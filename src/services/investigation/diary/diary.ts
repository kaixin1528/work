import { useQuery, useMutation } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";
import { NewDiary, EditDiary } from "src/types/investigation";

const prefix = "investigation/diary";

// get a specified investigation diary's info
export const GetInvestigation = (
  env: string,
  diaryID: string | (string | null)[] | null
) =>
  useQuery<any, unknown, any, (string | (string | null)[] | null)[]>(
    ["get-investigation", env, diaryID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}?env_id=${env}&diary_id=${diaryID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: env !== "" && diaryID !== "", keepPreviousData: false }
  );

// create a new investigation diary
export const CreateInvestigation = (env: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      newDiary,
      signal,
    }: {
      newDiary: NewDiary;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}?env_id=${env}`,
          newDiary,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

// update an existing investigation diary's info
export const UpdateInvestigation = (env: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      editDiary,
      signal,
    }: {
      editDiary: EditDiary;
      signal: AbortSignal;
    }) => {
      try {
        await client.patch(
          `/api/${apiVersion}/${prefix}?env_id=${env}`,
          editDiary,
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-investigation"]);
      },
    }
  );

// delete an investigation diary
export const DeleteInvestigation = (env: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({ diaryID, signal }: { diaryID: string; signal: AbortSignal }) => {
      try {
        await client.delete(
          `/api/${apiVersion}/${prefix}?env_id=${env}&diary_id=${diaryID}`,
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-investigations"]);
        window.location.assign("/investigation/summary");
      },
    }
  );
