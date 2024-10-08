import { useQuery, useMutation } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";

const prefix = "observability/graph";

// get actions for a node's context menu
export const GetContextualActions = (
  env: string,
  nodeType: string | (string | null)[] | null,
  id: string | (string | null)[] | null
) =>
  useQuery<any, unknown, any, (string | boolean | (string | null)[] | null)[]>(
    ["get-contextual-actions", env, nodeType, id],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/contextual_actions?env_id=${env}&node_type=${nodeType}&node_id=${id}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "" && nodeType !== "" && id !== "",
      keepPreviousData: true,
    }
  );

// get watchlist
export const GetWatchlist = (env: string) =>
  useQuery<any, unknown, any, (string | boolean | (string | null)[] | null)[]>(
    ["get-watchlist", env],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/watchlist?env_id=${env}`,
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

// add/remove node/edge to watchlist
export const UpdateWatchlist = (env: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      elementType,
      integrationType,
      resourceType,
      elementID,
      action,
      signal,
    }: {
      elementType: string;
      integrationType: string;
      resourceType: string;
      elementID: string;
      action: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/watchlist`,
          {
            graph_artifact_type: elementType,
            graph_artifact_id: elementID,
            integration_type: integrationType,
            resource_type: resourceType,
            action: action,
          },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => queryClient.invalidateQueries(["get-watchlist", env]),
    }
  );
