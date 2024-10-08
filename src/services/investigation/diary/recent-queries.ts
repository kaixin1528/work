import { useQuery, useMutation } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";
import { decodeJWT } from "src/utils/general";

const prefix = "investigation";

// get a list of recent queries
export const GetRecentQueries = (
  env: string,
  count: number,
  evidenceType: string
) =>
  useQuery<any, unknown, any, (string | number | (string | null)[] | null)[]>(
    ["get-recent-queries", env, count, evidenceType],
    async ({ signal }) => {
      try {
        const jwt = decodeJWT();
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/users/recent-queries?env_id=${env}&user_email=${jwt?.name}&top_n=${count}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "" && evidenceType.includes("SEARCH"),
      keepPreviousData: true,
    }
  );

// delete a recent query from the list of recent queries
export const DeleteRecentQuery = (env: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      queryLogID,
      signal,
    }: {
      queryLogID: string;
      signal: AbortSignal;
    }) => {
      try {
        await client.delete(
          `/api/${apiVersion}/${prefix}/search-query-log?env_id=${env}&query_log_id=${queryLogID}`,
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-recent-queries"]);
      },
    }
  );
