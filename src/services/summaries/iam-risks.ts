import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";

const prefix = "summaries/ir/iamrisks";

export const GetIAMRisksPolicies = (
  integrationType: string,
  accountID: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-iam-risks-policies", integrationType, accountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/policies?integration_type=${integrationType}&source_account_id=${accountID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: integrationType !== "" && accountID !== "",
      keepPreviousData: false,
    }
  );

export const GetIAMRisksPrincipals = (
  integrationType: string,
  accountID: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-iam-risks-principals", integrationType, accountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/principals?integration_type=${integrationType}&source_account_id=${accountID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: integrationType !== "" && accountID !== "",
      keepPreviousData: false,
    }
  );
