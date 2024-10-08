import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { queryClient } from "src/App";
import FileInput from "src/components/Input/FileInput";
import RegularInput from "src/components/Input/RegularInput";
import ModalLayout from "src/layouts/ModalLayout";
import { UploadPolicyVersion } from "src/services/regulation-policy/policy";

const UpdatePolicyVersion = ({
  documentName,
  documentID,
  setSelectedPolicyVersion,
}: {
  documentName: string;
  documentID: string;
  setSelectedPolicyVersion: (selectedPolicyVersion: string) => void;
}) => {
  const [show, setShow] = useState<boolean>(false);
  const [inputs, setInputs] = useState<any>({
    policy_version: "",
    file: "",
    file_uri: "",
  });

  const uploadPolicyVersion = UploadPolicyVersion();

  const handleOnClose = () => setShow(false);

  return (
    <>
      <button
        className="flex items-center gap-2 dark:text-checkbox dark:hover:text-checkbox/60 duration-100"
        onClick={() => {
          setShow(true);
          setInputs({
            policy_version: "",
            file: "",
            file_uri: "",
          });
        }}
      >
        <FontAwesomeIcon icon={faPencil} />
        <h4>Update Version</h4>
      </button>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        <section className="grid content-start gap-5">
          <h3 className="flex items-center gap-2 text-lg">
            <FontAwesomeIcon icon={faPencil} />
            Update Version
          </h3>
          <RegularInput
            label="Policy Version"
            keyName="policy_version"
            inputs={inputs}
            setInputs={setInputs}
          />
          <RegularInput
            label="File URL (optional)"
            keyName="file_uri"
            inputs={inputs}
            setInputs={setInputs}
            optional
          />
          <FileInput
            label="Policy"
            keyName="file"
            types={["pdf", "docx"]}
            inputs={inputs}
            setInputs={setInputs}
          />
          <button
            disabled={
              inputs.policy_version === "" ||
              (inputs.file === "" && inputs.file_uri === "")
            }
            className="flex items-center justify-self-center gap-2 px-4 py-2 w-max dark:text-white green-gradient-button rounded-sm"
            onClick={() => {
              setShow(false);
              setInputs({
                policy_version: "",
                file: "",
                file_uri: "",
              });

              const formData = new FormData();

              formData.append("policy_id", documentID);
              formData.append("policy_name", documentName);
              formData.append("policy_version", inputs.policy_version);
              if (inputs.file) formData.append("file", inputs.file);
              if (inputs.file_uri) formData.append("file_uri", inputs.file_uri);

              uploadPolicyVersion.mutate(
                {
                  formData: formData,
                },
                {
                  onSuccess: () => {
                    queryClient.invalidateQueries(["get-policy-versions"]);
                    setSelectedPolicyVersion(inputs.policy_version);
                  },
                }
              );
            }}
          >
            <h4>Done</h4>
          </button>
        </section>
      </ModalLayout>
    </>
  );
};

export default UpdatePolicyVersion;
