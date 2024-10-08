import React, { useState } from "react";
import ReviewDetail from "./ReviewDetail/ReviewDetail";
import ReviewMetadata from "./ReviewMetadata";
import ReturnPage from "src/components/Button/ReturnPage";
import PageLayout from "src/layouts/PageLayout";
import { parseURL } from "src/utils/general";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Review = () => {
  const parsed = parseURL();

  const [editSections, setEditSections] = useState<any>({});
  const [documentModified, setDocumentModified] = useState<string[]>([]);

  const documentType = "frameworks";
  const documentID = String(parsed.framework_id) || "";
  const reviewID = String(parsed.review_id) || "";
  const auditID = String(parsed.audit_id) || "";

  return (
    <PageLayout>
      <main className="relative flex flex-col flex-grow gap-5 px-5 pt-5 h-full w-full overflow-auto scrollbar">
        <article className="flex items-center gap-5">
          <ReturnPage />
          <h4 className="capitalize">
            Third Party Risk <FontAwesomeIcon icon={faArrowRightLong} /> Privacy
            Review
          </h4>
        </article>
        <ReviewMetadata
          documentType={documentType}
          documentID={documentID}
          reviewID={reviewID}
          auditID={auditID}
          editSections={editSections}
          setEditSections={setEditSections}
          documentModified={documentModified}
          setDocumentModified={setDocumentModified}
        />
        <ReviewDetail reviewID={reviewID} auditID={auditID} />
      </main>
    </PageLayout>
  );
};

export default Review;
