import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import FileInput from "src/components/Input/FileInput";
import RegularInput from "src/components/Input/RegularInput";
import ModalLayout from "src/layouts/ModalLayout";
import { AddControlEvidence } from "src/services/audits-assessments/internal-audit";

const AttachEvidence = ({
  auditID,
  controlID,
}: {
  auditID: string;
  controlID: string;
}) => {
  const [show, setShow] = useState<boolean>(false);
  const [inputs, setInputs] = useState<any>({
    name: "",
    file: "",
    file_uri: "",
  });

  const attachEvidence = AddControlEvidence(auditID, controlID);

  const handleOnClose = () => setShow(false);

  return (
    <>
      <button
        className="w-max"
        onClick={() => {
          setShow(true);
          setInputs({
            name: "",
            file: "",
            file_uri: "",
          });
        }}
      >
        <FontAwesomeIcon icon={faUpload} /> Attach evidence
      </button>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        <section className="grid gap-5">
          <h4 className="text-xl">
            <FontAwesomeIcon icon={faUpload} /> Attach evidence
          </h4>
          <RegularInput
            label="Label"
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
            label="Evidence"
            keyName="file"
            types={[
              "png",
              "svg",
              "pdf",
              "docx",
              "csv",
              "txt",
              "xlsx",
              "jpg",
              "jpeg",
            ]}
            inputs={inputs}
            setInputs={setInputs}
          />
          <button
            disabled={
              inputs.name === "" ||
              (inputs.file === "" && inputs.file_uri === "")
            }
            className="px-4 py-2 mx-auto gradient-button"
            onClick={() => {
              const formData = new FormData();

              formData.append("name", inputs.name);
              formData.append("file", inputs.file);
              if (inputs.file_uri) formData.append("file_uri", inputs.file_uri);

              attachEvidence.mutate({
                formData: formData,
              });
              setShow(false);
            }}
          >
            Upload
          </button>
        </section>
      </ModalLayout>
    </>
  );
};

export default AttachEvidence;
