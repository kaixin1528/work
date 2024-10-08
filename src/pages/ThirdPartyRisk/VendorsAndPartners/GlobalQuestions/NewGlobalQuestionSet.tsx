import React, { useState } from "react";
import ModalLayout from "src/layouts/ModalLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import FileInput from "src/components/Input/FileInput";
import RegularInput from "src/components/Input/RegularInput";
import { AddGlobalQuestionSet } from "src/services/third-party-risk/vendors-and-partners/global-questions";

const NewGlobalQuestionSet = () => {
  const [show, setShow] = useState<boolean>(false);
  const [inputs, setInputs] = useState<any>({
    file: "",
    file_uri: "",
  });

  const addQuestionSet = AddGlobalQuestionSet();

  const handleOnClose = () => setShow(false);

  return (
    <>
      <button
        className="flex items-center gap-2 px-8 py-2 mx-auto text-base dark:text-white green-gradient-button rounded-sm"
        onClick={() => {
          setShow(true);
          setInputs({
            file: "",
            file_uri: "",
          });
        }}
      >
        <FontAwesomeIcon icon={faUpload} />
        <h4>Upload Question Set</h4>
      </button>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        <section className="grid content-start gap-5 h-full">
          <h3 className="flex items-center gap-2 text-lg">
            <FontAwesomeIcon icon={faUpload} />
            Upload Question Set
          </h3>
          <RegularInput
            label="File URL (optional)"
            keyName="file_uri"
            inputs={inputs}
            setInputs={setInputs}
          />
          <FileInput
            label="Question Set"
            keyName="file"
            types={["docx", "pdf", "xlsx"]}
            inputs={inputs}
            setInputs={setInputs}
          />
          <button
            disabled={inputs.file === "" && inputs.file_uri === ""}
            className="flex items-center justify-self-center gap-2 px-4 py-2 w-max dark:text-white green-gradient-button rounded-sm"
            onClick={() => {
              const formData = new FormData();

              formData.append("file", inputs.file);
              if (inputs.file_uri) formData.append("file_uri", inputs.file_uri);

              addQuestionSet.mutate({
                formData: formData,
              });
              handleOnClose();
            }}
          >
            <h4>Done</h4>
          </button>
        </section>
      </ModalLayout>
    </>
  );
};

export default NewGlobalQuestionSet;
