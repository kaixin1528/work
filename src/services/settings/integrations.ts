import { useQuery, useMutation } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";
import {
  AccountInput,
  Credentials,
  UpdateAccountInput,
} from "src/types/settings";

// get a list of available integrations
// ie. aws, gcp, datadog, github, etc.
export const GetAvailableIntegrations = (customerID: string) =>
  useQuery<any, unknown, any, string[]>(
    ["get-available-integrations", customerID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/customers/${customerID}/available_integrations`,
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
      enabled: customerID !== "",
    }
  );

// get a list of accounts in the org
export const GetAllAccounts = (customerID: string) =>
  useQuery<any, unknown, any, string[]>(
    ["get-all-accounts", customerID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/customers/${customerID}/integrations`,
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
      enabled: customerID !== "",
    }
  );

// get an account's info
export const GetAccountInfo = (customerID: string, accountID: string) =>
  useQuery<any, unknown, any, string[]>(
    ["get-account-info", customerID, accountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/customers/${customerID}/integrations/${accountID}`,
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
      enabled: customerID !== "" && accountID !== "",
      cacheTime: 0,
    }
  );

// create a new account in the org
export const CreateAccount = (customerID: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({
      account,
      signal,
    }: {
      account: AccountInput;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/customers/${customerID}/integrations`,
          account,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

// update an existing account's info in the org
export const UpdateAccount = (customerID: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      accountID,
      account,
      signal,
    }: {
      accountID: string;
      account: UpdateAccountInput;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.patch(
          `/api/${apiVersion}/customers/${customerID}/integrations/${accountID}`,
          account,
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
        queryClient.invalidateQueries(["get-all-accounts", customerID]);
        queryClient.invalidateQueries(["get-account-info", customerID]);
      },
    }
  );

// delete an existing account from the org
export const DeleteAccount = (customerID: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({
      accountID,
      signal,
    }: {
      accountID: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.delete(
          `/api/${apiVersion}/customers/${customerID}/integrations/${accountID}`,
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
        queryClient.invalidateQueries(["get-all-accounts", customerID]);
      },
    }
  );

// test credentials
export const TestCredentials = (
  customerID: string,
  integrationType: string | (string | null)[] | null
) =>
  useMutation<any, unknown, any, string[]>(
    async ({
      credentials,
      signal,
    }: {
      credentials: Credentials;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/customers/${customerID}/credentials/verification/${integrationType}`,
          credentials,
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

// upload credentials
export const UploadCredentials = (
  customerID: string,
  setShowIntegrationDetails: (showIntegrationDetails: boolean) => void
) =>
  useMutation<any, unknown, any, string[]>(
    async ({
      accountID,
      credentials,
      signal,
    }: {
      accountID: string;
      credentials: Credentials;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/customers/${customerID}/credentials/upload/${accountID}`,
          credentials,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-all-accounts", customerID]);
        setShowIntegrationDetails(false);
      },
    }
  );

// get slack temporary token
export const GetSlackOTT = () =>
  useQuery<any, unknown, any, (string | boolean)[]>(
    ["get-slack-ott"],
    async ({ signal }) => {
      try {
        const res = await client.get(`/api/${apiVersion}/slack/ott`, {
          signal,
        });
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

// get slack temporary token
export const GetSlackClientID = () =>
  useQuery<any, unknown, any, (string | boolean)[]>(
    ["get-slack-client-id"],
    async ({ signal }) => {
      try {
        const res = await client.get(`/api/${apiVersion}/slack/client_id`, {
          signal,
        });
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

// store slack oauth
export const StoreSlackOauth = (
  code: string,
  state: string,
  redirectURI: string
) =>
  useQuery<any, unknown, any, (string | boolean)[]>(
    ["store-slack-oauth-redirect", code, state, redirectURI],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/slack/oauth`,
          { code: code, state: state, redirect_uri: redirectURI },
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
      enabled: code !== "" && state !== "",
    }
  );
