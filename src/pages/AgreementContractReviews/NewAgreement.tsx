/* eslint-disable react-hooks/exhaustive-deps */
import { faArrowRightLong, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GeneralSnapshotDatepicker from "src/components/Datepicker/GeneralSnapshotDatepicker";
import FileInput from "src/components/Input/FileInput";
import RegularInput from "src/components/Input/RegularInput";
import ModalLayout from "src/layouts/ModalLayout";
import { KeyStringVal } from "src/types/general";
import {
  CreateAgreement,
  ParseAgreementContractReviewMetadata,
} from "src/services/agreement-contract-review";
import Tags from "../AuditsAssessments/Questionnaire/Assessments/AssessmentList/Tags";
import { queryClient } from "src/App";

const NewAgreement = () => {
  const navigate = useNavigate();

  const [show, setShow] = useState<boolean>(false);
  const [inputs, setInputs] = useState<any>({
    file: "",
    file_uri: "",
    agreement_name: "",
    agreement_date: Date.now() * 1000,
    tags: [],
  });

  const uploadAgreement = CreateAgreement();
  const parseAgreementMetadata = ParseAgreementContractReviewMetadata();

  const handleOnClose = () => setShow(false);
  const handleOnCloseConfirmation = () => uploadAgreement.reset();

  useEffect(() => {
    if (inputs.file !== "") {
      const formData = new FormData();

      formData.append("file", inputs.file);
      if (inputs.file_uri) formData.append("file_uri", inputs.file_uri);

      parseAgreementMetadata.mutate({
        formData: formData,
      });
    }
  }, [inputs.file]);

  useEffect(() => {
    if (parseAgreementMetadata.data)
      setInputs({
        ...inputs,
        ...(!Boolean(inputs.agreement_name) && {
          agreement_name: parseAgreementMetadata.data.agreement_name || "",
        }),
        ...(parseAgreementMetadata.data.agreement_date && {
          agreement_date: parseAgreementMetadata.data.agreement_date,
        }),
      });
  }, [parseAgreementMetadata.data]);

  return (
    <>
      <button
        className="flex items-center place-self-end gap-2 px-8 py-2 mx-auto text-base dark:text-white green-gradient-button rounded-sm"
        onClick={() => {
          setShow(true);
          setInputs({
            file: "",
            file_uri: "",
            agreement_name: "",
            agreement_date: Date.now() * 1000,
            tags: [],
          });
        }}
      >
        <FontAwesomeIcon icon={faUpload} />
        <h4 className="w-max">Start Agreement</h4>
      </button>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        <section className="grid content-start gap-5 py-4 h-full overflow-auto scrollbar">
          <h3 className="flex items-center gap-2 text-lg">
            <FontAwesomeIcon icon={faUpload} />
            Start Agreement
          </h3>
          <section className="grid content-start gap-7">
            <RegularInput
              label="Agreement Name"
              keyName="agreement_name"
              inputs={inputs}
              setInputs={setInputs}
              required
            />
            <GeneralSnapshotDatepicker
              label="Agreement Date"
              keyName="agreement_date"
              inputs={inputs}
              setInputs={setInputs}
            />
            <RegularInput
              label="File URL (optional)"
              keyName="file_uri"
              inputs={inputs}
              setInputs={setInputs}
            />
            <FileInput
              label="Agreement"
              keyName="file"
              types={["pdf", "docx"]}
              inputs={inputs}
              setInputs={setInputs}
            />
            <Tags inputs={inputs} setInputs={setInputs} />
          </section>
          <button
            disabled={
              inputs.agreement_name === "" ||
              (inputs.file === "" && inputs.file_uri === "")
            }
            className="flex items-center justify-self-center gap-2 px-4 py-2 w-max dark:text-white green-gradient-button rounded-sm"
            onClick={() => {
              const formData = new FormData();

              formData.append("agreement_name", inputs.agreement_name);
              formData.append("agreement_date", inputs.agreement_date);
              if (inputs.file) formData.append("file", inputs.file);
              if (inputs.file_uri) formData.append("file_uri", inputs.file_uri);
              if (inputs.tags.length > 0)
                inputs.tags.forEach((tag: KeyStringVal) =>
                  formData.append("tags", tag.tag_id)
                );
              uploadAgreement.mutate(
                {
                  formData: formData,
                },
                {
                  onSuccess: (data) => {
                    if (data) {
                      handleOnClose();
                      queryClient.invalidateQueries([
                        "get-agreement-contract-review",
                      ]);
                    }
                  },
                }
              );
            }}
          >
            Done
          </button>
        </section>
      </ModalLayout>
      <ModalLayout
        showModal={uploadAgreement.data !== undefined}
        onClose={handleOnCloseConfirmation}
      >
        <section className="grid content-start gap-5 py-4 h-full mx-auto text-center">
          <img
            src="/general/checkmark.svg"
            alt="checkmark"
            className="w-12 h-12 mx-auto"
          />
          <span className="text-2xl italic">{inputs.agreement_name}</span>
          <h3 className="text-lg">
            has been uploaded. GRC Copilot is on it! Will notify you as soon as
            the document is read, parsed, understood, and analyzed by the
            Copilot.
          </h3>
          <button
            className="px-4 py-2 mx-auto w-max dark:bg-filter/60 dark:hover:bg-filter/30 duration-100 rounded-full"
            onClick={() => {
              navigate(
                `/agreement-contract-review/agreement/details?agreement_id=${uploadAgreement.data?.id}`
              );
              handleOnCloseConfirmation();
            }}
          >
            <h4>
              Go to Agreement <FontAwesomeIcon icon={faArrowRightLong} />
            </h4>
          </button>
        </section>
      </ModalLayout>
    </>
  );
};

export default NewAgreement;
