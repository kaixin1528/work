import React, { useState } from "react";
import { Tooltip } from "recharts";
import StackedAreaChart from "src/components/Chart/StackedAreaChart";
import CustomBreakdownTooltip from "src/components/Chart/Tooltip/CustomBreakdownTooltip";
import { GetInventoryEvolution } from "src/services/summaries/cyber-risk/assets-services";
import { useSummaryStore } from "src/stores/summaries";
import { sortNumericData } from "src/utils/general";

const InventoryEvolution = () => {
  const { period, selectedReportAccount } = useSummaryStore();

  const [sectionProps, setSectionProps] = useState({});

  const { data: inventoryEvolution } = GetInventoryEvolution(
    period,
    selectedReportAccount?.customer_cloud_id || ""
  );

  const sortedInventory = sortNumericData(
    inventoryEvolution?.summary,
    "timestamp",
    "asc"
  );

  return (
    <section className="grid content-start gap-5 p-6 h-full dark:bg-card black-shadow">
      <h4>Inventory Evolution Over Time</h4>
      <StackedAreaChart
        data={sortedInventory}
        xKey="timestamp"
        yLabel="Count"
        sectionProps={sectionProps}
        setSectionProps={setSectionProps}
      >
        <Tooltip
          content={
            <CustomBreakdownTooltip details={inventoryEvolution?.details} />
          }
        />
      </StackedAreaChart>
    </section>
  );
};

export default InventoryEvolution;
