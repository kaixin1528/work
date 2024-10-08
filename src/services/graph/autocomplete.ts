import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, autcompleteQueryParams } from "src/constants/general";
import { KeyStringVal } from "src/types/general";
import {
  deconstructSearchString,
  getAutocompleteKeyValuePairs,
  getCypherMatches,
  getCypherProperties,
} from "src/utils/graph";

const prefix = "observability/graph";

// get graph autocomplete query params
export const GetAutocompleteParams = (
  env: string,
  graphType: string,
  cloud: string | undefined
) =>
  useQuery<any, unknown, any, (string | undefined)[]>(
    ["get-autocomplete-params", env, cloud, graphType],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${
            graphType === "cpm"
              ? "cpm/filter"
              : graphType === "main"
              ? "search"
              : "filter"
          }/autocomplete/query_params?env_id=${env}${
            cloud !== "" ? `&cloud_provider=${cloud}` : ""
          }`,
          { signal }
        );

        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "",
      staleTime: 0,
      keepPreviousData: false,
    }
  );

// get graph autocomplete query values
export const GetAutocompleteValues = (
  env: string,
  graphType: string,
  cloud: string | undefined,
  searchString: string,
  searching: boolean,
  queryParam: string,
  startTime?: number | undefined,
  endTime?: number | undefined
) =>
  useQuery<any, unknown, any, (string | number | undefined)[]>(
    [
      "get-autocomplete-values",
      env,
      cloud,
      queryParam,
      startTime,
      endTime,
      graphType,
    ],
    async ({ signal }) => {
      try {
        const obj = deconstructSearchString(searchString);

        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${
            graphType === "cpm"
              ? "cpm/filter"
              : graphType === "main"
              ? "search"
              : "filter"
          }/autocomplete/${queryParam}?env_id=${env}${
            cloud !== "" ? `&cloud_provider=${cloud}` : ""
          }${
            graphType === "main"
              ? `&start_time=${startTime}&end_time=${endTime}`
              : `&timestamp=${startTime}`
          }`,
          getAutocompleteKeyValuePairs(obj),
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
        searching &&
        autcompleteQueryParams.includes(queryParam),
      staleTime: 0,
      keepPreviousData: false,
    }
  );

// get the start + end time for each day within the date range
export const GetCypherAutocompleteValues = (
  env: string,
  queryParam: string,
  match: KeyStringVal,
  conditions: KeyStringVal[],
  startTime: number,
  endTime: number,
  propertyNameInstance: string
) =>
  useQuery<
    any,
    unknown,
    any,
    (string | number | KeyStringVal | KeyStringVal[])[]
  >(
    [
      "get-cypher-autocomplete-values",
      env,
      queryParam,
      startTime,
      endTime,
      propertyNameInstance,
    ],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/search/autocomplete/${queryParam}?env_id=${env}&start_time=${startTime}&end_time=${endTime}`,
          {
            ...getCypherMatches(match),
            ...getCypherProperties(conditions),
            ...(propertyNameInstance && {
              property_name_instance: propertyNameInstance,
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
      keepPreviousData: false,
      staleTime: 0,
      enabled:
        env !== "" &&
        autcompleteQueryParams.includes(queryParam) &&
        startTime !== 0 &&
        endTime !== 0,
    }
  );

// get suggest main search queries
export const GetSuggestMainSearchQueries = (
  env: string,
  navigationView: string,
  queryType: string
) =>
  useQuery<any, unknown, any, (string | (string | null)[] | null)[]>(
    ["get-suggest-main-search-queries", env, queryType],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/search-query-recommendations?env_id=${env}&num_of_recommendations=5&query_type=${queryType}`,
          { signal }
        );

        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "" && navigationView !== "evolution" && queryType !== "",
      keepPreviousData: false,
    }
  );
