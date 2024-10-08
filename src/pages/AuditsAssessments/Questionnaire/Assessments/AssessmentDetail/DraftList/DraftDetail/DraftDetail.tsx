/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef } from "react";
import DraftQuestion from "./DraftQuestion";
import { GetDraftStatus } from "src/services/audits-assessments/questionnaire";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { KeyStringVal } from "src/types/general";
import DraftSentences from "./DraftSentences";

const DraftDetail = ({
  assessmentID,
  draft,
  inputs,
  setInputs,
  setDraftIsEdited,
  setSelectedQuestionnaire,
}: {
  assessmentID: string;
  draft: any;
  inputs: any;
  setInputs: any;
  setDraftIsEdited: (draftIsEdited: boolean) => void;
  setSelectedQuestionnaire: (selectedQuestionnaire: KeyStringVal) => void;
}) => {
  const listRef = useRef([]) as any;

  const draftID = draft.draft_question_list_id;

  const { data: draftStatus } = GetDraftStatus(assessmentID, draftID);

  return (
    <article className="grid gap-3">
      <header className="flex items-center gap-2 mx-auto">
        <h4 className="text-lg">
          {draft.draft_document_name || "Document Name Not Available"}
        </h4>
        <button
          className="text-reset hover:text-reset/60 duration-100"
          onClick={() => {
            if (draftID === "2")
              setSelectedQuestionnaire({ generated_id: "", document_name: "" });
            setInputs({
              drafts: inputs.drafts.filter(
                (curDraft: KeyStringVal) =>
                  curDraft.draft_question_list_id !== draftID
              ),
            });
          }}
        >
          <FontAwesomeIcon icon={faXmark} className="w-8 h-8" />
        </button>
      </header>
      {draftStatus?.status === "ready" || ["1", "2"].includes(draftID) ? (
        <section className="grid gap-7">
          {draft.sentences?.length > 0 && (
            <DraftSentences
              draft={draft}
              inputs={inputs}
              setInputs={setInputs}
            />
          )}
          <ul
            ref={listRef}
            className="grid gap-2 max-h-[30rem] overflow-auto scrollbar"
          >
            {draft.questions.map((_: string, questionIndex: number) => {
              return (
                <DraftQuestion
                  key={questionIndex}
                  draft={draft}
                  questionIndex={questionIndex}
                  inputs={inputs}
                  setInputs={setInputs}
                  setDraftIsEdited={setDraftIsEdited}
                />
              );
            })}
          </ul>
          <button
            className="flex items-center gap-2 px-4 py-2 mx-auto text-sm gradient-button rounded-md"
            onClick={() => {
              setInputs({
                drafts: inputs.drafts.map((curDraft: KeyStringVal) => {
                  if (draftID === curDraft.draft_question_list_id)
                    return { ...draft, questions: [...draft.questions, ""] };
                  else return curDraft;
                }),
              });
              listRef?.current?.addEventListener(
                "DOMNodeInserted",
                (event: any) => {
                  const { currentTarget: target } = event as any;
                  target?.scroll({
                    top: target.scrollHeight,
                    behavior: "smooth",
                  });
                }
              );
            }}
          >
            <FontAwesomeIcon icon={faPlus} /> Add a question
          </button>
        </section>
      ) : draftStatus?.status === "parsing" ? (
        <section className="flex items-center place-content-center gap-10 w-full h-full">
          <article className="grid gap-3">
            <h4>Document is being processed</h4>
            <img
              src="/grc/data-parsing.svg"
              alt="data parsing"
              className="w-10 h-10 mx-auto"
            />
          </article>
        </section>
      ) : null}
    </article>
  );
};

export default DraftDetail;
