import { useMutation, useQuery } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";

const prefix = "grc/third_party_review/privacy/dpas";

export const GetDPAList = (pageNumber: number) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-dpa-list", pageNumber],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/all`,
          { page_size: pageSize, page_number: pageNumber },
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

export const UploadDPA = () =>
  useMutation<any, unknown, any, string[]>(
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
        queryClient.invalidateQueries(["get-dpa-list"]);
      },
    }
  );

export const RemoveDPA = () =>
  useMutation<any, unknown, any, string[]>(
    async ({ dpaID, signal }: { dpaID: string; signal: AbortSignal }) => {
      try {
        const res = await client.delete(
          `/api/${apiVersion}/${prefix}/${dpaID}`,
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
        queryClient.invalidateQueries(["get-dpa-list"]);
      },
    }
  );

export const GetDPASections = (dpaID: string, pageNumber: number) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-dpa-sections", dpaID, pageNumber],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${dpaID}/sections`,
          { page_size: pageSize, page_number: pageNumber },
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: dpaID !== "", keepPreviousData: false }
  );
