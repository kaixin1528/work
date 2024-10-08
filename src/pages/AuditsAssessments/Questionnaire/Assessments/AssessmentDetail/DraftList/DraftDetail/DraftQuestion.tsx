import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { KeyStringVal } from "src/types/general";

const DraftQuestion = ({
  draft,
  questionIndex,
  inputs,
  setInputs,
  setDraftIsEdited,
}: {
  draft: any;
  questionIndex: number;
  inputs: any;
  setInputs: any;
  setDraftIsEdited: (draftIsEdited: boolean) => void;
}) => {
  const draftID = draft.draft_question_list_id;

  return (
    <li className="flex items-center gap-2 px-4 py-2 w-full dark:bg-account black-shadow rounded-md">
      <input
        type="input"
        value={draft.questions[questionIndex]}
        spellCheck="false"
        autoComplete="off"
        onChange={(e) => {
          setDraftIsEdited(true);
          const newQuestions = draft.questions;
          newQuestions.splice(questionIndex, 1, e.target.value);
          setInputs({
            drafts: inputs.drafts.map((curDraft: KeyStringVal) => {
              if (draftID === curDraft.draft_question_list_id)
                return { ...draft, questions: newQuestions };
              else return curDraft;
            }),
          });
        }}
        className="w-full h-10 px-5 text-sm bg-transparent focus:outline-none border-none focus:ring-1 dark:focus:ring-signin rounded-md"
      />
      <button
        className="text-reset hover:text-reset/60 duration-100"
        onClick={() =>
          setInputs({
            drafts: inputs.drafts.map((curDraft: KeyStringVal) => {
              if (draftID === curDraft.draft_question_list_id)
                return {
                  ...draft,
                  questions: draft.questions.filter(
                    (_: string, index: number) => index !== questionIndex
                  ),
                };
              else return curDraft;
            }),
          })
        }
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </li>
  );
};

export default DraftQuestion;
