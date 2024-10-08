import { useMutation, useQuery } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";

const prefix = "summaries/al/audit-logs-metrics";

export const GetAuditLogRisk = (period: number, sourceAccountID: string) =>
  useQuery<any, unknown, any, any[]>(
    ["get-audit-log-risk", period, sourceAccountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/risk?period=${period}&source_account_id=${sourceAccountID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: sourceAccountID !== "",
      keepPreviousData: false,
    }
  );

export const GetAuditLogNewServices = (
  period: number,
  sourceAccountID: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-audit-log-new-services", period, sourceAccountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/new-services?period=${period}&source_account_id=${sourceAccountID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: sourceAccountID !== "",
      keepPreviousData: false,
    }
  );

export const GetAuditLogUsers = (period: number, sourceAccountID: string) =>
  useQuery<any, unknown, any, any[]>(
    ["get-audit-log-users", period, sourceAccountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/user-names?period=${period}&source_account_id=${sourceAccountID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: sourceAccountID !== "",
      keepPreviousData: false,
    }
  );

export const GetAuditLogUserInfo = (
  period: number,
  sourceAccountID: string,
  userName: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-audit-log-user-info", period, sourceAccountID, userName],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/principals/${userName}?period=${period}&source_account_id=${sourceAccountID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: sourceAccountID !== "" && userName !== "",
      keepPreviousData: false,
    }
  );

export const GetAuditLogSignificantChanges = (
  period: number,
  sourceAccountID: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-audit-log-significant-changes", period, sourceAccountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/significant-changes?period=${period}&source_account_id=${sourceAccountID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: sourceAccountID !== "",
      keepPreviousData: false,
    }
  );

export const GetAuditEvents = (
  period: number,
  sourceAccountID: string,
  resourceType: string,
  userName: string,
  pageNumber: number
) =>
  useQuery<any, unknown, any, any[]>(
    [
      "get-audit-events",
      period,
      sourceAccountID,
      userName,
      resourceType,
      pageNumber,
    ],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/event-summaries?period=${period}&source_account_id=${sourceAccountID}${
            resourceType !== "" ? `&node_class=${resourceType}` : ""
          }${userName !== "" ? `&user_name=${userName}` : ""}`,
          {
            page_number: pageNumber,
            page_size: 5,
          },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: sourceAccountID !== "",
      keepPreviousData: true,
    }
  );

export const FavoriteAuditEvent = () =>
  useMutation<any, unknown, any, string[]>(
    async ({ eventID, signal }: { eventID: string; signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/event-summaries/${eventID}/favorite`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => queryClient.invalidateQueries(["get-audit-events"]),
    }
  );

export const GetAuditLogSummaryInfo = (
  sourceAccountID: string,
  eventID: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-audit-log-summary-info", sourceAccountID, eventID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/event-summaries/${eventID}?source_account_id=${sourceAccountID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: sourceAccountID !== "" && eventID !== "",
      keepPreviousData: false,
    }
  );

export const GetAuditLogActions = (
  period: number,
  widgetType: string,
  sourceAccountID: string,
  pageNumber: number
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-audit-log-actions", period, widgetType, sourceAccountID, pageNumber],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${widgetType}-frequent?period=${period}&source_account_id=${sourceAccountID}`,
          {
            page_number: pageNumber,
            page_size: 5,
          },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: sourceAccountID !== "",
      keepPreviousData: true,
    }
  );

export const GetAuditLogEventInfo = (
  sourceAccountID: string,
  eventName: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-audit-log-event-info", sourceAccountID, eventName],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/event-info/${eventName}?source_account_id=${sourceAccountID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: sourceAccountID !== "" && eventName !== "",
      keepPreviousData: false,
    }
  );
