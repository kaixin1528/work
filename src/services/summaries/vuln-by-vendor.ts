import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";

const prefix = "summaries/cpe/cpe";

export const GetVendors = (
  type: string,
  order: string,
  orderBy: string,
  cveIDs: string[]
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-vendors", type, order, orderBy, cveIDs],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/get-vendor-list?type=${type}&order=${order}&order_by=${orderBy}`,
          { cve_ids: cveIDs },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: type !== "" && order !== "" && orderBy !== "",
      keepPreviousData: false,
    }
  );

export const GetProductsByVendor = (
  type: string,
  vendor: string,
  order: string,
  orderBy: string,
  cveIDs: string[],
  show: boolean
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-products-by-vendor", type, vendor, order, orderBy, cveIDs],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/get-products-by-vendor?type=${type}&vendor=${vendor}&order=${order}&order_by=${orderBy}`,
          { cve_ids: cveIDs },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled:
        show && type !== "" && vendor !== "" && order !== "" && orderBy !== "",
      keepPreviousData: false,
    }
  );

export const GetCPEFilterOptions = () =>
  useQuery<any, unknown, any, any[]>(
    ["get-cpe-filter-options"],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/get-filter-options`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

export const GetCVEListForVendor = (
  type: string,
  vendor: string,
  show: boolean
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-cve-for-vendor", type, vendor],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/get-cve-for-vendor-product?type=${type}&vendor=${vendor}`,
          {},
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: show && type !== "" && vendor !== "",
      keepPreviousData: false,
    }
  );

export const GetCVEListForProduct = (
  type: string,
  vendor: string,
  product: string,
  cveVersion: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-cve-for-product", type, vendor, product, cveVersion],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/get-cve-for-vendor-product?type=${type}&vendor=${vendor}&product=${product}${
            cveVersion !== "" ? `&cve_version=${cveVersion}` : ""
          }`,
          {},
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: type !== "" && vendor !== "" && product !== "",
      keepPreviousData: false,
    }
  );

export const GetCPEAnalytics = (
  type: string,
  vendor: string,
  product: string,
  integrationType: string,
  cveVersion: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-cpe-analytics", type, vendor, product, integrationType, cveVersion],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/get-cpe-analytics?type=${type}&vendor=${vendor}&product=${product}&integration_type=${integrationType}&cve_version=${cveVersion}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled:
        type !== "" &&
        vendor !== "" &&
        product !== "" &&
        integrationType !== "" &&
        cveVersion !== "",
      keepPreviousData: false,
    }
  );
