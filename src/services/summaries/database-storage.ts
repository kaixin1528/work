import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";

const prefix = "summaries/ds/database_storage/database";

export const GetDatabaseOverview = (
  period: number,
  integrationType: string,
  accountID: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-database-overview", period, integrationType, accountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/summary?period=${period}&integration_type=${integrationType}&source_account_id=${accountID}`,
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

export const GetDatabaseSnapshots = (
  period: number,
  integrationType: string,
  accountID: string,
  resourceID: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-database-snapshots", period, integrationType, accountID, resourceID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${resourceID}/snapshots?period=${period}&integration_type=${integrationType}&source_account_id=${accountID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: integrationType !== "" && accountID !== "" && resourceID !== "",
      keepPreviousData: false,
    }
  );

export const GetDatabaseEvents = (
  period: number,
  integrationType: string,
  accountID: string,
  resourceID: string,
  pageNumber: number
) =>
  useQuery<any, unknown, any, any[]>(
    [
      "get-database-events",
      period,
      integrationType,
      accountID,
      resourceID,
      pageNumber,
    ],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${resourceID}/events?period=${period}&integration_type=${integrationType}&source_account_id=${accountID}`,
          { page_size: pageSize, page_number: pageNumber },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: integrationType !== "" && accountID !== "" && resourceID !== "",
      keepPreviousData: true,
    }
  );

export const GetStorageOverview = (
  period: number,
  integrationType: string,
  accountID: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-storage-overview", period, integrationType, accountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/summaries/ds/database_storage/storage/summary?period=${period}&integration_type=${integrationType}&source_account_id=${accountID}`,
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

export const GetAnalyticalSystemOverview = (
  period: number,
  integrationType: string,
  accountID: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-analytical-system-overview", period, integrationType, accountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/summaries/ds/database_storage/analytical-systems/summary?period=${period}&integration_type=${integrationType}&source_account_id=${accountID}`,
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

export const GetAnalyticalSystemChildren = (
  period: number,
  integrationType: string,
  accountID: string,
  parentNodeID: string,
  childrenNodeType: string,
  pageSize: number,
  pageNumber: number
) =>
  useQuery<any, unknown, any, any[]>(
    [
      "get-analytical-system-children",
      period,
      integrationType,
      accountID,
      parentNodeID,
      childrenNodeType,
      pageSize,
      pageNumber,
    ],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/summaries/ds/database_storage/analytical-systems/children?period=${period}&integration_type=${integrationType}&source_account_id=${accountID}&node_class=${childrenNodeType}&parent_node_id=${parentNodeID}&page_size=${pageSize}&page_number=${pageNumber}`,
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
        parentNodeID !== "" &&
        childrenNodeType !== "",
      keepPreviousData: true,
    }
  );
