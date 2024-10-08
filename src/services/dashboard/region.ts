import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";
import { Filter } from "src/types/general";

const prefix = "observability/regions";

// get the active regions by cloud
export const GetActiveRegions = (env: string, cloud: string) =>
  useQuery<any, unknown, any, any[]>(
    ["get-active-regions", env, cloud],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/activity?env_id=${env}&cloud_provider=${cloud}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: env !== "", keepPreviousData: true }
  );

// get the vpc counts over time of a region
export const GetRegionCounts = (
  env: string,
  cloud: string | (string | null)[] | null,
  id: string,
  filters: Filter[]
) =>
  useQuery<
    any,
    unknown,
    any,
    (string | (string | null)[] | Filter[] | null | undefined)[]
  >(
    ["get-region-counts", env, cloud, id, filters],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/resource_activity/${id}?env_id=${env}&cloud_provider=${cloud}`,
          filters,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "" && id !== "",
      keepPreviousData: false,
    }
  );
