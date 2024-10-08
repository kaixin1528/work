import { useQuery, useMutation } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";
import { KeyStringVal } from "src/types/general";

const prefix = "grc/tprm/questions/question-sets";

export const GetCustomQuestionSets = (pageNumber?: number) =>
  useQuery<any, unknown, any, (string | number | KeyStringVal | undefined)[]>(
    ["get-custom-question-sets", pageNumber],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/all`,
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
    },
    {
      keepPreviousData: false,
    }
  );

export const AddCustomQuestionSet = () =>
  useMutation<any, unknown, any, string>(
    async ({
      name,
      description,
      questionIDs,
      signal,
    }: {
      name: string;
      description: string;
      questionIDs: string[];
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/new`,
          { name: name, description: description, question_ids: questionIDs },
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
        queryClient.invalidateQueries(["get-custom-question-sets"]);
      },
    }
  );

export const GetCustomQuestions = (questionSetID: string, pageNumber: number) =>
  useQuery<any, unknown, any, (string | number | KeyStringVal | undefined)[]>(
    ["get-custom-question-sets", questionSetID, pageNumber],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${questionSetID}/questions/all`,
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
      enabled: questionSetID !== "",
      keepPreviousData: false,
    }
  );

export const RemoveCustomQuestionSet = (questionSetID: string) =>
  useMutation<any, unknown, any, string>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.delete(
          `/api/${apiVersion}/${prefix}/${questionSetID}`,
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
        queryClient.invalidateQueries(["get-custom-question-sets"]);
      },
    }
  );

export const GetVendorGroupsFromQuestionSet = (questionSetID: string) =>
  useQuery<any, unknown, any, (string | undefined)[]>(
    ["get-vendor-groups-from-question-set", questionSetID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${questionSetID}/groups`,
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
      enabled: questionSetID !== "",
      keepPreviousData: false,
    }
  );

export const AddVendorGroupsToQuestionSet = (questionSetID: string) =>
  useMutation<any, unknown, any, string>(
    async ({ groupID, signal }: { groupID: string; signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${questionSetID}/groups/add`,
          [groupID],
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
          "get-vendor-groups-from-question-set",
          questionSetID,
        ]);
        queryClient.invalidateQueries(["get-vendors-groups"]);
      },
    }
  );

export const RemoveVendorGroupsFromQuestionSet = (questionSetID: string) =>
  useMutation<any, unknown, any, string>(
    async ({ groupID, signal }: { groupID: string; signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${questionSetID}/groups/remove`,
          [groupID],
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
          "get-vendor-groups-from-question-set",
          questionSetID,
        ]);
        queryClient.invalidateQueries(["get-vendors-groups"]);
      },
    }
  );
