import { useMutation, useQuery } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";

export const GetPrivacyAgreements = (customerID: string) =>
  useQuery<any, unknown, any, string[]>(
    ["get-privacy-agreements", customerID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/customers/${customerID}/privacy_agreements`,
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

export const UpdatePrivacyAgreements = (customerID: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({
      questions,
      signal,
    }: {
      questions: string[];
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.patch(
          `/api/${apiVersion}/customers/${customerID}/privacy_agreements`,
          { questions: questions },
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
        queryClient.invalidateQueries(["get-privacy-agreements"]);
      },
    }
  );

export const EditPrivacyReviewQuestion = (customerID: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({
      questionID,
      newQuestion,
      signal,
    }: {
      questionID: string;
      newQuestion: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.patch(
          `/api/${apiVersion}/customers/${customerID}/privacy_agreements/${questionID}`,
          newQuestion,
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
        queryClient.invalidateQueries(["get-privacy-agreements"]);
      },
    }
  );

export const RemovePrivacyReviewQuestion = (customerID: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({
      questionID,
      signal,
    }: {
      questionID: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.delete(
          `/api/${apiVersion}/customers/${customerID}/privacy_agreements/${questionID}`,
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
        queryClient.invalidateQueries(["get-privacy-agreements"]);
      },
    }
  );
