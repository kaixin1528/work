import React, { useState } from "react";
import ModalLayout from "src/layouts/ModalLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong, faUpload } from "@fortawesome/free-solid-svg-icons";
import FileInput from "src/components/Input/FileInput";
import { useNavigate } from "react-router-dom";
import RegularInput from "src/components/Input/RegularInput";
import SelectFrameworksFilter from "src/components/Filter/ThirdPartyRisk/SelectFrameworksFilter";
import {
  CreatePrivacyReview,
  GetPrivacyStandards,
} from "src/services/third-party-risk/privacy-review";
import ThirdPartyFilter from "src/components/Filter/ThirdPartyRisk/ThirdPartyFilter";

const NewReview = () => {
  const navigate = useNavigate();

  const [show, setShow] = useState<boolean>(false);
  const [inputs, setInputs] = useState<any>({
    name: "",
    audit_name: "",
    file: "",
    file_uri: "",
    framework_ids: [],
  });

  const { data: privacyStandards } = GetPrivacyStandards();
  const addReview = CreatePrivacyReview();

  const handleOnClose = () => setShow(false);
  const handleOnCloseConfirmation = () => addReview.reset();

  return (
    <>
      <button
        className="flex items-center gap-2 px-8 py-2 mx-auto text-base dark:text-white green-gradient-button rounded-sm"
        onClick={() => {
          setShow(true);
          setInputs({
            name: "",
            audit_name: "",
            file: "",
            file_uri: "",
            framework_ids: [],
          });
        }}
      >
        <FontAwesomeIcon icon={faUpload} />
        <h4>Upload Review</h4>
      </button>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        <section className="grid content-start gap-5 h-full">
          <h3 className="flex items-center gap-2 text-lg">
            <FontAwesomeIcon icon={faUpload} />
            Upload Review
          </h3>
          <article className="grid lg:grid-cols-2 gap-10">
            <ThirdPartyFilter
              label="Third Party"
              inputs={inputs}
              setInputs={setInputs}
            />
            <article className="grid gap-2">
              <h4>Frameworks</h4>
              <SelectFrameworksFilter
                inputs={inputs}
                setInputs={setInputs}
                list={privacyStandards}
              />
            </article>
          </article>
          <RegularInput
            label="Agreement or Policy Name"
            keyName="audit_name"
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
            label="Document"
            keyName="file"
            types={["pdf", "docx"]}
            inputs={inputs}
            setInputs={setInputs}
          />
          <button
            disabled={
              inputs.name === "" ||
              inputs.audit_name === "" ||
              (inputs.file === "" && inputs.file_uri === "") ||
              inputs.framework_ids.length === 0
            }
            className="flex items-center justify-self-center gap-2 px-4 py-2 w-max dark:text-white green-gradient-button rounded-sm"
            onClick={() => {
              const formData = new FormData();

              formData.append("name", inputs.name);
              if (inputs.framework_ids.length > 0)
                inputs.framework_ids.forEach((frameworkID: string) =>
                  formData.append("framework_ids", frameworkID)
                );
              formData.append("audit_name", inputs.audit_name);
              formData.append("file", inputs.file);
              if (inputs.file_uri) formData.append("file_uri", inputs.file_uri);

              addReview.mutate({
                formData: formData,
              });
              handleOnClose();
            }}
          >
            <h4>Done</h4>
          </button>
        </section>
      </ModalLayout>
      <ModalLayout
        showModal={addReview.data !== undefined}
        onClose={handleOnCloseConfirmation}
      >
        <section className="grid content-start gap-5 py-4 h-full mx-auto">
          <article className="flex items-center gap-2">
            <img
              src="/general/checkmark.svg"
              alt="checkmark"
              className="w-6 h-6"
            />
            <h3 className="text-lg">New Review has been created!</h3>
          </article>
          <button
            className="px-4 py-2 mx-auto w-max dark:hover:bg-filter/30 duration-100 rounded-full"
            onClick={() => {
              navigate(
                `/third-party-risk/privacy/details?review_id=${addReview.data.review_id}&framework_id=${inputs.framework_ids[0]}&audit_id=${addReview.data.audit_id}`
              );
              handleOnCloseConfirmation();
            }}
          >
            <h4>
              Go to Review <FontAwesomeIcon icon={faArrowRightLong} />
            </h4>
          </button>
        </section>
      </ModalLayout>
    </>
  );
};

export default NewReview;
