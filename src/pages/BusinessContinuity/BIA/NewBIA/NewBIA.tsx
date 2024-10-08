/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import RegularInput from "src/components/Input/RegularInput";
import ModalLayout from "src/layouts/ModalLayout";
import FileInput from "src/components/Input/FileInput";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong, faUpload } from "@fortawesome/free-solid-svg-icons";
import { UploadBIA } from "src/services/business-continuity/bia";
import { read, utils } from "xlsx";
import Sheet from "./Sheet";
import Tags from "../../SOP/Tags";

const NewBIA = () => {
  const navigate = useNavigate();

  const [show, setShow] = useState<boolean>(false);
  const [newBIAID, setNewBIAID] = useState<string>("");
  const [inputs, setInputs] = useState<any>({
    bia_name: "",
    file: "",
    file_uri: "",
    selected_tag: "",
    entered_tag: "",
  });
  const [headers, setHeaders] = useState({});
  const [selectedHeaders, setSelectedHeaders] = useState({});
  const [numOfRows, setNumOfRows] = useState({});
  const [selectedSOPCol, setSelectedSOPCol] = useState("");

  const addBIA = UploadBIA();

  const handleOnClose = () => setShow(false);
  const handleOnCloseConfirmation = () => setNewBIAID("");

  useEffect(() => {
    if (inputs.file) {
      let fileReader = new FileReader();
      fileReader.readAsBinaryString(inputs.file);
      fileReader.onload = (event) => {
        let data = event.target?.result;
        let workbook = read(data, { type: "binary" });
        const tempHeaders = {};
        workbook.SheetNames.forEach((sheet) => {
          const rowObject = utils.sheet_to_json(workbook.Sheets[sheet], {
            header: 1,
            defval: "",
          });
          let curHeaders = [];
          if (numOfRows[sheet] > 1) {
            const maxHeaderRows = Math.max(
              ...(workbook.Sheets[sheet]["!merges"]?.reduce(
                (pV: number[], cV: any) => [...pV, cV.e.r],
                []
              ) as number[])
            );
            const topCols = rowObject[0] as string[];
            let topColIdx = 0;
            curHeaders = (rowObject[maxHeaderRows] as string[])?.map(
              (col, idx) => {
                if (col !== "") return `${topCols[topColIdx]} - ${col}`;
                else {
                  topColIdx = idx + 1;
                  return topCols[idx];
                }
              }
            );
          } else curHeaders = rowObject[0] as string[];
          tempHeaders[sheet] = curHeaders;
        });
        setHeaders(tempHeaders);
        setSelectedHeaders({});
      };
    } else {
      setHeaders({});
      setSelectedHeaders({});
    }
  }, [inputs.file, numOfRows]);

  return (
    <>
      <button
        className="flex items-center place-self-end gap-2 px-8 py-2 mx-auto text-base dark:text-white green-gradient-button rounded-sm"
        onClick={() => {
          setShow(true);
          setInputs({
            bia_name: "",
            file: "",
            file_uri: "",
            selected_tag: "",
            entered_tag: "",
          });
        }}
      >
        <FontAwesomeIcon icon={faUpload} />
        <h4>Upload BIA</h4>
      </button>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        <section className="grid content-start gap-5 h-full overflow-auto scrollbar">
          <h3 className="flex items-center gap-2 text-lg">
            <FontAwesomeIcon icon={faUpload} />
            Upload BIA
          </h3>
          <RegularInput
            label="BIA Name"
            keyName="bia_name"
            inputs={inputs}
            setInputs={setInputs}
            required
          />
          <Tags inputs={inputs} setInputs={setInputs} />
          <FileInput
            label="BIA"
            keyName="file"
            types={["xlsx"]}
            inputs={inputs}
            setInputs={setInputs}
          />
          {Object.keys(headers).length > 0 && (
            <section className="grid gap-5 overflow-auto scrollbar">
              {Object.keys(headers).map((sheet, index) => {
                return (
                  <Sheet
                    key={index}
                    headers={headers}
                    sheet={sheet}
                    selectedHeaders={selectedHeaders}
                    setSelectedHeaders={setSelectedHeaders}
                    numOfRows={numOfRows}
                    setNumOfRows={setNumOfRows}
                    selectedSOPCol={selectedSOPCol}
                    setSelectedSOPCol={setSelectedSOPCol}
                  />
                );
              })}
            </section>
          )}
          <button
            disabled={
              inputs.bia_name === "" ||
              (inputs.file === "" && inputs.file_uri === "") ||
              (Object.values(selectedHeaders) as any).every(
                (cols: string[]) => cols.length === 0
              )
            }
            className="flex items-center justify-self-center gap-2 px-4 py-2 w-max dark:text-white green-gradient-button rounded-sm"
            onClick={() => {
              const formData = new FormData();

              formData.append("bia_name", inputs.bia_name);
              if (inputs.file) formData.append("file", inputs.file);
              if (inputs.file_uri) formData.append("file_uri", inputs.file_uri);
              if (selectedSOPCol)
                formData.append("sop_name_column", selectedSOPCol);
              if (Object.keys(selectedHeaders).length > 0)
                formData.append(
                  "selected_columns",
                  JSON.stringify(selectedHeaders)
                );
              if (Object.keys(numOfRows).length > 0)
                formData.append(
                  "num_of_rows_for_header",
                  JSON.stringify(numOfRows)
                );
              if (inputs.selected_tag || inputs.entered_tag)
                formData.append(
                  "tag_name",
                  inputs.selected_tag !== ""
                    ? inputs.selected_tag
                    : inputs.entered_tag
                );

              addBIA.mutate({
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
        showModal={newBIAID !== ""}
        onClose={handleOnCloseConfirmation}
      >
        <section className="grid content-start gap-5 py-4 h-full mx-auto text-center">
          <img
            src="/general/checkmark.svg"
            alt="checkmark"
            className="w-12 h-12 mx-auto"
          />
          <span className="text-2xl italic">{inputs.bia_name} </span>
          <h3 className="text-lg">
            has been uploaded. GRC Copilot is on it! Will notify you as soon as
            the document is read, parsed, understood, and analyzed by the
            Copilot.
          </h3>
          <button
            className="px-4 py-2 mx-auto w-max dark:bg-filter/60 dark:hover:bg-filter/30 duration-100 rounded-full"
            onClick={() => {
              navigate(
                `/business-continuity/bia/details?bia_id=${newBIAID}&bia_version_id=${addBIA?.data?.version_id}`
              );
              handleOnCloseConfirmation();
            }}
          >
            <h4>
              Go to BIA <FontAwesomeIcon icon={faArrowRightLong} />
            </h4>
          </button>
        </section>
      </ModalLayout>
    </>
  );
};

export default NewBIA;
