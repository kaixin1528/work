/* eslint-disable react-hooks/exhaustive-deps */
import {
  faDownload,
  faFileExport,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { LineWave } from "react-loader-spinner";
import {
  ExportBIA,
  DownloadBIA,
  GetExportBIAStatus,
} from "src/services/business-continuity/bia";

const ExportFile = ({
  biaID,
  sopVersionIDs,
}: {
  biaID: string;
  sopVersionIDs: string[];
}) => {
  const exportBIA = ExportBIA(biaID, sopVersionIDs);
  const { data: exportStatus, refetch } = GetExportBIAStatus(biaID);
  const downloadBIA = DownloadBIA(biaID);

  const onDownload = () => {
    downloadBIA.mutate(
      {},
      {
        onSuccess: (data) => {
          const url = data.signed_url;
          let a = document.createElement("a");
          a.href = url;
          a.download = "bia.csv";
          a.target = "_blank";
          a.click();
        },
      }
    );
  };

  useEffect(() => {
    downloadBIA.mutate({});
  }, []);

  return (
    <section className="flex items-center gap-5">
      <button
        className="flex items-center gap-1 place-self-end text-left dark:hover:text-checkbox/60 duration-100"
        onClick={() => {
          exportBIA.mutate({});
        }}
      >
        <FontAwesomeIcon icon={faFileExport} className="text-checkbox" />
        New Export
      </button>
      {exportStatus?.status === "not-ready" ? (
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
      ) : (
        exportStatus?.status === "ready" && (
          <article className="flex items-center gap-5">
            <button
              className="flex items-center gap-1 dark:hover:text-signin duration-100"
              onClick={onDownload}
            >
              <FontAwesomeIcon icon={faDownload} className="text-signin" />
              Download Last Export
            </button>
            <span className="text-sm">{downloadBIA.data?.timestamp}</span>
          </article>
        )
      )}
      <button
        className="flex items-center gap-1 dark:hover:text-no/60 duration-100"
        onClick={() => refetch()}
      >
        <FontAwesomeIcon icon={faRefresh} className="text-no" />
        Refresh
      </button>
    </section>
  );
};

export default ExportFile;
