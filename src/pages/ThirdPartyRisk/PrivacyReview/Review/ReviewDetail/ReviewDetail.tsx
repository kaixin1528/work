/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import ReviewTabs from "./ReviewTabs";
import PrivacyReview from "./PrivacyReview/PrivacyReview";
import Sections from "./Sections/Sections";
import ExportFile from "./ExportFile";

const ReviewDetail = ({
  reviewID,
  auditID,
}: {
  reviewID: string;
  auditID: string;
}) => {
  const [selectedTab, setSelectedTab] = useState("Privacy Review");

  return (
    <section className="flex flex-col flex-grow gap-3 mb-4 overflow-auto scrollbar">
      <ReviewTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <ExportFile reviewID={reviewID} />
      {selectedTab === "Privacy Review" ? (
        <PrivacyReview auditID={auditID} />
      ) : (
        <Sections auditID={auditID} selectedTab={selectedTab} />
      )}
    </section>
  );
};

export default ReviewDetail;
