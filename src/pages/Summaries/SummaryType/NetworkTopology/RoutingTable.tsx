/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import ListLayout from "src/layouts/ListLayout";
import { GetNetworkTopologyRoutingTable } from "src/services/summaries/network-topology";
import { useSummaryStore } from "src/stores/summaries";
import { ListHeader } from "src/types/general";
import { isValidUrl } from "src/utils/general";

const RoutingTable = ({
  selectedRoutingTableID,
}: {
  selectedRoutingTableID: string;
}) => {
  const { period, selectedReportAccount } = useSummaryStore();

  const { data: routingTable } = GetNetworkTopologyRoutingTable(
    period,
    selectedReportAccount?.integration_type || "",
    selectedReportAccount?.customer_cloud_id || "",
    selectedRoutingTableID
  );

  return (
    <>
      {routingTable ? (
        routingTable.data.length > 0 ? (
          <section className="grid gap-3">
            <ListLayout listHeader={routingTable?.metadata.headers}>
              {routingTable?.data?.map((row: any) => {
                return (
                  <tr
                    key={row.destination}
                    className="px-4 py-2 dark:even:bg-card"
                  >
                    {routingTable?.metadata.headers?.map((col: ListHeader) => {
                      return (
                        <td
                          key={col.property_name}
                          className="py-2 px-3 break-all"
                        >
                          {isValidUrl(row[col.property_name]) ? (
                            <a
                              href={row[col.property_name]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {row[col.property_name]}
                            </a>
                          ) : (
                            row[col.property_name]
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </ListLayout>
          </section>
        ) : (
          <p>No data available</p>
        )
      ) : null}
    </>
  );
};

export default RoutingTable;
