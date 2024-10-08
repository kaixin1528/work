import { useQuery, useMutation } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";
import { DiaryTag } from "src/types/investigation";

const prefix = "investigation";

// get a list of tags added to the investigation diary
export const GetDiaryTags = (
  env: string,
  diaryID: string | (string | null)[] | null
) =>
  useQuery<any, unknown, any, (string | (string | null)[] | null)[]>(
    ["get-diary-tags", env, diaryID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/all-tags-for-diary?env_id=${env}&diary_id=${diaryID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: env !== "", keepPreviousData: true }
  );

// add a tag to the investigation diary
export const AddDiaryTag = (env: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({ tag, signal }: { tag: DiaryTag; signal: AbortSignal }) => {
      try {
        await client.post(
          `/api/${apiVersion}/${prefix}/add-tag-to-diary?env_id=${env}`,
          tag,
          {
            signal,
          }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => queryClient.invalidateQueries(["get-diary-tags"]),
    }
  );

// delete a diary from the investigation diary
export const RemoveDiaryTag = (
  env: string,
  diaryID: string | (string | null)[] | null
) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({ tagID, signal }: { tagID: string; signal: AbortSignal }) => {
      try {
        await client.delete(
          `/api/${apiVersion}/${prefix}/remove-tag-from-diary?env_id=${env}&diary_id=${diaryID}&tag_id=${tagID}`,
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-diary-tags"]);
      },
    }
  );
