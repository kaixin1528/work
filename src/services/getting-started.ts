import { useMutation, useQuery } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";

const prefix = "getting-started";

// get important alerts
export const GetImportantAlerts = (env: string, limit: number) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-important-alerts", env, limit],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/top-alerts?env_id=${env}&limit=${limit}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "",
      keepPreviousData: false,
    }
  );

// get key investigations
export const GetKeyInvestigations = (env: string, limit: number) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-important-diaries", env, limit],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/top-diaries?env_id=${env}&limit=${limit}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "",
      keepPreviousData: false,
    }
  );

// get important changes
export const GetImportantChanges = (env: string, limit: number) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-important-changes", env, limit],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/top-changes?env_id=${env}&limit=${limit}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "",
      keepPreviousData: false,
    }
  );

// add task to list of to-dos
export const AddTask = (env: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({
      userEmails,
      taskType,
      taskTitle,
      taskMetadata,
      signal,
    }: {
      userEmails: string[];
      taskType: string;
      taskTitle: string;
      taskMetadata: any;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/add-task?env_id=${env}`,
          {
            user_emails: userEmails,
            task_type: taskType,
            task_title: taskTitle,
            task_status: "OPEN",
            task_metadata: taskMetadata,
          },
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

// get tasks
export const GetTasks = (env: string, limit: number) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-tasks", env, limit],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/tasks?env_id=${env}&limit=${limit}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "",
      keepPreviousData: false,
    }
  );

// mark task as done
export const ArchiveTask = (env: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({ taskID, signal }: { taskID: string; signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/archive-task?env_id=${env}&task_id=${taskID}`,
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
      onSuccess: () => queryClient.invalidateQueries(["get-tasks"]),
    }
  );

// get key summary findings
export const GetKeySummaryFindings = (env: string, limit: number) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-key-summary-findings", env, limit],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/top-summary-findings?env_id=${env}&limit=${limit}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "",
      keepPreviousData: false,
    }
  );

// get key summary findings
export const GetContrafactuals = (env: string, limit: number) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-contrafactuals", env, limit],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/contrafactuals?env_id=${env}&limit=${limit}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "",
      keepPreviousData: false,
    }
  );

// get chat response
export const GetChatResponse = (env: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({
      queryString,
      signal,
    }: {
      queryString: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/get-answer?env_id=${env}`,
          {
            question: queryString,
          },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );
