/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListLayout from "src/layouts/ListLayout";
import { GetQueryLookup } from "src/services/graph/search";
import { GetNetworkTopologyCloudResource } from "src/services/summaries/network-topology";
import { useGraphStore } from "src/stores/graph";
import { useSummaryStore } from "src/stores/summaries";
import { KeyStringVal, ListHeader } from "src/types/general";
import { handleViewSnapshot } from "src/utils/graph";

const CloudResource = ({
  selectedCloudResourceID,
  type,
}: {
  selectedCloudResourceID: string;
  type: string;
}) => {
  const navigate = useNavigate();

  const { period, selectedReportAccount } = useSummaryStore();
  const {
    setNavigationView,
    setGraphSearch,
    setGraphSearching,
    setGraphSearchString,
    setSnapshotTime,
  } = useGraphStore();

  const [selectedNodeType, setSelectedNodeType] = useState<string>("");
  const [selectedSubnetType, setSelectedSubnetType] = useState<string>("");

  const { data: cloudResource } = GetNetworkTopologyCloudResource(
    period,
    selectedReportAccount?.integration_type || "",
    selectedReportAccount?.customer_cloud_id || "",
    selectedCloudResourceID,
    type
  );
  const queryLookup = GetQueryLookup();

  const nodeTypes = cloudResource
    ? ([
        ...new Set(
          cloudResource.data.reduce(
            (pV: string[], cV: KeyStringVal) => [...pV, cV.node_class],
            []
          )
        ),
      ] as string[])
    : [];
  const firstFilteredCloudResource = cloudResource?.data.filter(
    (d: KeyStringVal) => d.node_class === selectedNodeType
  );
  const subnetTypes = firstFilteredCloudResource
    ? ([
        ...new Set(
          firstFilteredCloudResource.reduce(
            (pV: string[], cV: KeyStringVal) => [...pV, cV.subn],
            []
          )
        ),
      ] as string[])
    : [];
  const filteredCloudResource = cloudResource?.data.filter(
    (d: KeyStringVal) =>
      d.node_class === selectedNodeType && d.subn === selectedSubnetType
  );

  useEffect(() => {
    if (nodeTypes?.length > 0 && selectedNodeType === "")
      setSelectedNodeType(nodeTypes[0]);
  }, [nodeTypes]);

  useEffect(() => {
    if (subnetTypes?.length > 0 && selectedSubnetType === "")
      setSelectedSubnetType(subnetTypes[0]);
  }, [subnetTypes]);

  return (
    <section className="grid gap-3">
      <article className="flex items-center gap-5">
        <h4>Resource Type:</h4>
        <nav className="flex items-center gap-2">
          {nodeTypes?.map((nodeType: string) => {
            const integrationType = cloudResource?.data.find(
              (d: KeyStringVal) => d.node_class === nodeType
            )?.integration_type;
            const nodeTypeName = cloudResource?.data.find(
              (d: KeyStringVal) => d.node_class === nodeType
            )?.node_type_name;
            return (
              <article
                key={nodeType}
                className={`flex items-center gap-2 p-2 cursor-pointer ${
                  selectedNodeType === nodeType
                    ? "selected-button"
                    : "not-selected-button"
                }`}
                onClick={() => {
                  setSelectedNodeType(nodeType);
                  setSelectedSubnetType("");
                }}
              >
                <img
                  src={`/graph/nodes/${integrationType?.toLowerCase()}/${nodeType?.toLowerCase()}.svg`}
                  alt={nodeType}
                  className="w-4 h-4"
                />
                <p>{nodeTypeName}</p>
              </article>
            );
          })}
        </nav>
      </article>
      <article className="flex items-center gap-5">
        <h4>Subnet:</h4>
        <nav className="flex items-center gap-2">
          {subnetTypes?.map((subnetType: string) => {
            return (
              <article
                key={subnetType}
                className={`p-2 cursor-pointer ${
                  selectedSubnetType === subnetType
                    ? "selected-button"
                    : "not-selected-button"
                }`}
                onClick={() => setSelectedSubnetType(subnetType)}
              >
                <p>{subnetType}</p>
              </article>
            );
          })}
        </nav>
      </article>
      {cloudResource ? (
        filteredCloudResource.length > 0 ? (
          <ListLayout listHeader={cloudResource?.metadata.headers}>
            {filteredCloudResource.map((row: any) => {
              return (
                <tr key={row.node_id} className="px-4 py-2 dark:even:bg-card">
                  {cloudResource?.metadata.headers?.map((col: ListHeader) => {
                    const value = row[col.property_name];
                    return (
                      <td key={col.property_name} className="py-2 px-3">
                        {Array.isArray(value) ? (
                          <ul className="grid list-disc px-4">
                            {value.map((ip) => {
                              return <li key={ip}>{ip}</li>;
                            })}
                          </ul>
                        ) : (
                          <p
                            className={`${
                              col.property_name === "node_id"
                                ? "w-max hover:underline cursor-pointer"
                                : ""
                            }`}
                            onClick={() => {
                              if (col.property_name === "node_id")
                                queryLookup.mutate(
                                  {
                                    requestData: {
                                      query_type: "nt_report_type_name",
                                      type: row.node_class,
                                      name: row[col.property_name],
                                    },
                                  },
                                  {
                                    onSuccess: (queryString) =>
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
                            }}
                          >
                            {value}
                          </p>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </ListLayout>
        ) : (
          <p>No data available</p>
        )
      ) : null}
    </section>
  );
};

export default CloudResource;
