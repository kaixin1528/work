import React from "react";
import RiskSummary from "src/pages/Summaries/SummaryType/AccessibleOnInternet/RiskSummary";
import CVEFound from "src/pages/Summaries/SummaryType/CommonVulnerabilities/Overview/CVEFound";
import IRSeverities from "src/pages/Summaries/SummaryType/IncidentResponse/Overview/Severities";
import Statuses from "src/pages/Summaries/SummaryType/IncidentResponse/Overview/Statuses";
import VRSeverities from "src/pages/Summaries/SummaryType/VulnerabilityRisks/Overview/Severities";
import SummaryInfo from "src/pages/Summaries/SummaryType/VulnerabilityRisks/Overview/SummaryInfo";

const SummaryOverview = () => {
  return (
    <section className="flex flex-col flex-grow gap-3 w-full h-max">
      <section className="grid grid-cols-3 gap-5 w-full h-full">
        <section className="flex flex-col flex-grow gap-5 w-full h-full">
          {/* <section className="p-2 dark:bg-card">
            <SummaryInfo />
          </section> */}
          <section className="grid grid-cols-2 items-center gap-5 p-2 w-full h-full dark:bg-card">
            <Statuses />
            <IRSeverities title="Alert Severity" />
          </section>
        </section>
        <section className="grid gap-5 p-4 pb-12 w-full h-full dark:bg-card">
          {/* <CVEFound selectedVersion="3.1" /> */}
          {/* <VRSeverities title="Vulnerability Severity" /> */}
        </section>
        <RiskSummary />
      </section>
    </section>
  );
};

export default SummaryOverview;
