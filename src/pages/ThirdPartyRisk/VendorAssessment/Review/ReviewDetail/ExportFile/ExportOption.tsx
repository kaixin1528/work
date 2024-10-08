import { faDownload, faFileExport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { LineWave } from "react-loader-spinner";
import {
  DownloadMappings,
  ExportMappings,
  GetExportMappingStatus,
} from "src/services/third-party-risk/vendor-assessment";

const ExportOption = ({
  reviewID,
  mapping,
}: {
  reviewID: string;
  mapping: boolean;
}) => {
  const exportMappings = ExportMappings(reviewID, mapping);
  const { data: exportStatus } = GetExportMappingStatus(reviewID, mapping);
  const downloadMappings = DownloadMappings(reviewID, mapping);

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
          Download {mapping ? "with" : "without"} mappings
        </button>
      ) : (
        <button
          className="flex items-center gap-1 px-4 py-1 text-left text-sm dark:hover:text-checkbox/60 duration-100"
          onClick={() => {
            exportMappings.mutate({});
          }}
        >
          <FontAwesomeIcon icon={faFileExport} className="text-checkbox" />
          Export {mapping ? "Covered Controls" : "Missing Controls"}
        </button>
      )}
    </>
  );
};

export default ExportOption;
