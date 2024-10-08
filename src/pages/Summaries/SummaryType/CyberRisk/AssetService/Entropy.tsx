import React, { useState } from "react";
import { Tooltip } from "recharts";
import { sortNumericData } from "src/utils/general";
import { GetEntropyOverTime } from "src/services/summaries/cyber-risk/assets-services";
import CustomBreakdownTooltip from "src/components/Chart/Tooltip/CustomBreakdownTooltip";
import StackedAreaChart from "src/components/Chart/StackedAreaChart";
import { useSummaryStore } from "src/stores/summaries";

const Entropy = () => {
  const { period, selectedReportAccount } = useSummaryStore();

  const [sectionProps, setSectionProps] = useState({});

  const { data: entropy } = GetEntropyOverTime(
    period,
    selectedReportAccount?.customer_cloud_id || ""
  );

  const sortedInventory = sortNumericData(entropy?.summary, "timestamp", "asc");

  return (
    <section className="grid content-start gap-5 p-6 w-full h-full dark:bg-card black-shadow">
      <h4>Entropy Over Time</h4>
      <StackedAreaChart
        data={sortedInventory}
        xKey="timestamp"
        yLabel="Count"
        sectionProps={sectionProps}
        setSectionProps={setSectionProps}
      >
        <Tooltip
          cursor={{ fill: "#23394F", fillOpacity: 0.4 }}
          content={<CustomBreakdownTooltip details={entropy?.details} />}
        />
      </StackedAreaChart>
    </section>
  );
};

export default Entropy;
