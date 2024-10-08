import {
  faInfoCircle,
  faXmark,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { showVariants, userColors } from "src/constants/general";
import { GetDocumentStatus, GetGRCDocumentMetadata } from "src/services/grc";
import { convertToUTCShortString, convertToUTCString } from "src/utils/general";
import DeleteReview from "./DeleteReview";
import {
  GetReviewMetadata,
  UpdateAuditSections,
} from "src/services/third-party-risk/vendor-assessment";

const ReviewMetadata = ({
  documentType,
  documentID,
  reviewID,
  auditID,
  editSections,
  setEditSections,
  documentModified,
  setDocumentModified,
}: {
  documentType: string;
  documentID: string;
  reviewID: string;
  auditID: string;
  editSections: any;
  setEditSections: any;
  documentModified: any;
  setDocumentModified: any;
}) => {
  const [isVisible, setVisible] = useState<boolean>(true);

  const { data: reviewMetadata } = GetReviewMetadata(reviewID);
  const { data: documentStatus } = GetDocumentStatus(documentType, documentID);
  const { data: documentMetadata } = GetGRCDocumentMetadata(
    documentType,
    documentID
  );
  const updateAuditSections = UpdateAuditSections(
    auditID,
    documentID,
    reviewID
  );

  return (
    <header className="grid gap-5">
      {reviewMetadata && (
        <article className="flex flex-wrap items-center justify-between gap-20 border-b-1 dark:border-white">
          <h2 className="text-2xl">
            {reviewMetadata.name} | {reviewMetadata.audit_name}
          </h2>
          <article className="flex flex-wrap items-center gap-3">
            <article className="flex items-center gap-2">
              <h4 className="dark:text-checkbox">created by</h4>
              <article
                key={reviewMetadata.user_id}
                className="flex items-center gap-1 text-left"
              >
                <span
                  className={`grid content-center w-5 h-5 capitalize text-center text-[0.65rem] dark:text-white font-medium bg-gradient-to-b ${
                    userColors[reviewMetadata.user_id[0].toLowerCase()]
                  } shadow-sm dark:shadow-checkbox rounded-full`}
                >
                  {reviewMetadata.user_id[0]}
                </span>
                <p>{reviewMetadata.user_id} </p>
              </article>
            </article>
            <article className="flex items-center gap-2">
              <h4 className="dark:text-checkbox">at</h4>
              <span>{convertToUTCString(reviewMetadata.created_at)}</span>
            </article>
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
              <span>FRAMEWORK</span>
              <article className="flex items-center justify-between gap-5">
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
                  {documentModified.length > 0 &&
                    documentModified.length ===
                      Object.keys(editSections).length && (
                      <article className="absolute top-10 left-1/2 -translate-x-1/2 grid gap-2 px-8 py-4 text-center dark:bg-expand border-1 dark:border-card/60 black-shadow rounded-md z-50">
                        <p>
                          You have modified this document. Would you like to
                          save your changes and remap it?
                        </p>
                        <article className="flex items-center gap-2 mx-auto">
                          <button
                            className="px-4 py-1 dark:bg-no dark:hover:bg-no/60 duration-100 rounded-md"
                            onClick={() => {
                              updateAuditSections.mutate({
                                editSections: editSections,
                              });
                              setDocumentModified([]);
                              setEditSections({});
                            }}
                          >
                            Yes
                          </button>
                          <button
                            className="px-4 py-1 dark:bg-reset dark:hover:bg-reset/60 duration-100 rounded-md"
                            onClick={() => {
                              setDocumentModified([]);
                              setEditSections({});
                            }}
                          >
                            No
                          </button>
                        </article>
                      </article>
                    )}
                </article>
              </article>
              <article className="flex flex-wrap items-center gap-3 text-sm dark:text-checkbox divide-x dark:divide-checkbox">
                {documentMetadata.last_updated_at && (
                  <span>
                    {convertToUTCShortString(documentMetadata.last_updated_at)}
                  </span>
                )}
                {documentMetadata.regulatory_date && (
                  <span>
                    {convertToUTCShortString(documentMetadata.regulatory_date)}
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
          <DeleteReview reviewID={reviewID} />
        </article>
      )}
    </header>
  );
};

export default ReviewMetadata;
