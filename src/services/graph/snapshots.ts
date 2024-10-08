// get earliest and latest snapshot, if available

import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";

const prefix = "observability/graph";

// if not available, return -1 correspondingly
export const GetSnapshotsAvailable = (
  env: string,
  cloud: string | (string | null)[] | null,
  graphType: string
) =>
  useQuery<any, unknown, any, (string | (string | null)[] | null)[]>(
    ["get-snapshots-available", env, cloud, graphType],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/latest-snapshot-available?env_id=${env}&cloud_provider=${cloud}&graph_type=${graphType}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "",
      keepPreviousData: true,
    }
  );

// get the snapshot times for one day
export const GetSnapshotTimestamps = (
  env: string,
  cloud: string | (string | null)[] | null,
  configured: boolean,
  timestamp: number,
  navigationView: string,
  graphType: string
) =>
  useQuery<
    any,
    unknown,
    any,
    (string | number | boolean | (string | null)[] | null)[]
  >(
    [
      "get-snapshot-timestamps",
      env,
      cloud,
      timestamp,
      graphType,
      navigationView,
    ],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/timestamps?env_id=${env}&cloud_provider=${cloud}&timestamp=${timestamp}&graph_type=${graphType}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      keepPreviousData: true,
      enabled: env !== "" && configured && navigationView !== "evolution",
    }
  );
