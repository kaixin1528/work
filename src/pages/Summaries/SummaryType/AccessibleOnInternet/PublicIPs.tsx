/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListLayout from "src/layouts/ListLayout";
import { GetQueryLookup } from "src/services/graph/search";
import { GetPublicIPs } from "src/services/summaries/accessible-on-internet";
import { useGraphStore } from "src/stores/graph";
import { useSummaryStore } from "src/stores/summaries";
import { ListHeader } from "src/types/general";
import { sortRows } from "src/utils/general";
import { handleViewSnapshot } from "src/utils/graph";

const PublicIPs = () => {
  const navigate = useNavigate();

  const { period, selectedReportAccount } = useSummaryStore();
  const {
    setNavigationView,
    setGraphSearch,
    setGraphSearching,
    setGraphSearchString,
    setSnapshotTime,
  } = useGraphStore();

  const [selectedService, setSelectedService] = useState<string>("");
  const [sort, setSort] = useState({
    order: "asc",
    orderBy: "display_name",
  });

  const { data: publicIPs } = GetPublicIPs(
    period,
    selectedReportAccount?.integration_type || "",
    selectedReportAccount?.customer_cloud_id || ""
  );
  const queryLookup = GetQueryLookup();

  useEffect(() => {
    if (publicIPs?.data.length > 0)
      setSelectedService(publicIPs.data[0].service_name);
  }, [publicIPs, sessionStorage.accountID]);

  const filteredServices = publicIPs?.data.filter(
    (service: { service_name: string }) =>
      service.service_name === selectedService
  );

  const sortedServices = filteredServices && sortRows(filteredServices, sort);

  const services = [
    ...new Set(
      publicIPs?.data.reduce(
        (pV: string[], cV: { service_name: string }) => [
          ...pV,
          cV.service_name,
        ],
        []
      )
    ),
  ] as string[];

  return (
    <section className="flex flex-col flex-grow gap-5">
      <h4 className="underlined-label">Public IPs</h4>
      {services?.length > 0 && (
        <nav className="flex items-center gap-2 text-sm">
          {services?.map((service: string) => {
            return (
              <article
                key={service}
                className={`p-2 cursor-pointer ${
                  selectedService === service
                    ? "selected-button"
                    : "not-selected-button"
                }`}
                onClick={() => setSelectedService(service)}
              >
                {service}
              </article>
            );
          })}
        </nav>
      )}

      {publicIPs ? (
        sortedServices?.length > 0 ? (
          <ListLayout
            height="max-h-[30rem]"
            listHeader={publicIPs?.metadata.headers}
            setSort={setSort}
          >
            {sortedServices?.map(
              (
                service: { [key: string]: string | number | string[] },
                index: number
              ) => {
                return (
                  <tr
                    key={`${selectedService}-${String(service.id)}-${
                      service.hostname
                    }-${index}`}
                    className="px-4 py-2 cursor-pointer dark:even:bg-card"
                  >
                    {publicIPs?.metadata.headers.map((col: ListHeader) => {
                      return (
                        <td key={col.property_name} className="pl-3 py-2">
                          {col.property_name === "ip_addresses" ? (
                            <ul>
                              {(service[col.property_name] as string[]).map(
                                (ip) => {
                                  return <li key={ip}>{ip}</li>;
                                }
                              )}
                            </ul>
                          ) : (
                            <p
                              className={`${
                                col.property_name === "resource_id"
                                  ? "cursor-pointer hover:underline"
                                  : ""
                              }`}
                              onClick={() => {
                                if (col.property_name === "resource_id") {
                                  queryLookup.mutate(
                                    {
                                      requestData: {
                                        query_type: "view_in_graph",
                                        id: service.resource_id,
                                      },
                                    },
                                    {
                                      onSuccess: (queryString: string) =>
                                        handleViewSnapshot(
                                          queryString,
                                          setNavigationView,
                                          setGraphSearch,
                                          setGraphSearching,
                                          setGraphSearchString,
                                          navigate,
                                          setSnapshotTime
                                        ),
                                    }
                                  );
                                }
                              }}
                            >
                              {service[col.property_name]}
                            </p>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              }
            )}
          </ListLayout>
        ) : (
          <p className="text-sm">No data available</p>
        )
      ) : null}
    </section>
  );
};
export default PublicIPs;
