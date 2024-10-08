/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { parseURL } from "src/utils/general";
import { GetUserGeneratedPreview } from "src/services/regulation-policy/policy";
import DocumentSummary from "./DocumentSummary";
import FAQ from "./FAQ";
import DocumentTabs from "./DocumentTabs";
import Sections from "./Sections/Sections";
import DocumentSearch from "./DocumentSearch";
import { GetDocumentStatus, GetGRCDocumentMetadata } from "src/services/grc";
import { ColorRing } from "react-loader-spinner";
import AuditTrail from "./AuditTrail/AuditTrail";
import Subsection from "./Sections/Subsection/Subsection";
import { GetGRCDocumentSectionsControls } from "src/services/regulation-policy/regulation-policy";
import Tables from "./Tables/Tables";
import Images from "./Images";
import Coverage from "./Coverage/Coverage";
import Checklist from "./Checklist";
import { KeyStringVal } from "src/types/general";
import SideBySideView from "./SideBySideView/SideBySideView";

const DocumentDetail = ({
  documentType,
  documentID,
  selectedPolicyVersion,
  setSelectedPolicyVersion,
  editSections,
  documentModified,
  setEditSections,
  setDocumentModified,
}: {
  documentType: string;
  documentID: string;
  selectedPolicyVersion: string;
  setSelectedPolicyVersion: (selectedPolicyVersion: string) => void;
  editSections: any;
  documentModified: any;
  setEditSections: any;
  setDocumentModified: any;
}) => {
  const parsed = parseURL();

  const [selectedTab, setSelectedTab] = useState<string>(
    documentType === "policies" ? "Sections" : "Controls"
  );
  const [filter, setFilter] = useState<string>("All");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [search, setSearch] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [controlFilters, setControlFilters] = useState<KeyStringVal>({
    context: "",
    domain: "",
    sub_domain: "",
  });

  const policyVersionID = String(parsed.policy_version_id) || "";
  const isPolicy = documentType === "policies";
  const docID = isPolicy ? policyVersionID : String(parsed.document_id) || "";

  const { data: documentStatus } = GetDocumentStatus(
    documentType,
    documentID,
    policyVersionID
  );
  const { data: documentMetadata } = GetGRCDocumentMetadata(
    documentType,
    documentID
  );
  const { data: userGeneratedPreview } = GetUserGeneratedPreview(
    docID,
    documentStatus?.status
  );
  const {
    data: table,
    status: tableStatus,
    refetch,
    isFetching,
  } = GetGRCDocumentSectionsControls(
    documentStatus?.status,
    documentType,
    documentID,
    docID,
    pageNumber,
    selectedTab,
    filter,
    controlFilters.context,
    controlFilters.domain,
    controlFilters.sub_domain,
    search,
    query
  );

  const documentName =
    documentMetadata?.framework_name || documentMetadata?.policy_name;

  useEffect(() => {
    if (query === "") setSearch(false);
  }, [query]);

  return (
    <section className="flex flex-col flex-grow mb-4">
      {documentStatus?.status === "failed" ? (
        <section className="grid place-content-center gap-10 w-full h-full text-center">
          <img src="/errors/503.svg" alt="error" className="mx-auto h-72" />
          <h4>
            Oops! something went wrong! We will reach out to you shortly to help
            resolve the issue. Thanks for your patience.
          </h4>
        </section>
      ) : documentStatus?.status === "parsing" ? (
        userGeneratedPreview?.length > 0 ? (
          <section className="grid gap-5">
            <h4 className="flex items-center gap-1">
              <ColorRing
                visible={true}
                height="30"
                width="30"
                ariaLabel="color-ring-loading"
                wrapperStyle={{}}
                wrapperClass="color-ring-wrapper"
                colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
              />
              Preview of the newly added sections{" "}
            </h4>
            <article className="grid gap-5">
              {userGeneratedPreview?.map(
                (subsection: any, subSectionIndex: number) => {
                  return (
                    <Subsection
                      key={subSectionIndex}
                      documentName={documentName}
                      documentType={documentType}
                      docID={docID}
                      selectedTab={selectedTab}
                      subsection={subsection}
                      sectionIndex={1}
                      subSectionIndex={subSectionIndex}
                    />
                  );
                }
              )}
            </article>
          </section>
        ) : (
          <article className="flex items-center place-content-center gap-5">
            <img
              src={`/grc/${documentType}-placeholder.svg`}
              alt="placeholder"
              className="w-40 h-40"
            />
            <article className="grid gap-3">
              <h4>
                Your document has been received and is currently being processed
              </h4>
              <img
                src="/grc/data-parsing.svg"
                alt="data parsing"
                className="w-10 h-10"
              />
            </article>
          </article>
        )
      ) : (
        <section className="flex flex-col flex-grow content-start gap-3 h-full">
          <DocumentSearch
            search={search}
            isFetching={isFetching}
            query={query}
            setQuery={setQuery}
            setSearch={setSearch}
            refetch={refetch}
          />
          {!isPolicy && (
            <>
              <FAQ documentID={documentID} />
              <DocumentSummary documentID={documentID} />
            </>
          )}
          <DocumentTabs
            documentType={documentType}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
          {selectedTab === "Tables" ? (
            <Tables documentID={docID} />
          ) : selectedTab === "Images" ? (
            <Images documentID={documentID} />
          ) : selectedTab === "Audit Trail" ? (
            <AuditTrail documentID={documentID} />
          ) : selectedTab === "Checklist" ? (
            <Checklist documentID={documentID} />
          ) : selectedTab === "Side-by-Side View" ? (
            <SideBySideView
              documentType={documentType}
              documentID={documentID}
              policyVersionID={policyVersionID}
              sourceDocumentID={docID}
            />
          ) : selectedTab === "Coverage" ? (
            <Coverage documentID={documentID} />
          ) : (
            <Sections
              table={table}
              tableStatus={tableStatus}
              documentName={documentName}
              documentType={documentType}
              documentID={documentID}
              docID={docID}
              selectedPolicyVersion={selectedPolicyVersion}
              setSelectedPolicyVersion={setSelectedPolicyVersion}
              selectedTab={selectedTab}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              filter={filter}
              setFilter={setFilter}
              controlFilters={controlFilters}
              setControlFilters={setControlFilters}
              search={search}
              setSearch={setSearch}
              query={query}
              editSections={editSections}
              setEditSections={setEditSections}
              documentModified={documentModified}
              setDocumentModified={setDocumentModified}
            />
          )}
        </section>
      )}
    </section>
  );
};

export default DocumentDetail;
