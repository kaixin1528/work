import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";

const prefix = "summaries/aa/activities";

export const GetUserActivityLevels = () =>
  useQuery<any, unknown, any, any[]>(
    ["get-user-activity-levels"],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/principals`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      keepPreviousData: false,
    }
  );

export const GetUserActivityCounts = (userID: string) =>
  useQuery<any, unknown, any, any[]>(
    ["get-user-activity-acounts", userID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/principals/${userID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: userID !== "",
      keepPreviousData: false,
    }
  );
