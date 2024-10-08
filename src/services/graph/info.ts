import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";

const prefix = "observability/graph";

export const GetGraphSummary = (
  env: string,
  timestamp: number,
  nodeType: string,
  integrationID: string
) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-graph-summary", env, timestamp, nodeType, integrationID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/node-counts?env_id=${env}&timestamp=${timestamp}&integration_id=${integrationID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled:
        env !== "" &&
        timestamp !== 0 &&
        integrationID !== "" &&
        nodeType.includes("CLD"),
      keepPreviousData: false,
    }
  );

// get a node/edge's info
export const GetMainElementInfo = (
  env: string,
  hasDiff: boolean,
  annotationContext: string,
  elementID: string | null,
  elementType: string | null,
  nodeType: string,
  curSnapshotTime: number,
  integrationType: string
) =>
  useQuery<any, unknown, any, (string | number | null)[]>(
    [
      "get-main-element-info",
      env,
      elementID,
      elementType,
      nodeType,
      curSnapshotTime,
      integrationType,
    ],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/info?env_id=${env}&graph_element_id=${elementID}&element_type=${elementType}${
            curSnapshotTime !== -1 ? `&record_time=${curSnapshotTime}` : ""
          }`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled:
        env !== "" &&
        !hasDiff &&
        !["malicious", "non-malicious"].includes(annotationContext) &&
        elementID !== "" &&
        elementType !== "" &&
        curSnapshotTime !== 0 &&
        integrationType !== "INSIGHTVM",
      keepPreviousData: false,
    }
  );

// get the list of nodes in the archive node
export const GetNodesInArchive = (
  env: string,
  archiveNodeID: string,
  timestamp: number,
  isArchive: boolean
) =>
  useQuery<
    any,
    unknown,
    any,
    (string | number | (string | null)[] | null | undefined)[]
  >(
    ["get-nodes-in-archive", env, archiveNodeID, timestamp],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/nodes-in-archive/${archiveNodeID}?env_id=${env}&timestamp=${timestamp}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled:
        env !== "" && isArchive && archiveNodeID !== "" && timestamp !== 0,
      keepPreviousData: false,
    }
  );

// get list of cves if node is dkrimg or cont
export const GetCVEListForNode = (
  env: string,
  integrationType: string,
  nodeID: string,
  nodeType: string,
  timestamp: number,
  uniqueID: string
) =>
  useQuery<
    any,
    unknown,
    any,
    (string | number | (string | null)[] | null | undefined)[]
  >(
    [
      "get-cve-list-for-node",
      env,
      integrationType,
      nodeID,
      nodeType,
      timestamp,
      uniqueID,
    ],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/cves?env_id=${env}&cloud_provider=${integrationType}&node_id=${
            integrationType === "INSIGHTVM" ? uniqueID : nodeID
          }&node_type=${nodeType}&record_time=${timestamp}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled:
        env !== "" &&
        integrationType !== "" &&
        nodeID !== "" &&
        timestamp !== 0,
      keepPreviousData: false,
    }
  );
