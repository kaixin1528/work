import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import RegularInput from "src/components/Input/RegularInput";
import ModalLayout from "src/layouts/ModalLayout";
import {
  CreateQuestionnaireTemplate,
  GetGlobalQuestionnaires,
} from "src/services/audits-assessments/questionnaire";
import { KeyStringVal } from "src/types/general";

const CreateTemplate = ({
  qnaList,
  assessmentID,
}: {
  qnaList: any;
  assessmentID: string;
}) => {
  const [show, setShow] = useState<boolean>(false);
  const [inputs, setInputs] = useState<any>({ title: "", questions: [] });
  const [valid, setValid] = useState<boolean>(true);

  const { data: availableQuestionnaires } = GetGlobalQuestionnaires();
  const createQuestionnaireTemplate = CreateQuestionnaireTemplate(assessmentID);

  const handleOnClose = () => setShow(false);

  return (
    <>
      <button
        className="px-3 py-1 w-max green-gradient-button"
        onClick={() => setShow(true)}
      >
        Create Template
      </button>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        <section className="grid gap-5">
          <h4 className="text-xl">Create Template</h4>
          <RegularInput
            label="Title"
            keyName="title"
            inputs={inputs}
            setInputs={setInputs}
            valid={valid}
            setValid={setValid}
            required
          />
          <header className="flex items-start gap-5 divide-x dark:divide-checkbox">
            <button
              className="dark:hover:text-checkbox/60 duration-100"
              onClick={() => {
                const questions = qnaList?.data?.reduce(
                  (pV: string[], cV: KeyStringVal) => [...pV, cV.question],
                  []
                );
                setInputs({ ...inputs, questions: questions });
              }}
            >
              Select All
            </button>
            <button
              className="pl-5 dark:hover:text-checkbox/60 duration-100"
              onClick={() => setInputs({ ...inputs, questions: [] })}
            >
              Deselect All
            </button>
          </header>
          <ul className="grid content-start gap-5 max-h-[20rem] overflow-auto scrollbar">
            {qnaList?.data.map(
              (question: KeyStringVal, questionIndex: number) => {
                const isSelected = inputs.questions.includes(question.question);
                return (
                  <li key={questionIndex} className="flex items-center gap-2">
                    <button
                      className={`${
                        isSelected ? "dark:text-filter" : "dark:text-signin"
                      } dark:hover:text-signin/60 duration-100`}
                      onClick={() => {
                        if (isSelected)
                          setInputs({
                            ...inputs,
                            questions: inputs.questions.filter(
                              (selectedQuestion: string) =>
                                selectedQuestion !== question.question
                            ),
                          });
                        else
                          setInputs({
                            ...inputs,
                            questions: [...inputs.questions, question.question],
                          });
                      }}
                    >
                      <FontAwesomeIcon icon={isSelected ? faMinus : faPlus} />
                    </button>
                    <h4>{question.question}</h4>
                  </li>
                );
              }
            )}
          </ul>
          <button
            disabled={
              !Boolean(inputs.title) || !Boolean(inputs.questions.length)
            }
            className="px-3 p-1 mx-auto gradient-button"
            onClick={() => {
              if (
                availableQuestionnaires?.some(
                  (qna: KeyStringVal) =>
                    qna.document_name.toLowerCase().trim() ===
                    inputs.title.toLowerCase().trim()
                )
              )
                setValid(false);
              else {
                handleOnClose();
                createQuestionnaireTemplate.mutate({
                  title: inputs.title,
                  questions: inputs.questions,
                });
              }
            }}
          >
            Create
          </button>
        </section>
      </ModalLayout>
    </>
  );
};

export default CreateTemplate;
