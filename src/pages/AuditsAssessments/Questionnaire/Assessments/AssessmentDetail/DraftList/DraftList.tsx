/* eslint-disable react-hooks/exhaustive-deps */
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import {
  GetDrafts,
  GetGlobalQuestionnaireQuestions,
  MarkDraftAsComplete,
  SubmitQuestion,
} from "src/services/audits-assessments/questionnaire";
import DraftDetail from "./DraftDetail/DraftDetail";
import { KeyStringArrayVal, KeyStringVal } from "src/types/general";

const DraftList = ({
  assessmentID,
  inputs,
  setInputs,
  setQuery,
  setNav,
  selectedQuestionnaire,
  setSelectedQuestionnaire,
}: {
  assessmentID: string;
  inputs: any;
  setInputs: any;
  setQuery: (query: string) => void;
  setNav: (nav: number) => void;
  selectedQuestionnaire: KeyStringVal;
  setSelectedQuestionnaire: (selectedQuestionnaire: KeyStringVal) => void;
}) => {
  const [draftIsEdited, setDraftIsEdited] = useState<boolean>(false);

  const markDraftAsComplete = MarkDraftAsComplete(assessmentID);
  const submitQuestion = SubmitQuestion(
    assessmentID,
    sessionStorage.source_type
  );
  const { data: drafts } = GetDrafts(assessmentID);
  const { data: globalQuestionnaireQuestions } =
    GetGlobalQuestionnaireQuestions(selectedQuestionnaire.generated_id);

  const questions = inputs.drafts
    .reduce(
      (pV: string[], cV: KeyStringArrayVal) => [...pV, ...cV.questions],
      []
    )
    .filter((question: string) => question !== "");

  const disableSubmit =
    questions?.length === 0 ||
    inputs.drafts.some(
      (curDraft: KeyStringVal) => curDraft.questions.length === 0
    );

  const handleSubmit = () => {
    submitQuestion.mutate({ questions: questions });
    drafts?.forEach((draft: any) => {
      markDraftAsComplete.mutate({
        draftID: draft.draft_question_list_id,
        questions: draft.questions,
      });
    });
    setInputs({ drafts: [] });
    setQuery("");
    setNav(2);
    setDraftIsEdited(false);
  };

  useEffect(() => {
    if (globalQuestionnaireQuestions?.questions.length > 0) {
      let tempDrafts = inputs.drafts;
      const draftIDs = inputs.drafts.reduce(
        (pV: string[], cV: KeyStringVal) => [...pV, cV.draft_question_list_id],
        []
      );
      if (!draftIDs.includes("2"))
        tempDrafts = [
          ...inputs.drafts,
          {
            draft_question_list_id: "2",
            draft_document_name: selectedQuestionnaire.document_name,
            questions: globalQuestionnaireQuestions.questions,
          },
        ];
      else
        tempDrafts = tempDrafts.map((tempDraft: KeyStringVal) => {
          if (tempDraft.draft_question_list_id === "2")
            return {
              ...tempDraft,
              draft_document_name: selectedQuestionnaire.document_name,
              questions: globalQuestionnaireQuestions.questions,
            };
          else return tempDraft;
        });
      setInputs({
        drafts: tempDrafts,
      });
    }
  }, [globalQuestionnaireQuestions]);

  useEffect(() => {
    if (drafts?.length > 0) {
      let tempDrafts = inputs.drafts;
      const draftIDs = inputs.drafts.reduce(
        (pV: string[], cV: KeyStringVal) => [...pV, cV.draft_question_list_id],
        []
      );
      drafts.forEach((curDraft: KeyStringVal) => {
        if (!draftIDs.includes(curDraft.draft_question_list_id))
          tempDrafts = [...tempDrafts, curDraft];
        else {
          const desiredDraft = tempDrafts.find(
            (tempDraft: KeyStringVal) =>
              tempDraft.draft_question_list_id ===
              curDraft.draft_question_list_id
          );
          if (
            curDraft.questions.length > 0 &&
            desiredDraft?.questions.length === 0
          ) {
            tempDrafts = tempDrafts.map((tempDraft: KeyStringVal) => {
              if (
                tempDraft.draft_question_list_id ===
                curDraft.draft_question_list_id
              )
                return { ...tempDraft, questions: curDraft.questions };
              else return tempDraft;
            });
          }
        }
      });

      setInputs({
        drafts: tempDrafts,
      });
    }
  }, [drafts]);

  window.addEventListener("beforeunload", (event) => {
    if (draftIsEdited) {
      event.preventDefault();
      event.returnValue = "";
    }
  });

  return (
    <>
      {inputs.drafts.length > 0 && (
        <section className="grid gap-5 text-center">
          <h4 className="text-2xl border-b-1 dark:border-signin">
            Draft Questions
          </h4>
          <section className="grid gap-10">
            {inputs.drafts.map((draft: any, draftIndex: number) => {
              return (
                <DraftDetail
                  key={draftIndex}
                  assessmentID={assessmentID}
                  draft={draft}
                  inputs={inputs}
                  setInputs={setInputs}
                  setDraftIsEdited={setDraftIsEdited}
                  setSelectedQuestionnaire={setSelectedQuestionnaire}
                />
              );
            })}
          </section>
          <article className="relative group mx-auto mt-5">
            <button
              disabled={disableSubmit}
              className="flex items-center gap-2 px-4 py-2 text-xl disabled:grey-gradient-button green-gradient-button rounded-md"
              onClick={() => handleSubmit()}
            >
              <FontAwesomeIcon icon={faSearch} /> Submit
            </button>
            {disableSubmit && (
              <span className="hidden group-hover:block absolute top-16 left-1/2 -translate-x-1/2 p-4 w-max dark:bg-reset rounded-md">
                Cannot submit until all the documents have come back with
                questions
              </span>
            )}
          </article>
        </section>
      )}
    </>
  );
};

export default DraftList;
