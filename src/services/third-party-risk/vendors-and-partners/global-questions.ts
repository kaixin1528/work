import { useQuery, useMutation } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";
import { KeyStringVal } from "src/types/general";

const prefix = "grc/tprm/questions/global";

export const GetGlobalQuestions = (pageNumber: number) =>
  useQuery<any, unknown, any, (string | number | KeyStringVal | undefined)[]>(
    ["get-global-questions", pageNumber],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/questions`,
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

export const AddGlobalQuestion = () =>
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
          `/api/${apiVersion}/${prefix}/new`,
          { question, response },
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
        queryClient.invalidateQueries(["get-global-questions"]);
      },
    }
  );

export const AddGlobalQuestionSet = () =>
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
          `/api/${apiVersion}/${prefix}/new/from-file`,
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
        queryClient.invalidateQueries(["get-global-questions"]);
      },
    }
  );

export const EditGlobalQuestion = (questionID: string) =>
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
        const res = await client.patch(
          `/api/${apiVersion}/${prefix}/${questionID}`,
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
        queryClient.invalidateQueries(["get-global-questions"]);
      },
    }
  );

export const RemoveGlobalQuestion = (questionID: string) =>
  useMutation<any, unknown, any, string>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.delete(
          `/api/${apiVersion}/${prefix}/${questionID}`,
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
        queryClient.invalidateQueries(["get-global-questions"]);
      },
    }
  );
