import { useQuery } from "react-query";
import { client } from "../../components/General/AxiosInterceptor";
import { apiVersion } from "../../constants/general";

// get whether each source is active or not
export const GetActiveSources = (env: string) =>
  useQuery<any, unknown, any, (string | (string | null)[] | null)[]>(
    ["get-active-sources", env],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/dash/clouds?env_id=${env}`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: env !== "", keepPreviousData: true }
  );
