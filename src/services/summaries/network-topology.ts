import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";

const prefix = "summaries/nt/network-topology";

export const GetNetworkTopologySummary = (
  period: number,
  integrationType: string,
  accountID: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-network-topology-summary", period, integrationType, accountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/summary?period=${period}&integration_type=${integrationType}&source_account_id=${accountID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: integrationType !== "" && accountID !== "",
      keepPreviousData: false,
    }
  );

export const GetNetworkTopologyRoutingTable = (
  period: number,
  integrationType: string,
  accountID: string,
  routingTableID: string
) =>
  useQuery<any, unknown, any, any[]>(
    [
      "get-network-topology-routing-table",
      period,
      integrationType,
      accountID,
      routingTableID,
    ],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/routing_table?period=${period}&integration_type=${integrationType}&source_account_id=${accountID}&${
            integrationType.toLowerCase() === "gcp"
              ? `vpc_id=${routingTableID}`
              : `routing_table_id=${routingTableID}`
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
        integrationType !== "" && accountID !== "" && routingTableID !== "",
      keepPreviousData: false,
    }
  );

export const GetNetworkTopologyCloudResource = (
  period: number,
  integrationType: string,
  accountID: string,
  cloudResourceID: string,
  type: string
) =>
  useQuery<any, unknown, any, any[]>(
    [
      "get-network-topology-cloud-resources",
      period,
      integrationType,
      accountID,
      cloudResourceID,
      type,
    ],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/resources?period=${period}&integration_type=${integrationType}&source_account_id=${accountID}&${
            type === "routing"
              ? `vpc_id=${cloudResourceID}`
              : `resource_id_lookup=${cloudResourceID}`
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
        integrationType !== "" && accountID !== "" && cloudResourceID !== "",
      keepPreviousData: false,
    }
  );
