/* eslint-disable react-hooks/exhaustive-deps */
import {
  faRefresh,
  faXmark,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import TablePagination from "src/components/General/TablePagination";
import Loader from "src/components/Loader/Loader";
import { KeyStringVal } from "src/types/general";
import { GetQnAList } from "src/services/audits-assessments/questionnaire";
import { pageSize } from "src/constants/general";
import { useGRCStore } from "src/stores/grc";
import Response from "./Response";
import ExportFile from "./ExportFile";
import { checkSuperAdmin } from "src/utils/general";
import CreateTemplate from "./CreateTemplate";

const ResponseList = ({ assessmentID }: { assessmentID: string }) => {
  const isSuperAdmin = checkSuperAdmin();

  const { GRCQuestionIDNotif } = useGRCStore();

  const [historyQuery, setHistoryQuery] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedExportQuestions, setSelectedExportQuestions] = useState<any>(
    []
  );

  const {
    data: qnaList,
    refetch,
    isFetching,
  } = GetQnAList(assessmentID, pageNumber, historyQuery);

  const totalCount = qnaList?.pager.total_results || 0;
  const totalPages = qnaList?.pager.num_pages || 0;
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  const questionRef = useRef(
    Array(qnaList?.data.length).fill(null)
  ) as MutableRefObject<any[]>;

  const handleSelectAllQuestions = () => {
    const questions = qnaList?.data?.reduce(
      (pV: string[], cV: KeyStringVal) => [
        ...pV,
        { question_id: cV.question_id },
      ],
      []
    );
    setSelectedExportQuestions(questions);
  };

  useEffect(() => {
    if (qnaList?.data.length > 0) {
      const questionIndex = qnaList?.data.findIndex(
        (question: KeyStringVal) => question.question_id === GRCQuestionIDNotif
      );
      if (questionRef?.current && questionRef?.current[questionIndex])
        questionRef.current[questionIndex].scrollIntoView();
    }
  }, [qnaList, GRCQuestionIDNotif]);

  useEffect(() => {
    if (qnaList?.data) handleSelectAllQuestions();
  }, [qnaList?.data]);

  useEffect(() => {
    if (historyQuery.length >= 3 || historyQuery.length === 0) refetch();
  }, [historyQuery]);

  return (
    <section className="grid content-start gap-5 w-full h-full">
      <header className="flex items-center gap-8 pb-2 border-b-1 dark:border-signin">
        <h4 className="text-2xl">Responses</h4>
        <button
          className="flex items-center gap-1 dark:hover:text-no/60 duration-100"
          onClick={() => refetch()}
        >
          <FontAwesomeIcon icon={faRefresh} className="text-no" />
          Refresh
        </button>
        {sessionStorage.source_type === "policies" && (
          <ExportFile
            assessmentID={assessmentID}
            selectedExportQuestions={selectedExportQuestions}
          />
        )}
      </header>
      <article className="flex items-start justify-between gap-10">
        <article className="flex items-center gap-5 pr-5 w-3/5 dark:bg-transparent border-b dark:border-know/6 know">
          <input
            type="input"
            spellCheck="false"
            autoComplete="off"
            placeholder="Search any question"
            value={historyQuery}
            onChange={(e) => setHistoryQuery(e.target.value)}
            className="p-3 w-full focus:outline-none dark:placeholder:text-checkbox dark:bg-transparent border-b dark:border-know/6 know dark:focus:ring-0 dark:focus:border-transparent"
          />
          <article className="flex items-center gap-2 divide-x-1 dark:divide-checkbox">
            {historyQuery !== "" && (
              <button onClick={() => setHistoryQuery("")}>
                <FontAwesomeIcon
                  icon={faXmark}
                  className="text-reset hover:text-reset/60 duration-100"
                />
              </button>
            )}
            <button
              disabled={historyQuery === ""}
              className="pl-2 dark:disabled:text-filter dark:text-signin dark:hover:text-signin/60 duration-100"
              onClick={() => refetch()}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </article>
        </article>
        <TablePagination
          totalPages={totalPages}
          beginning={beginning}
          end={end}
          totalCount={totalCount}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
        />
      </article>
      {isSuperAdmin && (
        <CreateTemplate qnaList={qnaList} assessmentID={assessmentID} />
      )}
      {isFetching ? (
        <Loader />
      ) : (
        qnaList?.data.length > 0 && (
          <section className="grid gap-3">
            <article className="flex items-center gap-5 divide-x dark:divide-checkbox">
              <button
                className="dark:hover:text-checkbox/60 duration-100"
                onClick={handleSelectAllQuestions}
              >
                Select All
              </button>
              <button
                className="pl-5 dark:hover:text-checkbox/60 duration-100"
                onClick={() => setSelectedExportQuestions([])}
              >
                Deselect All
              </button>
            </article>
            <ul className="grid content-start gap-5">
              {qnaList?.data.map((question: any, questionIndex: number) => {
                return (
                  <Response
                    key={questionIndex}
                    assessmentID={assessmentID}
                    questionIndex={questionIndex}
                    questionRef={questionRef}
                    question={question}
                    selectedExportQuestions={selectedExportQuestions}
                    setSelectedExportQuestions={setSelectedExportQuestions}
                  />
                );
              })}
            </ul>
          </section>
        )
      )}
    </section>
  );
};

export default ResponseList;
