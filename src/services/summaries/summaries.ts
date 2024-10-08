import { useMutation, useQuery } from "react-query";
import { client } from "../../components/General/AxiosInterceptor";
import { apiVersion } from "../../constants/general";
import { AddFavorite } from "../../types/general";
import { queryClient } from "src/App";

const prefix = "reports";

// get a list of reports
export const GetAllReports = (show: boolean) =>
  useQuery<any, unknown, any, any[]>(
    ["get-all-reports"],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/publications`,
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
      enabled: show,
      keepPreviousData: true,
    }
  );

// get a list of favorite reports
export const GetGlobalFavoriteReports = (show: boolean) =>
  useQuery<any, unknown, any, any[]>(
    ["get-global-favorite-reports"],
    async ({ signal }) => {
      try {
        const res = await client.get(`/api/${apiVersion}/${prefix}/favorites`, {
          signal,
        });
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: show,
      keepPreviousData: true,
    }
  );

// get a list of favorite reports
export const GetFavoriteReports = (show: boolean) =>
  useQuery<any, unknown, any, any[]>(
    ["get-favorite-reports"],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/publications/publications_favorites`,
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
      enabled: show,
      keepPreviousData: true,
    }
  );

// add report to the list of favorite reports
export const AddReportToFavorites = () =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      favorite,
      signal,
    }: {
      favorite: AddFavorite;
      signal: AbortSignal;
    }) => {
      try {
        await client.post(`/api/${apiVersion}/${prefix}/favorites`, favorite, {
          signal,
        });
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-global-favorite-reports"]);
      },
    }
  );

// remove report from the list of favorite reports
export const RemoveReportFromFavorites = () =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      artifactType,
      artifactCategory,
      artifactName,
      signal,
    }: {
      artifactType: string;
      artifactCategory: string;
      artifactName: string;
      signal: AbortSignal;
    }) => {
      try {
        await client.delete(
          `/api/${apiVersion}/${prefix}/favorites?artifact_type=${artifactType}&artifact_category=${artifactCategory}&artifact_name=${artifactName}`,
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-global-favorite-reports"]);
      },
    }
  );

export const GetSelectionOptions = (short: string, long: string) =>
  useQuery<any, unknown, any, any[]>(
    ["get-selection-options", short, long],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/summaries/${short}/${long}/selection-options`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );
