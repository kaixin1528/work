import {
  faInfoCircle,
  faXmark,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { showVariants } from "src/constants/general";
import { GetDocumentStatus, GetGRCDocumentMetadata } from "src/services/grc";
import { GetAuditMetadata } from "src/services/audits-assessments/internal-audit";
import { convertToUTCShortString, convertToUTCString } from "src/utils/general";
import DeleteAudit from "./DeleteAudit";
import CloseAudit from "./CloseAudit";

const AuditMetadata = ({
  documentType,
  documentID,
  auditID,
}: {
  documentType: string;
  documentID: string;
  auditID: string;
}) => {
  const [isVisible, setVisible] = useState<boolean>(true);

  const { data: auditMetadata } = GetAuditMetadata(auditID);
  const { data: documentMetadata } = GetGRCDocumentMetadata(
    documentType,
    documentID
  );
  const { data: documentStatus } = GetDocumentStatus(documentType, documentID);

  return (
    <>
      <header className="grid gap-5">
        {auditMetadata && (
          <article className="flex items-center justify-between gap-20 border-b-1 dark:border-white">
            <h2 className="text-2xl">{auditMetadata.name} </h2>
            <article className="flex flex-wrap items-center gap-5">
              <p>
                <span className="dark:text-checkbox">created at</span>{" "}
                {convertToUTCString(auditMetadata.created_at)}
              </p>
              {auditMetadata.is_closed ? (
                <span className="px-2 dark:bg-no border dark:border-no rounded-md">
                  Closed
                </span>
              ) : (
                <CloseAudit auditID={auditID} />
              )}
            </article>
          </article>
        )}
        {documentMetadata && (
          <article className="flex items-center justify-between gap-20">
            <article className="flex items-start gap-2">
              <img
                src={documentMetadata.thumbnail_uri}
                alt={documentMetadata.thumbnail_uri}
                className="w-10 h-10 rounded-full"
              />
              <article className="grid content-start gap-1">
                <header className="flex items-center justify-between gap-5">
                  <h4 className="break-words text-left text-2xl dark:text-checkbox">
                    {documentMetadata.framework_name ||
                      documentMetadata.policy_name}
                  </h4>
                  <article className="flex items-center gap-10">
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
                <article className="flex flex-wrap items-center gap-3 text-sm dark:text-checkbox divide-x dark:divide-checkbox">
                  {documentMetadata.last_updated_at && (
                    <span>
                      {convertToUTCShortString(
                        documentMetadata.last_updated_at
                      )}
                    </span>
                  )}
                  {documentMetadata.regulatory_date && (
                    <span>
                      {convertToUTCShortString(
                        documentMetadata.regulatory_date
                      )}
                    </span>
                  )}
                  {(documentMetadata.regulatory_authority ||
                    documentMetadata.customer_name) && (
                    <span className="pl-3">
                      {documentMetadata.regulatory_authority ||
                        documentMetadata.customer_name}
                    </span>
                  )}
                </article>
              </article>
            </article>
            <DeleteAudit auditID={auditID} />
          </article>
        )}
      </header>
    </>
  );
};

export default AuditMetadata;
