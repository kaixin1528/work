import React, { useState } from "react";
import StackedBarChart from "src/components/Chart/StackedBarChart";
import { GetServiceActivityByAccount } from "src/services/summaries/application-footprint";
import { useSummaryStore } from "src/stores/summaries";

const ServiceActivityByAccount = () => {
  const { period, selectedReportAccount } = useSummaryStore();

  const [sectionProps, setSectionProps] = useState({});

  const { data: serviceActivityByAccount } = GetServiceActivityByAccount(
    period,
    selectedReportAccount?.integration_type || "",
    selectedReportAccount?.customer_cloud_id || ""
  );

  return (
    <section className="grid content-start gap-5 p-6 w-full h-full dark:bg-card">
      <h4>Service Activity by Account</h4>
      <StackedBarChart
        data={serviceActivityByAccount}
        xKey="account"
        xLabel="Account"
        yLabel="Count"
        hideLegend
        sectionProps={sectionProps}
        setSectionProps={setSectionProps}
      />
    </section>
  );
};

export default ServiceActivityByAccount;
