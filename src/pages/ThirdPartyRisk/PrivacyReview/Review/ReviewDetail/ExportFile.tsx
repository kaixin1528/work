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
  ExportPrivacyReview,
  GetExportPrivacyReviewStatus,
  DownloadPrivacyReview,
} from "src/services/third-party-risk/privacy-review";

const ExportFile = ({ reviewID }: { reviewID: string }) => {
  const exportPrivacyReview = ExportPrivacyReview(reviewID);
  const { data: exportStatus, refetch } =
    GetExportPrivacyReviewStatus(reviewID);
  const downloadPrivacyReview = DownloadPrivacyReview(reviewID);

  const onDownload = () => {
    downloadPrivacyReview.mutate(
      {},
      {
        onSuccess: (data) => {
          const url = data;
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
    downloadPrivacyReview.mutate({});
  }, []);

  return (
    <section className="flex items-center place-self-end gap-5">
      <button
        className="flex items-center gap-1 place-self-end text-left dark:hover:text-checkbox/60 duration-100"
        onClick={() => {
          exportPrivacyReview.mutate({});
        }}
      >
        <FontAwesomeIcon icon={faFileExport} className="text-checkbox" />
        New Export
      </button>
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
      ) : (
        exportStatus?.status === "ready" && (
          <button
            className="flex items-center gap-1 dark:hover:text-signin duration-100"
            onClick={onDownload}
          >
            <FontAwesomeIcon icon={faDownload} className="text-signin" />
            Download Last Export
          </button>
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
