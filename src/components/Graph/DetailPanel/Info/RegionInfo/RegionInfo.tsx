/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { useEffect, useState } from "react";
import AttributeTable from "src/components/Attribute/AttributeTable";
import TableLayout from "src/layouts/TableLayout";
import { useGraphStore } from "src/stores/graph";
import { Filter } from "src/types/general";
import { parseURL, convertToUTCString } from "src/utils/general";
import VPCOvertime from "./VPCOvertime";
import { useGeneralStore } from "src/stores/general";
import { GetRegionCounts } from "src/services/dashboard/region";
import { GetMainElementInfo } from "src/services/graph/info";

const RegionInfo = ({
  elementID,
  curSnapshotTime,
  annotationContext,
  curSearchSnapshot,
}: {
  elementID: string;
  curSnapshotTime: number | undefined;
  annotationContext: string;
  curSearchSnapshot: any;
}) => {
  const parsed = parseURL();

  const { env } = useGeneralStore();
  const {
    selectedNode,
    selectedEdge,
    setSelectedNode,
    setSelectedEdge,
    setElementType,
    elementType,
  } = useGraphStore();

  const [resourcesFilter, setResourcesFilter] = useState<Filter[]>([
    {
      field: "timestamp",
      op: "ge",
      value: (Date.now() - 8.64e7) * 1000,
      type: "integer",
      set_op: "and",
    },
  ]);

  const nodeType = selectedNode?.data?.nodeType || "";
  const hasDiff =
    selectedNode?.data?.diffNode || selectedEdge?.data?.diffEdge || false;

  const { data: mainElementInfo } = GetMainElementInfo(
    env,
    hasDiff,
    annotationContext,
    elementID,
    elementType,
    nodeType,
    curSnapshotTime || -1
  );
  const { data: regionCounts } = GetRegionCounts(
    env,
    parsed.integration,
    elementID,
    resourcesFilter
  );
  const attributes = selectedNode?.data?.attributes;

  useEffect(() => {
    if (mainElementInfo) {
      if (elementType === "node") {
        setSelectedNode({
          id: mainElementInfo.node_id,
          integrationType: mainElementInfo.cloud_id,
          nodeTypeName: mainElementInfo.type,
          nodeType: mainElementInfo.node_class,
          data: {
            id: mainElementInfo.node_id,
            integrationType: mainElementInfo.cloud_id,
            nodeTypeName: mainElementInfo.type,
            nodeType: mainElementInfo.node_class,
            attributes: mainElementInfo.attributes,
            diffNode: null,
            uniqueID: mainElementInfo.unique_id,
          },
        });
        setSelectedEdge(undefined);
      } else if (elementType === "edge") {
        setSelectedEdge({
          id: mainElementInfo.edge_id_src,
          data: {
            id: mainElementInfo.edge_id_src,
            source: mainElementInfo.source_id,
            target: mainElementInfo.target_id,
            attributes: mainElementInfo.rel_src,
            diffEdge: null,
          },
        });
        setSelectedNode(undefined);
      }
      setElementType("");
    }
  }, [mainElementInfo, elementType]);

  return (
    <section className="flex flex-col flex-grow content-start gap-2 w-full duration-300 overflow-auto scrollbar">
      <section className="grid gap-3">
        {/* region info */}
        <AttributeTable
          attributes={attributes}
          curSearchSnapshot={curSearchSnapshot}
        />

        {/* latest vpc counts */}
        {regionCounts &&
          Object.keys(regionCounts.resource_counts).length > 0 && (
            <article
              data-test="latest-resource-counts"
              className="grid gap-2 mt-3 text-xs"
            >
              <h5 className="text-center dark:text-checkbox">
                Resource Counts at{" "}
                {convertToUTCString(regionCounts.resource_counts.timestamp)}
              </h5>
              <TableLayout>
                <thead>
                  <tr className="dark:bg-card">
                    {Object.keys(regionCounts.resource_counts)
                      .slice(1)
                      .map((resource, index) => {
                        return (
                          <th key={index} className="p-2 text-xs uppercase">
                            {regionCounts.metadata[resource]}
                          </th>
                        );
                      })}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {Object.values(regionCounts.resource_counts)
                      .slice(1)
                      .map((count, index) => {
                        return (
                          <td
                            key={index}
                            className="text-center bg-gradient-to-b dark:from-icon dark:to-tooltip"
                          >
                            {Number(count)}
                          </td>
                        );
                      })}
                  </tr>
                </tbody>
              </TableLayout>
            </article>
          )}

        {/* vpc counts over time */}
        {regionCounts &&
          Object.keys(regionCounts.resource_counts_over_time).length > 0 && (
            <VPCOvertime
              elementID={elementID}
              resourcesFilter={resourcesFilter}
              setResourcesFilter={setResourcesFilter}
            />
          )}
      </section>
    </section>
  );
};

export default RegionInfo;
