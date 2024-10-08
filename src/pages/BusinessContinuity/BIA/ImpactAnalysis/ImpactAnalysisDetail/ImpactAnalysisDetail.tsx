/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import DocumentTabs from "./DocumentTabs";
import Tables from "./Tables/Tables";

const ImpactAnalysisDetail = ({ biaID }: { biaID: string }) => {
  const [selectedTab, setSelectedTab] = useState<string>("Tables");

  return (
    <section className="flex flex-col flex-grow gap-3 mb-4">
      <DocumentTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <Tables biaID={biaID} />
    </section>
  );
};

export default ImpactAnalysisDetail;
