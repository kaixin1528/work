/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import Sections from "./Sections/Sections";
import AuditTabs from "./AuditTabs";

const AuditDetail = ({
  documentType,
  documentID,
  auditID,
}: {
  documentType: string;
  documentID: string;
  auditID: string;
}) => {
  const [selectedTab, setSelectedTab] = useState("controls");

  return (
    <section className="flex flex-col flex-grow gap-5 mb-4">
      <AuditTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <Sections
        documentType={documentType}
        documentID={documentID}
        auditID={auditID}
        selectedTab={selectedTab}
      />
    </section>
  );
};

export default AuditDetail;
