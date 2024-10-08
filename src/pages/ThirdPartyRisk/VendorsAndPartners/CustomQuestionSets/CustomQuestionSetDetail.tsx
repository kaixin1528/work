import {
  faChevronCircleDown,
  faChevronCircleRight,
  faRotateBackward,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { KeyStringVal } from "src/types/general";
import Loader from "src/components/Loader/Loader";
import { pageSize } from "src/constants/general";
import TablePagination from "src/components/General/TablePagination";
import { GetCustomQuestions } from "src/services/third-party-risk/vendors-and-partners/custom-question-sets";
import { Disclosure } from "@headlessui/react";
import CopyToClipboard from "src/components/General/CopyToClipboard";

const CustomQuestionSetDetail = ({
  selectedQuestionSet,
  setSelectedQuestionSet,
}: {
  selectedQuestionSet: KeyStringVal;
  setSelectedQuestionSet: (selectedQuestionSet: KeyStringVal) => void;
}) => {
  const [pageNumber, setPageNumber] = useState<number>(1);

  const questionSetID = sessionStorage.custom_question_set_id;

  const { data: questionSet, status: questionSetStatus } = GetCustomQuestions(
    questionSetID,
    pageNumber
  );

  const totalCount = questionSet?.pager?.total_results || 0;
  const totalPages = questionSet?.pager?.num_pages || 0;
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  const handleReturn = () => {
    sessionStorage.removeItem("custom_question_set_id");
    sessionStorage.removeItem("custom_question_set_name");
    setSelectedQuestionSet({});
  };

  return (
    <section className="flex flex-col flex-grow gap-5">
      <header className="flex items-center gap-5">
        <button
          className="flex gap-2 items-center w-max tracking-wide text-sm dark:text-checkbox dark:hover:text-checkbox/50 duration-100"
          onClick={handleReturn}
        >
          <FontAwesomeIcon icon={faRotateBackward} />
          <span>Return</span>
        </button>
        <h4 className="text-xl">{sessionStorage.custom_question_set_name}</h4>
      </header>
      {questionSetStatus === "loading" ? (
        <Loader />
      ) : questionSet?.data.length > 0 ? (
        <section className="flex flex-col flex-grow gap-5">
          <TablePagination
            totalPages={totalPages}
            beginning={beginning}
            end={end}
            totalCount={totalCount}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          />
          <ul className="flex flex-col flex-grow gap-5">
            {questionSet.data.map((qa: any, index: number) => {
              return (
                <li
                  key={index}
                  className="grid gap-5 p-5 bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 rounded-md"
                >
                  <h4>Q: {qa.question}</h4>
                  <Disclosure>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex items-center gap-2 text-sm">
                          <FontAwesomeIcon
                            icon={
                              open ? faChevronCircleDown : faChevronCircleRight
                            }
                            className="dark:text-black"
                          />
                          <p>{open ? "Hide" : "Show"} Answer</p>
                        </Disclosure.Button>
                        <Disclosure.Panel>
                          <article className="flex gap-2 text-base p-3 break-words dark:bg-black/60 rounded-md">
                            <article className="w-max">
                              <CopyToClipboard
                                copiedValue={qa.ideal_response}
                              />
                            </article>
                            <article className="grid content-start gap-3 w-full">
                              {qa.ideal_response ? (
                                <p className="flex items-start gap-2 w-full">
                                  A: {qa.ideal_response}
                                </p>
                              ) : (
                                "Question is currently being processed"
                              )}
                            </article>
                          </article>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </li>
              );
            })}
          </ul>
        </section>
      ) : (
        <section className="flex items-center place-content-center gap-10 w-full h-full">
          <img
            src="/grc/third-party-risk-placeholder.svg"
            alt="questionSet placeholder"
            className="w-40 h-40"
          />
          <article className="grid gap-3">
            <h4 className="text-xl font-extrabold">Custom Question Set</h4>
            <h4>No questions available</h4>
          </article>
        </section>
      )}
    </section>
  );
};

export default CustomQuestionSetDetail;
