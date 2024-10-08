/* eslint-disable react-hooks/exhaustive-deps */
import {
  faInfoCircle,
  faXmark,
  faWarning,
  faArrowRightLong,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import TextFilter from "src/components/Filter/General/TextFilter";
import { showVariants } from "src/constants/general";
import { KeyStringVal } from "src/types/general";
import { convertToUTCString, parseURL } from "src/utils/general";
import DeleteSOP from "../DeleteSOP";
import {
  GetProcedureMetadata,
  GetProcedureStatus,
  GetSOPVersions,
} from "src/services/business-continuity/sop";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import UpdateSOPVersion from "./UpdateSOPVersion";

const ProcedureMetadata = ({
  sopID,
  selectedSOPVersion,
  setSelectedSOPVersion,
}: {
  sopID: string;
  selectedSOPVersion: string;
  setSelectedSOPVersion: (selectedSOPVersion: string) => void;
}) => {
  const parsed = parseURL();
  const navigate = useNavigate();

  const [isVisible, setVisible] = useState<boolean>(true);

  const { data: documentMetadata } = GetProcedureMetadata(sopID);
  const { data: sopVersions } = GetSOPVersions(sopID);

  const versionID =
    sopVersions?.find(
      (version: KeyStringVal) => version.version === selectedSOPVersion
    )?.sop_version_id || "";
  const sopVersionID = String(parsed.sop_version_id) || "";

  const { data: documentStatus } = GetProcedureStatus(sopID, versionID);

  const versions = sopVersions?.reduce(
    (pV: string[], cV: KeyStringVal) => [...pV, cV.version],
    []
  );
  const sopName = documentMetadata?.sop_name;

  useEffect(() => {
    if (versions?.length > 0 && sopVersionID && selectedSOPVersion === "") {
      const filteredSOPVersion =
        sopVersions?.find(
          (version: KeyStringVal) => version.sop_version_id === sopVersionID
        )?.version || "";

      setSelectedSOPVersion(filteredSOPVersion);
    }
  }, [versions]);

  useEffect(() => {
    if (selectedSOPVersion !== "") {
      const filteredSOPVersionID =
        sopVersions?.find(
          (version: KeyStringVal) => version.version === selectedSOPVersion
        )?.sop_version_id || "";

      parsed.sop_version_id = filteredSOPVersionID;
      navigate(`${window.location.pathname}?${queryString.stringify(parsed)}`);
    }
  }, [selectedSOPVersion]);

  return (
    <>
      {documentMetadata && (
        <header className="grid gap-5">
          <article className="flex items-center justify-between gap-20">
            <article className="grid content-start gap-1">
              <header className="flex items-center justify-between gap-5">
                <article className="flex items-center gap-2">
                  <img
                    src={documentMetadata.thumbnail_uri}
                    alt="thumbnail"
                    className="w-10 h-10 rounded-full"
                  />
                  <h4 className="py-1 break-words text-left text-2xl dark:text-checkbox">
                    {sopName}
                  </h4>
                </article>
                <article className="flex items-center gap-10">
                  <TextFilter
                    label="Version"
                    list={versions}
                    value={selectedSOPVersion}
                    setValue={setSelectedSOPVersion}
                  />
                  <UpdateSOPVersion
                    sopName={sopName}
                    sopID={sopID}
                    setSelectedSOPVersion={setSelectedSOPVersion}
                  />
                  {isVisible ? (
                    documentStatus?.status === "failed" ? (
                      <motion.article
                        variants={showVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex items-center gap-2 px-4 py-2 text-sm dark:bg-reset/30 border dark:border-reset rounded-sm"
                      >
                        <FontAwesomeIcon icon={faWarning} /> Error processing
                        your document!
                        <button onClick={() => setVisible(!isVisible)}>
                          <FontAwesomeIcon icon={faXmark} />
                        </button>
                      </motion.article>
                    ) : (
                      documentStatus?.status === "parsing" && (
                        <motion.article
                          variants={showVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex items-center gap-2 px-4 py-2 text-sm dark:bg-event/30 border dark:border-event rounded-sm"
                        >
                          <FontAwesomeIcon icon={faInfoCircle} /> Uno is
                          currently processing the document!
                          <button onClick={() => setVisible(!isVisible)}>
                            <FontAwesomeIcon icon={faXmark} />
                          </button>
                        </motion.article>
                      )
                    )
                  ) : null}
                </article>
              </header>
              <span className="text-sm">
                {convertToUTCString(documentMetadata.last_updated_at)}
              </span>
            </article>
            {documentStatus?.status === "ready" && (
              <DeleteSOP versionID={versionID} />
            )}
          </article>
          {sopVersions?.length > 1 && (
            <a
              href={`/business-continuity/sop/policy-drift/details?sop_id=${sopID}&sop_name=${documentMetadata.sop_name}`}
              className="flex items-center gap-2 px-4 py-1 w-max dark:hover:bg-filter/30 duration-100 rounded-full"
            >
              Drift
              <FontAwesomeIcon icon={faArrowRightLong} />
            </a>
          )}
        </header>
      )}
    </>
  );
};

export default ProcedureMetadata;
