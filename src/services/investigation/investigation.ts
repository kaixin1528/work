import { useMutation, useQuery } from "react-query";
import { client } from "../../components/General/AxiosInterceptor";
import { apiVersion } from "../../constants/general";
import { Tag } from "../../types/investigation";
import { queryClient } from "src/App";

const prefix = "investigation";

// get a list of investigation diaries
export const GetInvestigations = (env: string) =>
  useQuery<any, unknown, any, (string | boolean | (string | null)[] | null)[]>(
    ["get-investigations", env],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/get-diaries-for-user?env_id=${env}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: env !== "", keepPreviousData: false }
  );

// get a list of tags in the investigation summary page
export const GetAllTags = (env: string) =>
  useQuery<any, unknown, any, (string | (string | null)[] | null)[]>(
    ["get-all-tags", env],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/all-tags?env_id=${env}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: env !== "", keepPreviousData: true }
  );

// create a new tag in the investigation summary page
export const CreateTag = (env: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({ tag, signal }: { tag: Tag; signal: AbortSignal }) => {
      try {
        await client.post(
          `/api/${apiVersion}/${prefix}/tag?env_id=${env}`,
          tag,
          {
            signal,
          }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

// delete a tag in the investigation summary page
export const DeleteTag = (env: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({ tagID, signal }: { tagID: string; signal: AbortSignal }) => {
      try {
        await client.delete(
          `/api/${apiVersion}/${prefix}/tag?env_id=${env}&tag_id=${tagID}`,
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-all-tags"]);
      },
    }
  );

// get a list of diaries, queries, comments, notes
// given a search string
export const FilterDiaries = (
  env: string,
  search: boolean,
  searchString: string
) =>
  useQuery<any, unknown, any, (string | (string | null)[] | null)[]>(
    ["filter-diaries", env, searchString],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/search?env_id=${env}&input=${searchString}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "" && search && searchString !== "",
      keepPreviousData: false,
    }
  );

// navigate to the specified investigation diary
export const GoToDiary = (env: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      evidenceID,
      signal,
    }: {
      evidenceID: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/go-to-diary?env_id=${env}&evidence_id=${evidenceID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: (data) => {
        window.location.assign(
          `/${prefix}/diary/details?diary_id=${data.diary_id}`
        );
      },
    }
  );

// get a list of diaries, queries, comments, notes
// given a search string
export const SendUnorderlyFeedback = (env: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      question,
      queryString,
      queryTitle,
      startTime,
      endTime,
      feedback,
      signal,
    }: {
      question: string;
      queryString: string;
      queryTitle: string;
      startTime: number;
      endTime: number;
      feedback: boolean;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/unorderly-feedback?env_id=${env}`,
          {
            question: question,
            query: queryString,
            query_title: queryTitle,
            query_start_time: startTime,
            query_end_time: endTime,
            feedback: feedback,
          },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );
