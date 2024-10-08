import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";

const prefix = "investigation";

// get a list of recommended evidence in an investigation diary
export const GetRecommendedEvidence = (
  env: string,
  diaryID: string | (string | null)[] | null
) =>
  useQuery<any, unknown, any, (string | (string | null)[] | null)[]>(
    ["get-recommended-evidence", env, diaryID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/query-recommendations?env_id=${env}&diary_id=${diaryID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: env !== "", keepPreviousData: true }
  );
