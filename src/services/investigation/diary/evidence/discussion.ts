import { useQuery, useMutation } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";
import { EditComment } from "src/types/investigation";

const prefix = "investigation/comment";

// get a list of comments for the evidence in the investigation diary
export const GetEvidenceComments = (env: string, evidenceID: string) =>
  useQuery<any, unknown, any, (string | (string | null)[] | null)[]>(
    ["get-evidence-comments", env, evidenceID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}s?env_id=${env}&evidence_id=${evidenceID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: env !== "", keepPreviousData: true }
  );

// add a new comment to the evidence in the investigation diary
export const AddEvidenceComment = (env: string, evidenceID: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({ comment, signal }: { comment: Comment; signal: AbortSignal }) => {
      try {
        await client.post(
          `/api/${apiVersion}/${prefix}?env_id=${env}`,
          comment,
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "get-evidence-comments",
          env,
          evidenceID,
        ]);
      },
    }
  );

// edit an existing comment for the evidence in the investigation diary
export const EditEvidenceComment = (env: string, evidenceID: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      comment,
      signal,
    }: {
      comment: EditComment;
      signal: AbortSignal;
    }) => {
      try {
        await client.patch(
          `/api/${apiVersion}/${prefix}?env_id=${env}`,
          comment,
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "get-evidence-comments",
          env,
          evidenceID,
        ]);
      },
    }
  );

// delete a comment from the evidence in the investigation diary
export const DeleteEvidenceComment = (env: string, evidenceID: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      commentID,
      signal,
    }: {
      commentID: string;
      signal: AbortSignal;
    }) => {
      try {
        await client.delete(
          `/api/${apiVersion}/${prefix}?env_id=${env}&comment_id=${commentID}`,
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "get-evidence-comments",
          env,
          evidenceID,
        ]);
      },
    }
  );
