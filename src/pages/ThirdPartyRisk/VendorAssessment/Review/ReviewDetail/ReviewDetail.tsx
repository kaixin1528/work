/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import ReviewTabs from "./ReviewTabs";
import DocumentSummary from "src/pages/RegulationPolicy/Document/DocumentDetail/DocumentSummary";
import FAQ from "src/pages/RegulationPolicy/Document/DocumentDetail/FAQ";
import Sections from "./Sections/Sections";
import SecondaryTabs from "./SecondaryTabs";
import Tables from "src/pages/RegulationPolicy/Document/DocumentDetail/Tables/Tables";
import Images from "src/pages/RegulationPolicy/Document/DocumentDetail/Images";
import Scorecard from "./Scorecard";

const ReviewDetail = ({
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
  const [selectedTab, setSelectedTab] = useState("Controls Coverage");
  const [selectedSecondaryTab, setSelectedSecondaryTab] = useState("Sections");

  return (
    <section className="flex flex-col flex-grow gap-5 mb-4">
      <FAQ documentID={auditID} />
      <DocumentSummary documentID={auditID} />
      <ReviewTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      {selectedTab === "Scorecard" ? (
        <Scorecard reviewID={reviewID} frameworkID={documentID} />
      ) : (
        selectedTab === "Audit Report" && (
          <SecondaryTabs
            selectedSecondaryTab={selectedSecondaryTab}
            setSelectedSecondaryTab={setSelectedSecondaryTab}
          />
        )
      )}
      {selectedTab === "Controls Coverage" ? (
        <Sections
          documentType={documentType}
          documentID={documentID}
          reviewID={reviewID}
          auditID={auditID}
          selectedTab={selectedTab}
          editSections={editSections}
          setEditSections={setEditSections}
          documentModified={documentModified}
          setDocumentModified={setDocumentModified}
        />
      ) : selectedTab === "Audit Report" ? (
        selectedSecondaryTab === "Sections" ? (
          <Sections
            documentType={documentType}
            documentID={documentID}
            reviewID={reviewID}
            auditID={auditID}
            selectedTab={selectedTab}
            editSections={editSections}
            setEditSections={setEditSections}
            documentModified={documentModified}
            setDocumentModified={setDocumentModified}
          />
        ) : selectedSecondaryTab === "Tables" ? (
          <Tables documentID={auditID} />
        ) : (
          <Images documentID={auditID} />
        )
      ) : null}
    </section>
  );
};

export default ReviewDetail;
