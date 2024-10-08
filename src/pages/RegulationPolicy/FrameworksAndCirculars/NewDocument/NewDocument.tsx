/* eslint-disable react-hooks/exhaustive-deps */
import { faArrowRightLong, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GeneralSnapshotDatepicker from "src/components/Datepicker/GeneralSnapshotDatepicker";
import RegionFilter from "src/components/Filter/RegulationPolicy/RegionFilter";
import VerticalFilter from "src/components/Filter/RegulationPolicy/VerticalFilter";
import FileInput from "src/components/Input/FileInput";
import RegularInput from "src/components/Input/RegularInput";
import ModalLayout from "src/layouts/ModalLayout";
import {
  CreateFramework,
  ParseFrameworkMetadata,
} from "src/services/regulation-policy/framework";
import AdditionalRegAuth from "./AdditionalRegAuth";
import { checkGRCAdmin } from "src/utils/general";

const NewDocument = ({ documentType }: { documentType: string }) => {
  const navigate = useNavigate();
  const isGRCAdmin = checkGRCAdmin();

  const documentTypePhrase =
    documentType === "frameworks" ? "Framework" : "Circular";

  const [show, setShow] = useState<boolean>(false);
  const [inputs, setInputs] = useState<any>({
    file: "",
    file_uri: "",
    regulatory_authority: "",
    additional_regulatory_authorities: [],
    framework_name: "",
    alias: "",
    thumbnail: "",
    regulatory_date: Date.now() * 1000,
    regions: [],
    verticals: [],
    parse_only: false,
    custom: false,
  });

  const uploadFramework = CreateFramework();
  const parseFrameworkMetadata = ParseFrameworkMetadata();

  const handleOnClose = () => setShow(false);
  const handleOnCloseConfirmation = () => uploadFramework.reset();

  useEffect(() => {
    if (inputs.file !== "") {
      const formData = new FormData();

      formData.append("file", inputs.file);
      if (inputs.file_uri) formData.append("file_uri", inputs.file_uri);

      parseFrameworkMetadata.mutate({
        formData: formData,
      });
    }
  }, [inputs.file]);

  useEffect(() => {
    if (parseFrameworkMetadata.data)
      setInputs({
        ...inputs,
        ...(!Boolean(inputs.regulatory_authority) && {
          regulatory_authority:
            parseFrameworkMetadata.data.regulatory_authority || "",
        }),
        ...(!Boolean(inputs.framework_name) && {
          framework_name: parseFrameworkMetadata.data.framework_name || "",
        }),
        ...(parseFrameworkMetadata.data.regulatory_date && {
          regulatory_date: parseFrameworkMetadata.data.regulatory_date,
        }),
      });
  }, [parseFrameworkMetadata.data]);

  return (
    <>
      <button
        className="flex items-center gap-2 px-8 py-2 mx-auto text-base dark:text-white green-gradient-button rounded-sm"
        onClick={() => {
          setShow(true);
          setInputs({
            file: "",
            file_uri: "",
            regulatory_authority: "",
            additional_regulatory_authorities: [],
            framework_name: "",
            alias: "",
            thumbnail: "",
            regulatory_date: Date.now() * 1000,
            regions: [],
            verticals: [],
            parse_only: false,
            custom: false,
          });
        }}
      >
        <FontAwesomeIcon icon={faUpload} />
        <h4 className="w-max">Upload {documentTypePhrase}</h4>
      </button>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        <section className="grid content-start gap-5 py-4 h-full overflow-auto scrollbar">
          <h3 className="flex items-center gap-2 text-lg">
            <FontAwesomeIcon icon={faUpload} />
            Upload {documentTypePhrase}
          </h3>
          <section className="grid content-start gap-7">
            <section className="grid content-start md:grid-cols-2 gap-10">
              <RegularInput
                label={`${documentTypePhrase} Name`}
                keyName="framework_name"
                inputs={inputs}
                setInputs={setInputs}
                required
              />
              <RegularInput
                label="Alias"
                keyName="alias"
                inputs={inputs}
                setInputs={setInputs}
                required
              />
              <RegularInput
                label="Regulatory Authority"
                keyName="regulatory_authority"
                inputs={inputs}
                setInputs={setInputs}
                required
              />
              {documentTypePhrase === "Framework" && (
                <AdditionalRegAuth
                  documentType={documentTypePhrase}
                  inputs={inputs}
                  setInputs={setInputs}
                />
              )}
              <GeneralSnapshotDatepicker
                label="Published at"
                keyName="regulatory_date"
                inputs={inputs}
                setInputs={setInputs}
              />
            </section>
            <RegionFilter
              label="Region"
              inputs={inputs}
              setInputs={setInputs}
            />
            <VerticalFilter
              label="Vertical"
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
              label={documentTypePhrase}
              keyName="file"
              types={["pdf", "docx", "xlsx"]}
              inputs={inputs}
              setInputs={setInputs}
            />
            <section className="flex items-center gap-5">
              {isGRCAdmin && (
                <article className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={inputs.parse_only}
                    id="parse only"
                    className="form-checkbox w-4 h-4 border-0 dark:focus:ring-0 dark:text-signin dark:focus:border-signin focus:ring dark:focus:ring-offset-0 dark:focus:ring-signin focus:ring-opacity-50"
                    onChange={() =>
                      setInputs({ ...inputs, parse_only: !inputs.parse_only })
                    }
                  />
                  <label htmlFor="parse only">Parse Framework Only</label>
                </article>
              )}
              <article className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={inputs.custom}
                  id="custom framework"
                  className="form-checkbox w-4 h-4 border-0 dark:focus:ring-0 dark:text-signin dark:focus:border-signin focus:ring dark:focus:ring-offset-0 dark:focus:ring-signin focus:ring-opacity-50"
                  onChange={() =>
                    setInputs({
                      ...inputs,
                      regulatory_authority: "Multiple",
                      custom: !inputs.custom,
                    })
                  }
                />
                <label htmlFor="custom framework">Custom Framework</label>
              </article>
            </section>
          </section>
          <button
            disabled={
              inputs.regulatory_authority === "" ||
              inputs.framework_name === "" ||
              (inputs.file === "" && inputs.file_uri === "")
            }
            className="flex items-center justify-self-center gap-2 px-4 py-2 w-max dark:text-white green-gradient-button rounded-sm"
            onClick={() => {
              const formData = new FormData();

              formData.append("type", documentTypePhrase.toUpperCase());
              formData.append(
                "regulatory_authority",
                inputs.regulatory_authority
              );
              formData.append("regulatory_date", inputs.regulatory_date);
              formData.append("framework_name", inputs.framework_name);
              formData.append("alias", inputs.alias);
              formData.append("parse_only", inputs.parse_only);
              formData.append("custom", inputs.custom);
              if (inputs.file) formData.append("file", inputs.file);
              if (inputs.file_uri) formData.append("file_uri", inputs.file_uri);
              if (inputs.additional_regulatory_authorities.length > 0)
                inputs.additional_regulatory_authorities.forEach(
                  (auth: string) =>
                    formData.append("additional_regulatory_authorities", auth)
                );
              if (inputs.regions.length > 0)
                inputs.regions.forEach((region: string) =>
                  formData.append("regions", region)
                );
              if (inputs.verticals.length > 0)
                inputs.verticals.forEach((vertical: string) =>
                  formData.append("verticals", vertical)
                );
              uploadFramework.mutate({
                formData: formData,
              });
              handleOnClose();
            }}
          >
            Done
          </button>
        </section>
      </ModalLayout>
      <ModalLayout
        showModal={uploadFramework.data !== undefined}
        onClose={handleOnCloseConfirmation}
      >
        <section className="grid content-start gap-5 py-4 h-full mx-auto text-center">
          <img
            src="/general/checkmark.svg"
            alt="checkmark"
            className="w-12 h-12 mx-auto"
          />
          <span className="text-2xl italic">{inputs.framework_name}</span>
          <h3 className="text-lg">
            has been uploaded. GRC Copilot is on it! Will notify you as soon as
            the document is read, parsed, understood, and analyzed by the
            Copilot.
          </h3>
          <button
            className="px-4 py-2 mx-auto w-max dark:bg-filter/60 dark:hover:bg-filter/30 duration-100 rounded-full"
            onClick={() => {
              navigate(
                `/regulation-policy/document/details?document_type=${documentType}&document_id=${uploadFramework.data?.generated_id}`
              );
              handleOnCloseConfirmation();
            }}
          >
            <h4>
              Go to {documentTypePhrase}{" "}
              <FontAwesomeIcon icon={faArrowRightLong} />
            </h4>
          </button>
        </section>
      </ModalLayout>
    </>
  );
};

export default NewDocument;
