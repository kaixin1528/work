import { useQuery } from "react-query";
import { client } from "../../components/General/AxiosInterceptor";
import { apiVersion } from "../../constants/general";

const prefix = "observability/graph";

// get main graph
export const GetMainGraph = (
  env: string,
  selectedNodeID: string | null,
  depth: number,
  showOnlyAgg: boolean,
  timestamp: number,
  searching: boolean,
  search: boolean,
  navigationView: string,
  searchedNodes: string[]
) =>
  useQuery<any, unknown, any, any[]>(
    [
      "get-main-graph",
      env,
      selectedNodeID,
      depth,
      showOnlyAgg,
      timestamp,
      searchedNodes,
      navigationView,
    ],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/subgraph?env_id=${env}`,
          {
            node_id: selectedNodeID,
            depth: depth,
            only_show_agg: showOnlyAgg,
            timestamp: timestamp,
            ...(searchedNodes?.length > 0 && {
              prune_set: searchedNodes,
            }),
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
        selectedNodeID !== "" &&
        navigationView === "snapshots" &&
        timestamp !== 0 &&
        !searching &&
        !search,
      keepPreviousData: false,
    }
  );

// get similar queries for a search string
export const GetSimilarQueries = (
  env: string,
  searchString: string,
  limit: number,
  noResults: boolean
) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-similar-queries", env, searchString, limit],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/similar-search-queries?env_id=${env}&search_query=${searchString}&limit=${limit}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "" && searchString !== "" && noResults,
      keepPreviousData: true,
    }
  );
