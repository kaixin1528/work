import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";
import { KeyStringVal } from "src/types/general";

const prefix = "grc/policies/groups";

export const GetPolicyGroups = () =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-policy-groups"],
    async ({ signal }) => {
      try {
        const res = await client.get(`/api/${apiVersion}/${prefix}`, {
          signal,
        });
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

export const GetPolicyGroup = (policyGroupID: string) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-policy-group", policyGroupID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${policyGroupID}`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: policyGroupID !== "" }
  );

export const GetPoliciesFromGroup = (
  policyGroupID: string,
  pageNumber?: number
) =>
  useQuery<any, unknown, any, (string | number | undefined)[]>(
    ["get-policies-from-group", policyGroupID, pageNumber],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${policyGroupID}/policies`,
          pageNumber
            ? {
                page_number: pageNumber,
                page_size: pageSize,
              }
            : null,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: policyGroupID !== "", keepPreviousData: false }
  );

export const AddPolicyGroup = () =>
  useMutation<any, unknown, any, string>(
    async ({
      title,
      description,
      signal,
    }: {
      title: string;
      description: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}`,
          { title: title, description: description },
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
        queryClient.invalidateQueries(["get-policy-groups"]);
      },
    }
  );

export const UpdatePolicyGroup = () =>
  useMutation<any, unknown, any, string>(
    async ({
      policyGroupID,
      title,
      description,
      signal,
    }: {
      policyGroupID: string;
      title: string;
      description: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.patch(
          `/api/${apiVersion}/${prefix}/${policyGroupID}`,
          { title: title, description: description },
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
        queryClient.invalidateQueries(["get-policy-groups"]);
      },
    }
  );

export const RemovePolicyGroup = () =>
  useMutation<any, unknown, any, string>(
    async ({
      policyGroupID,
      signal,
    }: {
      policyGroupID: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.delete(
          `/api/${apiVersion}/${prefix}/${policyGroupID}`,
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
        queryClient.invalidateQueries(["get-policy-groups"]);
      },
    }
  );

export const AddPoliciesToPolicyGroup = () =>
  useMutation<any, unknown, any, string>(
    async ({
      policyGroupID,
      policyIDs,
      signal,
    }: {
      policyGroupID: string;
      policyIDs: string[];
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${policyGroupID}/policies/add`,
          { policy_ids: policyIDs },
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
        queryClient.invalidateQueries(["get-policy-groups"]);
        queryClient.invalidateQueries(["get-policies-from-group"]);
      },
    }
  );

export const RemovePoliciesFromPolicyGroup = () =>
  useMutation<any, unknown, any, string>(
    async ({
      policyGroupID,
      policyIDs,
      signal,
    }: {
      policyGroupID: string;
      policyIDs: string[];
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${policyGroupID}/policies/remove`,
          { policy_ids: policyIDs },
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
        queryClient.invalidateQueries(["get-policy-groups"]);
        queryClient.invalidateQueries(["get-policies-from-group"]);
      },
    }
  );

export const GetPolicies = (pageNumber?: number) =>
  useQuery<any, unknown, any, (string | number | undefined)[]>(
    ["get-policies", pageNumber],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/policies`,
          pageNumber
            ? {
                page_number: pageNumber,
                page_size: pageSize,
              }
            : null,
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

export const GetPolicyMapping = (policyID: string) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-policy-mapping", policyID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/grc/policies/${policyID}/frameworks_mapped`,
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
      enabled: policyID !== "",
    }
  );

export const GetPolicyDriftCoverage = (
  frameworkID: string,
  policyVersionID: string
) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-policy-drift-coverage", frameworkID, policyVersionID],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/frameworks/get_coverage_by_policy_version`,
          { framework_id: frameworkID, policy_version_id: policyVersionID },
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
      enabled: frameworkID !== "" && policyVersionID !== "",
    }
  );

export const GetPolicyDrift = (policyID: string) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-policy-drift", policyID],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/policies/get-policy-drift?policy_id=${policyID}`,
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
      enabled: policyID !== "",
    }
  );

export const GetPolicyDriftDiff = (
  sourceVersionID: string,
  targetVersionID: string
) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-policy-drift-diff", sourceVersionID, targetVersionID],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/policies/get-policy-drift-diff?source_version_id=${sourceVersionID}&target_version_id=${targetVersionID}`,
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
      enabled: sourceVersionID !== "" && targetVersionID !== "",
    }
  );

export const RemovePolicy = () => {
  const navigate = useNavigate();

  return useMutation<any, unknown, any, string>(
    async ({ policyID, signal }: { policyID: string; signal: AbortSignal }) => {
      try {
        const res = await client.delete(
          `/api/${apiVersion}/grc/policies/${policyID}`,
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
        queryClient.invalidateQueries(["get-policies-from-group"]);
        navigate("/regulation-policy/summary");
      },
    }
  );
};

export const UpdatePolicyName = () =>
  useMutation<any, unknown, any, string>(
    async ({
      policyID,
      formData,
      signal,
    }: {
      policyID: string;
      formData: FormData;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.patch(
          `/api/${apiVersion}/grc/policies/${policyID}`,
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
        queryClient.invalidateQueries(["get-grc-document-metadata"]);
        queryClient.invalidateQueries(["get-grc-document-sections-controls"]);
      },
    }
  );

export const UpdatePolicySections = () =>
  useMutation<any, unknown, any, string>(
    async ({
      policyID,
      editSections,
      signal,
    }: {
      policyID: string;
      editSections: any;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.patch(
          `/api/${apiVersion}/grc/policies/${policyID}/sections`,
          editSections,
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
        queryClient.invalidateQueries(["get-grc-document-metadata"]);
        queryClient.invalidateQueries(["get-grc-document-sections-controls"]);
      },
    }
  );

export const GetPolicyVersions = (selectedCategory: string, policyID: string) =>
  useQuery<any, unknown, any, string[]>(
    ["get-policy-versions", selectedCategory, policyID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/grc/policies/${policyID}/versions`,
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
      enabled: selectedCategory === "policies" && policyID !== "",
    }
  );

export const UploadPolicyVersion = () =>
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
          `/api/${apiVersion}/grc/policies/versions`,
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

export const DeletePolicyVersion = (policyID: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      versionID,
      signal,
    }: {
      versionID: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.delete(
          `/api/${apiVersion}/grc/policies/${policyID}/versions/${versionID}`,
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
        queryClient.invalidateQueries(["get-grc-document-metadata"]);
        queryClient.invalidateQueries(["get-policy-versions"]);
      },
    }
  );

export const SuggestNewMappingDocs = (versionID: string, filter: string) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["suggest-new-mapping-docs", versionID, filter],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/policies/${versionID}/suggest_mappings_docs`,
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
      enabled: versionID !== "" && filter === "Suggest New Mapping",
    }
  );

export const SuggestNewMapping = (
  versionID: string,
  frameworkID: string,
  pageNumber: number,
  filter: string,
  controlsOnly: boolean
) =>
  useQuery<any, unknown, any, (string | number | boolean)[]>(
    [
      "suggest-new-mapping",
      versionID,
      frameworkID,
      pageNumber,
      filter,
      controlsOnly,
    ],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/policies/${versionID}/suggest_mappings`,
          {
            framework_id: frameworkID,
            pager: {
              page_size: pageSize,
              page_number: pageNumber,
            },
            controls_only: controlsOnly,
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
    {
      enabled:
        versionID !== "" &&
        frameworkID !== "" &&
        filter === "Suggest New Mapping",
    }
  );

export const GenerateSOP = () =>
  useMutation<any, unknown, any, string[]>(
    async ({
      versionID,
      documentID,
      generatedID,
      signal,
    }: {
      versionID: string;
      documentID: string;
      generatedID: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/policies/${versionID}/generate_sop?document_id=${documentID}&generated_id=${generatedID}`,
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
        queryClient.invalidateQueries(["get-grc-document-sections-controls"]);
      },
    }
  );

export const GetSuggestSection = () =>
  useMutation<any, unknown, any, string[]>(
    async ({
      versionID,
      index,
      signal,
    }: {
      versionID: string;
      index: number;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/grc/policies/${versionID}/suggest_section?index=${index}`,
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

export const CopyUpdateVersion = () =>
  useMutation<any, unknown, any, string[]>(
    async ({
      policyID,
      versionID,
      versionNumber,
      sections,
      signal,
    }: {
      policyID: string;
      versionID: string;
      versionNumber: string;
      sections: KeyStringVal;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/policies/${policyID}/copy_and_update_version`,
          {
            old_version_id: versionID,
            version_number: versionNumber,
            new_sections: sections,
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

export const UpdateSOP = () =>
  useMutation<any, unknown, any, string[]>(
    async ({
      versionID,
      frameworkID,
      editSOP,
      signal,
    }: {
      versionID: string;
      frameworkID: string;
      editSOP: any;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.patch(
          `/api/${apiVersion}/grc/policies/${versionID}/sop_override?document_id=${frameworkID}`,
          editSOP,
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

export const GetUserGeneratedPreview = (versionID: string, status: string) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-user-generated-preview", versionID],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/policies/${versionID}/user_generated_sections`,
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
      enabled: versionID !== "" && status === "parsing",
    }
  );

export const GetDocumentAuditTrail = (policyID: string, pageNumber: number) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-document-audit-trail", policyID, pageNumber],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/policies/${policyID}/audit_trail`,
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
    { enabled: policyID !== "" }
  );

export const GetDuplicateSections = () =>
  useMutation<any, unknown, any, string>(
    async ({
      generatedID,
      signal,
    }: {
      generatedID: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/grc/policies/${generatedID}/duplicate_sections`,
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

export const GetMappedDocuments = (
  documentType: string,
  documentID: string,
  policyVersionID: string
) =>
  useQuery<any, unknown, any, (string | (string | null)[])[]>(
    ["get-mapped-documents", documentType, documentID, policyVersionID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/grc/${documentType}/${documentID}/mapped-documents${
            documentType === "policies"
              ? `?policy_version_id=${policyVersionID}`
              : ""
          }`,
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

export const GetVersionID = () =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      policyID,
      versionID,
      signal,
    }: {
      policyID: string;
      versionID: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/grc/policies/${policyID}/versions/${versionID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

export const GeneratePolicyFromControl = (
  policyID: string,
  context: string,
  domain: string,
  filter: string
) =>
  useQuery<any, unknown, any, (string | (string | null)[])[]>(
    ["generate-policy-from-control", policyID, domain, context],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/policies/generate_policy_from_control`,
          {
            policy_id: policyID,
            domain: domain,
            context: context,
          },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled:
        filter === "Policy Generation" && domain !== "" && context !== "",
      keepPreviousData: false,
    }
  );
