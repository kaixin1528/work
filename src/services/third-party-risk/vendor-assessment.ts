import { useQuery, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";
import { KeyStringVal } from "src/types/general";

const prefix = "grc/third_party_review";

export const GetReviewList = (
  order: KeyStringVal,
  pageNumber: number,
  category?: string
) =>
  useQuery<any, unknown, any, (string | number | KeyStringVal | undefined)[]>(
    ["get-review-list", order, pageNumber, category],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}`,
          {
            ...(order.order_by !== "" && { order: order }),
            page_number: pageNumber,
            page_size: pageSize,
            ...(category && { category: category }),
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
      keepPreviousData: false,
    }
  );

export const AddReview = () =>
  useMutation<any, unknown, any, string>(
    async ({
      formData,
      signal,
    }: {
      formData: FormData;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/new`,
          formData,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-review-list"]);
      },
    }
  );

export const RemoveReview = () => {
  const navigate = useNavigate();

  return useMutation<any, unknown, any, string>(
    async ({ reviewID, signal }: { reviewID: string; signal: AbortSignal }) => {
      try {
        const res = await client.delete(
          `/api/${apiVersion}/${prefix}/${reviewID}`,
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
      onSuccess: () => {
        queryClient.invalidateQueries(["get-review-list"]);
        navigate("/third-party-risk/summary");
      },
    }
  );
};

export const GetAuditStatus = (auditID: string) =>
  useQuery<any, unknown, any, (string | undefined)[]>(
    ["get-audit-status", auditID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${auditID}/status`,
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
      enabled: auditID !== "",
      keepPreviousData: false,
    }
  );

export const GetReviewMetadata = (reviewID: string) =>
  useQuery<any, unknown, any, (string | undefined)[]>(
    ["get-review-metadata", reviewID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${reviewID}`,
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
      enabled: reviewID !== "",
      keepPreviousData: false,
    }
  );

export const GetControlFilters = (reviewID: string) =>
  useQuery<any, unknown, any, (string | undefined)[]>(
    ["get-control-filters", reviewID],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${reviewID}/control_metadata`,
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
      enabled: reviewID !== "",
      keepPreviousData: false,
    }
  );

export const GetControls = (
  reviewID: string,
  pageNumber: number,
  filter: string
) =>
  useMutation<any, unknown, any, string>(
    async ({
      context,
      domain,
      subDomain,
      level,
      signal,
    }: {
      context: string[];
      domain: string[];
      subDomain: string[];
      level: string[];
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${reviewID}/controls?filter=${filter
            .split(" ")
            .join("")}`,
          {
            pager: {
              page_number: pageNumber,
              page_size: pageSize,
            },
            ...(domain && { domain: domain }),
            ...(context && { context: context }),
            ...(subDomain && { sub_domain: subDomain }),
            ...(level && { level: level }),
          },
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

export const GetAudit = (
  selectedTab: string,
  auditID: string,
  frameworkID: string,
  pageNumber: number,
  filter: string
) =>
  useQuery<any, unknown, any, (string | number | string[])[]>(
    ["get-audit", auditID, frameworkID, pageNumber, filter],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${auditID}/sections?filter=${filter
            .split(" ")
            .join("")}`,
          {
            framework_id: frameworkID,
            pager: {
              page_number: pageNumber,
              page_size: pageSize,
            },
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
      keepPreviousData: false,
      enabled: selectedTab === "Audit Report" && auditID !== "",
    }
  );

export const UpdateAuditSections = (
  auditID: string,
  frameworkID: string,
  reviewID: string
) =>
  useMutation<any, unknown, any, string>(
    async ({
      editSections,
      signal,
    }: {
      editSections: any;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.patch(
          `/api/${apiVersion}/${prefix}/${auditID}/sections`,
          {
            framework_id: frameworkID,
            review_id: reviewID,
            updated: editSections,
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
      onSuccess: () => {
        queryClient.invalidateQueries(["get-review-metadata"]);
        queryClient.invalidateQueries(["get-audit"]);
      },
    }
  );

export const GetAIGeneratedAnswer = (reviewID: string, generatedID: string) =>
  useMutation<any, unknown, any, string>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${reviewID}/${generatedID}/answer`,
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

export const GetControlToAuditMapping = (
  frameworkID: string,
  auditID: string,
  generatedID: string
) =>
  useMutation<any, unknown, any, string>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/control_to_audit_mapping`,
          {
            framework_id: frameworkID,
            audit_id: auditID,
            control_id: generatedID,
          },
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

export const ExportMappings = (reviewID: string, mapping: boolean) =>
  useMutation<any, unknown, any, string>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${reviewID}/export?mapping=${mapping}&category=review`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "get-third-party-export-mappings-status",
          reviewID,
        ]);
      },
    }
  );

export const GetExportMappingStatus = (reviewID: string, mapping: boolean) =>
  useQuery<any, unknown, any, (string | boolean)[]>(
    ["get-third-party-export-mappings-status", reviewID, mapping],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${reviewID}/export/status?mapping=${mapping}&category=review`,
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
      enabled: reviewID !== "",
      keepPreviousData: false,
      refetchInterval: 30000,
    }
  );

export const DownloadMappings = (reviewID: string, mapping: boolean) =>
  useMutation<any, unknown, any, string>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${reviewID}/export?mapping=${mapping}&category=review`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "get-third-party-export-mappings-status",
          reviewID,
        ]);
      },
    }
  );

export const GetVAScorecard = (reviewID: string, frameworkID: string) =>
  useQuery<any, unknown, any, (string | number | string[])[]>(
    ["get-va-scorecard", reviewID, frameworkID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${reviewID}/scorecard?framework_id=${frameworkID}`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: reviewID !== "" && frameworkID !== "", keepPreviousData: true }
  );
