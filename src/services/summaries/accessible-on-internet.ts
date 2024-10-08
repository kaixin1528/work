import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";
import { FilterPagination } from "src/types/general";

const prefix = "summaries/aa/firewall_report";

export const GetAccessibleInternetSummary = (period: number) =>
  useQuery<any, unknown, any, any[]>(
    ["get-accessible-internet-summary", period],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/overview?period=${period}`,
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

export const GetPublicIPs = (
  period: number,
  integrationType: string,
  accountID: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-public-ips", period, integrationType, accountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/summaries/io/publicips?period=${period}&integration_type=${integrationType}&source_account_id=${accountID}`,
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

export const GetAccessibleInternetDetails = (
  period: number,
  accountID: string,
  body: FilterPagination
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-accessible-internet-details", period, accountID, body],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/resources?period=${period}&source_account_id=${accountID}`,
          body,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: accountID !== "",
      keepPreviousData: false,
    }
  );
