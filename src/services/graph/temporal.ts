import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";
import { nodeThreshold } from "src/constants/graph";

const prefix = "observability/graph";

// get pruned graph
export const GetPrunedGraph = (
  env: string,
  timestamp: number,
  searchResultsStatus: string,
  navigationView: string,
  searchedNodes: string[],
  regularTemporal: boolean
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-pruned-graph", env, timestamp, searchedNodes],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/get-subgraph-for-nodes?env_id=${env}`,
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
        navigationView === "temporal" &&
        timestamp !== 0 &&
        searchResultsStatus === "success" &&
        searchedNodes.length > 0 &&
        searchedNodes.length <= nodeThreshold &&
        regularTemporal,
      keepPreviousData: false,
    }
  );
