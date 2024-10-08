import { useMutation, useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";

const prefix = "grc/frameworks";

export const GetCoverageSummary = () =>
  useQuery<any, unknown, any, string[]>(
    ["get-coverage-summary"],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/global/summary`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

export const SearchGRCRegion = () =>
  useMutation<any, unknown, any, string[]>(
    async ({ region, signal }: { region: string; signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/search_regions`,
          { region: region },
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

export const SearchGRCVerticals = () =>
  useMutation<any, unknown, any, string[]>(
    async ({ vertical, signal }: { vertical: string; signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/search_vertical`,
          { vertical: vertical },
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

export const GetCoverage = (frameworkIDs: string[], policyIDs: string[]) =>
  useQuery<any, unknown, any, (string | string[])[]>(
    ["get-coverage", frameworkIDs, policyIDs],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/get_coverage`,
          { framework_ids: frameworkIDs, policy_ids: policyIDs },
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
      enabled: frameworkIDs.length > 0 && policyIDs.length > 0,
      keepPreviousData: false,
    }
  );

export const GetDiffGraph = (frameworkID: string, policyID: string) =>
  useQuery<any, unknown, any, string[]>(
    ["get-diff-graph", frameworkID, policyID],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${frameworkID}/diff-graph/${policyID}`,
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
      enabled: frameworkID !== "" && policyID !== "",
    }
  );

export const GetAuditTrailTypes = () =>
  useQuery<any, unknown, any, (string | number | string[])[]>(
    ["get-grc-audit-trail-types"],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/grc/activity/audit_trail_types`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

export const GetAuditTrailUsers = (customerID: string) =>
  useQuery<any, unknown, any, (string | boolean)[]>(
    ["get-audit-trail-users", customerID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/customers/${customerID}/users`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: customerID !== "" }
  );

export const GetGRCActivity = (
  pageNumber: number,
  auditTrailTypes: string[],
  auditTrailUsers: string[]
) =>
  useQuery<any, unknown, any, (string | number | string[])[]>(
    ["get-grc-activity", pageNumber, auditTrailTypes, auditTrailUsers],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/activity`,
          {
            page_number: pageNumber,
            page_size: pageSize,
            audit_trail_types: auditTrailTypes,
            audit_trail_users: auditTrailUsers,
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
    { keepPreviousData: true }
  );

export const GetCSFScorecard = (pageNumber: number) =>
  useQuery<any, unknown, any, (string | number | string[])[]>(
    ["get-csf-scorecard", pageNumber],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/risk/scorecard`,
          {
            page_number: pageNumber,
            page_size: pageSize,
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
    { keepPreviousData: true }
  );
