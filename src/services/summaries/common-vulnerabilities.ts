import { useMutation, useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";

const prefix = "summaries/cv/common-vulnerability";

export const GetCVEVersions = () =>
  useQuery<any, unknown, any, any[]>(
    ["get-cve-versions"],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/cve-versions`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      keepPreviousData: false,
    }
  );

export const GetCVEMatrixByYear = (source: string, version: string) =>
  useQuery<any, unknown, any, any[]>(
    ["get-cve-matrix-by-year", source, version],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/cve_matrix_by_year?source=${source}&version=${version}&order=asc`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: source !== "" && version !== "",
      keepPreviousData: false,
    }
  );

export const GetCVSystemTotal = (
  env: string,
  source: string,
  version: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-cv-system-total", env, source, version],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/cve_system_total?env_id=${env}&source=${source}&version=${version}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "" && source !== "" && version !== "",
      keepPreviousData: false,
    }
  );

export const GetCVSystemTotalBySeverity = (
  env: string,
  source: string,
  version: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-cv-system-total-by-severity", env, source, version],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/cve_system_total_by_severity?env_id=${env}&source=${source}&version=${version}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "" && source !== "" && version !== "",
      keepPreviousData: false,
    }
  );

export const GetCVSummary = (source: string, version: string) =>
  useQuery<any, unknown, any, any[]>(
    ["get-cv-summary", source, version],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/summary?source=${source}&version=${version}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: source !== "" && version !== "",
      keepPreviousData: false,
    }
  );

export const GetCVEYearsBySeverity = (
  source: string,
  version: string,
  severity: string,
  order: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-cve-years-by-severity", source, version, severity, order],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/cve-year-list?source=${source}&version=${version}&severity=${severity}&order=${order}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: source !== "" && version !== "" && severity !== "",
      keepPreviousData: false,
      cacheTime: 0,
    }
  );

export const GetCVEListByYear = (
  source: string,
  version: string,
  severity: string,
  year: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-cve-list-by-year", source, version, severity, year],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/cve-listing-by-severity?source=${source}&version=${version}&severity=${severity}&year=${year}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled:
        source !== "" && version !== "" && severity !== "" && year !== "",
      keepPreviousData: false,
    }
  );

export const GetEPSSOverSeverity = () =>
  useMutation<any, unknown, any, string[]>(
    async ({
      source,
      version,
      severity,
      year,
      minX,
      maxX,
      minY,
      maxY,
      signal,
    }: {
      source: string;
      version: string;
      severity: string;
      year: string;
      minX: number;
      maxX: number;
      minY: number;
      maxY: number;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/epss_vs_sev?source=${source}&version=${version}&severity=${severity}&year=${year}${
            minX ? `&severity_score_start=${minX}` : ""
          }${
            maxX ? `&severity_score_end=${maxX}` : ""
          }&epss_score_start=${minY}&epss_score_end=${maxY}`,
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
