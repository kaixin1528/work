import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";

const prefix = "summaries/ve/layered-cake";

export const GetLayeredCake = (
  period: number,
  intgrationType: string,
  accountID: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-layered-cake", period, intgrationType, accountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}?period=${period}&integration_type=${intgrationType}&source_account_id=${accountID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: intgrationType !== "" && accountID !== "",
      keepPreviousData: false,
    }
  );
