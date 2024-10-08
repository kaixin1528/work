/* eslint-disable react-hooks/exhaustive-deps */
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useGeneralStore } from "src/stores/general";

const FileInput = ({
  label,
  keyName,
  types,
  inputs,
  setInputs,
}: {
  label: string;
  keyName: string;
  types: string[];
  inputs: any;
  setInputs: any;
}) => {
  const { error, setError } = useGeneralStore();

  const handleClearError = () => setError({ url: "", message: "" });

  useEffect(() => {
    handleClearError();
  }, []);

  return (
    <article className="grid content-start gap-1">
      <h4>Upload {label}</h4>
      {error.message && (
        <p className="p-2 w-max break-words text-xs text-left dark:bg-inner border dark:border-error rounded-sm">
          {error.message}
        </p>
      )}
      <FileUploader
        handleChange={(file: any) => {
          handleClearError();
          if (types.includes("JSON")) {
            const reader = new FileReader();
            if (file) {
              reader.readAsText(file);
            }

            reader.onload = () => {
              setInputs({
                ...inputs,
                [keyName]: JSON.parse(String(reader.result)),
              });
            };
          } else
            setInputs({
              ...inputs,
              [keyName]: file,
            });
        }}
        name="file"
        types={types}
        children={
          <button
            className={`group flex flex-col gap-1 items-center px-10 ${
              inputs[keyName] !== ""
                ? "py-5 dark:bg-account shadow-lg"
                : "py-12 dark:hover:bg-icon duration-100 border-dashed border-2 dark:border-checkbox"
            } w-full h-full mx-auto tracking-wide rounded-sm`}
          >
            {inputs[keyName] !== "" ? (
              <p className="flex items-center gap-2">
                File Uploaded
                <FontAwesomeIcon
                  icon={faXmark}
                  className="hidden group-hover:block red-button"
                  onClick={() => {
                    handleClearError();
                    setInputs({
                      ...inputs,
                      [keyName]: "",
                    });
                  }}
                />
              </p>
            ) : (
              <article className="grid gap-2">
                <svg
                  width="21"
                  height="22"
                  viewBox="0 0 21 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto"
                >
                  <path
                    d="M5.00447 14.9527C4.01948 14.9538 3.06872 14.5914 2.33434 13.935C1.59995 13.2786 1.13358 12.3743 1.02458 11.3953C0.915574 10.4164 1.1716 9.43166 1.7436 8.62978C2.31561 7.8279 3.16337 7.26526 4.12447 7.04966C3.84639 5.75276 4.09489 4.3985 4.81532 3.28481C5.53574 2.17113 6.66906 1.38924 7.96597 1.11116C9.26288 0.833085 10.6171 1.08159 11.7308 1.80201C12.8445 2.52243 13.6264 3.65576 13.9045 4.95266H14.0045C15.2444 4.95142 16.4406 5.41095 17.3608 6.24204C18.281 7.07313 18.8596 8.21649 18.9842 9.45017C19.1088 10.6838 18.7706 11.9198 18.0352 12.9181C17.2997 13.9165 16.2196 14.6059 15.0045 14.8527M13.0045 11.9527L10.0045 8.95266M10.0045 8.95266L7.00447 11.9527M10.0045 8.95266V20.9527"
                    stroke="#7993B0"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>
                  <span className="font-bold"> Click to upload </span>
                  or drag and drop file
                </p>
              </article>
            )}
          </button>
        }
      />
    </article>
  );
};

export default FileInput;
