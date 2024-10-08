import { useQuery, useMutation } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";
import { KeyStringVal } from "src/types/general";

const prefix = "grc/tprm/third-parties";

export const GetVendorsAndPartners = () =>
  useQuery<any, unknown, any, (string | number | KeyStringVal | undefined)[]>(
    ["get-vendors-and-partners"],
    async ({ signal }) => {
      try {
        const res = await client.get(`/api/${apiVersion}/${prefix}`, {
          signal,
        });
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      keepPreviousData: false,
    }
  );

export const AddVendor = () =>
  useMutation<any, unknown, any, string>(
    async ({
      name,
      risk_profile,
      address,
      contact,
      signal,
    }: {
      name: string;
      risk_profile: string;
      address: string;
      contact: KeyStringVal;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}`,
          {
            name,
            risk_profile,
            address,
            contact,
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
        queryClient.invalidateQueries(["get-vendors-and-partners"]);
      },
    }
  );

export const EditVendor = (vendorID: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      name,
      risk_profile,
      address,
      contact,
      last_updated,
      number_of_assessments,
      analyst,
      signal,
    }: {
      name: string;
      risk_profile: string;
      address: string;
      contact: KeyStringVal;
      last_updated: number;
      number_of_assessments: number;
      analyst: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.patch(
          `/api/${apiVersion}/${prefix}/${vendorID}`,
          {
            name,
            risk_profile,
            address,
            contact,
            last_updated,
            number_of_assessments,
            analyst,
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
        queryClient.invalidateQueries(["get-vendors-and-partners"]);
      },
    }
  );

export const GetVendorMetadata = (vendorID: string) =>
  useQuery<any, unknown, any, (string | undefined)[]>(
    ["get-vendor-metadata", vendorID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${vendorID}`,
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
      enabled: vendorID !== "",
      keepPreviousData: false,
    }
  );

export const SearchVendor = () =>
  useMutation<any, unknown, any, string[]>(
    async ({ vendor, signal }: { vendor: string; signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/searches`,
          {
            third_party_name: vendor,
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

export const GetVendorAssessments = (
  vendorID: string,
  order: KeyStringVal,
  pageNumber: number,
  category?: string
) =>
  useQuery<any, unknown, any, (string | number | KeyStringVal | undefined)[]>(
    ["get-vendor-assessments", order, pageNumber, category],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/tprm/assessments`,
          {
            third_party_id: vendorID,
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
      enabled: vendorID !== "",
      keepPreviousData: false,
    }
  );

export const SubmitVendorResponses = (vendorID: string) =>
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
          `/api/${apiVersion}/${prefix}/${vendorID}/responses`,
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
        queryClient.invalidateQueries(["get-vendor-metadata"]);
      },
    }
  );

export const GetVendorResponses = (vendorID: string, pageNumber: number) =>
  useQuery<any, unknown, any, (string | number | KeyStringVal | undefined)[]>(
    ["get-vendor-responses", pageNumber],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${vendorID}/responses/all`,
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
      enabled: vendorID !== "",
      keepPreviousData: false,
    }
  );

export const AddVendorResponse = (vendorID: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      question,
      response,
      signal,
    }: {
      question: string;
      response: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${vendorID}/responses/new`,
          { question, response },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-vendor-responses"]);
      },
    }
  );

export const EditVendorResponse = (vendorID: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      questionID,
      question,
      response,
      signal,
    }: {
      questionID: string;
      question: string;
      response: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.patch(
          `/api/${apiVersion}/${prefix}/${vendorID}/responses/${questionID}`,
          { question, response },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-vendor-responses"]);
      },
    }
  );

export const RemoveVendorResponse = (vendorID: string, questionID: string) =>
  useMutation<any, unknown, any, string>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.delete(
          `/api/${apiVersion}/${prefix}/${vendorID}/responses/${questionID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-vendor-responses"]);
      },
    }
  );

export const TriggerResponseMappings = (vendorID: string) =>
  useMutation<any, unknown, any, string>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${vendorID}/responses/trigger-mappings`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-response-mappings"]);
      },
    }
  );

export const GetResponseMappings = (vendorID: string, pageNumber: number) =>
  useQuery<any, unknown, any, (string | number | KeyStringVal | undefined)[]>(
    ["get-response-mappings", pageNumber],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${vendorID}/responses/mappings`,
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
      enabled: vendorID !== "",
      keepPreviousData: false,
    }
  );
