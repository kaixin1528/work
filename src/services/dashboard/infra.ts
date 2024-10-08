import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";
import { FilterPagination, Filter } from "src/types/general";

const prefix = "observability/infra";

// get the cloud source's widget summary
export const GetInfraSummary = (
  env: string,
  cloud: string | (string | null)[] | null
) =>
  useQuery<any, unknown, any, (string | (string | null)[] | null)[]>(
    ["get-infra-summary", env, cloud],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/summary?env_id=${env}&cloud_provider=${cloud}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: env !== "" && cloud !== "", keepPreviousData: true }
  );

// get resource data for a node type
export const GetInfraDetails = (
  env: string,
  integration: string | (string | null)[] | null,
  category: string | (string | null)[] | null,
  nodeType: string | (string | null)[] | null,
  body: FilterPagination
) =>
  useQuery<
    any,
    unknown,
    any,
    (string | (string | null)[] | FilterPagination | null)[]
  >(
    ["get-infra-details", env, integration, category, nodeType, body],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/details/resources?env_id=${env}&cloud_provider=${integration}&category=${category}&type=${nodeType}`,
          body,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled:
        env !== "" && integration !== "" && category !== "" && nodeType !== "",
      keepPreviousData: true,
    }
  );

// get the most recent 10 images of a repo
export const GetMostRecentImages = (
  env: string,
  cloud: string | (string | null)[] | null,
  id: string,
  nodeType: string | (string | null)[] | null
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-most-recent-images", env, cloud, id, nodeType],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/repo/${id}?env_id=${env}&cloud_provider=${cloud}&image_type=${nodeType}&num_images=10`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: env !== "" && id !== "" }
  );

// get the vulnerability severity counts of a repo
export const GetSeverityCounts = (
  env: string,
  cloud: string | (string | null)[] | null,
  id: string,
  nodeType: string | (string | null)[] | null
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-severity-counts", env, cloud, id, nodeType],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/observability/vulnerability/analytics?env_id=${env}&cloud_provider=${cloud}&image_type=${nodeType}&node_id=${id}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: env !== "" && id !== "" }
  );

// get the 5 longest spanning vulnerabilities
export const GetVulnerabilitiesSpan = (
  env: string,
  cloud: string | (string | null)[] | null,
  id: string,
  nodeType: string | (string | null)[] | null
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-vulnerabilities-span", env, cloud, id, nodeType],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/observability/vulnerability/analytics/history?env_id=${env}&cloud_provider=${cloud}&image_type=${nodeType}&minimum_severity=CRITICAL&repository_name=${id}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: env !== "" && id !== "" }
  );

// get the vulnerability scans of an image
export const GetImageScans = (
  env: string,
  cloud: string | (string | null)[] | null,
  id: string,
  nodeType: string | (string | null)[] | null
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-image-scans", env, cloud, id, nodeType],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/image/scan/${id}?env_id=${env}&cloud_provider=${cloud}&image_type=${nodeType}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: env !== "" && id !== "" }
  );

// get the vulnerability info
export const GetCVEInfo = (
  env: string,
  cloud: string | (string | null)[] | null,
  cve: string,
  nodeType: string | (string | null)[] | null
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-cve-info", env, cloud, cve, nodeType],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/observability/vulnerability/${cve}?env_id=${env}&cloud_provider=${cloud}&image_type=${nodeType}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: env !== "" && cve !== "" }
  );

// get the eks resources used and total over time
export const GetEKSResources = (
  env: string,
  cloud: string | (string | null)[] | null,
  id: string
) =>
  useQuery<any, unknown, any, (string | (string | null)[] | null)[]>(
    ["get-eks-resources", env, cloud, id],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/compute/k8s/?env_id=${env}&cloud_type=${cloud}&cluster_id=${id}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: env !== "" && id !== "" }
  );

// get the pod expanded view data
export const GetPodExpanded = (
  env: string,
  cloud: string | (string | null)[] | null,
  id: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-pod-expanded", env, cloud, id],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/compute/pods/${id}?env_id=${env}&cloud_type=${cloud}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: env !== "" && id !== "" }
  );

// get the vpc counts over time
export const GetVPCCounts = (
  env: string,
  cloud: string | (string | null)[] | null,
  id: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-vpc-counts", env, cloud, id],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/networking/vpc/${id}?env_id=${env}&cloud_provider=${cloud}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: env !== "" && id !== "" }
  );

// get the container's metric categories
export const GetContainerMetricCategories = (
  env: string,
  cloud: string | (string | null)[] | null,
  id: string,
  nodeType: string | (string | null)[] | null
) =>
  useQuery<any, unknown, any, (string | (string | null)[] | null)[]>(
    ["get-container-metric-categories", env, cloud, id, nodeType],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/observability/graph/${id}/metrics/metadata?env_id=${env}&cloud_provider=${cloud}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "" && id !== "",
      keepPreviousData: true,
    }
  );

// get the container metrics
export const GetContainerMetrics = (
  env: string,
  cloud: string | (string | null)[] | null,
  id: string,
  category: string,
  filters: Filter[]
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-container-metrics", env, cloud, id, category, filters],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/observability/graph/${id}/metrics?env_id=${env}&cloud_provider=${cloud}&metric_category=${category}`,
          filters,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: env !== "" && id !== "" && category !== "" }
  );
