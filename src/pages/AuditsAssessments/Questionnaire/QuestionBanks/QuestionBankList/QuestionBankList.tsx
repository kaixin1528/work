/* eslint-disable react-hooks/exhaustive-deps */
import {
  faArrowRightLong,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import TablePagination from "src/components/General/TablePagination";
import { pageSize } from "src/constants/general";
import { convertToUTCString } from "src/utils/general";
import { useGRCStore } from "src/stores/grc";
import Loader from "src/components/Loader/Loader";
import UploadQuestionBank from "./UploadQuestionBank/UploadQuestionBank";
import {
  GetQuestionBanks,
  UseQuestionBanks,
} from "src/services/audits-assessments/questionnaire";
import DeleteQuestionBank from "./DeleteQuestionBank";
import { KeyStringVal } from "src/types/general";

const QuestionBankList = () => {
  const { setSelectedGRCQuestionBank } = useGRCStore();

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedQuestionBankIDs, setSelectedQuestionBankIDs] = useState<
    string[]
  >([]);

  const { data: questionBanks, status: questionBankStatus } =
    GetQuestionBanks(pageNumber);
  const useQuestionBank = UseQuestionBanks();

  const totalCount = questionBanks?.pager.total_results || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  const handleSelectAllQuestions = () => {
    const questionBankIDs = questionBanks?.data.reduce(
      (pV: string[], cV: KeyStringVal) => [...pV, cV.document_id],
      []
    );
    setSelectedQuestionBankIDs(questionBankIDs);
  };

  useEffect(() => {
    if (questionBanks?.data.length > 0 && selectedQuestionBankIDs.length === 0)
      handleSelectAllQuestions();
  }, [questionBanks]);

  return (
    <section className="flex flex-col flex-grow gap-5">
      {questionBanks?.data.length > 0 && <UploadQuestionBank />}
      {questionBankStatus === "loading" ? (
        <Loader />
      ) : questionBanks?.data.length > 0 ? (
        <section className="flex flex-col flex-grow gap-5">
          <TablePagination
            totalPages={totalPages}
            beginning={beginning}
            end={end}
            totalCount={totalCount}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          />
          <article className="flex items-center gap-5 divide-x dark:divide-checkbox">
            <button
              className="dark:hover:text-checkbox/60 duration-100"
              onClick={handleSelectAllQuestions}
            >
              Select All
            </button>
            <button
              className="pl-5 dark:hover:text-checkbox/60 duration-100"
              onClick={() => setSelectedQuestionBankIDs([])}
            >
              Deselect All
            </button>
            {selectedQuestionBankIDs.length > 0 &&
              useQuestionBank.status !== "success" && (
                <button
                  className="px-4 py-1 dark:bg-signin dark:hover:bg-signin/60 duration-100 rounded-md"
                  onClick={() =>
                    useQuestionBank.mutate({
                      questionBankIDs: selectedQuestionBankIDs,
                    })
                  }
                >
                  Apply for Use
                </button>
              )}
          </article>
          <ul className="flex flex-col flex-grow gap-5">
            {questionBanks?.data.map((questionBank: any, index: number) => {
              const included = selectedQuestionBankIDs.includes(
                questionBank.document_id
              );
              return (
                <li key={index} className="flex items-stretch gap-3">
                  <button
                    className={`flex items-center gap-1 px-4 py-1 ${
                      included
                        ? "dark:bg-no dark:hover:bg-no/60 duration-100"
                        : "dark:bg-signin dark:hover:bg-signin/60 duration-100"
                    } rounded-md`}
                    onClick={() => {
                      useQuestionBank.reset();
                      if (included) {
                        setSelectedQuestionBankIDs(
                          selectedQuestionBankIDs.filter(
                            (id: string) => id !== questionBank.document_id
                          )
                        );
                      } else
                        setSelectedQuestionBankIDs([
                          ...selectedQuestionBankIDs,
                          questionBank.document_id,
                        ]);
                    }}
                  >
                    <FontAwesomeIcon icon={included ? faMinus : faPlus} />
                  </button>
                  <header className="flex items-start justify-between gap-20 p-5 w-full bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 rounded-md">
                    <article className="flex flex-wrap items-end gap-5">
                      <h4 className="text-xl">{questionBank.name}</h4>
                      <button
                        className="px-4 py-1 w-max text-left dark:bg-card dark:hover:bg-card/30 duration-100 rounded-full"
                        onClick={() => {
                          setSelectedGRCQuestionBank(questionBank);
                          sessionStorage.GRCCategory = "questionnaire";
                          sessionStorage.question_bank_id =
                            questionBank.document_id;
                          sessionStorage.question_bank_name = questionBank.name;
                        }}
                      >
                        View questions{" "}
                        <FontAwesomeIcon icon={faArrowRightLong} />{" "}
                      </button>
                    </article>
                    <article className="flex items-center gap-5 text-sm">
                      <article className="flex items-center gap-2 w-max dark:text-checkbox">
                        <h4>Created at</h4>
                        <p className="dark:text-white">
                          {convertToUTCString(questionBank.record_time)}
                        </p>
                      </article>
                      <DeleteQuestionBank selectedQuestionBank={questionBank} />
                    </article>
                  </header>
                </li>
              );
            })}
          </ul>
        </section>
      ) : (
        <section className="flex items-center place-content-center gap-10 w-full h-full">
          <img
            src="/grc/frameworks-placeholder.svg"
            alt="frameworks placeholder"
            className="w-40 h-40"
          />
          <article className="grid gap-3">
            <h4 className="text-xl font-extrabold">Question Banks</h4>
            <h4>No question banks available</h4>
            <UploadQuestionBank />
          </article>
        </section>
      )}
    </section>
  );
};

export default QuestionBankList;
