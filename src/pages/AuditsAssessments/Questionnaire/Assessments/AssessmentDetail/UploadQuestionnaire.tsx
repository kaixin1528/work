import React, { useState } from "react";
import RegularInput from "src/components/Input/RegularInput";
import ModalLayout from "src/layouts/ModalLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import FileInput from "src/components/Input/FileInput";
import { SubmitQuestionnaire } from "src/services/audits-assessments/questionnaire";

const UploadQuestionnaire = ({ assessmentID }: { assessmentID: string }) => {
  const [show, setShow] = useState<boolean>(false);
  const [inputs, setInputs] = useState<any>({
    name: "",
    file: "",
    file_uri: "",
  });

  const uploadQuestionnaire = SubmitQuestionnaire(assessmentID);

  const handleOnClose = () => setShow(false);

  return (
    <>
      <button
        className="flex items-center gap-2 px-4 py-2 w-max text-sm dark:text-white green-gradient-button rounded-sm"
        onClick={() => {
          setShow(true);
          setInputs({
            name: "",
            file: "",
            file_uri: "",
          });
        }}
      >
        <FontAwesomeIcon icon={faUpload} />
        <h4>Upload Questionnaire</h4>
      </button>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        <section className="grid content-start gap-5 h-full">
          <h3 className="flex items-center gap-2 text-lg">
            <FontAwesomeIcon icon={faUpload} />
            Upload Questionnaire
          </h3>
          <RegularInput
            label="Name (optional)"
            keyName="name"
            inputs={inputs}
            setInputs={setInputs}
            required
          />
          <RegularInput
            label="File URL (optional)"
            keyName="file_uri"
            inputs={inputs}
            setInputs={setInputs}
          />
          <FileInput
            label="Questionnaire"
            keyName="file"
            types={["pdf", "docx", "xlsx"]}
            inputs={inputs}
            setInputs={setInputs}
          />
          <button
            disabled={inputs.file === "" && inputs.file_uri === ""}
            className="flex items-center justify-self-center gap-2 px-4 py-2 w-max dark:text-white green-gradient-button rounded-sm"
            onClick={() => {
              const formData = new FormData();

              if (inputs.name !== "") formData.append("name", inputs.name);
              if (inputs.file) formData.append("file", inputs.file);
              if (inputs.file_uri) formData.append("file_uri", inputs.file_uri);

              uploadQuestionnaire.mutate({
                formData: formData,
              });
              handleOnClose();
            }}
          >
            <h4>Submit</h4>
          </button>
        </section>
      </ModalLayout>
    </>
  );
};

export default UploadQuestionnaire;
