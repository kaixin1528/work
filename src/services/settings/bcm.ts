import { useMutation, useQuery } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";
import { KeyStringVal } from "src/types/general";

const prefix = "bcm_sop_settings";

export const GetBCMSettings = (customerID: string) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-bcm-settings", customerID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/customers/${customerID}/${prefix}`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { keepPreviousData: false }
  );

export const SaveBCMSettings = (customerID: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({
      rowFilters,
      sectionsToExport,
      biaMatchingColumns,
      signal,
    }: {
      rowFilters: KeyStringVal[];
      sectionsToExport: number;
      biaMatchingColumns: string[];
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.patch(
          `/api/${apiVersion}/customers/${customerID}/${prefix}`,
          {
            row_filter: rowFilters,
            section_to_export: sectionsToExport,
            bia_matching_columns: biaMatchingColumns,
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
        queryClient.invalidateQueries(["get-bcm-settings", customerID]);
      },
    }
  );
