import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";

const prefix = "investigation";

// get a list of eng nodes and edges
// on a successful search query
export const GetENSearchResults = (
  env: string,
  cloud: string | (string | null)[] | null,
  searchString: string | number | null,
  search: boolean,
  searching: boolean,
  timestamp: number,
  graphType: string
) =>
  useQuery<
    any,
    unknown,
    any,
    (string | number | boolean | (string | null)[] | null)[]
  >(
    [
      "get-en-search-results",
      env,
      cloud,
      search,
      searchString,
      timestamp,
      graphType,
    ],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/observability/${
            graphType === "firewall" ? "firewall_graph" : "cpm_graph"
          }/search/?env_id=${env}&cloud_provider=${cloud}&query_string=${searchString}&search_start=${timestamp}&search_end=${timestamp}`,
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
        searchString !== "" &&
        search &&
        !searching &&
        timestamp !== 0,
    }
  );

// save en search query if search query is successful
export const SaveENSearchQuery = (
  env: string,
  cloud: string | (string | null)[] | null,
  searchString: string,
  search: boolean,
  searching: boolean,
  timestamp: number,
  graphType: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["save-en-search-query", env, cloud, searchString, timestamp, graphType],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/search-query-log?env_id=${env}`,
          {
            query_input: searchString.trim(),
            query_start_time: timestamp,
            query_end_time: timestamp,
            results: { cloud: cloud },
            ran_at: Date.now() * 1000,
            search_type: `${graphType.toUpperCase()}_SEARCH`,
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
        searchString !== "" &&
        search &&
        !searching &&
        timestamp !== 0,
      keepPreviousData: true,
    }
  );
