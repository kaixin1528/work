import React, { useEffect, useState } from "react";
import ModalLayout from "src/layouts/ModalLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import FileInput from "src/components/Input/FileInput";
import { read, utils } from "xlsx";
import Sheet from "src/pages/AuditsAssessments/Questionnaire/QuestionBanks/QuestionBankList/UploadQuestionBank/Sheet";
import { SubmitVendorResponses } from "src/services/third-party-risk/vendors-and-partners/vendors";

const UploadVendorResponses = ({ vendorID }: { vendorID: string }) => {
  const [show, setShow] = useState<boolean>(false);
  const [inputs, setInputs] = useState<any>({
    file: "",
  });
  const [headers, setHeaders] = useState<any>({});
  const [numOfRows, setNumOfRows] = useState<any>({});
  const [markedAsQuestionCol, setMarkedAsQuestionCol] = useState<any>({});
  const [markedAsAnswerCol, setMarkedAsAnswerCol] = useState<any>({});

  const uploadVendorResponses = SubmitVendorResponses(vendorID);

  const handleOnClose = () => setShow(false);

  useEffect(() => {
    if (inputs.file) {
      let fileReader = new FileReader();
      fileReader.readAsBinaryString(inputs.file);
      fileReader.onload = (event) => {
        let data = event.target?.result;
        let workbook = read(data, { type: "binary" });
        const tempHeaders = {} as any;
        workbook.SheetNames.forEach((sheet: string) => {
          const rowObject = utils.sheet_to_json(workbook.Sheets[sheet], {
            header: 1,
            defval: "",
          });
          let curHeaders = [];
          if (numOfRows[sheet] > 1) {
            const maxHeaderRows = Math.max(
              ...(workbook.Sheets[sheet]["!merges"] || [])?.reduce(
                (pV: number[], cV: any) => [...pV, cV.e.r],
                []
              )
            );
            const topCols = rowObject[0] as string[];
            let topColIdx = 0;
            curHeaders = (
              rowObject[Math.max(maxHeaderRows, 2)] as string[]
            )?.map((col, idx) => {
              if (col !== "") return `${topCols[topColIdx]} - ${col}`;
              else {
                topColIdx = idx + 1;
                return topCols[idx];
              }
            });
          } else curHeaders = rowObject[0] as string[];
          tempHeaders[sheet] = curHeaders;
        });
        setHeaders(tempHeaders);
      };
    } else setHeaders({});
  }, [inputs.file, numOfRows]);

  return (
    <>
      <button
        className="flex items-center gap-2 px-8 py-2 mx-auto text-base dark:text-white green-gradient-button rounded-sm"
        onClick={() => {
          setShow(true);
          setInputs({
            file: "",
          });
          setMarkedAsQuestionCol({});
          setMarkedAsAnswerCol({});
        }}
      >
        <FontAwesomeIcon icon={faUpload} />
        <h4>Upload Vendor Responses</h4>
      </button>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        <section className="grid content-start gap-5 h-full">
          <h3 className="flex items-center gap-2 text-lg">
            <FontAwesomeIcon icon={faUpload} />
            Upload Vendor Responses
          </h3>
          <FileInput
            label="Vendor Responses"
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
                    numOfRows={numOfRows}
                    setNumOfRows={setNumOfRows}
                    markedAsQuestionCol={markedAsQuestionCol}
                    setMarkedAsQuestionCol={setMarkedAsQuestionCol}
                    markedAsAnswerCol={markedAsAnswerCol}
                    setMarkedAsAnswerCol={setMarkedAsAnswerCol}
                  />
                );
              })}
            </section>
          )}
          <button
            disabled={
              inputs.file === "" ||
              Object.keys(markedAsQuestionCol).length === 0 ||
              Object.keys(markedAsAnswerCol).length === 0
            }
            className="flex items-center justify-self-center gap-2 px-4 py-2 w-max dark:text-white green-gradient-button rounded-sm"
            onClick={() => {
              const formData = new FormData();

              formData.append("file", inputs.file);

              let toExtract = {} as any;
              Object.keys(headers).forEach((sheet, sheetIndex: number) => {
                if (
                  markedAsQuestionCol.hasOwnProperty(sheet) &&
                  markedAsQuestionCol.hasOwnProperty(sheet) &&
                  numOfRows.hasOwnProperty(sheet)
                )
                  toExtract[sheetIndex] = {
                    questions: markedAsQuestionCol[sheet],
                    answers: markedAsAnswerCol[sheet],
                    num_header_rows: numOfRows[sheet],
                  };
              });
              formData.append("to_extract", JSON.stringify(toExtract));

              uploadVendorResponses.mutate({
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

export default UploadVendorResponses;
