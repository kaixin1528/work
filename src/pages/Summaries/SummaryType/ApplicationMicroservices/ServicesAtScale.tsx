import React, { useState } from "react";
import StackedBarChart from "src/components/Chart/StackedBarChart";
import { GetServiceScale } from "src/services/summaries/application-footprint";
import { useSummaryStore } from "src/stores/summaries";

const ServicesAtScale = () => {
  const { period, selectedReportAccount } = useSummaryStore();

  const [sectionProps, setSectionProps] = useState({});

  const { data: serviceScale } = GetServiceScale(
    period,
    selectedReportAccount?.integration_type || "",
    selectedReportAccount?.customer_cloud_id || ""
  );

  return (
    <section className="grid content-start gap-5 p-6 w-full h-full dark:bg-card">
      <h4>Services at Scale</h4>
      <StackedBarChart
        data={serviceScale}
        xKey="service"
        xLabel="Service"
        yLabel="Count"
        hideLegend
        sectionProps={sectionProps}
        setSectionProps={setSectionProps}
      />
    </section>
  );
};

export default ServicesAtScale;
