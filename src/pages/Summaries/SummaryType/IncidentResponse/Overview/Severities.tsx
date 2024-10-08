import React from "react";
import DonutChart from "src/components/Chart/DonutChart";
import { GetIRSummary } from "src/services/summaries/incident-response";
import { sortNumericData } from "src/utils/general";

const Severities = ({ title }: { title?: string }) => {
  const { data: irSummary } = GetIRSummary();

  const sortedSeverities = sortNumericData(
    irSummary?.severities,
    "order",
    "desc"
  );

  return (
    <section className="w-full h-max">
      <DonutChart data={sortedSeverities} xKey="severity" title={title} />
    </section>
  );
};

export default Severities;
