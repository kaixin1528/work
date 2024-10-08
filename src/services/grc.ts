import { useMutation, useQuery } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";
import { KeyStringVal } from "src/types/general";

const documentPrefix = "grc/documents";
const mappingPrefix = "grc/mapping";
const discussionPrefix = "grc/discussions";
const notePrefix = "grc/notes";
const redliningPrefix = "grc/redlining";

export const GetGRCDocumentFAQ = (documentID: string) =>
  useQuery<any, unknown, any, string[]>(
    ["get-grc-document-faqs", documentID],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${documentPrefix}/document-faqs?document_id=${documentID}`,
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

export const GetGRCDocumentMetadata = (
  documentType: string,
  documentID: string
) =>
  useQuery<any, unknown, any, string[]>(
    ["get-grc-document-metadata", documentType, documentID],
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
    {
      enabled: documentID !== "",
    }
  );

export const GetDocumentStatus = (
  documentType: string,
  documentID: string,
  versionID?: string
) =>
  useQuery<any, unknown, any, (string | undefined)[]>(
    ["get-document-status", documentType, documentID, versionID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/grc/${documentType}/${documentID}/status${
            versionID && !["", "undefined"].includes(versionID)
              ? `?version_id=${versionID}`
              : ""
          }`,
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
        documentType !== "" &&
        documentID !== "" &&
        (documentType !== "policies" ||
          (documentType === "policies" && versionID !== "")),
      keepPreviousData: false,
    }
  );

export const GetDocumentSummary = (documentID: string) =>
  useQuery<any, unknown, any, (string | undefined)[]>(
    ["get-document-summary", documentID],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${documentPrefix}/document-summary?document_id=${documentID}`,
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

export const GetGRCTables = (documentID: string) =>
  useQuery<any, unknown, any, (string | number | boolean | undefined)[]>(
    ["get-grc-tables", documentID],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${documentPrefix}/${documentID}/tables`,
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
      keepPreviousData: true,
    }
  );

export const EditTable = (documentID: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({
      table,
      version,
      approvers,
      reviewers,
      signal,
    }: {
      table: any;
      version: string;
      approvers: string[];
      reviewers: string[];
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${documentPrefix}/${documentID}/save-edited-table`,
          {
            table: table,
            version: version,
            approvers: approvers,
            reviewers: reviewers,
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
      onSuccess: () => queryClient.invalidateQueries(["get-grc-tables"]),
    }
  );

export const MergeColumns = (
  documentID: string,
  tableID: string,
  versionID: string
) =>
  useMutation<any, unknown, any, string>(
    async ({ columns, signal }: { columns: string[]; signal: AbortSignal }) => {
      try {
        const res = await client.patch(
          `/api/${apiVersion}/${documentPrefix}/${documentID}/merge-table-columns`,
          {
            version_id: Number(versionID) + 1,
            table_id: tableID,
            merged_column_names: columns,
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
      onSuccess: () => {
        queryClient.invalidateQueries(["get-grc-tables"]);
      },
    }
  );

export const UpdateTableReviewers = (generatedID: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({
      reviewers,
      signal,
    }: {
      reviewers: string[];
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${documentPrefix}/update-table-reviewers`,
          {
            table_id: generatedID,
            new_reviewers: reviewers,
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
      onSuccess: () => queryClient.invalidateQueries(["get-grc-tables"]),
    }
  );

export const ApproveTable = (tableID: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({
      approvers,
      signal,
    }: {
      approvers: string[];
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${documentPrefix}/approve-table`,
          {
            table_id: tableID,
            approvers: approvers,
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
      onSuccess: () => queryClient.invalidateQueries(["get-grc-tables"]),
    }
  );

export const GetGRCImages = (documentID: string) =>
  useQuery<any, unknown, any, (string | number | boolean | undefined)[]>(
    ["get-grc-images", documentID],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${documentPrefix}/${documentID}/images`,
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

export const SearchGRC = () =>
  useMutation<any, unknown, any, string[]>(
    async ({
      query,
      type,
      searchType,
      signal,
    }: {
      query: string;
      type: string;
      searchType: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/search`,
          {
            query: query,
            ...(type && { type: type }),
            search_type: searchType,
            pager: {
              page_size: pageSize,
              page_number: 1,
            },
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

export const GetGRCMapping = (
  documentType: string,
  documentTab: string,
  documentID: string,
  generatedID: string,
  auditID: string,
  selectedMappingType: string,
  policyID: string
) =>
  useQuery<any, unknown, any, (string | number)[]>(
    [
      "get-grc-mapping",
      documentType,
      documentTab,
      documentID,
      generatedID,
      auditID,
      selectedMappingType,
      policyID,
    ],
    async ({ signal }) => {
      const opposite =
        documentType === "policies" ||
        (documentType !== "policies" && selectedMappingType === "Policy");
      const rfsToRfs =
        documentTab !== "Audit Report" && selectedMappingType === "RFS";
      const control = selectedMappingType === "Relevant Sections";
      const auditToRfs = documentTab === "Audit Report";
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/${
            opposite
              ? "mapping"
              : rfsToRfs
              ? "frameworks/regulation_to_regulation_mapping"
              : control
              ? "frameworks/regulation_self_control_mapping"
              : auditToRfs
              ? "third_party_review/audit_to_regulation_mapping"
              : ""
          }`,
          {
            ...((opposite || auditToRfs) && { document_id: documentID }),
            ...((rfsToRfs || control) && {
              regulation_framework_id: documentID,
            }),
            document_id: documentID,
            generated_id: generatedID,
            ...((documentType === "policies" ||
              (documentType !== "policies" &&
                selectedMappingType === "Policy")) && {
              query_type: documentType === "policies" ? "Policy" : "RFS",
            }),
            ...(policyID !== "" && { policy_document_id: policyID }),
            ...(auditToRfs && auditID !== "" && { audit_id: auditID }),
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
      enabled: documentID !== "" && generatedID !== "",
      keepPreviousData: false,
    }
  );

// update mapping sub section id
export const UpdateMapping = () =>
  useMutation<any, unknown, any, string>(
    async ({
      oldID,
      newID,
      mappingID,
      policyID,
      frameworkID,
      signal,
    }: {
      oldID: string;
      newID: string;
      mappingID: string;
      policyID: string;
      frameworkID: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/frameworks/update_mapping`,
          {
            old_id: oldID,
            new_id: newID,
            mapping_id: mappingID,
            policy_id: policyID,
            regulation_framework_id: frameworkID,
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
        queryClient.invalidateQueries(["get-framework-mapping"]);
      },
    }
  );

// get feedback to mapping
export const GetMappingFeedback = (
  documentType: string,
  documentID: string | undefined,
  mappingID: string | undefined,
  showFeedback: boolean
) =>
  useQuery<any, unknown, any, (string | boolean | undefined)[]>(
    ["get-mapping-feedback", documentType, documentID, mappingID, showFeedback],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/grc/${documentType}/${documentID}/feedback/${mappingID}`,
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
        documentID !== "" &&
        documentID !== "" &&
        documentType !== "" &&
        mappingID !== "" &&
        showFeedback,
      keepPreviousData: false,
    }
  );

// update feedback to mapping
export const UpdateMappingFeedback = (
  documentType: string,
  documentID: string
) =>
  useMutation<any, unknown, any, string[]>(
    async ({
      mappingID,
      feedback,
      signal,
    }: {
      mappingID: string;
      feedback: number;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/${documentType}/${documentID}/feedback/${mappingID}?feedback=${feedback}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

// add mapping
export const AddMapping = () =>
  useMutation<any, unknown, any, string[]>(
    async ({
      sourceDocumentID,
      targetDocumentID,
      sourceSectionID,
      targetSectionID,
      signal,
    }: {
      sourceDocumentID: string;
      targetDocumentID: string;
      sourceSectionID: string;
      targetSectionID: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${mappingPrefix}/new`,
          {
            source_document_id: sourceDocumentID,
            target_document_id: targetDocumentID,
            source_section_generated_id: sourceSectionID,
            target_section_generated_id: targetSectionID,
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
        queryClient.invalidateQueries(["get-grc-mapping"]);
        queryClient.invalidateQueries(["get-rfs-to-rfs-mapping"]);
      },
    }
  );

// delete mapping
export const DeleteMapping = () =>
  useMutation<any, unknown, any, string[]>(
    async ({
      mappingID,
      signal,
    }: {
      mappingID: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.delete(
          `/api/${apiVersion}/${mappingPrefix}/${mappingID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-grc-mapping"]);
        queryClient.invalidateQueries(["get-rfs-to-rfs-mapping"]);
      },
    }
  );

export const GetDocumentTags = (
  documentType: string,
  regAuth?: string,
  documentID?: string | (string | null)[] | null
) =>
  useQuery<
    any,
    unknown,
    any,
    (string | (string | null)[] | null | undefined)[]
  >(
    ["get-document-tags", documentType, regAuth, documentID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/grc/${documentType}/tags${
            documentID
              ? `?document_id=${documentID}`
              : regAuth && regAuth !== "All"
              ? `?regulatory_authority=${regAuth}`
              : ""
          }`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { keepPreviousData: false }
  );

export const CreateDocumentTag = (documentType: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({ title, signal }: { title: string; signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/${documentType}/tags`,
          {
            title: title,
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
      onSuccess: () => {
        queryClient.invalidateQueries(["get-document-tags"]);
        queryClient.invalidateQueries(["get-frameworks"]);
        queryClient.invalidateQueries(["get-circulars"]);
        queryClient.invalidateQueries(["get-agreement-contract-reviews"]);
      },
    }
  );

export const DeleteDocumentTag = (documentType: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({ tagID, signal }: { tagID: string; signal: AbortSignal }) => {
      try {
        const res = await client.delete(
          `/api/${apiVersion}/grc/${documentType}/tags/${tagID}`,
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
        queryClient.invalidateQueries(["get-document-tags"]);
        queryClient.invalidateQueries(["get-frameworks"]);
        queryClient.invalidateQueries(["get-circulars"]);
        queryClient.invalidateQueries(["get-assessment-list"]);
      },
    }
  );

export const AddDocumentTag = (documentType: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      documentID,
      tags,
      signal,
    }: {
      documentID: string;
      tags: string[];
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/${documentType}/tags/add`,
          {
            entity_id: documentID,
            entity_type: "document",
            tags: tags,
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
      onSuccess: () => {
        queryClient.invalidateQueries(["get-document-tags"]);
        queryClient.invalidateQueries(["get-frameworks"]);
        queryClient.invalidateQueries(["get-circulars"]);
      },
    }
  );

export const RemoveDocumentTag = (documentType: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      documentID,
      tags,
      signal,
    }: {
      documentID: string;
      tags: string[];
      signal: AbortSignal;
    }) => {
      try {
        await client.post(
          `/api/${apiVersion}/grc/${documentType}/tags/remove`,
          {
            entity_id: documentID,
            entity_type: documentType,
            tags: tags,
          },
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-document-tags"]);
        queryClient.invalidateQueries(["get-frameworks"]);
        queryClient.invalidateQueries(["get-circulars"]);
      },
    }
  );

export const GetGRCDiscussion = (
  documentID: string,
  anchorID: string,
  discussionComponent: string
) =>
  useQuery<
    any,
    unknown,
    any,
    (string | (string | null)[] | null | undefined)[]
  >(
    ["get-grc-discussion", documentID, anchorID, discussionComponent],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${discussionPrefix}/${documentID}/${anchorID}?discussion_component=${discussionComponent}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { keepPreviousData: false }
  );

export const AddToDiscussion = (
  documentID: string,
  anchorID: string,
  discussionComponent: string
) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      comments,
      email_list,
      signal,
    }: {
      comments: string;
      email_list: string[];
      signal: AbortSignal;
    }) => {
      try {
        await client.post(
          `/api/${apiVersion}/${discussionPrefix}/${documentID}/${anchorID}/new?discussion_component=${discussionComponent}`,
          {
            comments,
            email_list,
          },
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => queryClient.invalidateQueries(["get-grc-discussion"]),
    }
  );

export const EditDiscussionComment = (
  documentID: string,
  anchorID: string,
  discussionComponent: string
) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      discussion_id,
      comments,
      email_list,
      signal,
    }: {
      discussion_id: string;
      comments: string;
      email_list: string[];
      signal: AbortSignal;
    }) => {
      try {
        await client.patch(
          `/api/${apiVersion}/${discussionPrefix}/${documentID}/${anchorID}?discussion_component=${discussionComponent}`,
          {
            discussion_id,
            comments,
            email_list,
          },
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => queryClient.invalidateQueries(["get-grc-discussion"]),
    }
  );

export const RemoveDiscussionComment = (
  documentID: string,
  discussionComponent: string
) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      discussionID,
      signal,
    }: {
      discussionID: string;
      signal: AbortSignal;
    }) => {
      try {
        await client.delete(
          `/api/${apiVersion}/${discussionPrefix}/${documentID}/${discussionID}?discussion_component=${discussionComponent}`,
          { signal }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => queryClient.invalidateQueries(["get-grc-discussion"]),
    }
  );

export const GetGRCNotes = (documentID: string, anchorID: string) =>
  useQuery<any, unknown, any, (string | boolean | string[])[]>(
    ["get-grc-notes", documentID, anchorID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${notePrefix}/${documentID}/${anchorID}/notes`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: documentID !== "" && anchorID !== "",
      keepPreviousData: false,
    }
  );

export const AddGRCNote = (documentID: string, anchorID: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({ note, signal }: { note: KeyStringVal; signal: AbortSignal }) => {
      try {
        await client.post(
          `/api/${apiVersion}/${notePrefix}/${documentID}/${anchorID}/notes`,
          note,
          {
            signal,
          }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-grc-notes"]);
      },
    }
  );

export const UpdateGRCNote = (documentID: string, anchorID: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({ note, signal }: { note: KeyStringVal; signal: AbortSignal }) => {
      try {
        await client.patch(
          `/api/${apiVersion}/${notePrefix}/${documentID}/${anchorID}/notes`,
          note,
          {
            signal,
          }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-grc-notes"]);
      },
    }
  );

export const DeleteGRCNote = (documentID: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({ noteID, signal }: { noteID: string; signal: AbortSignal }) => {
      try {
        await client.delete(
          `/api/${apiVersion}/${notePrefix}/${documentID}/${noteID}/notes`,
          {
            signal,
          }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-grc-notes"]);
      },
    }
  );

export const GetRedliningList = (documentID: string) =>
  useQuery<any, unknown, any, (string | boolean | string[])[]>(
    ["get-redlining-list", documentID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${redliningPrefix}/${documentID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: documentID !== "",
      keepPreviousData: false,
    }
  );

export const CreateRedlining = (documentID: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({ redlining, signal }: { redlining: any; signal: AbortSignal }) => {
      try {
        await client.post(
          `/api/${apiVersion}/${redliningPrefix}/${documentID}`,
          redlining,
          {
            signal,
          }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-grc-notes"]);
      },
    }
  );

export const DeleteRedlining = (documentID: string) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({
      redliningID,
      signal,
    }: {
      redliningID: string;
      signal: AbortSignal;
    }) => {
      try {
        await client.delete(
          `/api/${apiVersion}/${redliningPrefix}/${documentID}/${redliningID}`,
          {
            signal,
          }
        );
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-redlining-list"]);
      },
    }
  );
