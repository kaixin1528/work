import { useQuery, useMutation } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";
import { KeyStringVal } from "src/types/general";

const prefix = "grc/tprm/third-parties/groups";

export const GetVendorGroups = (pageNumber: number) =>
  useQuery<any, unknown, any, (string | number | KeyStringVal | undefined)[]>(
    ["get-vendors-groups", pageNumber],
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
    {
      keepPreviousData: false,
    }
  );

export const AddVendorGroup = () =>
  useMutation<any, unknown, any, string>(
    async ({
      name,
      description,
      signal,
    }: {
      name: string;
      description: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/new`,
          { name: name, description: description },
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
        queryClient.invalidateQueries(["get-vendors-groups"]);
      },
    }
  );

export const EditVendorGroup = (groupID: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      name,
      description,
      signal,
    }: {
      name: string;
      description: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.patch(
          `/api/${apiVersion}/${prefix}/${groupID}`,
          {
            name: name,
            description: description,
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
        queryClient.invalidateQueries(["get-vendors-groups"]);
      },
    }
  );

export const RemoveVendorGroup = (groupID: string) =>
  useMutation<any, unknown, any, string>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.delete(
          `/api/${apiVersion}/${prefix}/${groupID}`,
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
        queryClient.invalidateQueries(["get-vendors-groups"]);
      },
    }
  );

export const GetVendorGroupMetadata = (groupID: string) =>
  useQuery<any, unknown, any, (string | undefined)[]>(
    ["get-vendor-group-metadata", groupID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${groupID}`,
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
      enabled: groupID !== "",
      keepPreviousData: false,
    }
  );

export const GetVendorsFromGroup = (groupID: string) =>
  useQuery<any, unknown, any, (string | undefined)[]>(
    ["get-vendors-from-group", groupID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${groupID}/members`,
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
      enabled: groupID !== "",
      keepPreviousData: false,
    }
  );

export const AddVendorToGroup = () =>
  useMutation<any, unknown, any, string>(
    async ({
      groupID,
      vendor,
      signal,
    }: {
      groupID: string;
      vendor: string[];
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${groupID}/members/add`,
          vendor,
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
        queryClient.invalidateQueries(["get-vendors-from-group"]);
        queryClient.invalidateQueries(["get-vendors-and-partners"]);
        queryClient.invalidateQueries(["get-vendor-metadata"]);
      },
    }
  );

export const RemoveVendorFromGroup = () =>
  useMutation<any, unknown, any, string>(
    async ({
      groupID,
      vendor,
      signal,
    }: {
      groupID: string;
      vendor: string[];
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${groupID}/members/remove`,
          vendor,
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
        queryClient.invalidateQueries(["get-vendors-from-group"]);
        queryClient.invalidateQueries(["get-vendors-and-partners"]);
        queryClient.invalidateQueries(["get-vendor-metadata"]);
      },
    }
  );

export const GetQuestionSetsFromGroup = (groupID: string) =>
  useQuery<any, unknown, any, (string | undefined)[]>(
    ["get-question-sets-from-group", groupID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${groupID}/question-sets`,
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
      enabled: groupID !== "",
      keepPreviousData: false,
    }
  );

export const AddQuestionSetToVendorGroup = (vendorGroupID: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      questionSetID,
      signal,
    }: {
      questionSetID: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${vendorGroupID}/question-sets/add`,
          [questionSetID],
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
          "get-question-sets-from-group",
          vendorGroupID,
        ]);
      },
    }
  );

export const RemoveQuestionSetFromVendorGroup = (vendorGroupID: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      questionSetID,
      signal,
    }: {
      questionSetID: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${vendorGroupID}/question-sets/remove`,
          [questionSetID],
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
          "get-question-sets-from-group",
          vendorGroupID,
        ]);
      },
    }
  );
