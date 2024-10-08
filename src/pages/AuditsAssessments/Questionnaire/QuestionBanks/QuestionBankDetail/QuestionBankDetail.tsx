import {
  faChevronCircleDown,
  faChevronCircleRight,
  faRotateBackward,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import TablePagination from "src/components/General/TablePagination";
import { pageSize } from "src/constants/general";
import Loader from "src/components/Loader/Loader";
import { GetQuestionBankQuestions } from "src/services/audits-assessments/questionnaire";
import { Disclosure, Transition } from "@headlessui/react";
import { useGRCStore } from "src/stores/grc";
import NewQAPair from "./NewQAPair";
import DeleteQAPair from "./DeleteQAPair";
import UpdateQAPair from "./UpdateQAPair";

const QuestionBankDetail = () => {
  const { setSelectedGRCQuestionBank } = useGRCStore();

  const [pageNumber, setPageNumber] = useState<number>(1);

  const questionBankID = sessionStorage.question_bank_id;

  const { data: questions, status: questionStatus } = GetQuestionBankQuestions(
    questionBankID,
    pageNumber
  );

  const totalCount = questions?.pager.total_results || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <section className="flex flex-col flex-grow gap-5">
      <header className="flex items-center gap-5">
        <button
          className="flex gap-2 items-center w-max tracking-wide text-sm dark:text-checkbox dark:hover:text-checkbox/50 duration-100"
          onClick={() => {
            sessionStorage.removeItem("question_bank_id");
            setSelectedGRCQuestionBank({
              name: "",
              question_bank_id: "",
            });
          }}
        >
          <FontAwesomeIcon icon={faRotateBackward} /> Return
        </button>
        <h4 className="text-2xl">{sessionStorage.question_bank_name}</h4>
      </header>
      <NewQAPair questionBankID={questionBankID} />
      {questionStatus === "loading" ? (
        <Loader />
      ) : questions?.data.length > 0 ? (
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
            {questions?.data.map((question: any, index: number) => {
              return (
                <li
                  key={index}
                  className="grid gap-3 p-5 text-base bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 rounded-md"
                >
                  <header className="flex items-center justify-between gap-10">
                    <h4 className="text-lg">Q: {question.question}</h4>
                    <article className="flex items-center gap-5">
                      <UpdateQAPair
                        questionBankID={questionBankID}
                        questionID={question.generated_id}
                        question={question}
                      />
                      <DeleteQAPair
                        questionBankID={questionBankID}
                        questionID={question.generated_id}
                      />
                    </article>
                  </header>
                  <Disclosure>
                    {({ open }) => {
                      return (
                        <section className="grid gap-2">
                          <Disclosure.Button className="flex items-center gap-2 w-max">
                            <h4>Answer</h4>
                            <FontAwesomeIcon
                              icon={
                                open
                                  ? faChevronCircleDown
                                  : faChevronCircleRight
                              }
                              className="dark:text-black"
                            />
                          </Disclosure.Button>
                          <Transition
                            show={open}
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                          >
                            <Disclosure.Panel>
                              <p className="p-4 dark:bg-black rounded-md">
                                {question.response}
                              </p>
                            </Disclosure.Panel>
                          </Transition>
                        </section>
                      );
                    }}
                  </Disclosure>
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
            <h4>No questions available</h4>
            <NewQAPair questionBankID={questionBankID} />
          </article>
        </section>
      )}
    </section>
  );
};

export default QuestionBankDetail;
