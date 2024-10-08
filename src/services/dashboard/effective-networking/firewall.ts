import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";

const prefix = "observability/infra/firewall";

// get the firewall preview widget
export const GetFirewallPreview = (
  env: string,
  cloud: string,
  selectedTab: string
) =>
  useQuery<any, unknown, any, (string | (string | null)[] | null)[]>(
    ["get-firewall-preview", env, cloud, selectedTab],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/observability/firewall_dashboard?env_id=${env}&cloud_provider=${cloud}&most_recent_used_count=3&most_recent_created_count=1&most_recent_bound_count=1`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "" && selectedTab === "firewall",
      keepPreviousData: true,
    }
  );

// get the list of firewall nodes and edges
export const GetFirewallGraph = (
  env: string,
  cloud: string | (string | null)[] | null,
  timestamp: number
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-firewall-graph", env, cloud, timestamp],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/graph?env_id=${env}&cloud_provider=${cloud}&timestamp=${timestamp}`,
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
      enabled: env !== "" && timestamp !== 0,
      keepPreviousData: false,
    }
  );

// get a firewall node/edge's info
export const GetFirewallElementInfo = (
  env: string,
  integrationType: string,
  elementID: string | null,
  elementType: string | null,
  nodeType: string,
  curSnapshotTime: number
) =>
  useQuery<any, unknown, any, (string | (string | null)[] | null)[]>(
    [
      "get-firewall-element-info",
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

// get the list of effective ips of a firewall node
export const GetEffectiveIP = (
  env: string,
  cloud: string | (string | null)[] | null,
  id: string | undefined,
  type: string | undefined
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-effective-ip", env, cloud, id, type],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/effective_ips?env_id=${env}&cloud_provider=${cloud}&firewall_id=${id}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "" && id !== "" && String(type) !== "EffectiveIP",
    }
  );

// get the list of port protocols of a firewall node
export const GetPortProtocol = (
  env: string,
  cloud: string | (string | null)[] | null,
  id: string | undefined,
  type: string | undefined
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-port-protocol", env, cloud, id, type],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/port_protocols_and_rules?env_id=${env}&cloud_provider=${cloud}&firewall_id=${id}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "" && id !== "" && String(type) !== "EffectiveIP",
    }
  );
