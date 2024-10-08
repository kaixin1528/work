import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import RegularInput from "src/components/Input/RegularInput";
import ModalLayout from "src/layouts/ModalLayout";
import { EditQAPair } from "src/services/audits-assessments/questionnaire";
import { KeyStringVal } from "src/types/general";

const UpdateQAPair = ({
  questionBankID,
  questionID,
  question,
}: {
  questionBankID: string;
  questionID: string;
  question: KeyStringVal;
}) => {
  const [show, setShow] = useState<boolean>(false);
  const [inputs, setInputs] = useState<any>({
    question: question.question || "",
    answer: question.answer || "",
  });

  const editQAPair = EditQAPair(questionBankID);

  const handleOnClose = () => setShow(false);

  return (
    <>
      <button
        className="flex items-center p-2 dark:bg-signin dark:hover:bg-signin/60 duration-100 rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          setShow(true);
        }}
      >
        <FontAwesomeIcon icon={faEdit} />
      </button>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        <section className="grid content-start gap-5 h-full">
          <h3 className="text-lg">Edit QA</h3>
          <RegularInput
            label="Question"
            keyName="question"
            inputs={inputs}
            setInputs={setInputs}
            required
          />
          <RegularInput
            label="Answer"
            keyName="answer"
            inputs={inputs}
            setInputs={setInputs}
            required
          />
          <button
            disabled={Object.values(inputs).includes("")}
            className="flex items-center justify-self-center gap-2 px-4 py-2 w-max dark:text-white green-gradient-button rounded-sm"
            onClick={() => {
              editQAPair.mutate({
                questionID: questionID,
                newQuestion: inputs.question,
                newResponse: inputs.answer,
              });
              handleOnClose();
            }}
          >
            <h4>Add</h4>
          </button>
        </section>
      </ModalLayout>
    </>
  );
};

export default UpdateQAPair;
