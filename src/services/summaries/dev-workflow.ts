import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";

const prefix = "summaries/dev_workflow/repo_activity";

export const GetDevWorkflowRepos = (env: string, period: number) =>
  useQuery<any, unknown, any, any[]>(
    ["get-dev-workflow-repos", env, period],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}?env_id=${env}&period=${period}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "",
      keepPreviousData: true,
    }
  );

export const GetDevWorkflowWidgets = (
  env: string,
  orgName: string,
  repoName: string,
  startMarker: number,
  endMarker: number
) =>
  useQuery<any, unknown, any, any[]>(
    [
      "get-dev-workflow-widgets",
      env,
      orgName,
      repoName,
      startMarker,
      endMarker,
    ],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${orgName}/${repoName}?env_id=${env}&start_marker=${startMarker}&end_marker=${endMarker}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "" && orgName !== "" && repoName !== "",
      keepPreviousData: true,
    }
  );
