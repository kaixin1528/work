import { useMutation, useQuery } from "react-query";
import { client } from "../components/General/AxiosInterceptor";
import { NewPassword } from "src/types/settings";
import { apiVersion } from "src/constants/general";

// Uno login
export const UnoLogin = () =>
  useMutation<any, unknown, any, (string | FormData)[]>(
    async ({
      credentials,
      signal,
    }: {
      credentials: FormData;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post("/login", credentials, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          signal,
        });
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

// OIDC Login
export const OIDCLogin = () =>
  useMutation<any, unknown, any, string[]>(
    async ({
      authCode,
      signal,
    }: {
      authCode: { code: string };
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post("/oidc-login", authCode, { signal });
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

// resets the user's password
export const UpdateUserPassword = (customerID: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({
      newPassword,
      signal,
    }: {
      newPassword: NewPassword;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.put(
          `/api/${apiVersion}/reset-password/`,
          newPassword,
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

// verify temp password has been set or not
export const TempPasswordSet = (
  customerID: string,
  userEmail: string,
  tempPassword: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["temp-password-set", customerID, userEmail, tempPassword],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/reset-password/has-temp-pass-been-used?customer_id=${customerID}&user_email=${userEmail}&temp_password=${tempPassword}`,
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

// generate unique 2fa secret (if not already set) and render qr code
export const TwoFAInitialSetup = () =>
  useMutation<any, unknown, any, string[]>(
    async ({
      customerID,
      email,
      signal,
    }: {
      customerID: string;
      email: { user_email: string };
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/customers/${customerID}/users/auth/setup_2fa`,
          email,
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

// verify if otp code is correct or not
export const VerifyOTP = () =>
  useMutation<any, unknown, any, string[]>(
    async ({
      customerID,
      info,
      signal,
    }: {
      customerID: string;
      info: { user_email: string; input_otp: string };
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/customers/${customerID}/users/auth/verify_otp`,
          info,
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
