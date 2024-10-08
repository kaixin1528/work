import { useQuery, useMutation } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";
import { RoleInput } from "src/types/settings";

// get a list of roles in the org
export const GetAllRoles = (customerID: string) =>
  useQuery<any, unknown, any, string[]>(
    ["get-all-roles", customerID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/customers/${customerID}/roles`,
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

// get a list of roles in the org
export const GetRoleInfo = (customerID: string, roleID: string) =>
  useQuery<any, unknown, any, string[]>(
    ["get-role-info", customerID, roleID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/customers/${customerID}/roles/${roleID}`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: customerID !== "" && roleID !== "", cacheTime: 0 }
  );

// create a new role in the org
export const CreateRole = () =>
  useMutation<any, unknown, any, string[]>(
    async ({
      customerID,
      role,
      signal,
    }: {
      customerID: string;
      role: RoleInput;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/customers/${customerID}/roles`,
          role,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-all-roles"]);
        queryClient.invalidateQueries(["get-admin-roles"]);
      },
    }
  );

// update an existing role's info in the org
export const UpdateRole = (customerID: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({
      roleID,
      role,
      signal,
    }: {
      roleID: string;
      role: RoleInput;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.patch(
          `/api/${apiVersion}/customers/${customerID}/roles/${roleID}`,
          role,
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
        queryClient.invalidateQueries(["get-all-roles", customerID]),
    }
  );

// delete an existing role's info in the org
export const DeleteRole = (customerID: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({ roleID, signal }: { roleID: string; signal: AbortSignal }) => {
      try {
        const res = await client.delete(
          `/api/${apiVersion}/customers/${customerID}/roles/${roleID}`,
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
        queryClient.invalidateQueries(["get-all-roles", customerID]),
    }
  );

// get a list of admin roles across orgs
export const GetAdminRoles = (isSuperOrSiteAdmin: boolean) =>
  useQuery<any, unknown, any, (string | boolean)[]>(
    ["get-admin-roles"],
    async ({ signal }) => {
      try {
        const res = await client.get(`/api/${apiVersion}/admin/roles`, {
          signal,
        });
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: isSuperOrSiteAdmin }
  );
