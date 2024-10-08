import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";

const prefix = "observability/infra/cpm_graph";

// get container port mapping preview widget
export const GetCPMPreview = (
  env: string,
  cloud: string | (string | null)[] | null,
  topNServices: number,
  selectedTab: string
) =>
  useQuery<
    any,
    unknown,
    any,
    (string | number | boolean | (string | null)[] | null)[]
  >(
    ["get-cpm-preview", env, cloud, topNServices, selectedTab],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/observability/cpm_dashboard?env_id=${env}&cloud_provider=${cloud}&top_most_used_services=${topNServices}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "" && selectedTab === "cpm",
      keepPreviousData: false,
    }
  );

// get effective networking service list
export const GetCPMServiceList = (
  env: string,
  cloud: string | (string | null)[] | null,
  timestamp: number,
  pageNumber: number
) =>
  useQuery<
    any,
    unknown,
    any,
    (string | number | boolean | (string | null)[] | null)[]
  >(
    ["get-cpm-service-list", env, cloud, timestamp, pageNumber],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/list_services?env_id=${env}&cloud_provider=${cloud}&page_number=${pageNumber}&page_size=${pageSize}&timestamp=${timestamp}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "" && timestamp !== 0,
      keepPreviousData: false,
    }
  );

// get effective networking graph
export const GetCPMGraph = (
  env: string,
  cloud: string | (string | null)[] | null,
  timestamp: number,
  serviceName: string
) =>
  useQuery<any, unknown, any, (string | number | (string | null)[] | null)[]>(
    ["get-cpm-graph", env, cloud, timestamp, serviceName],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/graph?env_id=${env}&cloud_provider=${cloud}&svc_name=${serviceName}&timestamp=${timestamp}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "" && timestamp !== 0 && serviceName !== "",
      keepPreviousData: false,
    }
  );

// get an eng node/edge's info
export const GetCPMElementInfo = (
  env: string,
  integrationType: string,
  elementID: string | null,
  elementType: string | null,
  nodeType: string,
  curSnapshotTime: number
) =>
  useQuery<any, unknown, any, (string | (string | null)[] | null)[]>(
    [
      "get-cpm-element-info",
      env,
      integrationType,
      elementID,
      elementType,
      nodeType,
    ],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/info?env_id=${env}&cloud_provider=${integrationType}&record_time=${curSnapshotTime}&graph_element_id=${elementID}&element_type=${elementType}${
            nodeType !== "" ? `&node_class=${nodeType}` : ""
          }`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled:
        env !== "" &&
        integrationType !== "" &&
        elementID !== "" &&
        elementType !== "" &&
        curSnapshotTime !== 0,
      keepPreviousData: false,
    }
  );
