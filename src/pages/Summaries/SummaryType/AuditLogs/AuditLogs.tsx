import React, { useState } from "react";
import SummaryLayout from "src/layouts/SummaryLayout";
import Accounts from "../../Accounts";
import RiskLevelGauge from "./RiskLevelGauge";
import NewerServices from "./NewerServices";
import AuditEvents from "./AuditEvents";
import Actions from "./Actions";

const AuditLogs = () => {
  const [expandAction, setExpandAction] = useState<string>("");

  return (
    <SummaryLayout name="Audit Logs and Metrics" excludePeriods={[1]}>
      <Accounts showAll />
      <section className="flex items-start gap-10 p-6 w-full h-max dark:bg-card black-shadow overflow-auto scrollbar">
        <RiskLevelGauge />
        <NewerServices />
      </section>
      <AuditEvents />
      <section
        className={`grid ${
          expandAction !== "" ? "lg:grid-cols-10" : "lg:grid-cols-2"
        } gap-10`}
      >
        <Actions
          widgetType="most"
          expandAction={expandAction}
          setExpandAction={setExpandAction}
        />
        <Actions
          widgetType="least"
          expandAction={expandAction}
          setExpandAction={setExpandAction}
        />
      </section>
    </SummaryLayout>
  );
};

export default AuditLogs;
