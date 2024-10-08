import React, { useState } from "react";
import StackedAreaChart from "src/components/Chart/StackedAreaChart";
import { GetVSLLineage } from "src/services/summaries/vuln-summary-lineage";
import { useSummaryStore } from "src/stores/summaries";

const Lineage = ({ selectedSeverity }: { selectedSeverity: string }) => {
  const { period } = useSummaryStore();

  const [sectionProps, setSectionProps] = useState({});

  const { data: lineage } = GetVSLLineage(period, selectedSeverity);

  return (
    <>
      {lineage && (
        <StackedAreaChart
          data={lineage.lineage}
          xKey="timestamp"
          yLabel="Counts"
          sectionProps={sectionProps}
          setSectionProps={setSectionProps}
        />
      )}
    </>
  );
};

export default Lineage;
