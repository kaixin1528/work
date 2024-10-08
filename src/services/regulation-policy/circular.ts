import { useQuery } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";
import { KeyStringVal } from "src/types/general";

const prefix = "grc/circulars";

export const GetCirculars = (
  order: KeyStringVal,
  tags: string[],
  filter: string
) =>
  useQuery<any, unknown, any, (string | boolean | KeyStringVal | string[])[]>(
    ["get-circulars", order, tags, filter],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}`,
          {
            ...(order.order_by !== "" && { order: order }),
            tags: tags,
            ...(filter !== "" && { filter: filter }),
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

export const GetCircularSourceHighlights = (
  documentType: string,
  sourceDocID: string,
  targetDocID: string
) =>
  useQuery<any, unknown, any, (string | boolean | KeyStringVal | string[])[]>(
    ["get-circular-source-highlights", documentType, sourceDocID, targetDocID],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/${documentType}/${
            documentType === "policies" ? "framework" : "policy"
          }_mapping`,
          {
            source_document: sourceDocID,
            target_document: targetDocID,
          },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: sourceDocID !== "" && targetDocID !== "",
      keepPreviousData: false,
    }
  );

export const GetCircularMappedPdf = (
  documentType: string,
  sourceDocument: string | (string | null)[],
  targetDocument: string | (string | null)[],
  mappingType: string | (string | null)[],
  viewType: string
) =>
  useQuery<any, unknown, any, (string | (string | null)[])[]>(
    [
      "get-circular-mapped-pdf",
      sourceDocument,
      targetDocument,
      mappingType,
      viewType,
    ],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/${documentType}/mapped-pdf`,
          {
            source_document: sourceDocument,
            target_document: targetDocument,
            mapping_type: mappingType,
            view_type: viewType,
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
        sourceDocument !== "" && targetDocument !== "" && mappingType !== "",
      keepPreviousData: false,
    }
  );

export const GetPdfPreview = (
  sourceDocumentID: string | (string | null)[],
  targetDocumentID: string | (string | null)[],
  documentType: string
) =>
  useQuery<any, unknown, any, (string | (string | null)[])[]>(
    ["get-pdf-preview", sourceDocumentID, targetDocumentID, documentType],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/policies/pdf-preview?document_name=${sourceDocumentID}&document_type=${documentType}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: sourceDocumentID !== "" && documentType !== "",
      keepPreviousData: false,
    }
  );
