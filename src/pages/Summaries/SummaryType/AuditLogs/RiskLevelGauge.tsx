import React from "react";
import GaugeChart from "react-gauge-chart";
import { GetAuditLogRisk } from "src/services/summaries/audit-logs";
import { useSummaryStore } from "src/stores/summaries";

const RiskLevelGauge = () => {
  const { period, selectedReportAccount } = useSummaryStore();

  const { data: riskLevel } = GetAuditLogRisk(
    period,
    selectedReportAccount?.customer_cloud_id || ""
  );

  const risk = riskLevel?.toLowerCase();

  return (
    <section className="grid content-start h-full text-center">
      <h4>Risk Level</h4>
      {risk && (
        <GaugeChart
          id="risk-level-gauge"
          style={{
            width: 300,
          }}
          colors={["#5BE12C", "#F5CD19", "#EA4228"]}
          arcWidth={0.1}
          percent={risk === "high" ? 0.85 : risk === "medium" ? 0.5 : 0.165}
          needleColor="#29ABE2"
          needleBaseColor="#29ABE2"
          hideText
          formatTextValue={(value) => value}
        />
      )}
    </section>
  );
};

export default RiskLevelGauge;
