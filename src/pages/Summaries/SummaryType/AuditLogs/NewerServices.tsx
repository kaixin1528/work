import React from "react";
import { GetAuditLogNewServices } from "src/services/summaries/audit-logs";
import { useSummaryStore } from "src/stores/summaries";
import { KeyStringVal } from "src/types/general";

const NewerServices = () => {
  const { period, selectedReportAccount } = useSummaryStore();

  const { data: services } = GetAuditLogNewServices(
    period,
    selectedReportAccount?.customer_cloud_id || ""
  );

  return (
    <>
      {services ? (
        services.length > 0 ? (
          <section className="grid content-start gap-5 overflow-auto scrollbar">
            <h4>Newer services introduced</h4>
            <ul className="flex items-center gap-10 p-4 w-full overflow-auto scrollbar">
              {services?.map((resource: KeyStringVal, index: number) => {
                return (
                  <li key={index} className="grid gap-2 text-center text-sm">
                    <img
                      src={`/graph/nodes/${resource.integration_type.toLowerCase()}/${resource.resource_type.toLowerCase()}.svg`}
                      alt={resource.resource_type}
                      className="w-7 h-7 mx-auto"
                    />
                    <h4>{resource.resource_type}</h4>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : (
          <p>No new services</p>
        )
      ) : null}
    </>
  );
};

export default NewerServices;
