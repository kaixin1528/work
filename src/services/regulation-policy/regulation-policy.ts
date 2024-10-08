import { useQuery, useMutation } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";

export const GetGRCDocumentSectionsControls = (
  documentStatus: string,
  documentType: string,
  documentID: string,
  policyVersion: string,
  pageNumber: number,
  documenTab: string,
  filter: string,
  context: string,
  domain: string,
  subDomain: string,
  search?: boolean,
  query?: string
) =>
  useQuery<any, unknown, any, (string | number | boolean | undefined)[]>(
    [
      "get-grc-document-sections-controls",
      documentStatus,
      documentType,
      documentID,
      policyVersion,
      pageNumber,
      documenTab,
      filter,
      context,
      domain,
      subDomain,
      search,
      query,
    ],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/${documentType}/${documentID}/${documenTab.toLowerCase()}?filter=${filter
            .split(" ")
            .join("")}${
            documentType === "policies" && policyVersion !== ""
              ? `&policy_version=${policyVersion}`
              : ""
          }`,
          {
            ...(query && search && { query: query }),
            pager: {
              page_size: pageSize,
              page_number: pageNumber,
            },
            ...(domain && { domain: domain }),
            ...(context && { context: context }),
            ...(subDomain && { sub_domain: subDomain }),
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
      enabled:
        documentStatus === "ready" &&
        documentID !== "" &&
        !["Suggest New Mapping", "Policy Generation"].includes(filter) &&
        ((!search && query === "") || (search && query !== "")) &&
        ["Sections", "Controls"].includes(documenTab),
      keepPreviousData: true,
    }
  );

export const GetAllScanners = (show: boolean) =>
  useQuery<any, unknown, any, (string | boolean)[]>(
    ["get-all-scanners"],
    async ({ signal }) => {
      try {
        const res = await client.get(`/api/${apiVersion}/grc/scanners`, {
          signal,
        });
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: show }
  );

export const ExportMappings = (
  documentType: string,
  documentID: string,
  noMappings: boolean,
  policyVersion?: string
) =>
  useMutation<any, unknown, any, string>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/${documentType}/${documentID}/export?invert=${noMappings}${
            documentType === "policies"
              ? `&policy_version=${policyVersion}`
              : ""
          }`,
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
          "get-export-mappings-status",
          documentType,
          documentID,
        ]);
      },
    }
  );

export const GetExportMappingStatus = (
  documentType: string,
  documentID: string,
  noMappings: boolean
) =>
  useQuery<any, unknown, any, (string | boolean)[]>(
    ["get-export-mappings-status", documentType, documentID, noMappings],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/grc/${documentType}/${documentID}/export/status?invert=${noMappings}`,
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
      enabled: documentType !== "" && documentID !== "",
      keepPreviousData: false,
      refetchInterval: 30000,
    }
  );

export const DownloadMappings = (
  documentType: string,
  documentID: string,
  noMappings: boolean
) =>
  useMutation<any, unknown, any, string>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/grc/${documentType}/${documentID}/export?invert=${noMappings}`,
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
          "get-export-mappings-status",
          documentType,
          documentID,
        ]);
      },
    }
  );

export const GetRiskComplianceControlFilters = (
  documentType: string,
  documentID: string
) =>
  useQuery<any, unknown, any, (string | undefined)[]>(
    ["get-regulation-policy-control-filters", documentType, documentID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/grc/${documentType}/${documentID}/${
            documentType === "frameworks"
              ? "controls/metadata"
              : "control_metadata"
          }`,
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
      enabled: documentType !== "" && documentID !== "",
      keepPreviousData: false,
    }
  );
