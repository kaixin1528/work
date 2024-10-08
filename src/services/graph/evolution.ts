import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";
import { DiffStartTime } from "src/types/graph";

const prefix = "observability/graph/diff";

// get diff integrations
export const GetDiffIntegrations = (
  env: string,
  diffView: string,
  diffStartTime: DiffStartTime
) =>
  useQuery<any, unknown, any, (string | DiffStartTime)[]>(
    ["get-diff-integrations", env, diffView, diffStartTime],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/integrations?env_id=${env}&bucket_size=${
            diffView === "snapshot" ? "hour" : diffView
          }${
            diffView === "month" || !diffStartTime[diffView]
              ? ""
              : `&start_time=${diffStartTime[diffView]}`
          }`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      // enabled: env !== "",
      keepPreviousData: true,
    }
  );

// get # of removed/modified/created nodes
// for each diff bucket (month, day, hour)
export const GetDiffSummary = (
  env: string,
  diffView: string,
  diffStartTime: DiffStartTime,
  navigationView: string,
  integrationType: string
) =>
  useQuery<any, unknown, any, (string | DiffStartTime)[]>(
    ["get-diff-summary", env, integrationType, diffView, diffStartTime],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/summary?env_id=${env}${
            integrationType.toLowerCase() === "all"
              ? ""
              : `&cloud_type=${integrationType}`
          }&bucket_size=${diffView === "snapshot" ? "hour" : diffView}${
            diffView === "month" || !diffStartTime[diffView]
              ? ""
              : `&start_time=${diffStartTime[diffView]}`
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
        env !== "" && navigationView === "evolution" && integrationType !== "",
      keepPreviousData: true,
    }
  );

// get the subgraph of the selected diff snapshot
export const GetDiffSnapshot = (
  env: string,
  integrationType: string,
  uniqueID: string,
  navigationView: string,
  diffView: string,
  diffStartTime: DiffStartTime,
  pageNumber: number,
  diffFilter: string[]
) =>
  useQuery<
    any,
    unknown,
    any,
    (string | number | (string | null)[] | null | undefined)[]
  >(
    [
      "get-diff-snapshot",
      env,
      integrationType,
      navigationView,
      diffStartTime.snapshot,
      pageNumber,
      diffFilter,
    ],
    async ({ signal }) => {
      try {
        if (uniqueID !== "") {
          const res = await client.get(
            `/api/${apiVersion}/${prefix}/view?env_id=${env}&unique_id=${uniqueID}&timestamp=${diffStartTime.snapshot}`,
            { signal }
          );
          return res?.data;
        } else {
          const res = await client.post(
            `/api/${apiVersion}/${prefix}/${
              diffStartTime.snapshot
            }?env_id=${env}${
              integrationType.toLowerCase() === "all"
                ? ""
                : `&cloud_type=${integrationType}`
            }`,
            {
              pager: { page_number: pageNumber, page_size: pageSize },
              nodes: diffFilter,
            },
            { signal }
          );
          return res?.data;
        }
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled:
        env !== "" && navigationView === "evolution" && diffView === "snapshot",
      keepPreviousData: false,
    }
  );

// get a diff node/edge's info
export const GetDiffElementInfo = (
  env: string,
  graphType: string,
  hasDiff: boolean,
  elementType: string | null,
  elementID: string | null,
  uniqueID: string,
  timestamp: number
) =>
  useQuery<any, unknown, any, (string | number | null)[]>(
    ["get-diff-element-info", env, elementType, elementID, uniqueID, timestamp],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${elementType}?env_id=${env}&timestamp=${timestamp}&${
            uniqueID !== "" ? `unique_id=${uniqueID}` : `edge_id=${elementID}`
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
        graphType === "main" &&
        hasDiff &&
        elementID !== "" &&
        elementType !== "" &&
        timestamp !== 0,
      keepPreviousData: false,
    }
  );
