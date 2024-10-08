import { useQuery, useMutation } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";

const prefix = "observability/graph";

// get a list of nodes' info for graph list view
export const GetNodesInfo = (
  env: string,
  search: boolean,
  searchedNodes: string[],
  timestamp: number,
  aboveThreshold: boolean
) =>
  useQuery<any, unknown, any, (string | number | boolean | string[])[]>(
    ["get-nodes-info", env, timestamp, searchedNodes, aboveThreshold],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/info-for-nodes?env_id=${env}`,
          {
            timestamp: timestamp,
            nodes: searchedNodes,
          },
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
        search &&
        searchedNodes.length > 0 &&
        aboveThreshold &&
        timestamp !== 0,
    }
  );

// get a list of connected nodes for a source/qualifying node
export const GetConnectedNodes = (env: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      nodeID,
      timestamp,
      targetNodeTypes,
      signal,
    }: {
      nodeID: string;
      timestamp: number;
      targetNodeTypes: string[];
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/get-connected-nodes?env_id=${env}`,
          {
            node_id: nodeID,
            timestamp: timestamp,
            target_node_classes: targetNodeTypes,
          },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

// get graph from list
export const GetGraphFromList = (env: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      timestamp,
      resourceIDs,
      signal,
    }: {
      timestamp: number;
      resourceIDs: string[];
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/graph_from_list?env_id=${env}`,
          {
            record_time: timestamp,
            node_ids: resourceIDs,
          },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

// get graph from list
export const GetDiffGraphFromList = (env: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      timestamp,
      resourceIDs,
      signal,
    }: {
      timestamp: number;
      resourceIDs: string[];
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/diff/graph_from_list?env_id=${env}&new_record_time=${timestamp}`,
          {
            node_ids: resourceIDs,
          },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );
