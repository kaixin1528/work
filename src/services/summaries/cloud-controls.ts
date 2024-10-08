import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";
import { FilterPagination } from "src/types/general";

const prefix = "summaries/cc/assessment";

export const GetCCSummary = (integrationType: string, accountID: string) =>
  useQuery<any, unknown, any, any[]>(
    ["get-cloud-controls-summary", integrationType, accountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/summary?integration_type=${integrationType}&source_account_id=${accountID}`,
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

export const GetCCEvolutionValues = (
  integrationType: string,
  accountID: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-cloud-controls-evolution-values", integrationType, accountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/evolution/values?integration_type=${integrationType}&source_account_id=${accountID}`,
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

export const GetCCEvolution = (
  integrationType: string,
  accountID: string,
  service: string,
  status: string
) =>
  useQuery<any, unknown, any, any[]>(
    [
      "get-cloud-controls-evolution",
      integrationType,
      accountID,
      service,
      status,
    ],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/evolution?integration_type=${integrationType}&source_account_id=${accountID}&service=${service}&status=${status}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled:
        integrationType !== "" &&
        accountID !== "" &&
        service !== "" &&
        status !== "",
      keepPreviousData: false,
    }
  );

export const GetCCDetails = (
  integrationType: string,
  accountID: string,
  body: FilterPagination
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-cloud-controls-details", integrationType, accountID, body],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/details?integration_type=${integrationType}&source_account_id=${accountID}`,
          body,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: integrationType !== "" && accountID !== "",
      keepPreviousData: true,
    }
  );
