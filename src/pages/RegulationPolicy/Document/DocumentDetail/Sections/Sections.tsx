/* eslint-disable react-hooks/exhaustive-deps */
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import Subsection from "./Subsection/Subsection";
import { useNavigate } from "react-router-dom";
import {
  convertToUTCShortString,
  parseURL,
} from "../../../../../utils/general";
import TablePagination from "../../../../../components/General/TablePagination";
import Loader from "../../../../../components/Loader/Loader";
import { pageSize } from "../../../../../constants/general";
import {
  GetPolicyVersions,
  SuggestNewMappingDocs,
  SuggestNewMapping,
  GeneratePolicyFromControl,
} from "../../../../../services/regulation-policy/policy";
import { KeyStringVal } from "../../../../../types/general";
import AddSectionsToPolicyVersion from "./AddSectionsToPolicyVersion/AddSectionsToPolicyVersion";
import SectionTabs from "./SectionTabs";
import ExportFile from "../../ExportFile/ExportFile";
import SelectFrameworkFilter from "../../../../../components/Filter/RegulationPolicy/SelectFrameworkFilter";
import queryString from "query-string";
import SectionContent from "./SectionContent";
import ControlFilter from "src/components/Filter/RegulationPolicy/ControlFilter";

const Sections = ({
  table,
  tableStatus,
  documentName,
  documentType,
  documentID,
  docID,
  selectedPolicyVersion,
  setSelectedPolicyVersion,
  selectedTab,
  pageNumber,
  setPageNumber,
  filter,
  setFilter,
  controlFilters,
  setControlFilters,
  search,
  setSearch,
  query,
  editSections,
  setEditSections,
  documentModified,
  setDocumentModified,
}: {
  table: any;
  tableStatus: string;
  documentName: string;
  documentType: string;
  documentID: string;
  docID: string;
  selectedPolicyVersion: string;
  setSelectedPolicyVersion: (selectedPolicyVersion: string) => void;
  selectedTab: string;
  pageNumber: number;
  setPageNumber: (pageNumber: number) => void;
  filter: string;
  setFilter: (filter: string) => void;
  controlFilters: KeyStringVal;
  setControlFilters: (controlFilters: KeyStringVal) => void;
  search: boolean;
  setSearch: (search: boolean) => void;
  query: string;
  editSections: any;
  setEditSections: any;
  documentModified: any;
  setDocumentModified: any;
}) => {
  const parsed = parseURL();
  const navigate = useNavigate();

  const [suggestFramework, setSuggestFramework] = useState<any>({
    id: "",
    name: "",
    regulatory_date: 0,
    regulatory_authority: "",
  });
  const [addSectionsToPolicy, setAddSectionsToPolicy] =
    useState<boolean>(false);
  const [selectedAddedSections, setSelectedAddedSections] = useState<any[]>([]);
  const [controlsOnly, setControlsOnly] = useState<boolean>(true);

  const { data: policyVersions } = GetPolicyVersions(documentType, documentID);

  const policyVersionID = String(parsed.policy_version_id) || "";
  const isPolicy = documentType === "policies";

  const { data: suggestMappingDocs } = SuggestNewMappingDocs(docID, filter);
  const { data: suggestNewMapping } = SuggestNewMapping(
    docID,
    suggestFramework?.id || "",
    pageNumber,
    filter,
    controlsOnly
  );
  const { data: policyGeneration } = GeneratePolicyFromControl(
    documentID,
    controlFilters.context,
    controlFilters.domain,
    filter
  );

  const filteredTable =
    filter === "Policy Generation"
      ? policyGeneration
      : filter === "Suggest New Mapping"
      ? suggestNewMapping
      : table;
  const sortedTable =
    filter === "Policy Generation"
      ? policyGeneration
      : filter === "Suggest New Mapping"
      ? suggestNewMapping?.data
      : table?.data;

  const totalCount = filteredTable?.pager?.total_results || 0;
  const totalPages = filteredTable?.pager?.num_pages || 0;
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;
  const versions = policyVersions?.reduce(
    (pV: string[], cV: KeyStringVal) => [...pV, cV.version],
    []
  );
  const filterRequired = filter === "Policy Generation" ? "(required)" : "";

  const sectionRef = useRef(
    Array(filteredTable?.data?.length).fill(null)
  ) as MutableRefObject<any[]>;

  const searchedRowIndex = sessionStorage.search_id
    ? filteredTable?.data
        ?.reduce((pV: any, cV: any) => [...pV, ...cV.sub_sections], [])
        .findIndex(
          (section: KeyStringVal) =>
            section.generated_id === sessionStorage.search_id
        )
    : -1;

  useEffect(() => {
    if (isPolicy && versions?.length > 0 && selectedPolicyVersion === "") {
      if (!parsed.policy_version_id) setSelectedPolicyVersion(versions[0]);
      else {
        const filteredPolicyVersion =
          policyVersions?.find(
            (version: KeyStringVal) => version.version_id === policyVersionID
          )?.version || "";
        setSelectedPolicyVersion(filteredPolicyVersion);
      }
    }
  }, [versions]);

  useEffect(() => {
    if (selectedPolicyVersion !== "") {
      const filteredPolicyVersionID = policyVersions?.find(
        (version: KeyStringVal) => version.version === selectedPolicyVersion
      )?.version_id;
      parsed.policy_version_id = filteredPolicyVersionID;
      navigate(`${window.location.pathname}?${queryString.stringify(parsed)}`);
    }
  }, [selectedPolicyVersion]);

  useEffect(() => {
    if (query === "") setSearch(false);
  }, [query]);

  useEffect(() => {
    setPageNumber(1);
  }, [filter]);

  useEffect(() => {
    if (sessionStorage.policy_id) sessionStorage.removeItem("policy_id");
    if (sessionStorage.search_id && filteredTable?.data?.length > 0) {
      if (sectionRef?.current && sectionRef?.current[searchedRowIndex])
        sectionRef.current[searchedRowIndex].scrollIntoView();
    }
  }, [sessionStorage, filteredTable]);

  useEffect(() => {
    if (suggestMappingDocs?.data.length > 0 && suggestFramework.id === "")
      setSuggestFramework(suggestMappingDocs?.data[0]);
  }, [suggestFramework.id, suggestMappingDocs]);

  useEffect(() => {
    setAddSectionsToPolicy(false);
    setSelectedAddedSections([]);
  }, [suggestFramework]);

  useEffect(() => {
    if (sessionStorage.section_tab) setFilter(sessionStorage.section_tab);
  }, [sessionStorage.section_tab]);

  return (
    <>
      {tableStatus === "loading" ? (
        <Loader />
      ) : (
        tableStatus === "success" && (
          <section className="flex flex-col flex-grow content-start gap-3 h-full">
            <article className="flex items-center justify-between gap-5">
              <SectionTabs
                documentType={documentType}
                selectedTab={selectedTab}
                filter={filter}
                setFilter={setFilter}
                setAddSectionsToPolicy={setAddSectionsToPolicy}
                setSelectedAddedSections={setSelectedAddedSections}
              />
              <ExportFile
                documentType={documentType}
                documentID={documentID}
                policyVersionID={docID}
              />
            </article>
            {filter === "Suggest New Mapping" && (
              <SelectFrameworkFilter
                selectedFramework={suggestFramework}
                setSelectedFramework={setSuggestFramework}
                list={suggestMappingDocs?.data}
                selectedTextSize="text-lg"
              />
            )}
            {filter === "Suggest New Mapping" &&
              suggestFramework?.name !== "" && (
                <article className="flex flex-wrap items-center gap-3 text-base dark:text-checkbox divide-x dark:divide-checkbox">
                  {suggestFramework.regulatory_date && (
                    <span>
                      {convertToUTCShortString(
                        suggestFramework.regulatory_date
                      )}
                    </span>
                  )}
                  {suggestFramework.regulatory_authority && (
                    <span className="pl-3">
                      {suggestFramework.regulatory_authority}
                    </span>
                  )}
                </article>
              )}
            {((documentType === "frameworks" && selectedTab === "Controls") ||
              filter === "Policy Generation") && (
              <article className="flex items-center gap-5">
                <ControlFilter
                  documentType={documentType}
                  documentID={documentID}
                  label={`Context ${filterRequired}`}
                  keyName="context"
                  inputs={controlFilters}
                  setInputs={setControlFilters}
                />
                <ControlFilter
                  documentType={documentType}
                  documentID={documentID}
                  label={`Domain ${filterRequired}`}
                  keyName="domain"
                  inputs={controlFilters}
                  setInputs={setControlFilters}
                />
                {documentType === "frameworks" && (
                  <ControlFilter
                    documentType={documentType}
                    documentID={documentID}
                    label={`Sub Domain ${filterRequired}`}
                    keyName="sub_domain"
                    inputs={controlFilters}
                    setInputs={setControlFilters}
                  />
                )}
              </article>
            )}
            <article className="flex items-center justify-between gap-10">
              <article className="flex items-center gap-5">
                {filter === "Suggest New Mapping" && (
                  <article className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={controlsOnly}
                      id="parse only"
                      className="form-checkbox w-4 h-4 border-0 dark:focus:ring-0 dark:text-signin dark:focus:border-signin focus:ring dark:focus:ring-offset-0 dark:focus:ring-signin focus:ring-opacity-50"
                      onChange={() => setControlsOnly(!controlsOnly)}
                    />
                    <label htmlFor="parse only">Controls Only</label>
                  </article>
                )}
                {filter === "Suggest New Mapping" && (
                  <AddSectionsToPolicyVersion
                    documentType={documentType}
                    documentID={documentID}
                    docID={docID}
                    selectedAddedSections={selectedAddedSections}
                    addSectionsToPolicy={addSectionsToPolicy}
                    setAddSectionsToPolicy={setAddSectionsToPolicy}
                    setSelectedAddedSections={setSelectedAddedSections}
                  />
                )}
              </article>
              {filter !== "Policy Generation" && (
                <TablePagination
                  totalPages={totalPages}
                  beginning={beginning}
                  end={end}
                  totalCount={totalCount}
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                />
              )}
            </article>
            {sortedTable ? (
              sortedTable.length > 0 ? (
                <ul className="grid gap-5">
                  {sortedTable.map((section: any, sectionIndex: number) => {
                    return (
                      <li
                        key={sectionIndex}
                        className={`grid content-start gap-3 p-4 bg-gradient-to-r ${
                          !isPolicy || filter === "Suggest New Mapping"
                            ? "dark:from-checkbox/70 dark:to-white/10"
                            : "dark:from-admin/70 dark:to-white/10"
                        } rounded-2xl`}
                      >
                        <header className="flex items-center gap-2 text-xl border-b dark:border-black">
                          {section.section_id && (
                            <span>{section.section_id}.</span>
                          )}
                          {section.title && section.title}
                          {!["-", "", null].includes(section.section_title) && (
                            <span>{section.section_title}</span>
                          )}
                        </header>
                        {filter === "Policy Generation" && section.content && (
                          <SectionContent
                            section={section}
                            sectionIndex={String(sectionIndex)}
                          />
                        )}
                        {section.sub_sections && (
                          <article className="grid gap-5">
                            {section.sub_sections.map(
                              (subsection: any, subSectionIndex: number) => {
                                return (
                                  <Subsection
                                    key={subSectionIndex}
                                    documentName={documentName}
                                    documentType={documentType}
                                    docID={docID}
                                    selectedTab={selectedTab}
                                    subsection={subsection}
                                    sectionIndex={sectionIndex}
                                    searchedRowIndex={searchedRowIndex}
                                    subSectionIndex={subSectionIndex}
                                    pageNumber={pageNumber}
                                    filter={filter}
                                    search={search}
                                    sectionRef={sectionRef}
                                    editSections={editSections}
                                    setEditSections={setEditSections}
                                    documentModified={documentModified}
                                    setDocumentModified={setDocumentModified}
                                    selectedAddedSections={
                                      selectedAddedSections
                                    }
                                    setSelectedAddedSections={
                                      setSelectedAddedSections
                                    }
                                    suggestFramework={suggestFramework}
                                    addSectionsToPolicy={addSectionsToPolicy}
                                  />
                                );
                              }
                            )}
                          </article>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>No results found</p>
              )
            ) : null}
          </section>
        )
      )}
    </>
  );
};

export default Sections;
