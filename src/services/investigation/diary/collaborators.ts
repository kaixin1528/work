import { useQuery, useMutation } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";
import { Collaborators } from "src/types/investigation";

const prefix = "investigation";

// get a list of collaborators in the investigation diary
export const GetCollaborators = (
  env: string,
  diaryID: string | (string | null)[] | null
) =>
  useQuery<any, unknown, any, (string | (string | null)[] | null)[]>(
    ["get-collaborators", env, diaryID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/collaborations?env_id=${env}&diary_id=${diaryID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: env !== "", keepPreviousData: true }
  );

// add a specified user to the list of collaborators in the investigation diary
export const AddCollaborators = (env: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({ body, signal }: { body: Collaborators; signal: AbortSignal }) => {
      try {
        await client.post(
          `/api/${apiVersion}/${prefix}/add-collaborators?env_id=${env}`,
          body,
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-collaborators"]);
      },
    }
  );
