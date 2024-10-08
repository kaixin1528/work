import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";

const prefix = "summaries/se/system-entropy";

export const GetPropertyGroupChanges = (period: number) =>
  useQuery<any, unknown, any, any[]>(
    ["get-property-group-overall-changes", period],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/prop-group-overall-change?period=${period}`,
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

export const GetResourceTypesByTime = (period: number) =>
  useQuery<any, unknown, any, any[]>(
    ["get-resource-types-by-time", period],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/class-change-by-time?period=${period}`,
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

export const GetPropertyGroupsByTime = (period: number) =>
  useQuery<any, unknown, any, any[]>(
    ["get-property-groups-by-time", period],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/prop-group-change-by-time?period=${period}`,
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

export const GetPropertyGroupDetail = (
  period: number,
  group: string,
  bucketStart: number,
  resourceType: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-property-group-detail", period, group, bucketStart, resourceType],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/property-group-summary?period=${period}&bucket_start=${bucketStart}${
            resourceType !== ""
              ? `&node_class=${resourceType}`
              : `&group=${group}`
          }`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      keepPreviousData: false,
      enabled: group !== "",
    }
  );

export const GetPropertyValueDistribution = (
  period: number,
  group: string,
  bucketStart: number,
  nodeType: string,
  propertyName: string
) =>
  useQuery<any, unknown, any, any[]>(
    [
      "get-property-value-distribution",
      period,
      group,
      bucketStart,
      nodeType,
      propertyName,
    ],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/property-value-distribution?period=${period}&group=${group}&bucket_start=${bucketStart}&node_class=${nodeType}&property=${propertyName}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      keepPreviousData: false,
      enabled: group !== "" && nodeType !== "" && propertyName !== "",
    }
  );

export const GetPropertyValueChanges = (
  period: number,
  group: string,
  bucketStart: number,
  nodeType: string,
  propertyName: string,
  pageNumber: number
) =>
  useQuery<any, unknown, any, any[]>(
    [
      "get-property-value-changes",
      period,
      group,
      bucketStart,
      nodeType,
      propertyName,
      pageNumber,
    ],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/property-value-changes?period=${period}&group=${group}&bucket_start=${bucketStart}&node_class=${nodeType}&property=${propertyName}`,
          {
            page_number: pageNumber,
            page_size: pageSize,
          },

          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      keepPreviousData: false,
      enabled: group !== "" && nodeType !== "" && propertyName !== "",
    }
  );
