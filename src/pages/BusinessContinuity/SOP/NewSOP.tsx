import React, { useState } from "react";
import RegularInput from "src/components/Input/RegularInput";
import ModalLayout from "src/layouts/ModalLayout";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong, faUpload } from "@fortawesome/free-solid-svg-icons";
import { UploadSOPVersion } from "src/services/business-continuity/sop";
import Tags from "./Tags";
import MultipleFileInput from "src/components/Input/MultipleFileInput";

const NewSOP = () => {
  const navigate = useNavigate();

  const [show, setShow] = useState<boolean>(false);
  const [newSOPID, setNewSOPID] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [inputs, setInputs] = useState<any>({
    sop_id: "",
    sop_name: "",
    sop_version: "",
    files: [],
    file_uri: "",
    selected_tag: "",
    entered_tag: "",
  });

  const addSOP = UploadSOPVersion();

  const handleOnClose = () => setShow(false);
  const handleOnCloseConfirmation = () => setNewSOPID("");

  return (
    <>
      <button
        className="flex items-center place-self-end gap-2 px-8 py-2 mx-auto text-base dark:text-white green-gradient-button rounded-sm"
        onClick={() => {
          setShow(true);
          setSelectedOption("Upload a new procedure");
          setInputs({
            sop_id: "",
            sop_name: "",
            sop_version: "",
            files: [],
            file_uri: "",
            selected_tag: "",
            entered_tag: "",
          });
        }}
      >
        <FontAwesomeIcon icon={faUpload} />
        <h4>Upload Procedure</h4>
      </button>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        <section className="grid content-start gap-5 h-full overflow-auto scrollbar">
          <h3 className="flex items-center gap-2 text-lg">
            <FontAwesomeIcon icon={faUpload} />
            Upload Procedure
          </h3>
          <nav className="flex items-center gap-5 mx-1">
            {["Upload a new procedure", "Upload multiple procedures"].map(
              (option, index) => {
                return (
                  <article key={index} className="flex items-center gap-2">
                    <input
                      type="radio"
                      className="form-radio w-4 h-4 dark:ring-0 dark:text-signin dark:focus:border-signin focus:ring dark:focus:ring-offset-0 dark:focus:ring-signin focus:ring-opacity-50 rounded-full"
                      checked={selectedOption === option}
                      onChange={() => {
                        setSelectedOption(option);
                        if (
                          selectedOption === "Upload multiple procedures" &&
                          option !== "Upload multiple procedures"
                        )
                          setInputs({ ...inputs, files: [] });
                      }}
                    />
                    {option}
                  </article>
                );
              }
            )}
          </nav>
          {selectedOption !== "" && (
            <>
              {selectedOption !== "Upload multiple procedures" && (
                <section className="grid md:grid-cols-2 gap-10">
                  <RegularInput
                    label="Procedure Name"
                    keyName="sop_name"
                    inputs={inputs}
                    setInputs={setInputs}
                    required
                  />
                  <RegularInput
                    label="Procedure Version"
                    keyName="sop_version"
                    inputs={inputs}
                    setInputs={setInputs}
                    required
                  />
                </section>
              )}
              <Tags inputs={inputs} setInputs={setInputs} />
              {selectedOption !== "Upload multiple procedures" && (
                <RegularInput
                  label="File URL (optional)"
                  keyName="file_uri"
                  inputs={inputs}
                  setInputs={setInputs}
                />
              )}
              <MultipleFileInput
                label="Procedures"
                keyName="files"
                types={["pdf"]}
                inputs={inputs}
                setInputs={setInputs}
              />
              <button
                disabled={
                  (inputs.files.length <= 1 &&
                    (inputs.sop_name === "" || inputs.sop_version === "")) ||
                  (inputs.files.length === 0 && inputs.file_uri === "")
                }
                className="flex items-center justify-self-center gap-2 px-4 py-2 w-max dark:text-white green-gradient-button rounded-sm"
                onClick={() => {
                  const formData = new FormData();

                  if (inputs.sop_name !== "")
                    formData.append("sop_name", inputs.sop_name);
                  if (inputs.sop_version !== "")
                    formData.append("bcm_sop_version", inputs.sop_version);
                  if (inputs.selected_tag || inputs.entered_tag)
                    formData.append(
                      "tag_name",
                      inputs.selected_tag !== ""
                        ? inputs.selected_tag
                        : inputs.entered_tag
                    );
                  if (inputs.files.length > 0)
                    inputs.files.forEach((file: any) =>
                      formData.append("files", file)
                    );
                  if (inputs.file_uri)
                    formData.append("file_uri", inputs.file_uri);

                  addSOP.mutate({
                    formData: formData,
                  });
                  handleOnClose();
                }}
              >
                Done
              </button>
            </>
          )}
        </section>
      </ModalLayout>
      <ModalLayout
        showModal={newSOPID !== ""}
        onClose={handleOnCloseConfirmation}
      >
        <section className="grid content-start gap-5 py-4 h-full mx-auto text-center">
          <img
            src="/general/checkmark.svg"
            alt="checkmark"
            className="w-12 h-12 mx-auto"
          />
          <span className="text-2xl italic">{inputs.sop_name} </span>
          <h3 className="text-lg">
            has been uploaded. GRC Copilot is on it! Will notify you as soon as
            the document is read, parsed, understood, and analyzed by the
            Copilot.
          </h3>
          <button
            className="px-4 py-2 mx-auto w-max dark:bg-filter/60 dark:hover:bg-filter/30 duration-100 rounded-full"
            onClick={() => {
              navigate(
                `/business-continuity/sop/details?sop_id=${newSOPID}&sop_version_id=${addSOP?.data?.version_id}`
              );
              handleOnCloseConfirmation();
            }}
          >
            <h4>
              Go to Procedure <FontAwesomeIcon icon={faArrowRightLong} />
            </h4>
          </button>
        </section>
      </ModalLayout>
    </>
  );
};

export default NewSOP;
