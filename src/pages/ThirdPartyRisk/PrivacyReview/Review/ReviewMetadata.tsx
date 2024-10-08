import React from "react";
import { convertToUTCString } from "src/utils/general";
import DeleteReview from "./DeleteReview";
import { GetPrivacyReviewMetadata } from "src/services/third-party-risk/privacy-review";

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
  const { data: reviewMetadata } = GetPrivacyReviewMetadata(auditID);

  return (
    <header className="grid gap-5">
      {reviewMetadata && (
        <article className="flex flex-wrap items-center justify-between gap-20 border-b-1 dark:border-white">
          <h2 className="text-2xl">{reviewMetadata.audit_name}</h2>
          <article className="flex items-center gap-2 pb-1">
            <span>{convertToUTCString(reviewMetadata.created_at)}</span>
            <DeleteReview reviewID={reviewID} />
          </article>
        </article>
      )}
    </header>
  );
};

export default ReviewMetadata;
