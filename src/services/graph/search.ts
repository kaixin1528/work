// get the list of source + qualifying nodes

import { useMutation, useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";
import { QueryLookup } from "src/types/graph";

const prefix = "observability/graph";

// of a search query by snapshot time, if any
export const GetMainSearchResults = (
  env: string,
  searchString: string,
  search: boolean,
  searching: boolean,
  startTime: number,
  endTime: number,
  navigationView: string,
  snapshotIndex: number,
  pageNumber: number,
  selectedResourceCategory: string,
  selectedReturnType: string
) =>
  useQuery<any, unknown, any, (string | number | string[])[]>(
    [
      "get-main-search-results",
      env,
      searchString,
      startTime,
      endTime,
      pageNumber,
      selectedReturnType,
    ],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/search?env_id=${env}`,
          {
            query_string: searchString
              .match(/[^"]+|"([^"]*)"/g)
              ?.map((word) => {
                if (word.includes('"'))
                  return `"${encodeURIComponent(
                    encodeURIComponent(word.replaceAll('"', ""))
                  )}"`;
                else return word;
              })
              .join(""),
            search_start: Number(startTime),
            search_end: Number(endTime),
            source_nodes_page_number: selectedResourceCategory.includes(
              "source"
            )
              ? pageNumber
              : 1,
            source_nodes_page_size: pageSize,
            qualifying_nodes_page_number: selectedResourceCategory.includes(
              "qualifying"
            )
              ? pageNumber
              : 1,
            qualifying_nodes_page_size: pageSize,
            format: selectedReturnType,
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
        snapshotIndex !== -1 &&
        startTime !== 0 &&
        endTime !== 0 &&
        (navigationView === "snapshots" ||
          (navigationView === "temporal" &&
            Math.abs(endTime - startTime) <= 6.048e11)),
      keepPreviousData: pageNumber !== 1,
    }
  );

// save the main search query on search
export const SaveMainSearchQuery = (
  env: string,
  search: boolean,
  searching: boolean,
  searchString: string,
  startTime: number,
  endTime: number
) =>
  useQuery<any, unknown, any, any[]>(
    ["save-main-search-query", env, searchString, startTime, endTime],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/investigation/search-query-log?env_id=${env}`,
          {
            query_input: searchString.trim(),
            query_start_time: startTime,
            query_end_time: endTime,
            results: "",
            ran_at: Date.now() * 1000,
            search_type: "MAIN_GRAPH_SEARCH",
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
        !searching &&
        searchString !== "" &&
        startTime !== 0 &&
        endTime !== 0,
      keepPreviousData: true,
    }
  );

// get the start + end time for each day within the date range
export const SearchDays = (
  env: string,
  searchString: string,
  search: boolean,
  startTime: number,
  endTime: number,
  navigationView: string
) =>
  useQuery<any, unknown, any, (string | number | boolean)[]>(
    ["search-days", env, search, startTime, endTime],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/distinct-days-within-range?env_id=${env}&start_time=${startTime}&end_time=${endTime}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      keepPreviousData: false,
      enabled:
        env !== "" &&
        searchString !== "" &&
        search &&
        navigationView === "temporal",
    }
  );

// get graph annotations
export const GetGraphAnnotations = (
  env: string,
  search: boolean,
  curSearchSnapshot: any,
  curSnapshotTime: number
) =>
  useQuery<
    any,
    unknown,
    any,
    (string | number | boolean | (string | null)[] | null)[]
  >(
    ["get-graph-annotations", env, curSearchSnapshot, curSnapshotTime],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/annotations?env_id=${env}&record_time=${curSnapshotTime}`,
          {
            source_nodes: curSearchSnapshot?.source_nodes,
            qualifying_nodes: curSearchSnapshot?.qualifying_nodes,
            metadata: curSearchSnapshot?.metadata,
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
        (Array.isArray(curSearchSnapshot?.qualifying_nodes)
          ? [
              ...curSearchSnapshot?.source_nodes,
              ...curSearchSnapshot?.qualifying_nodes,
            ]
          : []
        ).length > 0 &&
        curSnapshotTime !== 0,
      keepPreviousData: true,
    }
  );

// get simple query string
export const GetQueryLookup = () =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      requestData,
      signal,
    }: {
      requestData: QueryLookup;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/query_lookup`,
          requestData,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

// get property search query
export const GetPropertySearchQuery = () =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      query,
      type,
      found_in_source_nodes,
      source_nodes_present,
      found_in_qualifying_nodes,
      qualifying_nodes_present,
      property_name,
      property_operator,
      property_value,
      signal,
    }: {
      query: string;
      type: string;
      found_in_source_nodes: boolean;
      source_nodes_present: boolean;
      found_in_qualifying_nodes: boolean;
      qualifying_nodes_present: boolean;
      property_name: string;
      property_operator: string;
      property_value: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/property_search_update`,
          {
            query: query,
            type: type,
            found_in_source_nodes: found_in_source_nodes,
            source_nodes_present: source_nodes_present,
            found_in_qualifying_nodes: found_in_qualifying_nodes,
            qualifying_nodes_present: qualifying_nodes_present,
            property_name: property_name,
            property_operator: property_operator,
            property_value: property_value,
          },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );
