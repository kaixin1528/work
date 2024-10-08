import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";

const prefix = `grc/bcmsop`;

export const GetSOPList = (tags: string[], pageNumber?: number) =>
  useQuery<any, unknown, any, (string | number | string[] | undefined)[]>(
    ["get-sop-list", pageNumber, tags],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}`,
          pageNumber
            ? {
                page_number: pageNumber,
                page_size: pageSize,
                ...(tags.length > 0 && { tag: tags }),
              }
            : null,
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
      refetchInterval: 60000,
    }
  );

export const RemoveSOP = () => {
  const navigate = useNavigate();

  return useMutation<any, unknown, any, string>(
    async ({ sopID, signal }: { sopID: string; signal: AbortSignal }) => {
      try {
        const res = await client.delete(
          `/api/${apiVersion}/${prefix}/${sopID}`,
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
        queryClient.invalidateQueries(["get-sop-list"]);
        navigate("/business-continuity/summary");
      },
    }
  );
};

export const GetSOPVersions = (sopID: string) =>
  useQuery<any, unknown, any, string[]>(
    ["get-sop-versions", sopID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${sopID}/versions`,
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
      enabled: sopID !== "",
    }
  );

export const UploadSOPVersion = () =>
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
          `/api/${apiVersion}/${prefix}/versions`,
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
    { onSuccess: () => queryClient.invalidateQueries(["get-sop-list"]) }
  );

export const DeleteSOPVersion = (sopID: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      versionID,
      signal,
    }: {
      versionID: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.delete(
          `/api/${apiVersion}/${prefix}/${sopID}/versions/${versionID}`,
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
        queryClient.invalidateQueries(["get-procedure-metadata"]);
        queryClient.invalidateQueries(["get-sop-versions"]);
      },
    }
  );

export const UpdateSOP = (sopID: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      sopName,
      tag,
      signal,
    }: {
      sopName: string;
      tag: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/update-sop?sop_id=${sopID}`,
          { new_sop_name: sopName, tag_name: tag },
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
        queryClient.invalidateQueries(["get-sop-list"]);
        queryClient.invalidateQueries(["get-sop-names-and-values", sopID]);
      },
    }
  );

export const GetProcedureMetadata = (sopID: string) =>
  useQuery<any, unknown, any, string[]>(
    ["get-procedure-metadata", sopID],
    async ({ signal }) => {
      try {
        const res = await client.get(`/api/${apiVersion}/${prefix}/${sopID}`, {
          signal,
        });
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: sopID !== "",
    }
  );

export const GetProcedureStatus = (sopID: string, versionID: string) =>
  useQuery<any, unknown, any, (string | undefined)[]>(
    ["get-procedure-status", sopID, versionID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${sopID}/status?version_id=${versionID}`,
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
      enabled: sopID !== "" && versionID !== "",
      keepPreviousData: false,
    }
  );

export const GetSOPSections = (
  sopStatus: string,
  sopID: string,
  sopVersion: string,
  pageNumber: number,
  documenTab: string,
  filter: string
) =>
  useQuery<any, unknown, any, (string | number | boolean | undefined)[]>(
    [
      "get-sop-sections",
      sopStatus,
      sopID,
      sopVersion,
      pageNumber,
      documenTab,
      filter,
    ],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/get-sop-sections?sop_id=${sopID}&sop_version_id=${sopVersion}`,
          {
            page_size: pageSize,
            page_number: pageNumber,
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
        sopStatus === "ready" && sopID !== "" && documenTab === "Sections",
      keepPreviousData: true,
    }
  );

export const GetSOPDrift = (sopID: string) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-sop-drift", sopID],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/get-sop-drift?sop_id=${sopID}`,
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
      enabled: sopID !== "",
    }
  );

export const GetSOPDriftDiff = (
  sourceVersionID: string,
  targetVersionID: string
) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-sop-drift-diff", sourceVersionID, targetVersionID],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/get-sop-drift-diff?source_version_id=${sourceVersionID}&target_version_id=${targetVersionID}`,
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
      enabled: sourceVersionID !== "" && targetVersionID !== "",
    }
  );

export const AddTableActivity = (versionID: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      tableIDs,
      signal,
    }: {
      tableIDs: string[];
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${versionID}/add-table-activity`,
          { tables: tableIDs },
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
        queryClient.invalidateQueries(["get-grc-tables"]);
      },
    }
  );

export const RemoveTableActivity = (versionID: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      tableIDs,
      signal,
    }: {
      tableIDs: string[];
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${versionID}/remove-table-activity`,
          { tables: tableIDs },
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
        queryClient.invalidateQueries(["get-grc-tables"]);
      },
    }
  );

export const ExportBIA = (versionID: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      selectedColumns,
      signal,
    }: {
      selectedColumns: string[];
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/export-bia?sop_version_id=${versionID}`,
          { selected_columns: selectedColumns },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-export-bia-status", versionID]);
      },
    }
  );

export const GetExportBIAStatus = (versionID: string) =>
  useQuery<any, unknown, any, (string | boolean)[]>(
    ["get-export-bia-status", versionID],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/bia-status?sop_version_id=${versionID}`,
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
      enabled: versionID !== "",
      keepPreviousData: false,
      refetchInterval: 30000,
    }
  );

export const DownloadBIA = (versionID: string) =>
  useMutation<any, unknown, any, string>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/download-bia?sop_version_id=${versionID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-export-bia-status", versionID]);
      },
    }
  );

export const GetPageCoverage = (sopID: string, sopVersionID: string) =>
  useQuery<any, unknown, any, string[]>(
    ["get-page-coverage", sopID, sopVersionID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${sopID}/stats?bcm_sop_version_id=${sopVersionID}`,
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
      enabled: sopID !== "" && sopVersionID !== "",
    }
  );

export const GetTableCoverage = (documentID: string) =>
  useQuery<any, unknown, any, (string | undefined)[]>(
    ["get-table-coverage", documentID],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/documents/${documentID}/table-verification`,
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
      enabled: documentID !== "",
    }
  );

export const AddSOPTags = (sopID: string) =>
  useMutation<any, unknown, any, string>(
    async ({ tag, signal }: { tag: string; signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/add-sop-tags?sop_id=${sopID}`,
          { tags: [tag] },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-sop-names-and-values", sopID]);
      },
    }
  );

export const DeleteSOPTag = (sopID: string) =>
  useMutation<any, unknown, any, string>(
    async ({ tag, signal }: { tag: string; signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/delete-sop-tag?sop_id=${sopID}tag_value=${tag}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-sop-names-and-values", sopID]);
      },
    }
  );

export const GetSOPTagNamesAndValues = (sopID?: string) =>
  useQuery<any, unknown, any, (string | undefined)[]>(
    ["get-sop-names-and-values", sopID],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/get-sop-tag-values${
            sopID ? `?sop_id=${sopID}` : ""
          }`,
          {},
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

export const GetSOPDepartments = (sopID?: string) =>
  useQuery<any, unknown, any, (string | undefined)[]>(
    ["get-sop-departments", sopID],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/get-sop-departments`,
          {},
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

export const GetSOPTableHeaders = (sopVersionIDs: string[], show: boolean) =>
  useQuery<any, unknown, any, (string | boolean | string[])[]>(
    ["get-sop-table-headers", sopVersionIDs, show],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/get-sop-table-headers`,
          {
            inputs: { sop_version_ids: sopVersionIDs },
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
    { enabled: sopVersionIDs.length > 0 && show }
  );

export const BulkExportBIA = () =>
  useMutation<any, unknown, any, string>(
    async ({
      tablesBySOP,
      headers,
      signal,
    }: {
      tablesBySOP: any;
      headers: string[];
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/bulk-export-bia`,
          { tables_by_sop: tablesBySOP, header: headers },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );
