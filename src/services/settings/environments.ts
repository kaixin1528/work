import { useQuery, useMutation } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";
import { CustomerEnvInput } from "src/types/settings";

// get a list of env types in the org
export const GetCustomerEnvs = (customerID: string) =>
  useQuery<any, unknown, any, string[]>(
    ["get-customer-envs", customerID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/customers/${customerID}/customer_envs`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: customerID !== "" }
  );

// get a list of integrations for an environment
export const GetCustomerEnvAccounts = (
  customerID: string,
  customerEnvID: string
) =>
  useQuery<any, unknown, any, string[]>(
    ["get-customer-env-accounts", customerID, customerEnvID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/customers/${customerID}/customer_envs/${customerEnvID}/integrations`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: customerID !== "" && customerEnvID !== "" }
  );

// create an env type in the org
export const CreateCustomerEnv = (customerID: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({
      envType,
      signal,
    }: {
      envType: CustomerEnvInput;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/customers/${customerID}/customer_envs`,
          envType,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-customer-envs", customerID]);
      },
    }
  );

// update an env type in the org
export const UpdateCustomerEnv = (customerID: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      customerEnvID,
      envType,
      signal,
    }: {
      customerEnvID: string;
      envType: CustomerEnvInput;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.patch(
          `/api/${apiVersion}/customers/${customerID}/customer_envs/${customerEnvID}`,
          envType,
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

// delete an env type in the org
export const DeleteCustomerEnv = (customerID: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({
      customerEnvID,
      signal,
    }: {
      customerEnvID: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.delete(
          `/api/${apiVersion}/customers/${customerID}/customer_envs/${customerEnvID}`,
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
        queryClient.invalidateQueries(["get-customer-envs", customerID]);
        queryClient.invalidateQueries(["get-all-accounts", customerID]);
      },
    }
  );
