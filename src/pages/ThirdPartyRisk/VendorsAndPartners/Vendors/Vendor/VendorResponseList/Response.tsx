/* eslint-disable react-hooks/exhaustive-deps */
import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure, Transition } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import CopyToClipboard from "src/components/General/CopyToClipboard";
import { EditVendorResponse } from "src/services/third-party-risk/vendors-and-partners/vendors";
import DeleteVendorResponse from "./DeleteVendorResponse";

const Response = ({
  vendorID,
  questionIndex,
  question,
}: {
  vendorID: string;
  questionIndex: number;
  question: any;
}) => {
  const [editedQuestion, setEditedQuestion] = useState<string>(
    question.question
  );
  const [editedAnswer, setEditedAnswer] = useState<string>(question.response);

  const editResponse = EditVendorResponse(vendorID);

  const handleDiscardEditedQuestion = () =>
    setEditedQuestion(question.question);
  const handleDiscardEditedAnswer = () => setEditedAnswer(question.response);

  useEffect(() => {
    handleDiscardEditedQuestion();
    handleDiscardEditedAnswer();
  }, [question]);

  return (
    <li key={questionIndex} className="flex items-start gap-5 w-full">
      <Disclosure key={questionIndex}>
        {({ open }) => {
          return (
            <section className="grid gap-2 p-5 w-full bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 dark:hover:to-white/30 duration-100 rounded-md">
              <header className="grid gap-5 w-full">
                <article className="flex items-start gap-2 w-full">
                  Q:{" "}
                  <textarea
                    value={editedQuestion}
                    onChange={(e) => setEditedQuestion(e.target.value)}
                    className="px-4 py-1 pb-10 w-full dark:bg-black focus:outline-none resize-none overflow-auto scrollbar"
                  />
                </article>
                {question.question !== "" &&
                  question.question !== editedQuestion && (
                    <article className="flex items-center justify-self-end gap-2">
                      <button
                        className="p-3 py-1 dark:bg-reset dark:hover:bg-reset/60 duration-100 rounded-md"
                        onClick={handleDiscardEditedQuestion}
                      >
                        Discard
                      </button>
                      <button
                        className="px-3 py-1 dark:bg-no dark:hover:bg-no/60 duration-100 rounded-md"
                        onClick={() => {
                          editResponse.mutate({
                            questionID: question.generated_id,
                            question: editedQuestion,
                            response: editedAnswer,
                          });
                          handleDiscardEditedQuestion();
                        }}
                      >
                        Save
                      </button>
                    </article>
                  )}
              </header>
              <Disclosure.Button className="flex items-center gap-1">
                {open ? "Hide" : "Show"} Response
                <FontAwesomeIcon
                  icon={open ? faChevronCircleDown : faChevronCircleRight}
                  className="dark:text-checkbox"
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
                  <section className="grid gap-5">
                    <article className="flex gap-2 text-base p-3 break-words dark:bg-black/60 rounded-md">
                      <article className="w-max">
                        <CopyToClipboard copiedValue={question.response} />
                      </article>
                      <article className="grid content-start gap-3 w-full">
                        {question.response !== "" ? (
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
                        {question.response !== editedAnswer && (
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
                                editResponse.mutate({
                                  questionID: question.generated_id,
                                  question: editedQuestion,
                                  response: editedAnswer,
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
                  </section>
                </Disclosure.Panel>
              </Transition>
            </section>
          );
        }}
      </Disclosure>
      <DeleteVendorResponse
        vendorID={vendorID}
        questionID={question.generated_id}
      />
    </li>
  );
};

export default Response;
