/* eslint-disable react-hooks/exhaustive-deps */
import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import CopyToClipboard from "src/components/General/CopyToClipboard";
import { EditGlobalQuestion } from "src/services/third-party-risk/vendors-and-partners/global-questions";
import { KeyStringVal } from "src/types/general";
import DeleteGlobalQuestion from "./DeleteGlobalQuestion";

const Response = ({
  qa,
  selectedQuestions,
  setSelectedQuestions,
}: {
  qa: any;
  selectedQuestions: any;
  setSelectedQuestions: any;
}) => {
  const questionID = qa.generated_id;
  const [editedQuestion, setEditedQuestion] = useState<string>(qa.question);
  const [editedAnswer, setEditedAnswer] = useState<string>(qa.response);

  const editResponse = EditGlobalQuestion(questionID);

  const handleDiscardEditedQuestion = () => setEditedQuestion(qa.question);
  const handleDiscardEditedAnswer = () => setEditedAnswer(qa.response);

  const selected = selectedQuestions.includes(questionID);

  useEffect(() => {
    handleDiscardEditedQuestion();
    handleDiscardEditedAnswer();
  }, [qa]);

  return (
    <li className="flex items-start gap-5 w-full">
      <input
        type="checkbox"
        value={selected}
        onChange={() => {
          if (selected)
            setSelectedQuestions(
              selectedQuestions.filter(
                (question: KeyStringVal) => question.generated_id !== questionID
              )
            );
          else setSelectedQuestions([...selectedQuestions, questionID]);
        }}
        className="form-checkbox mt-1 w-4 h-4 border-0 dark:focus:ring-0 dark:text-checkbox dark:focus:border-checkbox focus:ring dark:focus:ring-offset-0 dark:focus:ring-checkbox focus:ring-opacity-50"
      />
      <section className="grid gap-5 p-5 w-full bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 dark:hover:to-white/30 duration-100 rounded-md">
        <article className="grid content-start gap-3 w-full">
          <article className="flex items-start gap-2 w-full">
            Q:{" "}
            <textarea
              value={editedQuestion}
              onChange={(e) => setEditedQuestion(e.target.value)}
              className="px-4 py-1 pb-10 w-full text-sm dark:bg-black focus:outline-none resize-none overflow-auto scrollbar"
            />
          </article>
          {qa.question !== "" && qa.question !== editedQuestion && (
            <article className="flex items-center justify-self-end gap-2 text-sm">
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
        </article>
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex items-center gap-2 text-sm">
                <FontAwesomeIcon
                  icon={open ? faChevronCircleDown : faChevronCircleRight}
                  className="dark:text-black"
                />
                <p>{open ? "Hide" : "Show"} Answer</p>
              </Disclosure.Button>
              <Disclosure.Panel>
                <article className="flex gap-2 text-base p-3 break-words dark:bg-black/60 rounded-md">
                  <article className="w-max">
                    <CopyToClipboard copiedValue={qa.response} />
                  </article>
                  <article className="grid content-start gap-3 w-full">
                    {qa.response !== "" ? (
                      <article className="flex items-start gap-2 w-full">
                        A:{" "}
                        <textarea
                          value={editedAnswer}
                          onChange={(e) => setEditedAnswer(e.target.value)}
                          className="px-4 py-1 pb-10 w-full text-sm bg-gradient-to-b dark:bg-main border-t border-b dark:border-know/60 know focus:outline-none resize-none overflow-auto scrollbar"
                        />
                      </article>
                    ) : (
                      "Question is currently being processed"
                    )}
                    {qa.response !== "" && qa.response !== editedAnswer && (
                      <article className="flex items-center justify-self-end gap-2 text-sm">
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
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </section>
      <DeleteGlobalQuestion questionID={questionID} />
    </li>
  );
};

export default Response;
