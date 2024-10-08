import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import RegularInput from "src/components/Input/RegularInput";
import ModalLayout from "src/layouts/ModalLayout";
import { AddQAPair } from "src/services/audits-assessments/questionnaire";

const NewQAPair = ({ questionBankID }: { questionBankID: string }) => {
  const [show, setShow] = useState<boolean>(false);
  const [inputs, setInputs] = useState<any>({
    question: "",
    answer: "",
  });

  const addQAPair = AddQAPair();

  const handleOnClose = () => setShow(false);

  return (
    <>
      <button
        className="flex items-center gap-2 px-4 py-2 w-max text-sm dark:text-white green-gradient-button rounded-sm"
        onClick={() => {
          setShow(true);
          setInputs({
            question: "",
            answer: "",
          });
        }}
      >
        <FontAwesomeIcon icon={faPlus} />
        New QA
      </button>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        <section className="grid content-start gap-5 h-full">
          <h3 className="flex items-center gap-2 text-lg">
            <FontAwesomeIcon icon={faPlus} />
            New QA
          </h3>
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
              addQAPair.mutate({
                questionBankID: questionBankID,
                question: inputs.question,
                answer: inputs.answer,
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

export default NewQAPair;
