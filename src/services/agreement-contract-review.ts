import { useMutation, useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";
import { KeyStringVal } from "src/types/general";

const prefix = "grc/contractual_agreements";

export const GetAgreementContractReviews = (
  order: KeyStringVal,
  pageNumber: number
) =>
  useQuery<any, unknown, any, (string | number | KeyStringVal)[]>(
    ["get-agreement-contract-reviews", order, pageNumber],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}`,
          {
            ...(order.order_by !== "" && { order: order }),
            page_size: pageSize,
            page_number: pageNumber,
          },
          { signal }
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

export const ParseAgreementContractReviewMetadata = () =>
  useMutation<any, unknown, any, string>(
    async ({
      formData,
      signal,
    }: {
      formData: FormData;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/parse`,
          formData,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

export const CreateAgreement = () =>
  useMutation<any, unknown, any, string>(
    async ({
      formData,
      signal,
    }: {
      formData: FormData;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/new_contractual_agreement`,
          formData,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

export const GetAgreementContractReviewMetadata = (agreementID: string) =>
  useQuery<any, unknown, any, (string | undefined)[]>(
    ["get-agreement-contract-review-metadata", agreementID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${agreementID}`,
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
      enabled: agreementID !== "",
      keepPreviousData: false,
    }
  );

export const GetAgreement = (agreementID: string) =>
  useQuery<any, unknown, any, (string | boolean | KeyStringVal | string[])[]>(
    ["get-agreement", agreementID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/mapping?contractual_agreement_id=${agreementID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: agreementID !== "",
      keepPreviousData: false,
    }
  );

export const GetAgreementSections = (agreementID: string, pageNumber: number) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-agreement-sections", agreementID, pageNumber],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/sections`,
          {
            contractual_agreement_id: agreementID,
            pager: { page_size: pageSize, page_number: pageNumber },
          },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: agreementID !== "",
      keepPreviousData: false,
    }
  );
