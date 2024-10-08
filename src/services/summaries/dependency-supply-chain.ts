import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";

const prefix = "summaries/sd/software-dependency";

export const GetDependencySummary = (period: number, integrationType: string) =>
  useQuery<any, unknown, any, any[]>(
    ["get-software-dependency-summary", period, integrationType],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/summary?period=${period}&integration_type=${integrationType}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: integrationType !== "",
      keepPreviousData: false,
    }
  );

export const GetDependencyCountByActiveBranches = (
  period: number,
  integrationType: string,
  orgName: string,
  repoName: string
) =>
  useQuery<any, unknown, any, any[]>(
    [
      "get-software-dependency-count-by-active-branches",
      period,
      integrationType,
      orgName,
      repoName,
    ],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/active-branches-count/${orgName}/${repoName}?period=${period}&integration_type=${integrationType}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: integrationType !== "" && orgName !== "" && repoName !== "",
      keepPreviousData: false,
    }
  );

export const GetDependencyCountByPackageManagers = (
  period: number,
  integrationType: string,
  orgName: string,
  repoName: string,
  branch: string
) =>
  useQuery<any, unknown, any, any[]>(
    [
      "get-software-dependency-count-by-package-managers",
      period,
      integrationType,
      orgName,
      repoName,
      branch,
    ],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/package-managers-count/${orgName}/${repoName}/${branch}?period=${period}&integration_type=${integrationType}`,
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
        orgName !== "" &&
        repoName !== "" &&
        branch !== "",
      keepPreviousData: false,
    }
  );

export const GetDependencyDetails = (
  period: number,
  integrationType: string,
  orgName: string,
  repoName: string,
  branch: string,
  packageManager: string,
  dependency: string
) =>
  useQuery<any, unknown, any, any[]>(
    [
      "get-software-dependency-details",
      period,
      integrationType,
      orgName,
      repoName,
      branch,
      packageManager,
      dependency,
    ],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/details/${orgName}/${repoName}/${encodeURIComponent(
            encodeURIComponent(branch)
          )}/${encodeURIComponent(
            encodeURIComponent(packageManager)
          )}/${encodeURIComponent(
            encodeURIComponent(dependency)
          )}?period=${period}&integration_type=${integrationType}`,
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
        orgName !== "" &&
        repoName !== "" &&
        branch !== "" &&
        packageManager !== "" &&
        dependency !== "",
      keepPreviousData: false,
    }
  );
