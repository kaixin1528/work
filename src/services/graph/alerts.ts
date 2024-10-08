import { useMutation, useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";
import { Filter } from "src/types/general";

const prefix = "observability/graph/alerts";

export const GetDBEvents = (
  env: string,
  integrationType: string | undefined,
  elementID: string | (string | null)[] | null,
  body: {
    filters: Filter[];
    pager: { page_number: number; page_size: number };
  }
) =>
  useQuery<any>(
    ["get-db-events", env, integrationType, elementID, body],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/observability/graph/db/events?env_id=${env}&cloud_provider=${integrationType}&node_id=${elementID}`,
          body,
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

// get the list of alerts for a node
export const GetNodeAlerts = (
  env: string,
  integrationType: string | undefined,
  elementID: string | (string | null)[] | null,
  body: {
    filters: Filter[];
    pager: { page_number: number; page_size: number };
  }
) =>
  useQuery<
    any,
    unknown,
    any,
    (
      | string
      | boolean
      | {
          filters: Filter[];
          pager: {
            page_number: number;
            page_size: number;
          };
        }
      | (string | null)[]
      | null
      | undefined
    )[]
  >(
    ["get-node-alerts", env, integrationType, elementID, body],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}?env_id=${env}&cloud_provider=${integrationType}&node_id=${elementID}`,
          body,
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

// get alert analysis
export const GetAlertAnalysis = (
  env: string,
  elementID: string,
  alertClusterID: string,
  snapshotTime: number,
  showDetails: boolean
) =>
  useQuery<any, unknown, any, string[]>(
    ["get-alert-analysis", env, elementID, alertClusterID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${elementID}/${alertClusterID}?env_id=${env}${
            snapshotTime !== 0 ? `&snapshot_time=${snapshotTime}` : ""
          }`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: elementID !== "" && alertClusterID !== "" && showDetails,
      keepPreviousData: false,
    }
  );

// get alert analysis notes
export const GetAlertAnalysisNotes = (env: string, alertAnalysisID: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/analysis/${alertAnalysisID}/notes?env_id=${env}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

// add note in the alert analysis
export const AddAlertAnalysisNote = (env: string, alertAnalysisID: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      note,
      signal,
    }: {
      note: { content: string };
      signal: AbortSignal;
    }) => {
      try {
        await client.post(
          `/api/${apiVersion}/${prefix}/analysis/${alertAnalysisID}/notes?env_id=${env}`,
          note,
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

// edit existing note in the alert analysis
export const EditAlertAnalysisNote = (env: string, alertAnalysisID: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      nodeID,
      note,
      signal,
    }: {
      nodeID: string;
      note: { content: string };
      signal: AbortSignal;
    }) => {
      try {
        await client.patch(
          `/api/${apiVersion}/${prefix}/analysis/${alertAnalysisID}/notes/${nodeID}?env_id=${env}`,
          note,
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

// delete note in the alert analysis
export const DeleteAlertAnalysisNote = (env: string, alertAnalysisID: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({ noteID, signal }: { noteID: string; signal: AbortSignal }) => {
      try {
        await client.delete(
          `/api/${apiVersion}/${prefix}/analysis/${alertAnalysisID}/notes/${noteID}?env_id=${env}`,
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

// share alert analysis with someone
export const ShareAlertAnalysis = (env: string, alertAnalysisID: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      recipientUserID,
      signal,
    }: {
      recipientUserID: string;
      signal: AbortSignal;
    }) => {
      try {
        await client.post(
          `/api/${apiVersion}/${prefix}/analysis/${alertAnalysisID}?env_id=${env}`,
          {
            action: "SHARE",
            recipient_user_id: recipientUserID,
          },
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );
