import { useQuery, useMutation } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";
import { GroupInput } from "src/types/settings";

// get a list of groups given a customer
export const GetAllGroups = (customerID: string, isSuperOrSiteAdmin: boolean) =>
  useQuery<any, unknown, any, (string | boolean)[]>(
    ["get-all-groups", customerID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/customers/${customerID}/groups`,
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

// get a group's info
export const GetGroupInfo = (
  customerID: string,
  groupID: string,
  isSuperOrSiteAdmin: boolean
) =>
  useQuery<any, unknown, any, (string | boolean)[]>(
    ["get-group-info", customerID, groupID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/customers/${customerID}/groups/${groupID}`,
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
      enabled: !isSuperOrSiteAdmin && customerID !== "" && groupID !== "",
      cacheTime: 0,
    }
  );

// get a group's users
export const GetGroupUsers = (customerID: string, groupID: string) =>
  useQuery<any, unknown, any, (string | boolean)[]>(
    ["get-group-users", customerID, groupID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/customers/${customerID}/groups/${groupID}/users`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: customerID !== "" && groupID !== "" }
  );

// create a new group in the org
export const CreateGroup = (customerID: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({ group, signal }: { group: GroupInput; signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/customers/${customerID}/groups`,
          group,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries(["get-all-groups", customerID]),
    }
  );

// update an existing group in the org
export const UpdateGroup = (customerID: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({
      groupID,
      group,
      signal,
    }: {
      groupID: string;
      group: GroupInput;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.patch(
          `/api/${apiVersion}/customers/${customerID}/groups/${groupID}`,
          group,
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
        queryClient.invalidateQueries(["get-all-groups", customerID]);
        queryClient.invalidateQueries(["get-group-users", customerID]);
      },
    }
  );

// delete an existing group in the org
export const DeleteGroup = (customerID: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({ groupID, signal }: { groupID: string; signal: AbortSignal }) => {
      try {
        const res = await client.delete(
          `/api/${apiVersion}/customers/${customerID}/groups/${groupID}`,
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
        queryClient.invalidateQueries(["get-all-groups", customerID]);
        queryClient.invalidateQueries(["get-group-users", customerID]);
      },
    }
  );
