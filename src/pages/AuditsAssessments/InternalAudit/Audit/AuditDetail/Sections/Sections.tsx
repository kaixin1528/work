import {
  faChevronCircleDown,
  faChevronCircleRight,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import React, { useState } from "react";
import TablePagination from "src/components/General/TablePagination";
import Loader from "src/components/Loader/Loader";
import { pageSize, attributeColors } from "src/constants/general";
import DocumentSummary from "src/pages/RegulationPolicy/Document/DocumentDetail/DocumentSummary";
import FAQ from "src/pages/RegulationPolicy/Document/DocumentDetail/FAQ";
import { GetDocumentStatus, GetGRCDocumentMetadata } from "src/services/grc";
import { convertToUTCString } from "src/utils/general";
import ControlDetail from "../ControlDetail/ControlDetail";
import SectionTabs from "./SectionTabs";
import { GetInternalAuditSections } from "src/services/audits-assessments/internal-audit";
import SectionAnalysis from "./SectionAnalysis";
import ExportFile from "../ExportFile";

const Sections = ({
  documentType,
  documentID,
  auditID,
  selectedTab,
}: {
  documentType: string;
  documentID: string;
  auditID: string;
  selectedTab: string;
}) => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [filter, setFilter] = useState<string>("All");

  const { data: documentStatus } = GetDocumentStatus(documentType, documentID);
  const { data: documentMetadata } = GetGRCDocumentMetadata(
    documentType,
    documentID
  );
  const { data: table, status: tableStatus } = GetInternalAuditSections(
    documentStatus?.status,
    auditID,
    selectedTab,
    pageNumber
  );

  const documentName = documentMetadata?.framework_name;

  const sortedTable = table?.data;
  const totalCount = table?.pager?.total_results || 0;
  const totalPages = table?.pager?.num_pages || 0;
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

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
        <article className="flex items-center place-content-center gap-5">
          <img
            src={`/grc/frameworks-placeholder.svg`}
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
      ) : tableStatus === "loading" ? (
        <Loader />
      ) : (
        tableStatus === "success" && (
          <section className="flex flex-col flex-grow content-start gap-3 h-full">
            <FAQ documentID={auditID} />
            <DocumentSummary documentID={auditID} />
            <ExportFile auditID={auditID} />
            <article className="flex items-center justify-between gap-10">
              <SectionTabs filter={filter} setFilter={setFilter} />
              <TablePagination
                totalPages={totalPages}
                beginning={beginning}
                end={end}
                totalCount={totalCount}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
              />
            </article>
            {sortedTable ? (
              sortedTable.length > 0 ? (
                <ul className="grid gap-5">
                  {sortedTable.map((section: any, sectionIndex: number) => {
                    let result = { pass: [], fail: [] } as any;
                    section.system_analysis?.findings?.forEach(
                      (finding: any) => {
                        finding.did_pass === true
                          ? result.pass.push(finding.summary)
                          : result.fail.push(finding.summary);
                      }
                    );
                    return (
                      <li
                        key={sectionIndex}
                        className="grid content-start gap-3 p-4 bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 rounded-2xl"
                      >
                        <header className="grid gap-3 pb-4 border-b dark:border-black">
                          <h4 className="text-xl">
                            {section.section_id}{" "}
                            {!["-", "", null].includes(section.section_title) &&
                              section.section_title}
                          </h4>
                          {selectedTab === "controls" &&
                          section.system_analysis ? (
                            <article className="grid gap-3">
                              <h4>
                                System Analysis{" "}
                                {section.system_analysis.last_run &&
                                  `(last performed: ${convertToUTCString(
                                    section.system_analysis.last_run
                                  )})`}
                              </h4>
                              {Object.keys(result).map((status) => {
                                if (result[status].length === 0) return null;
                                return (
                                  <Disclosure key={status}>
                                    {({ open }) => (
                                      <>
                                        <Disclosure.Button className="flex items-center gap-2 text-sm">
                                          <span
                                            className={`uppercase ${attributeColors[status]}`}
                                          >
                                            {result[status]?.length} {status}
                                          </span>
                                          <FontAwesomeIcon
                                            icon={
                                              open
                                                ? faChevronCircleDown
                                                : faChevronCircleRight
                                            }
                                            className="dark:text-black"
                                          />
                                        </Disclosure.Button>
                                        <Disclosure.Panel>
                                          <ul className="flex flex-col flex-grow gap-3 p-2 max-h-[20rem] overflow-auto scrollbar">
                                            {result[status]?.map(
                                              (
                                                summary: string,
                                                index: number
                                              ) => (
                                                <li
                                                  key={index}
                                                  className={`flex items-center gap-2 px-4 py-1 ${
                                                    status === "pass"
                                                      ? "bg-black/60"
                                                      : "bg-reset"
                                                  } rounded-md`}
                                                >
                                                  <FontAwesomeIcon
                                                    icon={
                                                      status === "pass"
                                                        ? faCheck
                                                        : faXmark
                                                    }
                                                    className={`${
                                                      status === "pass"
                                                        ? "text-no"
                                                        : ""
                                                    }`}
                                                  />
                                                  {summary}
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        </Disclosure.Panel>
                                      </>
                                    )}
                                  </Disclosure>
                                );
                              })}
                            </article>
                          ) : (
                            selectedTab === "report" && (
                              <SectionAnalysis section={section} />
                            )
                          )}
                        </header>
                        {section.sub_sections && (
                          <article className="grid gap-5">
                            {section.sub_sections.map(
                              (control: any, subSectionIndex: number) => {
                                return (
                                  <ControlDetail
                                    key={subSectionIndex}
                                    documentType="internal-audit"
                                    documentID={documentID}
                                    documentName={documentName}
                                    auditID={auditID}
                                    control={control}
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
                <p>No controls found</p>
              )
            ) : null}
          </section>
        )
      )}
    </section>
  );
};

export default Sections;
