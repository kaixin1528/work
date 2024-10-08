import { useMutation, useQuery } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";
import { KeyStringVal } from "src/types/general";

const prefix = "grc/frameworks";

export const GetRegulatoryAuthorities = (documentType: string) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-regulatory-authorities", documentType],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/regulatory-authorities?type=${documentType}`,
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

export const GetFrameworkChecklistQA = (frameworkID: string) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-framework-checklist-qa", frameworkID],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${frameworkID}/checklist_qa`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: frameworkID !== "" }
  );

export const GetFrameworks = (
  regAuth?: string,
  pageNumber?: number,
  tags?: string[],
  order?: KeyStringVal
) =>
  useQuery<
    any,
    unknown,
    any,
    (string | number | string[] | KeyStringVal | undefined)[]
  >(
    ["get-frameworks", regAuth, pageNumber, tags, order],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}`,
          {
            ...(regAuth &&
              regAuth !== "All" && { regulatory_authority: regAuth }),
            ...(pageNumber && {
              page_number: pageNumber,
              page_size: pageSize,
            }),
            ...(tags && { tags: tags }),
            ...(order?.order_by !== "" && { order: order }),
          },
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

export const GetFrameworksOrCirculars = (
  documentType: string,
  regAuth: string,
  regions: string[],
  verticals: string[],
  mappedToPolicy: string,
  pageNumber: number,
  tags: string[],
  order: KeyStringVal
) =>
  useQuery<
    any,
    unknown,
    any,
    (string | number | string[] | KeyStringVal | undefined)[]
  >(
    [
      "get-frameworks-or-circulars",
      documentType,
      regAuth,
      regions,
      verticals,
      mappedToPolicy,
      pageNumber,
      tags,
      order,
    ],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/${documentType}`,
          {
            ...(regAuth !== "All" && { regulatory_authority: regAuth }),
            ...(regions.length > 0 && { regions: regions }),
            ...(verticals.length > 0 && { verticals: verticals }),
            ...(mappedToPolicy !== "" && { filter: mappedToPolicy }),
            ...(pageNumber && {
              page_number: pageNumber,
              page_size: pageSize,
            }),
            ...(tags && { tags: tags }),
            ...(order?.order_by !== "" && { order: order }),
          },
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

export const GetFrameworksWithControls = () =>
  useQuery<
    any,
    unknown,
    any,
    (string | number | string[] | KeyStringVal | undefined)[]
  >(["get-frameworks-with-controls"], async ({ signal }) => {
    try {
      const res = await client.post(
        `/api/${apiVersion}/${prefix}`,
        { controls_only: true },
        {
          signal,
        }
      );
      return res?.data;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  });

export const GetAvailableFrameworks = (pageNumber: number, regAuth?: string) =>
  useQuery<any, unknown, any, (string | number | undefined)[]>(
    ["get-available-frameworks", pageNumber, regAuth],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/available${
            regAuth ? `?regulatory_authority=${regAuth}` : ""
          }`,
          {
            page_number: pageNumber,
            page_size: pageSize,
          },
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

export const GetFrameworkToPolicyGroupMappings = (
  frameworkID: string,
  policyIDs: string[]
) =>
  useQuery<any, unknown, any, (string | string[])[]>(
    ["get-framework-to-policy-group-mappings", frameworkID, policyIDs],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/framework_to_policy_group_mappings`,
          {
            framework_id: frameworkID,
            policy_ids: policyIDs,
          },
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: policyIDs.length > 0 }
  );

export const GetFrameworkOrCircularMetadata = (
  documentType: string,
  documentID: string
) =>
  useQuery<any, unknown, any, (string | string[])[]>(
    ["get-framework-or-circular-metadata", documentType, documentID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/grc/${documentType}/${documentID}`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: documentType !== "" && Boolean(documentID) }
  );

export const GetFrameworkOrCircularMetadataForEdit = (
  documentType: string,
  documentID: string,
  show: boolean
) =>
  useQuery<any, unknown, any, (string | string[])[]>(
    ["get-framework-or-circular-metadata-for-edit", documentType, documentID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/grc/${documentType}/${documentID}`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: documentType !== "" && Boolean(documentID) && show }
  );

export const UpdateFramework = (documentID: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      formData,
      signal,
    }: {
      formData: FormData;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.patch(
          `/api/${apiVersion}/${prefix}/${documentID}`,
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

export const ParseFrameworkMetadata = () =>
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

export const FilterFrameworks = () =>
  useMutation<any, unknown, any, string>(
    async ({
      frameworkIDs,
      signal,
    }: {
      frameworkIDs: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/customer`,
          frameworkIDs,
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
        queryClient.invalidateQueries(["get-frameworks"]);
        queryClient.invalidateQueries(["get-regulatory-authorities"]);
      },
    }
  );

export const CreateFramework = () =>
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
          `/api/${apiVersion}/${prefix}/new`,
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
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-frameworks"]);
        queryClient.invalidateQueries(["get-circulars"]);
      },
    }
  );

export const AddScanners = (documentID: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      scanners,
      signal,
    }: {
      scanners: string[];
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${documentID}/scanners/add`,
          scanners,
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
        queryClient.invalidateQueries(["get-frameworks"]);
        queryClient.invalidateQueries(["get-circulars"]);
      },
    }
  );

export const RemoveScanners = (documentID: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      scanners,
      signal,
    }: {
      scanners: string[];
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${documentID}/scanners/remove`,
          scanners,
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
        queryClient.invalidateQueries(["get-frameworks"]);
        queryClient.invalidateQueries(["get-circulars"]);
      },
    }
  );

export const GetFrameworkScanners = (documentID: string, show: boolean) =>
  useQuery<any, unknown, any, string[]>(
    ["get-framework-scanners", documentID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${documentID}/scanners`,
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
      enabled: documentID !== "" && show,
    }
  );

export const GetSectionIDsAndTitles = (documentID: string) =>
  useQuery<any, unknown, any, string[]>(
    ["get-section-ids-titles"],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${documentID}/sections/ids-and-titles`,
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
      enabled: documentID !== "",
    }
  );

export const UpdateSectionIDTitle = (documentID: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      generatedID,
      sectionID,
      sectionTitle,
      signal,
    }: {
      generatedID: string;
      sectionID: string;
      sectionTitle: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.patch(
          `/api/${apiVersion}/${prefix}/${documentID}/sections/${generatedID}`,
          { section_id: sectionID, section_title: sectionTitle },
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
        queryClient.invalidateQueries(["get-grc-document-sections-controls"]),
    }
  );
