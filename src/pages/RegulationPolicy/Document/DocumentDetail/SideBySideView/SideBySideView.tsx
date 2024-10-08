/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { KeyStringVal } from "src/types/general";
import { targetDoc } from "src/constants/grc";
import {
  GetCircularMappedPdf,
  GetCircularSourceHighlights,
  GetPdfPreview,
} from "src/services/regulation-policy/circular";
import DocumentFilter from "src/components/Filter/RegulationPolicy/DocumentFilter";
import { GetMappedDocuments } from "src/services/regulation-policy/policy";
import Table from "./Table";
import PDF from "./PDF/PDF";

const SideBySideView = ({
  documentType,
  documentID,
  policyVersionID,
  sourceDocumentID,
}: {
  documentType: string;
  documentID: string;
  policyVersionID: string;
  sourceDocumentID: string;
}) => {
  const [selectedTargetDoc, setSelectedTargetDoc] =
    useState<KeyStringVal>(targetDoc);
  const [selectedSourceHighlight, setSelectedSourceHighlight] =
    useState<string>("");
  const [selectedTargetHighlight, setSelectedTargetHighlight] =
    useState<string>("");
  const [selectedTargetFormat, setSelectedTargetFormat] =
    useState<string>("pdf");

  const mappingType =
    documentType === "policies"
      ? "policy_to_regulation"
      : "regulation_to_policy";

  const { data: sourcePDF } = GetPdfPreview(
    sourceDocumentID,
    selectedTargetDoc.document_id,
    documentType === "policies" ? "policies" : "regulation"
  );
  const { data: mappedDocumentList } = GetMappedDocuments(
    documentType,
    documentID,
    policyVersionID
  );
  const { data: sourceHighlights } = GetCircularSourceHighlights(
    documentType,
    sourceDocumentID,
    selectedTargetDoc.document_id || ""
  );
  const { data: targetPDF } = GetCircularMappedPdf(
    documentType,
    selectedTargetDoc.document_id,
    sourceDocumentID,
    mappingType,
    selectedTargetFormat
  );

  const targetHighlights =
    selectedSourceHighlight !== ""
      ? targetPDF?.mappings_by_id[selectedSourceHighlight] || []
      : [];

  useEffect(() => {
    if (mappedDocumentList?.length > 0 && selectedTargetDoc.document_id === "")
      setSelectedTargetDoc(mappedDocumentList[0]);
  }, [mappedDocumentList]);

  useEffect(() => {
    if (targetHighlights?.length > 0)
      setSelectedTargetHighlight(targetHighlights[0].id);
  }, [targetHighlights]);

  return (
    <section className="flex flex-col flex-grow gap-5 w-full h-full p-4">
      <article className="flex items-center place-content-end gap-10 w-full">
        <nav className="flex items-center gap-5">
          {["pdf", "table"].map((format) => (
            <button
              key={format}
              className={`uppercase ${
                selectedTargetFormat === format
                  ? "full-underlined-label"
                  : "hover:border-b dark:hover:border-signin"
              }`}
              onClick={() => setSelectedTargetFormat(format)}
            >
              {format}
            </button>
          ))}
        </nav>
        {mappedDocumentList ? (
          mappedDocumentList.length > 0 ? (
            <DocumentFilter
              list={mappedDocumentList}
              selectedDocument={selectedTargetDoc}
              setSelectedDocument={setSelectedTargetDoc}
            />
          ) : (
            <p>No mappings found</p>
          )
        ) : null}
      </article>
      <section className="grid md:grid-cols-2 gap-20">
        {sourcePDF && (
          <PDF
            url={sourcePDF?.bucket_url}
            highlights={sourceHighlights?.data}
            selectedHighlight={selectedSourceHighlight}
            setSelectedHighlight={setSelectedSourceHighlight}
            type="source"
          />
        )}
        {selectedTargetDoc.document_path ? (
          selectedTargetFormat === "pdf" ? (
            <PDF
              url={targetPDF?.url}
              highlights={targetHighlights}
              selectedHighlight={selectedTargetHighlight}
              setSelectedHighlight={setSelectedTargetHighlight}
              type="target"
            />
          ) : (
            <Table highlights={targetHighlights} />
          )
        ) : null}
      </section>
    </section>
  );
};

export default SideBySideView;
