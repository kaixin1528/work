import { useQuery, useMutation } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";
import { EditNote, Note } from "src/types/investigation";

const prefix = "investigation/note";

// get a list of notes
export const GetNotes = (env: string, evidenceID: string) =>
  useQuery<any, unknown, any, (string | (string | null)[] | null)[]>(
    ["get-notes", env, evidenceID],
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
    { enabled: env !== "" && evidenceID !== "", keepPreviousData: true }
  );

// add a new note for the evidence in the investigation diary
export const AddNote = (env: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({ note, signal }: { note: Note; signal: AbortSignal }) => {
      try {
        await client.post(`/api/${apiVersion}/${prefix}?env_id=${env}`, note, {
          signal,
        });
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-notes"]);
      },
    }
  );

// update an existing note for the evidence in the investigation diary
export const UpdateNote = (env: string, evidenceID: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({ note, signal }: { note: EditNote; signal: AbortSignal }) => {
      try {
        await client.patch(`/api/${apiVersion}/${prefix}?env_id=${env}`, note, {
          signal,
        });
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-notes", env, evidenceID]);
      },
    }
  );

// delete a note from the evidence in the investigation diary
export const DeleteNote = (env: string, evidenceID: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({ noteID, signal }: { noteID: string; signal: AbortSignal }) => {
      try {
        await client.delete(
          `/api/${apiVersion}/${prefix}?env_id=${env}&note_id=${noteID}`,
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-notes", env, evidenceID]);
      },
    }
  );
