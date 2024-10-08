import {
  faChevronCircleDown,
  faChevronCircleRight,
  faMagnifyingGlass,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure, Popover, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { useGRCStore } from "src/stores/grc";
import { KeyStringVal } from "src/types/general";
import Source from "./Source";
import CopyToClipboard from "src/components/General/CopyToClipboard";
import {
  AddQAPair,
  EditAnswer,
  GetQuestionBanks,
  SubmitQuestion,
} from "src/services/audits-assessments/questionnaire";

const Response = ({
  assessmentID,
  questionIndex,
  questionRef,
  question,
  selectedExportQuestions,
  setSelectedExportQuestions,
}: {
  assessmentID: string;
  questionIndex: number;
  questionRef: any;
  question: any;
  selectedExportQuestions: any;
  setSelectedExportQuestions: any;
}) => {
  const { GRCQuestionIDNotif, setGRCQuestionIDNotif } = useGRCStore();

  const [editedAnswer, setEditedAnswer] = useState<string>(question.answer);

  const { data: questionBanks } = GetQuestionBanks(1);
  const addQAPair = AddQAPair();
  const editAnswer = EditAnswer(assessmentID);
  const submitQuestion = SubmitQuestion(
    assessmentID,
    sessionStorage.source_type
  );

  const added = selectedExportQuestions.some(
    (curQuestion: KeyStringVal) =>
      curQuestion.question_id === question.question_id
  );

  const handleDiscardEditedAnswer = () => setEditedAnswer(question.answer);

  return (
    <li
      key={questionIndex}
      ref={(el) => {
        if (questionRef && questionRef.current)
          questionRef.current[questionIndex] = el;
      }}
      className="grid"
    >
      <Disclosure
        key={questionIndex}
        defaultOpen={question.question_id === GRCQuestionIDNotif}
      >
        {({ open }) => {
          return (
            <section className="grid gap-2">
              <header className="flex items-start gap-2 text-base w-3/5">
                <h4 className="text-left">
                  Q: {question.question}
                  {question.is_answered && (
                    <span className="px-2 text-xs bg-no rounded-full">
                      answered
                    </span>
                  )}
                </h4>
                <Disclosure.Button
                  onClick={() => {
                    if (GRCQuestionIDNotif !== "") setGRCQuestionIDNotif("");
                  }}
                >
                  <FontAwesomeIcon
                    icon={open ? faChevronCircleDown : faChevronCircleRight}
                    className="dark:text-checkbox"
                  />
                </Disclosure.Button>
              </header>
              <section className="flex items-center gap-2 text-sm">
                <button
                  className={`flex items-center gap-1 px-4 py-1 ${
                    added
                      ? "dark:bg-reset dark:hover:bg-reset/60 duration-100"
                      : "dark:bg-signin dark:hover:bg-signin/60 duration-100"
                  } rounded-md`}
                  onClick={() => {
                    if (added) {
                      setSelectedExportQuestions(
                        selectedExportQuestions.filter(
                          (curQ: KeyStringVal) =>
                            curQ.question_id !== question.question_id
                        )
                      );
                    } else
                      setSelectedExportQuestions([
                        ...selectedExportQuestions,
                        { question_id: question.question_id },
                      ]);
                  }}
                >
                  <FontAwesomeIcon icon={added ? faMinus : faPlus} /> Export
                </button>
                {question.answer !== "" && (
                  <Popover className="relative">
                    <Popover.Button className="flex items-center gap-1 px-4 py-1 w-max dark:bg-signin dark:hover:bg-signin/60 duraiton-100 rounded-md">
                      <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                      Add To
                    </Popover.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel className="absolute left-28 top-0">
                        {({ close }) => (
                          <section className="grid gap-1 p-4 dark:bg-expand black-shadow rounded-md">
                            <h4>Question Banks</h4>
                            <ul className="grid gap-3">
                              {questionBanks?.data.map(
                                (questionBank: KeyStringVal) => {
                                  return (
                                    <li
                                      key={questionBank.document_id}
                                      className="px-3 py-1 cursor-pointer bg-gradient-to-br dark:from-admin to-white/30 dark:hover:to-white/60 rounded-md"
                                      onClick={() => {
                                        addQAPair.mutate({
                                          questionBankID:
                                            questionBank.document_id,
                                          question: question.question,
                                          answer: question.answer,
                                        });
                                        close();
                                      }}
                                    >
                                      {questionBank.name}
                                    </li>
                                  );
                                }
                              )}
                            </ul>
                          </section>
                        )}
                      </Popover.Panel>
                    </Transition>
                  </Popover>
                )}
                <button
                  className="flex items-center gap-1 px-4 py-1 dark:bg-no dark:hover:bg-no/60 duration-100 rounded-md"
                  onClick={() =>
                    submitQuestion.mutate({ questions: [question.question] })
                  }
                >
                  <FontAwesomeIcon icon={faMagnifyingGlass} /> Resubmit
                </button>
              </section>
              <Transition
                show={question.question_id === GRCQuestionIDNotif || open}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel>
                  <section className="grid gap-5 p-4 bg-gradient-to-br dark:from-checkbox/30 dark:to-white/10 rounded-md">
                    <article className="flex gap-2 text-base p-3 break-words dark:bg-black/60 rounded-md">
                      <article className="w-max">
                        <CopyToClipboard copiedValue={question.answer} />
                      </article>
                      <article className="grid content-start gap-3 w-full">
                        {question.answer !== "" ? (
                          <article className="flex items-start gap-2 w-full">
                            A:{" "}
                            <textarea
                              value={editedAnswer}
                              onChange={(e) => setEditedAnswer(e.target.value)}
                              className={`px-4 py-1 pb-10 w-full ${
                                editedAnswer.length >= 500 ? "h-[15rem]" : ""
                              } bg-gradient-to-b dark:bg-main border-t border-b dark:border-know/60 know focus:outline-none resize-none overflow-auto scrollbar`}
                            />
                          </article>
                        ) : (
                          "Question is currently being processed"
                        )}
                        {question.answer !== editedAnswer && (
                          <article className="flex items-center justify-self-end gap-2">
                            <button
                              className="p-3 py-1 dark:bg-reset dark:hover:bg-reset/60 duration-100 rounded-md"
                              onClick={handleDiscardEditedAnswer}
                            >
                              Discard
                            </button>
                            <button
                              className="px-3 py-1 dark:bg-no dark:hover:bg-no/60 duration-100 rounded-md"
                              onClick={() => {
                                editAnswer.mutate({
                                  questionID: question.question_id,
                                  answer: editedAnswer,
                                });
                                handleDiscardEditedAnswer();
                              }}
                            >
                              Save
                            </button>
                          </article>
                        )}
                      </article>
                    </article>
                    {question.context?.length > 0 && (
                      <section className="grid gap-2">
                        <Disclosure>
                          {({ open }) => {
                            return (
                              <section className="grid gap-2 text-sm">
                                <Disclosure.Button className="flex items-center gap-2 w-max">
                                  <h4 className="text-lg">Sources</h4>
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
                                    <section className="flex flex-wrap items-center gap-5">
                                      {question.context.map(
                                        (
                                          source: KeyStringVal,
                                          sourceIndex: number
                                        ) => {
                                          return (
                                            <Source
                                              key={sourceIndex}
                                              documentType="policies"
                                              sourceIndex={sourceIndex}
                                              source={source}
                                            />
                                          );
                                        }
                                      )}
                                    </section>
                                  </Disclosure.Panel>
                                </Transition>
                              </section>
                            );
                          }}
                        </Disclosure>
                      </section>
                    )}
                    {question.mapped_questions?.from_assessments?.length >
                      0 && (
                      <section className="grid gap-2">
                        <Disclosure>
                          {({ open }) => {
                            return (
                              <section className="grid gap-2 text-sm">
                                <Disclosure.Button className="flex items-center gap-2 w-max">
                                  <h4 className="text-lg">From Assessments</h4>
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
                                    <section className="flex flex-wrap items-center gap-5">
                                      {question.mapped_questions?.from_assessments?.map(
                                        (
                                          source: KeyStringVal,
                                          sourceIndex: number
                                        ) => {
                                          return (
                                            <Source
                                              key={sourceIndex}
                                              documentType="policies"
                                              sourceIndex={sourceIndex}
                                              source={source}
                                              questionID={question.question_id}
                                              selectedExportQuestions={
                                                selectedExportQuestions
                                              }
                                              setSelectedExportQuestions={
                                                setSelectedExportQuestions
                                              }
                                            />
                                          );
                                        }
                                      )}
                                    </section>
                                  </Disclosure.Panel>
                                </Transition>
                              </section>
                            );
                          }}
                        </Disclosure>
                      </section>
                    )}
                    {question.mapped_questions?.from_question_banks?.length >
                      0 && (
                      <section className="grid gap-2">
                        <Disclosure>
                          {({ open }) => {
                            return (
                              <section className="grid gap-2 text-sm">
                                <Disclosure.Button className="flex items-center gap-2 w-max">
                                  <h4 className="text-lg">
                                    From Question Banks
                                  </h4>
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
                                    <section className="flex flex-wrap items-center gap-5">
                                      {question.mapped_questions?.from_question_banks?.map(
                                        (
                                          source: KeyStringVal,
                                          sourceIndex: number
                                        ) => {
                                          return (
                                            <Source
                                              key={sourceIndex}
                                              documentType="policies"
                                              sourceIndex={sourceIndex}
                                              source={source}
                                              questionID={question.question_id}
                                              selectedExportQuestions={
                                                selectedExportQuestions
                                              }
                                              setSelectedExportQuestions={
                                                setSelectedExportQuestions
                                              }
                                            />
                                          );
                                        }
                                      )}
                                    </section>
                                  </Disclosure.Panel>
                                </Transition>
                              </section>
                            );
                          }}
                        </Disclosure>
                      </section>
                    )}
                  </section>
                </Disclosure.Panel>
              </Transition>
            </section>
          );
        }}
      </Disclosure>
    </li>
  );
};

export default Response;
