import { useQuery, useMutation } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";
import { KeyStringVal } from "src/types/general";

const prefix = "grc/enforcement_actions";

export const GetEnforcementActionsList = (pageNumber: number) =>
  useQuery<any, unknown, any, (string | number | KeyStringVal)[]>(
    ["get-enforcement-actions-list", pageNumber],
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

export const GetEnforcementActionsMetadata = (enforcementActionID: string) =>
  useQuery<any, unknown, any, (string | undefined)[]>(
    ["get-enforcement-actions-metadata", enforcementActionID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${enforcementActionID}`,
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
      enabled: enforcementActionID !== "",
      keepPreviousData: false,
    }
  );

export const GetSections = (enforcementActionID: string, pageNumber: number) =>
  useQuery<any, unknown, any, (string | number | string[])[]>(
    ["get-enforcement-actions-sections", enforcementActionID, pageNumber],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${enforcementActionID}/sections`,
          {
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
      enabled: enforcementActionID !== "",
    }
  );

export const ExportMappings = (enforcementActionID: string, mapping: boolean) =>
  useMutation<any, unknown, any, string>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${enforcementActionID}/export?mapping=${mapping}`,
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
          "get-enforcement-actions-export-mappings-status",
          enforcementActionID,
        ]);
      },
    }
  );

export const GetExportMappingStatus = (
  enforcementActionID: string,
  mapping: boolean
) =>
  useQuery<any, unknown, any, (string | boolean)[]>(
    [
      "get-enforcement-actions-export-mappings-status",
      enforcementActionID,
      mapping,
    ],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${enforcementActionID}/export/status?mapping=${mapping}`,
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
      enabled: enforcementActionID !== "",
      keepPreviousData: false,
      refetchInterval: 30000,
    }
  );

export const DownloadMappings = (
  enforcementActionID: string,
  mapping: boolean
) =>
  useMutation<any, unknown, any, string>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${enforcementActionID}/export?mapping=${mapping}`,
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
          "get-enforcement-actions-export-mappings-status",
          enforcementActionID,
        ]);
      },
    }
  );
