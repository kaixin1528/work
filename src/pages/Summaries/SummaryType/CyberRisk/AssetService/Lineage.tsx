import React, { useState } from "react";
import { GetLineage } from "src/services/summaries/cyber-risk/assets-services";
import { Tooltip } from "recharts";
import StackedBarChart from "src/components/Chart/StackedBarChart";
import CustomTooltip from "src/components/Chart/Tooltip/CustomTooltip";
import { useSummaryStore } from "src/stores/summaries";

const Lineage = () => {
  const { period, selectedReportAccount } = useSummaryStore();

  const [sectionProps, setSectionProps] = useState({});

  const { data: lineage } = GetLineage(
    period,
    selectedReportAccount?.integration_type || "",
    selectedReportAccount?.customer_cloud_id || ""
  );

  return (
    <section className="grid content-start gap-5 p-6 dark:bg-card black-shadow">
      <h4>Lineage</h4>
      <StackedBarChart
        data={lineage}
        xKey="category"
        xLabel="Open for"
        yLabel="Count"
        sectionProps={sectionProps}
        setSectionProps={setSectionProps}
      >
        <Tooltip
          cursor={{ fill: "#23394F", fillOpacity: 0.4 }}
          content={<CustomTooltip xKey="category" />}
        />
      </StackedBarChart>
    </section>
  );
};

export default Lineage;
