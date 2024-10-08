import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";

const prefix = "summaries/vsl/vul-lineage";

export const GetVSLSummary = (period: number) =>
  useQuery<any, unknown, any, any[]>(
    ["get-vsl-summary", period],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/summary?period=${period}`,
          {
            signal,
          }
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

export const GetVSLLineage = (period: number, severity: string) =>
  useQuery<any, unknown, any, any[]>(
    ["get-vsl-lineage", period, severity],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/lineage?period=${period}&severity=${severity}`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: severity !== "",
      keepPreviousData: false,
    }
  );

export const GetVSLDetails = (
  period: number,
  severity: string,
  pageNumber: number,
  filteredBuckets: string[]
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-vsl-details", period, severity, pageNumber, filteredBuckets],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/details?period=${period}&severity=${severity}`,
          {
            page_number: pageNumber,
            page_size: pageSize,
            buckets: filteredBuckets,
          },
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: severity !== "",
      keepPreviousData: false,
    }
  );
