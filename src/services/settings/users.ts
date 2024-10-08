import { useQuery, useMutation } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";
import { TempEmail, UserInput } from "src/types/settings";

// get a list of users in the org
export const GetAllUsers = (customerID: string, isSuperOrSiteAdmin: boolean) =>
  useQuery<any, unknown, any, (string | boolean)[]>(
    ["get-all-users", customerID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/customers/${customerID}/users`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: !isSuperOrSiteAdmin && customerID !== "" }
  );

// get a user's info
export const GetUserInfo = (customerID: string, userID: string) =>
  useQuery<any, unknown, any, (string | boolean)[]>(
    ["get-user-info", customerID, userID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/customers/${customerID}/users/${userID}`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: customerID !== "" && userID !== "", cacheTime: 0 }
  );

// create a new user
export const CreateUser = () =>
  useMutation<any, unknown, any, string[]>(
    async ({
      customerID,
      user,
      signal,
    }: {
      customerID: string;
      user: UserInput;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/customers/${customerID}/users`,
          user,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

// update an existing user's info
export const UpdateUser = (customerID: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({
      userID,
      user,
      signal,
    }: {
      userID: string;
      user: UserInput;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.patch(
          `/api/${apiVersion}/customers/${customerID}/users/${userID}`,
          user,
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
      onSuccess: () =>
        queryClient.invalidateQueries(["get-all-users", customerID]),
    }
  );

// get a list of admin users across orgs
export const GetAdminUsers = (isSuperOrSiteAdmin: boolean) =>
  useQuery<any, unknown, any, (string | boolean)[]>(
    ["get-admin-users"],
    async ({ signal }) => {
      try {
        const res = await client.get(`/api/${apiVersion}/admin/users`, {
          signal,
        });
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: isSuperOrSiteAdmin }
  );

// send a temporary password email to reset password
export const SendTempPasswordEmail = (customerID: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({
      tempPasswordEmail,
      signal,
    }: {
      tempPasswordEmail: TempEmail;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/customers/${customerID}/users/send_temp_password_email`,
          tempPasswordEmail,
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

// send a verification email to return back to login page
export const SendLoginEmail = () =>
  useMutation<any, unknown, any, string[]>(
    async ({
      customerID,
      customerName,
      loginEmail,
      signal,
    }: {
      customerID: string;
      customerName: string;
      loginEmail: TempEmail;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/customers/${customerID}/users/send_login_with_google_email?customer_name=${customerName}`,
          loginEmail,
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
