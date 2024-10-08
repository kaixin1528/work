import { useQuery, useMutation } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";

const prefix = "cves";

// get a cve's details
export const GetCVEDetail = (cveID: string | (string | null)[] | null) =>
  useQuery<any, unknown, any, (string | boolean | (string | null)[] | null)[]>(
    ["get-cve-details", cveID],
    async ({ signal }) => {
      try {
        const res = await client.get(`/api/${apiVersion}/${prefix}/${cveID}`, {
          signal,
        });
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: cveID !== "",
      keepPreviousData: true,
    }
  );

export const GetEPSSOverTime = (
  env: string,
  cveID: string | (string | null)[] | null
) =>
  useQuery<any, unknown, any, (string | boolean | (string | null)[] | null)[]>(
    ["get-epss-over-time", env, cveID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/epss_over_time?env_id=${env}&cve_id=${cveID}`,
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
      enabled: env !== "" && cveID !== "",
      keepPreviousData: false,
    }
  );

// get a cve's resource usage graph
export const GetCVEUsageGraph = (
  env: string,
  cveID: string | (string | null)[] | null,
  source: string,
  selectedResourceCategory: string,
  pageNumber: number
) =>
  useQuery<any, unknown, any, (string | number | (string | null)[] | null)[]>(
    [
      "get-cve-usage-graph",
      env,
      cveID,
      source,
      selectedResourceCategory,
      pageNumber,
    ],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/usage_graph?env_id=${env}&cve=${cveID}&cloud_provider=${source}`,
          {
            source_nodes_page_number: selectedResourceCategory.includes(
              "source"
            )
              ? pageNumber
              : 1,
            source_nodes_page_size: pageSize,
            qualifying_nodes_page_number: selectedResourceCategory.includes(
              "qualifying"
            )
              ? pageNumber
              : 1,
            qualifying_nodes_page_size: pageSize,
          },
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
      enabled: cveID !== "" && source !== "",
      keepPreviousData: pageNumber !== 1,
    }
  );

// get 3d epss
export const Get3DEPSS = (cveID: string) =>
  useQuery<any, unknown, any, (string | boolean | (string | null)[] | null)[]>(
    ["get-3d-epss", cveID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/3d-epss?cve_id=${cveID}`,
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
      enabled: cveID !== "",
    }
  );

// get cpe info
export const GetCPEInfo = (cpeIDs: string[]) =>
  useQuery<any, unknown, any, (string | boolean | (string | null)[] | null)[]>(
    ["get-cpe-info", cpeIDs],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/cpe`,
          { cpe_ids: cpeIDs },
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
      enabled: cpeIDs?.length > 0,
    }
  );

// get cve url info
export const GetCVEURLInfo = (
  cveID: string | (string | null)[] | null,
  urls: string[]
) =>
  useQuery<any, unknown, any, (string | boolean | (string | null)[] | null)[]>(
    ["get-cve-url-info", cveID, urls],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/url_info?cve_id=${cveID}`,
          { urls: urls },
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
      enabled: cveID !== "" && urls?.length > 0,
    }
  );

// get cve notes
export const GetCVENotes = (env: string, cveID: string, show: boolean) =>
  useQuery<any, unknown, any, (string | boolean)[]>(
    ["get-cve-notes", env, cveID, show],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${cveID}/notes?env_id=${env}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: show && cveID !== "",
      keepPreviousData: false,
    }
  );

// add note in cve
export const AddCVENote = (env: string, cveID: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      note,
      signal,
    }: {
      note: { body: string; tagged_users: string[] };
      signal: AbortSignal;
    }) => {
      try {
        await client.post(
          `/api/${apiVersion}/${prefix}/${cveID}/notes?env_id=${env}`,
          note,
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries(["get-cve-notes", env, cveID]),
    }
  );

// edit existing note in cve
export const EditCVENote = (env: string, cveID: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      nodeID,
      note,
      signal,
    }: {
      nodeID: string;
      note: { body: string; tagged_users: string[] };
      signal: AbortSignal;
    }) => {
      try {
        await client.patch(
          `/api/${apiVersion}/${prefix}/${cveID}/notes/${nodeID}?env_id=${env}`,
          note,
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries(["get-cve-notes", env, cveID]),
    }
  );

// delete note in cve
export const DeleteCVENote = (env: string, cveID: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({ noteID, signal }: { noteID: string; signal: AbortSignal }) => {
      try {
        await client.delete(
          `/api/${apiVersion}/${prefix}/${cveID}/notes/${noteID}?env_id=${env}`,
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries(["get-cve-notes", env, cveID]),
    }
  );
