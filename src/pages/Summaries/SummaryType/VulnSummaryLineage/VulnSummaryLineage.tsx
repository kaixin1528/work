import React, { useState } from "react";
import SummaryLayout from "src/layouts/SummaryLayout";
import Severities from "./Severities";
import Lineage from "./Lineage";
import Detail from "./Detail";

const VulnSummaryLineage = () => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>("");

  return (
    <SummaryLayout name="Vulnerability Summary Lineage">
      <section className="flex flex-col flex-grow content-start gap-16 p-6 w-full dark:bg-card black-shadow">
        <Severities
          selectedSeverity={selectedSeverity}
          setSelectedSeverity={setSelectedSeverity}
        />
        <Lineage selectedSeverity={selectedSeverity} />
        <Detail selectedSeverity={selectedSeverity} />
      </section>
    </SummaryLayout>
  );
};

export default VulnSummaryLineage;
