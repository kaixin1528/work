import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";

const prefix = "summaries/irs/incident_response";

export const GetIRSummary = () =>
  useQuery<any, unknown, any, any[]>(
    ["get-ir-summary"],
    async ({ signal }) => {
      try {
        const res = await client.get(`/api/${apiVersion}/${prefix}/summary`, {
          signal,
        });
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      keepPreviousData: false,
    }
  );

export const GetIRIncidents = (pageNumber: number) =>
  useQuery<any, unknown, any, any[]>(
    ["get-ir-incidents", pageNumber],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/incidents`,
          { page_number: pageNumber, page_size: pageSize },
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
      keepPreviousData: false,
    }
  );
