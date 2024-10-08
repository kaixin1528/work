import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";

const prefix = "investigation";

// get a list of alerts for new evidence
export const GetAlertList = (env: string, limit: number) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-alert-list", env, limit],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/get-alert-analysis-entries?env_id=${env}&limit=${limit}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: env !== "", keepPreviousData: true }
  );
