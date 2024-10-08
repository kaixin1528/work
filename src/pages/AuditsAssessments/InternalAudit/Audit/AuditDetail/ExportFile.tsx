import { faDownload, faFileExport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { LineWave } from "react-loader-spinner";
import {
  DownloadInternalAudit,
  ExportInternalAudit,
  GetExportInternalAuditStatus,
} from "src/services/audits-assessments/internal-audit";

const ExportFile = ({ auditID }: { auditID: string }) => {
  const exportInternalAudit = ExportInternalAudit(auditID);
  const { data: exportStatus } = GetExportInternalAuditStatus(auditID);
  const downloadInternalAudit = DownloadInternalAudit(auditID);

  const onDownload = () => {
    downloadInternalAudit.mutate(
      {},
      {
        onSuccess: (data) => {
          const url = data;
          let a = document.createElement("a");
          a.href = url;
          a.download = "internal-audit.csv";
          a.target = "_blank";
          a.click();
        },
      }
    );
  };

  return (
    <article className="place-self-end">
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
        <button
          className="flex items-center gap-1 dark:hover:text-signin duration-100"
          onClick={onDownload}
        >
          <FontAwesomeIcon icon={faDownload} className="text-signin" />
          Download as File
        </button>
      ) : (
        <button
          className="text-left dark:hover:text-checkbox/60 duration-100"
          onClick={() => {
            exportInternalAudit.mutate({});
          }}
        >
          <FontAwesomeIcon icon={faFileExport} className="text-checkbox" />
          Export
        </button>
      )}
    </article>
  );
};

export default ExportFile;
