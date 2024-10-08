import { useQuery, useMutation } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";
import { CustomerInput, ContactInput } from "src/types/settings";

// get the list of customer info
export const GetCustomers = (isSuperOrSiteAdmin: boolean) =>
  useQuery<any, unknown, any, (string | boolean)[]>(
    ["get-all-customers"],
    async ({ signal }) => {
      try {
        const res = await client.get(`/api/${apiVersion}/customers`, {
          signal,
        });
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: isSuperOrSiteAdmin }
  );

// get the specified customer info
export const GetCustomer = (customerID: string) =>
  useQuery<any, unknown, any, string[]>(
    ["get-customer", customerID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/customers/${customerID}`,
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

// create a new customer
// given org name, org alias, address, and oidc login or not
export const CreateCustomer = () =>
  useMutation<any, unknown, any, string[]>(
    async ({
      customer,
      signal,
    }: {
      customer: CustomerInput;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/customers`,
          customer,
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
      onSuccess: () => {
        queryClient.invalidateQueries(["get-all-customers"]);
      },
    }
  );

// update a customer's name, alias, or address
export const UpdateCustomer = (customerID: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({
      customer,
      signal,
    }: {
      customer: CustomerInput;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.patch(
          `/api/${apiVersion}/customers/${customerID}`,
          customer,
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

// create primary/billing contact for a customer
export const CreateContact = (customerID: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({
      contact,
      signal,
    }: {
      contact: CustomerInput;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/customers/${customerID}/contacts`,
          contact,
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
      onSuccess: () => {
        queryClient.invalidateQueries(["get-customer", customerID]);
      },
    }
  );

// update a primary/billing contact for a customer
export const UpdateContact = (customerID: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({
      contactID,
      contact,
      signal,
    }: {
      contactID: string;
      contact: ContactInput;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.patch(
          `/api/${apiVersion}/customers/${customerID}/contacts/${contactID}`,
          contact,
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
      onSuccess: () => {
        queryClient.invalidateQueries(["get-customer", customerID]);
      },
    }
  );

export const GetAvailableModules = () =>
  useQuery<any, unknown, any, (string | boolean)[]>(
    ["get-available-modules"],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/customers/modules/available`,
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

export const GetCustomerModules = (customerID: string) =>
  useQuery<any, unknown, any, (string | boolean)[]>(
    ["get-customer-modules", customerID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/customers/${customerID}/modules`,
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

export const AddCustomerModule = (customerID: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({ modules, signal }: { modules: string[]; signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/customers/${customerID}/modules/add`,
          modules,
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
      onSuccess: () => {
        queryClient.invalidateQueries(["get-customer-modules", customerID]);
      },
    }
  );

export const RemoveCustomerModule = (customerID: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({ modules, signal }: { modules: string[]; signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/customers/${customerID}/modules/remove`,
          modules,
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
      onSuccess: () => {
        queryClient.invalidateQueries(["get-customer-modules", customerID]);
      },
    }
  );
