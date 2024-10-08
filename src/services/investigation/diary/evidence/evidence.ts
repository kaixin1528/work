import { useQuery, useMutation } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";
import { UpdateEvidence } from "src/types/investigation";
import { decodeJWT } from "src/utils/general";

const prefix = "investigation";

// auto generate a title given a search query string
export const AutoGenerateTitle = (env: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      queryType,
      searchString,
      signal,
    }: {
      queryType: string;
      searchString: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/generate-title-for-query?env_id=${env}&query_type=${queryType}&query_string=${searchString}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

// add as evidence to the investigation diary
export const AddAsEvidence = (env: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({ body, signal }: { body: any; signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/save-evidence?env_id=${env}`,
          body,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

// get a list of evidence for a specified investigation diary
export const GetAllDiaryEvidence = (
  env: string,
  diaryID: string | (string | null)[] | null
) =>
  useQuery<any, unknown, any, (string | (string | null)[] | null)[]>(
    ["get-all-diary-evidence", env, diaryID],
    async ({ signal }) => {
      const jwt = decodeJWT();
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/all-evidence?env_id=${env}&diary_id=${diaryID}&author_email=${jwt?.name}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "" && diaryID !== "",
      keepPreviousData: true,
    }
  );

// edit an existing evidence in the investigation diary
export const EditDiaryEvidence = (env: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      editEvidence,
      signal,
    }: {
      editEvidence: UpdateEvidence;
      signal: AbortSignal;
    }) => {
      try {
        await client.patch(
          `/api/${apiVersion}/${prefix}/evidence?env_id=${env}`,
          editEvidence,
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-all-diary-evidence"]);
      },
    }
  );

// edit a list of queries' timestamps in the investigation diary
export const EditDiaryEvidenceTimes = (
  env: string,
  diaryID: string | (string | null)[] | null
) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      evidenceIDs,
      startTime,
      endTime,
      signal,
    }: {
      evidenceIDs: string[];
      startTime: number;
      endTime: number;
      signal: AbortSignal;
    }) => {
      try {
        await client.patch(
          `/api/${apiVersion}/${prefix}/evidence-times?env_id=${env}&diary_id=${diaryID}`,
          {
            evidence_ids: evidenceIDs,
            start_time: startTime,
            end_time: endTime,
          },
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-all-diary-evidence", env, diaryID]);
      },
    }
  );

// delete the evidence from the investigation diary
export const DeleteDiaryEvidence = (env: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      evidenceID,
      evidenceType,
      signal,
    }: {
      evidenceID: string;
      evidenceType: string;
      signal: AbortSignal;
    }) => {
      try {
        await client.delete(
          `/api/${apiVersion}/${prefix}/evidence?env_id=${env}&evidence_id=${evidenceID}&evidence_type=${evidenceType}`,
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-all-diary-evidence"]);
      },
    }
  );

// checks evidence note flag as read
export const ReadEvidenceNote = (env: string, evidenceID: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const jwt = decodeJWT();

        await client.post(
          `/api/${apiVersion}/${prefix}/read-note?env_id=${env}`,
          {
            evidence_id: evidenceID,
            author_email: jwt?.name,
          },
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries([
          "get-all-diary-evidence",
          env,
          evidenceID,
        ]),
    }
  );

// checks evidence comment flag as read
export const ReadEvidenceComment = (env: string, evidenceID: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const jwt = decodeJWT();

        await client.post(
          `/api/${apiVersion}/${prefix}/read-comment?env_id=${env}`,
          {
            evidence_id: evidenceID,
            author_email: jwt?.name,
          },
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries([
          "get-all-diary-evidence",
          env,
          evidenceID,
        ]),
    }
  );

// get a list of auto generated tags for an evidence
export const GetAutoGeneratedTags = (env: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      diaryID,
      evidenceID,
      evidenceType,
      signal,
    }: {
      diaryID: string;
      evidenceID: string;
      evidenceType: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/get-auto-generated-tags?env_id=${env}&diary_id=${diaryID}&evidence_id=${evidenceID}&evidence_type=${evidenceType}`,

          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );
