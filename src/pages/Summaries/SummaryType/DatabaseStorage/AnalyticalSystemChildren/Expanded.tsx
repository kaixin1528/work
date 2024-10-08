import React from "react";
import ViewInGraph from "src/components/Button/ViewInGraph";
import Alerts from "src/components/Graph/DetailPanel/Alerts";
import Timeline from "src/components/Graph/DetailPanel/Timeline";
import KeyValuePair from "src/components/General/KeyValuePair";
import { useSummaryStore } from "src/stores/summaries";

const Expanded = ({
  resourceID,
  system,
  headers,
  selectedChildType,
}: {
  resourceID: string;
  system: any;
  headers: any;
  selectedChildType: string;
}) => {
  const { selectedReportAccount } = useSummaryStore();

  const integrationType = selectedReportAccount?.integration_type || "";

  return (
    <tr
      key={`${resourceID}-expanded`}
      className="relative py-5 px-10 gap-10 text-sm bg-gradient-to-b dark:from-expand dark:to-expand/60"
    >
      <td colSpan={headers?.length + 1} className="p-5 pl-10 pr-20 pb-10 w-5">
        <header className="grid gap-3 break-all">
          <KeyValuePair label="Resource ID" value={resourceID} />
          {system.encryption_details !== "" && (
            <KeyValuePair
              label="Encryption Details"
              value={String(system.encryption_details)}
            />
          )}
        </header>
        <section className="grid md:grid-cols-2 content-start gap-10 mt-5">
          <article className="grid content-start">
            <h4 className="text-sm underlined-label">Alerts</h4>
            <Alerts
              elementID={resourceID}
              integrationType={integrationType}
              showLimited
            />
          </article>
          <article className="grid content-start">
            <h4 className="text-sm underlined-label">Timeline</h4>
            <Timeline
              elementID={resourceID}
              nodeType={selectedChildType}
              uniqueID={String(system.unique_id)}
              showLimited
            />
          </article>
          <article className="grid content-start gap-3 text-sm">
            <h4 className="underlined-label">Connected Resources</h4>
            <ViewInGraph
              requestData={{
                query_type: "blast_radius",
                id: resourceID,
              }}
              curSnapshotTime={Number(system.timestamp)}
            />
          </article>
        </section>
      </td>
    </tr>
  );
};

export default Expanded;
