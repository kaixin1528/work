/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import ReturnPage from "src/components/Button/ReturnPage";
import PageLayout from "src/layouts/PageLayout";
import DocumentMetadata from "./DocumentMetadata/DocumentMetadata";
import DocumentDetail from "./DocumentDetail/DocumentDetail";
import { parseURL } from "src/utils/general";
import { GetPolicyGroups } from "src/services/regulation-policy/policy";
import { KeyStringVal } from "src/types/general";

const Document = () => {
  const parsed = parseURL();

  const [selectedPolicyVersion, setSelectedPolicyVersion] =
    useState<string>("");
  const [editSections, setEditSections] = useState<any>({});
  const [documentModified, setDocumentModified] = useState<string[]>([]);

  const { data: policyGroups } = GetPolicyGroups();

  const policyGroup = policyGroups?.find(
    (group: KeyStringVal) =>
      group.policy_group_id === sessionStorage.selectedPolicyGroupID
  )?.title;
  const documentType = String(parsed.document_type) || "";
  const documentID = String(parsed.document_id) || "";

  return (
    <PageLayout>
      <main className="relative flex flex-col flex-grow gap-5 px-5 pt-5 h-full w-full overflow-auto scrollbar">
        <article className="flex items-center text-xl capitalize">
          {documentType === "policies" ? (
            <span>Policy Group: {policyGroup}</span>
          ) : (
            <span>{documentType.replace("s", "")}</span>
          )}
        </article>
        <ReturnPage />
        <DocumentMetadata
          documentType={documentType}
          documentID={documentID}
          selectedPolicyVersion={selectedPolicyVersion}
          setSelectedPolicyVersion={setSelectedPolicyVersion}
          editSections={editSections}
          documentModified={documentModified}
          setEditSections={setEditSections}
          setDocumentModified={setDocumentModified}
        />
        <DocumentDetail
          documentType={documentType}
          documentID={documentID}
          selectedPolicyVersion={selectedPolicyVersion}
          setSelectedPolicyVersion={setSelectedPolicyVersion}
          editSections={editSections}
          documentModified={documentModified}
          setEditSections={setEditSections}
          setDocumentModified={setDocumentModified}
        />
      </main>
    </PageLayout>
  );
};

export default Document;
