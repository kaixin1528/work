import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";

const prefix = "summaries/am/application-microservices";

export const GetLiveServices = (
  period: number,
  integrationType: string,
  accountID: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-live-services", period, integrationType, accountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/live?period=${period}&integration_type=${integrationType}&source_account_id=${accountID}`,
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

export const GetServiceLifecycle = (
  period: number,
  integrationType: string,
  accountID: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-service-lifecycle", period, integrationType, accountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/lifecycle?period=${period}&integration_type=${integrationType}&source_account_id=${accountID}`,
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

export const GetVulnCountByService = (
  period: number,
  integrationType: string,
  accountID: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-vuln-count-by-service", period, integrationType, accountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/vulns?period=${period}&integration_type=${integrationType}&source_account_id=${accountID}`,
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

export const GetServiceScale = (
  period: number,
  integrationType: string,
  accountID: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-service-scale", period, integrationType, accountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/scale?period=${period}&integration_type=${integrationType}&source_account_id=${accountID}`,
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

export const GetClusterNamespace = (
  period: number,
  integrationType: string,
  accountID: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-cluster-namespace", period, integrationType, accountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/cluster-namespace-info?period=${period}&integration_type=${integrationType}&source_account_id=${accountID}`,
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

export const GetServiceScalingVolatility = (
  period: number,
  integrationType: string,
  accountID: string,
  cluster: string,
  namespace: string,
  topN: number
) =>
  useQuery<any, unknown, any, any[]>(
    [
      "get-service-scaling-volatility",
      period,
      integrationType,
      accountID,
      cluster,
      namespace,
      topN,
    ],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/scaling-volatility?period=${period}&integration_type=${integrationType}&source_account_id=${accountID}&cluster_name=${cluster}&namespace=${namespace}&top_n=${topN}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled:
        integrationType !== "" &&
        accountID !== "" &&
        cluster !== "" &&
        namespace !== "",
      keepPreviousData: false,
    }
  );

export const GetServiceActivity = (
  period: number,
  integrationType: string,
  accountID: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-service-activity", period, integrationType, accountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/activity?period=${period}&integration_type=${integrationType}&source_account_id=${accountID}&topn=20`,
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

export const GetMaxReleases = (
  period: number,
  integrationType: string,
  accountID: string,
  topN: number
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-max-releases", period, integrationType, accountID, topN],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/releases?period=${period}&integration_type=${integrationType}&source_account_id=${accountID}&top_n=${topN}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: integrationType !== "" && accountID !== "",
      keepPreviousData: topN !== 10,
    }
  );

export const GetServiceActivityByAccount = (
  period: number,
  integrationType: string,
  accountID: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-service-activity-by-account", period, integrationType, accountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/accounts?period=${period}&integration_type=${integrationType}&source_account_id=${accountID}`,
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
