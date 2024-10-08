import { useQuery, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";

const prefix = `grc/audits/internal`;

export const GetAuditList = (pageNumber: number) =>
  useQuery<any, unknown, any, (string | number | string[])[]>(
    ["get-audit-list", pageNumber],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}`,
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
    {
      keepPreviousData: false,
    }
  );

export const AddAudit = () =>
  useMutation<any, unknown, any, string>(
    async ({
      name,
      framework_id,
      signal,
    }: {
      name: string;
      framework_id: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/new`,
          {
            name: name,
            framework_id: framework_id,
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
        queryClient.invalidateQueries(["get-audit-list"]);
      },
    }
  );

export const RemoveAudit = () => {
  const navigate = useNavigate();

  return useMutation<any, unknown, any, string>(
    async ({ auditID, signal }: { auditID: string; signal: AbortSignal }) => {
      try {
        const res = await client.delete(
          `/api/${apiVersion}/${prefix}/${auditID}`,
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
        queryClient.invalidateQueries(["get-audit-list"]);
        navigate("/audits-assessments/summary");
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
          `/api/${apiVersion}/grc/internal_audit/${auditID}/status`,
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

export const GetAuditMetadata = (auditID: string) =>
  useQuery<any, unknown, any, (string | undefined)[]>(
    ["get-audit-metadata", auditID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${auditID}`,
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

export const GetInternalAuditSections = (
  auditStatus: string,
  auditID: string,
  selectedTab: string,
  pageNumber: number
) =>
  useQuery<any, unknown, any, (string | number | string[])[]>(
    ["get-internal-audit-sections", auditStatus, selectedTab, pageNumber],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${auditID}/${selectedTab}?inline=true`,
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
    {
      keepPreviousData: false,
      enabled: auditStatus === "ready" && auditID !== "",
    }
  );

export const GetControlEvidence = (
  auditID: string,
  controlID: string,
  show: boolean
) =>
  useQuery<any, unknown, any, (string | undefined)[]>(
    ["get-control-evidence", auditID, controlID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${auditID}/controls/${controlID}/evidence`,
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
      enabled: auditID !== "" && controlID !== "" && show,
      keepPreviousData: false,
    }
  );

export const AddControlEvidence = (auditID: string, controlID: string) =>
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
          `/api/${apiVersion}/${prefix}/${auditID}/controls/${controlID}/evidence`,
          formData,
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
        queryClient.invalidateQueries([
          "get-control-evidence",
          auditID,
          controlID,
        ]);
      },
    }
  );

export const DeleteControlEvidence = (auditID: string, controlID: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      evidenceID,
      signal,
    }: {
      evidenceID: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.delete(
          `/api/${apiVersion}/${prefix}/${auditID}/controls/${controlID}/evidence/${evidenceID}`,
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
        queryClient.invalidateQueries([
          "get-control-evidence",
          auditID,
          controlID,
        ]);
      },
    }
  );

export const CloseInternalAudit = (auditID: string) =>
  useMutation<any, unknown, any, string>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${auditID}/close`,
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
        queryClient.invalidateQueries(["get-audit-metadata", auditID]);
      },
    }
  );

export const ExportInternalAudit = (auditID: string) =>
  useMutation<any, unknown, any, string>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/audits/internal/${auditID}/export`,
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
          "get-export-internal-audit-status",
          auditID,
        ]);
      },
    }
  );

export const GetExportInternalAuditStatus = (auditID: string) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-export-internal-audit-status", auditID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/grc/audits/internal/${auditID}/export/status`,
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
      refetchInterval: 30000,
    }
  );

export const DownloadInternalAudit = (auditID: string) =>
  useMutation<any, unknown, any, string>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/grc/audits/internal/${auditID}/export`,
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
          "get-export-internal-audit-status",
          auditID,
        ]);
      },
    }
  );
