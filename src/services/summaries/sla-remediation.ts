import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";

const prefix = "summaries/sla/sla-remediation";

export const GetSLAOverallCountsBySeverity = (
  source: string,
  version: string,
  integrationType: string,
  sourceAccountID: string,
  numScans: number
) =>
  useQuery<any, unknown, any, any[]>(
    [
      "get-sla-overall-counts-by-severity",
      source,
      version,
      integrationType,
      sourceAccountID,
      numScans,
    ],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/overall_counts_by_severity?num_scans=${numScans}&source=${source}&version=${version}&integration_type=${integrationType}&source_account_id=${sourceAccountID}`,
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
      keepPreviousData: false,
      enabled:
        source !== "" &&
        version !== "" &&
        integrationType !== "" &&
        sourceAccountID !== "",
    }
  );

export const GetSLAServices = (
  source: string,
  version: string,
  integrationType: string,
  sourceAccountID: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-sla-services", source, version, integrationType, sourceAccountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/get_all_services?source=${source}&version=${version}&integration_type=${integrationType}&source_account_id=${sourceAccountID}`,
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
      keepPreviousData: false,
      enabled:
        source !== "" &&
        version !== "" &&
        integrationType !== "" &&
        sourceAccountID !== "",
    }
  );

export const GetSLAServiceCountsBySeverity = (
  source: string,
  version: string,
  integrationType: string,
  sourceAccountID: string,
  service: string,
  startTime: number,
  endTime: number,
  applyTime: boolean
) =>
  useQuery<any, unknown, any, any[]>(
    [
      "get-sla-service-counts-by-severity",
      source,
      version,
      integrationType,
      sourceAccountID,
      service,
      startTime,
      endTime,
      applyTime,
    ],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/service_counts_by_severity?source=${source}&version=${version}&integration_type=${integrationType}&source_account_id=${sourceAccountID}&service_name=${service}${
            applyTime && startTime !== endTime
              ? `&start_time=${startTime}&end_time=${endTime}`
              : ""
          }`,
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
      enabled:
        source !== "" &&
        version !== "" &&
        integrationType !== "" &&
        sourceAccountID !== "" &&
        service !== "",
      keepPreviousData: !applyTime,
    }
  );

export const GetSLAServiceActivityStatus = (
  integrationType: string,
  sourceAccountID: string,
  service: string
) =>
  useQuery<any, unknown, any, any[]>(
    [
      "get-sla-service-activity-status",
      integrationType,
      sourceAccountID,
      service,
    ],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/service-activity-status?integration_type=${integrationType}&source_account_id=${sourceAccountID}&service_name=${service}`,
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
      enabled:
        integrationType !== "" && sourceAccountID !== "" && service !== "",
    }
  );

export const GetSLAViolationTimes = () =>
  useQuery<any, unknown, any, any[]>(
    ["get-sla-violation-times"],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/sla_violation_times`,
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
      keepPreviousData: false,
    }
  );

export const GetSLAViolations = (
  integrationType: string,
  sourceAccountID: string,
  service: string,
  severity: string,
  earliestTime: number,
  latestTime: number
) =>
  useQuery<any, unknown, any, any[]>(
    [
      "get-sla-violations",
      integrationType,
      sourceAccountID,
      service,
      severity,
      earliestTime,
      latestTime,
    ],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/violations?integration_type=${integrationType}&source_account_id=${sourceAccountID}&service_name=${service}&severity=${severity}&scan_time_start=${earliestTime}&scan_time_end=${latestTime}`,
          {
            page_number: 1,
            page_size: pageSize,
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
      enabled:
        integrationType !== "" &&
        sourceAccountID !== "" &&
        service !== "" &&
        severity !== "" &&
        earliestTime !== 0 &&
        latestTime !== 0,

      keepPreviousData: true,
    }
  );

export const GetSLARemediations = (
  source: string,
  version: string,
  integrationType: string,
  sourceAccountID: string,
  service: string,
  severity: string,
  earliestTime: number,
  latestTime: number
) =>
  useQuery<any, unknown, any, any[]>(
    [
      "get-sla-remediations",
      source,
      version,
      integrationType,
      sourceAccountID,
      service,
      severity,
      earliestTime,
      latestTime,
    ],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/remediations?source=${source}&version=${version}&integration_type=${integrationType}&source_account_id=${sourceAccountID}&service_name=${service}&severity=${severity}&scan_time_start=${earliestTime}&scan_time_end=${latestTime}`,
          {
            page_number: 1,
            page_size: pageSize,
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
      enabled:
        integrationType !== "" &&
        sourceAccountID !== "" &&
        service !== "" &&
        severity !== "" &&
        earliestTime !== 0 &&
        latestTime !== 0,

      keepPreviousData: true,
    }
  );
