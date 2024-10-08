import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";

const prefix = "observability/data";

// get the data flow widget summary
export const GetDataSummary = (env: string, previousDays: number) =>
  useQuery<any, unknown, any, (string | number | (string | null)[] | null)[]>(
    ["get-data-summary", env, previousDays],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/summary?env_id=${env}&previous_days=${previousDays}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "",
    }
  );

// get the data flow aggregated metrics
export const GetAggregatedMetrics = (env: string) =>
  useQuery<any, unknown, any, (string | (string | null)[] | null)[]>(
    ["get-aggregated-metrics", env],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/aggregated-metrics?env_id=${env}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "",
    }
  );

// get the data flow metrics
export const GetDataMetrics = (
  env: string,
  resource: string,
  previousDays: number,
  type: string
) =>
  useQuery<any, unknown, any, (string | number | (string | null)[] | null)[]>(
    ["get-data-metrics", env, resource, previousDays, type],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${resource}/metrics?env_id=${env}&previous_days=${previousDays}&type=${type}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "",
    }
  );
