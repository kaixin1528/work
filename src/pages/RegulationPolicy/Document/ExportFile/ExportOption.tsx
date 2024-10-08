import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { LineWave } from "react-loader-spinner";
import {
  DownloadMappings,
  ExportMappings,
  GetExportMappingStatus,
} from "src/services/regulation-policy/regulation-policy";

const ExportOption = ({
  documentType,
  documentID,
  policyVersionID,
  option,
}: {
  documentType: string;
  documentID: string;
  policyVersionID: string;
  option: string;
}) => {
  const noMappings = option === "Gaps";

  const exportMappings = ExportMappings(
    documentType,
    documentID,
    noMappings,
    policyVersionID
  );
  const { data: exportStatus } = GetExportMappingStatus(
    documentType,
    documentID,
    noMappings
  );
  const downloadMappings = DownloadMappings(
    documentType,
    documentID,
    noMappings
  );

  const onDownload = () => {
    downloadMappings.mutate(
      {},
      {
        onSuccess: (data) => {
          const url = data;
          let a = document.createElement("a");
          a.href = url;
          a.download = "mappings.csv";
          a.target = "_blank";
          a.click();
        },
      }
    );
  };

  return (
    <>
      {exportStatus?.status === "parsing" ? (
        <span className="flex items-center gap-1 px-4 py-1">
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
          className="flex items-center gap-1 px-4 py-1 dark:hover:text-signin duration-100"
          onClick={onDownload}
        >
          <FontAwesomeIcon icon={faDownload} className="text-signin" />
          Download {option} as File
        </button>
      ) : (
        <button
          className="px-4 py-1 text-left dark:hover:text-checkbox/60 duration-100"
          onClick={() => {
            exportMappings.mutate({});
          }}
        >
          Export {option}
        </button>
      )}
    </>
  );
};

export default ExportOption;
