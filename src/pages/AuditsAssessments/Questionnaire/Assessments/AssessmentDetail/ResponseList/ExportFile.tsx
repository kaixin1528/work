/* eslint-disable react-hooks/exhaustive-deps */
import {
  faDownload,
  faFileExport,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { LineWave } from "react-loader-spinner";
import {
  DownloadResponses,
  ExportResponses,
  GetExportResponsesStatus,
} from "src/services/audits-assessments/questionnaire";

const ExportFile = ({
  assessmentID,
  selectedExportQuestions,
}: {
  assessmentID: string;
  selectedExportQuestions: any;
}) => {
  const [includesCitations, setIncludesCitations] = useState<boolean>(false);

  const exportResponses = ExportResponses(assessmentID);
  const { data: exportStatus } = GetExportResponsesStatus(assessmentID);
  const downloadResponses = DownloadResponses(assessmentID);

  const onDownload = () => {
    downloadResponses.mutate(
      {},
      {
        onSuccess: (data) => {
          const url = data.signed_url;
          let a = document.createElement("a");
          a.href = url;
          a.download = "responses.docx";
          a.target = "_blank";
          a.click();
        },
      }
    );
  };

  useEffect(() => {
    downloadResponses.mutate({});
  }, []);

  return (
    <section className="flex items-center gap-5">
      <button
        className="flex items-center gap-1"
        onClick={() =>
          exportResponses.mutate({
            includesCitations: includesCitations,
            questions: selectedExportQuestions,
          })
        }
      >
        <FontAwesomeIcon icon={faFileExport} className="text-checkbox" />
        Export Responses
      </button>
      <article className="flex items-center gap-1">
        <input
          type="checkbox"
          checked={includesCitations}
          onChange={() => setIncludesCitations(!includesCitations)}
          className="form-checkbox w-4 h-4 border-0 dark:focus:ring-0 dark:text-checkbox dark:focus:border-checkbox focus:ring dark:focus:ring-offset-0 dark:focus:ring-checkbox focus:ring-opacity-50"
        />
        <label htmlFor="">with citations</label>
      </article>
      {exportStatus?.status === "parsing" ? (
        <span className="flex items-center gap-1">
          Exporting{" "}
          <LineWave
            visible={true}
            height="30"
            width="30"
            color="#4fa94d"
            ariaLabel="line-wave-loading"
            wrapperStyle={{}}
            wrapperClass=""
            firstLineColor=""
            middleLineColor=""
            lastLineColor=""
          />
        </span>
      ) : exportStatus?.status === "ready" ? (
        <article className="flex items-center gap-5">
          <button
            className="flex items-center gap-1 dark:hover:text-signin duration-100"
            onClick={onDownload}
          >
            <FontAwesomeIcon icon={faDownload} className="text-signin" />
            Download Last Export
          </button>
          <span className="text-sm">{downloadResponses.data?.timestamp}</span>
        </article>
      ) : (
        exportStatus?.status === "failed" && (
          <span>
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              className="text-reset"
            />{" "}
            Export failed
          </span>
        )
      )}
    </section>
  );
};

export default ExportFile;
