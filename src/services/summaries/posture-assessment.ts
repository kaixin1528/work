import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";

const prefix = "summaries/pa/assessment";

export const GetPostureAssessmentSummary = (
  integrationType: string,
  accountID: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-posture-assessment-summary", integrationType, accountID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/overview?integration_type=${integrationType}&source_account_id=${accountID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: integrationType !== "" && accountID !== "",
      keepPreviousData: false,
    }
  );

export const GetPAEvolution = (
  integrationType: string,
  accountID: string,
  service: string
) =>
  useQuery<any, unknown, any, any[]>(
    ["get-posture-assessment-evolution", integrationType, accountID, service],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/evolution?integration_type=${integrationType}&source_account_id=${accountID}&service_name=${service}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: integrationType !== "" && accountID !== "" && service !== "",
      keepPreviousData: false,
    }
  );

export const GetPostureAssessmentServiceDetails = (serviceName: string) =>
  useQuery<any, unknown, any, any[]>(
    ["get-posture-assessment-service-details", serviceName],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/findings?service_name=${serviceName.toLowerCase()}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: serviceName !== "undefined",
      keepPreviousData: false,
    }
  );
