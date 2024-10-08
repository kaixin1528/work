import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";

const prefix = "summaries/cra/cyber-risk-assessment/surface/as";

export const GetAssetServices = (period: number) =>
  useQuery<any, unknown, any, any[]>(
    ["get-assets-services", period],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/assets-services?period=${period}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      keepPreviousData: true,
    }
  );

export const GetASResourceTypes = (
  period: number,
  accountID: string,
  serviceType: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-assets-services-resource-types", period, accountID, serviceType],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/assets-services/resource_types?period=${period}&source_account_id=${accountID}&service_type=${serviceType}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: accountID !== "" && serviceType !== "",
      keepPreviousData: false,
    }
  );

export const GetASDetails = (
  period: number,
  sourceAccountID: string,
  referenceID: string,
  pageNumber: number
) =>
  useQuery<any, unknown, any, any[]>(
    [
      "get-assets-services-details",
      period,
      sourceAccountID,
      referenceID,
      pageNumber,
    ],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/assets-services/details?period=${period}&source_account_id=${sourceAccountID}&reference_id=${referenceID}`,
          { page_size: pageSize, page_number: pageNumber },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: sourceAccountID !== "" && referenceID !== "",
      keepPreviousData: true,
    }
  );

export const GetInventoryEvolution = (period: number, accountID: string) =>
  useQuery<any, unknown, any, any[]>(
    ["get-inventory-evolution", period, accountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/inventory-evolution?period=${period}&source_account_id=${accountID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: accountID !== "",
      keepPreviousData: true,
    }
  );

export const GetEntropyOverTime = (period: number, accountID: string) =>
  useQuery<any, unknown, any, any[]>(
    ["get-entropy-over-time", period, accountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/entropy-over-time?period=${period}&source_account_id=${accountID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: accountID !== "",
      keepPreviousData: true,
    }
  );

export const GetLineage = (
  period: number,
  integrationType: string,
  accountID: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-lineage", period, integrationType, accountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/lineage?period=${period}&integration_type=${integrationType}&source_account_id=${accountID}`,
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
