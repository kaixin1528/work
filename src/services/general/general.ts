/* eslint-disable no-restricted-globals */
import { useMutation, useQuery } from "react-query";
import { AddSubscription, CreateDistributionOption } from "../../types/general";
import { client } from "../../components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "../../constants/general";
import { queryClient } from "src/App";
import { useNavigate } from "react-router-dom";

// get the latest version of uno
export const GetLatestVersion = (show: boolean) =>
  useQuery<any, unknown, any, string[]>(
    ["latest-version"],
    async ({ signal }) => {
      try {
        const res = await client.get(`/api/${apiVersion}/version`, {
          signal,
        });
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: show, keepPreviousData: true }
  );

// returns a flag indicating whether there is notification
export const HasNotification = () =>
  useQuery<any, unknown, any, string[]>(
    ["has-notification"],
    async ({ signal }) => {
      try {
        const res = await client.get("/api/notifications/has-notifications", {
          signal,
        });
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { keepPreviousData: true, refetchInterval: 120000 }
  );

// get a list of notifications for a user
export const GetNotifications = () =>
  useMutation<any, unknown, any, string[]>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.get("/api/notifications", { signal });
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

// update the notification status to read
export const UpdateNotificationStatus = () =>
  useMutation<any, unknown, any, string[]>(
    async ({
      notificationID,
      signal,
    }: {
      notificationID: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.patch(
          `/api/notifications/${notificationID}`,
          {
            state: "hidden",
          },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["has-notification"]);
        queryClient.invalidateQueries(["get-notifications"]);
      },
    }
  );

// clear the list of notifications
export const ClearAllNotifications = () =>
  useMutation<any, unknown, any, string[]>(
    async ({ signal }) => {
      try {
        await client.patch(
          "/api/notifications",
          {
            state: "hidden",
          },
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["has-notification"]);
        queryClient.invalidateQueries(["get-notifications"]);
      },
    }
  );

// get a list of subscriptions
export const GetSubscriptions = (show: boolean) =>
  useQuery<any, unknown, any, string[]>(
    ["get-subscriptions"],
    async ({ signal }) => {
      try {
        const res = await client.get(`/api/${apiVersion}/subscriptions`, {
          signal,
        });
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: show, keepPreviousData: true }
  );

// subscribe to an artifact
export const Subscribe = () =>
  useMutation<any, unknown, any, string[]>(
    async ({
      subscription,
      signal,
    }: {
      subscription: AddSubscription;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/subscriptions`,
          subscription,
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
        queryClient.invalidateQueries(["has-notification"]);
        queryClient.invalidateQueries(["get-subscriptions"]);
      },
    }
  );

// unsubscribe from an artifact
export const Unsubscribe = () =>
  useMutation<any, unknown, any, string[]>(
    async ({
      artifactType,
      artifactCategory,
      artifactName,
      frequency,
      signal,
    }: {
      artifactType: string;
      artifactCategory: string;
      artifactName: string;
      frequency: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.delete(
          `/api/${apiVersion}/subscriptions?artifact_type=${artifactType}&artifact_category=${encodeURIComponent(
            encodeURIComponent(artifactCategory)
          )}&artifact_name=${artifactName}&subscription_frequency=${frequency}`,
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
      onSuccess: () => queryClient.invalidateQueries(["get-subscriptions"]),
    }
  );

// get the list of distribution options
export const GetDistributionOptions = () =>
  useQuery<any, unknown, any, string[]>(
    ["get-distribution-options"],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/distribution-options`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { keepPreviousData: true }
  );

// add a distribution option
export const AddDistributionOption = () =>
  useMutation<any, unknown, any, string[]>(
    async ({
      distribution,
      signal,
    }: {
      distribution: CreateDistributionOption;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/distribution-options`,
          distribution,
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
        queryClient.invalidateQueries(["get-distribution-options"]),
    }
  );

// remove the distribution option
export const RemoveDistribuionOption = () =>
  useMutation<any, unknown, any, string[]>(
    async ({
      destinationType,
      signal,
    }: {
      destinationType: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.delete(
          `/api/${apiVersion}/distribution-options?delivery_destination_type=${destinationType}`,
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
        queryClient.invalidateQueries(["get-distribution-options"]),
    }
  );

// get metadata
export const GetMetadata = (domain: string) =>
  useQuery<any, unknown, any, (string | boolean | (string | null)[] | null)[]>(
    ["get-metadata", domain],
    async ({ signal }) => {
      try {
        const res = await client.get(`/api/${apiVersion}/metadata/${domain}`, {
          signal,
        });
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      keepPreviousData: true,
    }
  );

// get spotlight search results
export const GetSpotlightSearchResults = () =>
  useMutation<any, unknown, any, string[]>(
    async ({
      searchString,
      category,
      signal,
    }: {
      searchString: string;
      category: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/observability/raccoon/search?search_query="${searchString}"&category=${category}`,
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

export const VulnLookup = () =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      query,
      vulnType,
      pageNumber,
      signal,
    }: {
      query: string;
      vulnType: string;
      pageNumber: number;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/vuln/search`,
          {
            query: query,
            entity_type: vulnType,
            pager: { page_size: pageSize, page_number: pageNumber },
          },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

export const GetEnabledModules = () =>
  useQuery<any, unknown, any, (string | boolean | (string | null)[] | null)[]>(
    ["get-enabled-modules"],
    async ({ signal }) => {
      try {
        const res = await client.get(`/api/${apiVersion}/enabled-modules`, {
          signal,
        });
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

export const GetEnabledModulesOnLogin = () =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.get(`/api/${apiVersion}/enabled-modules`, {
          signal,
        });
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

export const LogOut = () => {
  const navigate = useNavigate();

  return useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.post(`/logout`, {
          signal,
        });
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        sessionStorage.clear();
        navigate("/signin");
      },
    }
  );
};
