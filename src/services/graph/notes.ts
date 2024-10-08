import { useQuery, useMutation } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";

const prefix = "observability/graph/comments";

// get the list of notes for an element
export const GetElementNotes = (
  env: string,
  integrationType: string,
  elementID: string | (string | null)[] | null
) =>
  useQuery<any, unknown, any, (string | boolean | (string | null)[] | null)[]>(
    ["get-element-notes", env, integrationType, elementID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}?env_id=${env}&integration_type=${integrationType}&graph_element_id=${elementID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "" && integrationType !== "" && elementID !== "",
      keepPreviousData: true,
    }
  );

// add a note to an element
export const AddElementNote = (
  env: string,
  integrationType: string,
  elementID: string | (string | null)[] | null
) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      note,
      signal,
    }: {
      note: { new_comment: { body: string }; tagged_users: string[] };
      signal: AbortSignal;
    }) => {
      try {
        await client.post(
          `/api/${apiVersion}/${prefix}?env_id=${env}&integration_type=${integrationType}&graph_element_id=${elementID}`,
          note,
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries([
          "get-element-notes",
          env,
          integrationType,
          elementID,
        ]),
    }
  );

// edit an existing note for an element
export const EditElementNote = (
  env: string,
  integrationType: string,
  elementID: string | (string | null)[] | null
) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      noteID,
      editNote,
      signal,
    }: {
      noteID: string | (string | null)[] | null;
      editNote: { updated_comment: { body: string }; references: string[] };
      signal: AbortSignal;
    }) => {
      try {
        await client.put(
          `/api/${apiVersion}/${prefix}?env_id=${env}&comment_id=${noteID}`,
          editNote,
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries([
          "get-element-notes",
          env,
          integrationType,
          elementID,
        ]),
    }
  );

// delete a note from the list of notes for an element
export const DeleteElementNote = (
  env: string,
  integrationType: string,
  elementID: string | (string | null)[] | null
) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      noteID,
      signal,
    }: {
      noteID: string | (string | null)[] | null;
      signal: AbortSignal;
    }) => {
      try {
        await client.delete(
          `/api/${apiVersion}/${prefix}?env_id=${env}&comment_id=${noteID}`,
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries([
          "get-element-notes",
          env,
          integrationType,
          elementID,
        ]),
    }
  );
