import { useMutation, useQuery } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";
import { KeyStringVal } from "src/types/general";

const prefix = "grc/third_party_review/privacy";

export const GetPrivacyStandards = () =>
  useQuery<
    any,
    unknown,
    any,
    (string | number | string[] | KeyStringVal | undefined)[]
  >(["get-privacy-standards"], async ({ signal }) => {
    try {
      const res = await client.post(`/api/${apiVersion}/${prefix}/standards`, {
        signal,
      });
      return res?.data;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  });

export const CreatePrivacyReview = () =>
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
    }
  );

export const GetPrivacyReviewStatus = (auditID: string) =>
  useQuery<any, unknown, any, (string | undefined)[]>(
    ["get-privacy-review-status", auditID],
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
      keepPreviousData: false,
    }
  );

export const GetPrivacyReviewMetadata = (auditID: string) =>
  useQuery<any, unknown, any, (string | boolean | KeyStringVal | string[])[]>(
    ["get-privacy-review-metadata", auditID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${auditID}`,
          { signal }
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

export const GetPrivacyReviewMappings = (reviewID: string) =>
  useQuery<any, unknown, any, (string | boolean | KeyStringVal | string[])[]>(
    ["get-privacy-review-mappings", reviewID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/mapping?review_id=${reviewID}`,
          { signal }
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

export const GetPrivacyReviewSections = (
  reviewID: string,
  pageNumber: number
) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-privacy-review-sections", reviewID, pageNumber],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/sections`,
          {
            audit_id: reviewID,
            pager: { page_size: pageSize, page_number: pageNumber },
          },
          { signal }
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

export const ExportPrivacyReview = (reviewID: string) =>
  useMutation<any, unknown, any, string>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/third_party_review/${reviewID}/export?mapping=true&category=privacy`,
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
          "get-export-privacy-review-status",
          reviewID,
        ]);
      },
    }
  );

export const GetExportPrivacyReviewStatus = (reviewID: string) =>
  useQuery<any, unknown, any, (string | boolean)[]>(
    ["get-export-privacy-review-status", reviewID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/grc/third_party_review/${reviewID}/export/status?mapping=true&category=privacy`,
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

export const DownloadPrivacyReview = (reviewID: string) =>
  useMutation<any, unknown, any, string>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/grc/third_party_review/${reviewID}/export?mapping=true&category=privacy`,
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
          "get-export-privacy-review-status",
          reviewID,
        ]);
      },
    }
  );
