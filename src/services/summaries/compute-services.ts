import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";

const prefix = "summaries/rs/resource-change-summary";

export const GetComputeServicesSummary = (
  period: number,
  integrationType: string,
  accountID: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-compute-services-summary", period, integrationType, accountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}?period=${period}&integration_type=${integrationType}&source_account_id=${accountID}`,
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
      cacheTime: 0,
    }
  );

export const GetComputeServicesDetails = (
  summaryID: string,
  pageNumber: number
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-compute-services-details", summaryID, pageNumber],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}-details?summary_id=${summaryID}`,
          { page_size: pageSize, page_number: pageNumber },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: summaryID !== "",
      keepPreviousData: pageNumber !== 1,
    }
  );
