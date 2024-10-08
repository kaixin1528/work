import React from "react";
import SummaryLayout from "src/layouts/SummaryLayout";
import Overview from "./Overview/Overview";
import Incidents from "./Incidents";

const IncidentResponse = () => {
  return (
    <SummaryLayout name="Incident Response" hidePeriod>
      <section className="grid content-start gap-10">
        <Overview />
        <Incidents />
      </section>
    </SummaryLayout>
  );
};

export default IncidentResponse;
