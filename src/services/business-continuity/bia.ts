import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";

const prefix = `grc/bcmsop`;

export const GetBIATemplates = () =>
  useQuery<any, unknown, any, (string | number | undefined)[]>(
    ["get-bia-templates"],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/get-bia-templates`,
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

export const GetBIAList = (pageNumber: number) =>
  useQuery<any, unknown, any, (string | number | undefined)[]>(
    ["get-bia-list", pageNumber],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/get-bias`,
          pageNumber
            ? {
                page_number: pageNumber,
                page_size: pageSize,
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
    }
  );

export const UpdateBIA = () =>
  useMutation<any, unknown, any, string>(
    async ({
      biaGroupID,
      title,
      description,
      signal,
    }: {
      biaGroupID: string;
      title: string;
      description: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.patch(
          `/api/${apiVersion}/${prefix}/list/${biaGroupID}`,
          { title: title, description: description },
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
        queryClient.invalidateQueries(["get-bia-list"]);
      },
    }
  );

export const RemoveBIA = (biaID: string) => {
  const navigate = useNavigate();

  return useMutation<any, unknown, any, string>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/delete-bia?bia_id=${biaID}`,
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
        queryClient.invalidateQueries(["get-bia-list"]);
        navigate("/business-continuity/summary");
      },
    }
  );
};

export const RemoveBIATemplate = () =>
  useMutation<any, unknown, any, string>(
    async ({
      templateID,
      signal,
    }: {
      templateID: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/delete-bia-template?template_id=${templateID}`,
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
      onSuccess: () => queryClient.invalidateQueries(["get-bia-templates"]),
    }
  );

export const UploadBIA = () =>
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
          `/api/${apiVersion}/${prefix}/upload-bia`,
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

export const GetBIAMetadata = (biaID: string) =>
  useQuery<any, unknown, any, string[]>(
    ["get-bia-metadata", biaID],
    async ({ signal }) => {
      try {
        const res = await client.get(`/api/${apiVersion}/${prefix}/${biaID}`, {
          signal,
        });
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: biaID !== "",
    }
  );

export const GetBIAStatus = (biaID: string) =>
  useQuery<any, unknown, any, (string | undefined)[]>(
    ["get-bia-status", biaID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${biaID}/status`,
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
      enabled: biaID !== "",
      keepPreviousData: false,
    }
  );

export const GetBIAExcelSheets = (biaID: string) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-bia-excel-sheets", biaID],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/get-bia?bia_id=${biaID}`,
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
      enabled: biaID !== "",
    }
  );

export const GetBIADrift = (biaID: string) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-bia-drift", biaID],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/get-bia-drift?bia_id=${biaID}`,
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
      enabled: biaID !== "",
    }
  );

export const GetBIADriftDiff = (
  sourceVersionID: string,
  targetVersionID: string
) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-bia-drift-diff", sourceVersionID, targetVersionID],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/get-bia-drift-diff?source_version_id=${sourceVersionID}&target_version_id=${targetVersionID}`,
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

export const ExportBIA = (biaID: string, sopVersionIDs: string[]) =>
  useMutation<any, unknown, any, string>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/export-bia-mappings`,
          {
            bia_id: biaID,
            sop_version_ids: sopVersionIDs,
          },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-export-bia-status", biaID]);
      },
    }
  );

export const GetExportBIAStatus = (biaID: string) =>
  useQuery<any, unknown, any, (string | boolean)[]>(
    ["get-export-bia-status", biaID],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/bia-mappings-export-status?bia_id=${biaID}`,
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
      enabled: biaID !== "",
      keepPreviousData: false,
      refetchInterval: 30000,
    }
  );

export const DownloadBIA = (biaID: string) =>
  useMutation<any, unknown, any, string>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/download-bia-mappings-export?bia_id=${biaID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-export-bia-status", biaID]);
      },
    }
  );

export const ViewBIA = (sopVersionID: string) =>
  useMutation<any, unknown, any, string>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/documents/get-bia-for-sop?sop_version_id=${sopVersionID}`,
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

export const GetMappedSOPs = (biaID: string, pageNumber: number) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-mapped-sops", biaID, pageNumber],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/mapped-sops?bia_id=${biaID}`,
          {
            pager: { page_number: pageNumber, page_size: pageSize },
            user_query: "",
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
      enabled: biaID !== "",
      keepPreviousData: false,
    }
  );

export const GetBIAMappings = (biaID: string, sopVersionIDs: string[]) =>
  useQuery<any, unknown, any, (string | string[])[]>(
    ["get-bia-mappings", biaID, sopVersionIDs],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/get-bia-mappings`,
          {
            bia_id: biaID,
            sop_version_ids: sopVersionIDs,
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
      enabled: sopVersionIDs.length > 0,
      keepPreviousData: false,
    }
  );
