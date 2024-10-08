/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Subsection from "./Subsection/Subsection";
import SectionTabs from "./SectionTabs";
import TablePagination from "src/components/General/TablePagination";
import Loader from "src/components/Loader/Loader";
import { pageSize } from "src/constants/general";
import { GetDocumentStatus, GetGRCDocumentMetadata } from "src/services/grc";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import ControlFilters from "./ControlFilters";
import ExportFile from "../ExportFile/ExportFile";
import {
  GetAudit,
  GetAuditStatus,
  GetControls,
} from "src/services/third-party-risk/vendor-assessment";

const Sections = ({
  documentType,
  documentID,
  reviewID,
  auditID,
  selectedTab,
  editSections,
  setEditSections,
  documentModified,
  setDocumentModified,
}: {
  documentType: string;
  documentID: string;
  reviewID: string;
  auditID: string;
  selectedTab: string;
  editSections: any;
  setEditSections: any;
  documentModified: any;
  setDocumentModified: any;
}) => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [filter, setFilter] = useState<string>("All");
  const [controlFilters, setControlFilters] = useState({
    context: [],
    domain: [],
    sub_domain: [],
    level: [],
  });

  const { data: documentStatus } = GetDocumentStatus(documentType, documentID);
  const { data: auditStatus } = GetAuditStatus(auditID);
  const { data: documentMetadata } = GetGRCDocumentMetadata(
    documentType,
    documentID
  );

  const controls = GetControls(reviewID, pageNumber, filter);
  const { data: audit, status: auditSectionsStatus } = GetAudit(
    selectedTab,
    auditID,
    documentID,
    pageNumber,
    filter
  );

  const isControls = selectedTab === "Controls Coverage";
  const table = isControls ? controls?.data : audit;
  const tableStatus = isControls ? controls.status : auditSectionsStatus;
  const sectionStatus = isControls ? documentStatus : auditStatus;
  const documentName = isControls
    ? documentMetadata?.framework_name
    : table?.audit_name;

  const sortedTable = table?.data;
  const totalCount = table?.pager?.total_results || 0;
  const totalPages = table?.pager?.num_pages || 0;
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  useEffect(() => {
    setPageNumber(1);
    if (isControls)
      controls.mutate({
        context: controlFilters.context,
        domain: controlFilters.domain,
        subDomain: controlFilters.sub_domain,
        level: controlFilters.level,
      });
  }, [selectedTab, filter]);

  return (
    <>
      {sectionStatus?.status === "failed" ? (
        <section className="grid place-content-center gap-10 w-full h-full text-center">
          <img src="/errors/503.svg" alt="error" className="mx-auto h-72" />
          <h4>
            Oops! something went wrong! We will reach out to you shortly to help
            resolve the issue. Thanks for your patience.
          </h4>
        </section>
      ) : sectionStatus?.status === "parsing" ? (
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
      ) : tableStatus === "loading" ? (
        <Loader />
      ) : (
        tableStatus === "success" && (
          <section className="flex flex-col flex-grow content-start gap-5 h-full">
            {isControls && (
              <>
                <ControlFilters
                  reviewID={reviewID}
                  controls={controls}
                  controlFilters={controlFilters}
                  setControlFilters={setControlFilters}
                />
                <article className="grid gap-3 mx-auto text-center text-xl">
                  <h4 className="text-center text-lg">Coverage</h4>
                  <CircularProgressbarWithChildren
                    strokeWidth={10}
                    value={controls?.data?.coverage}
                    maxValue={100}
                    styles={buildStyles({
                      trailColor: "#FFF",
                      pathColor: "#fcba03",
                    })}
                    className="w-32 h-32"
                  >
                    <span>{controls?.data?.coverage}%</span>
                  </CircularProgressbarWithChildren>
                </article>
              </>
            )}
            <article className="grid gap-5">
              <article className="flex items-center justify-between gap-10">
                <SectionTabs
                  selectedTab={selectedTab}
                  filter={filter}
                  setFilter={setFilter}
                />
                <ExportFile reviewID={reviewID} />
              </article>
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
                    return (
                      <li
                        key={sectionIndex}
                        className="grid content-start gap-3 p-4 bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 rounded-2xl"
                      >
                        <h4 className="text-xl border-b dark:border-black">
                          {section.section_id}{" "}
                          {!["-", "", null].includes(section.section_title) &&
                            section.section_title}
                        </h4>
                        <article className="grid gap-5">
                          {section.sub_sections.map(
                            (subsection: any, subSectionIndex: number) => {
                              return (
                                <Subsection
                                  key={subSectionIndex}
                                  documentType="third-party"
                                  documentID={documentID}
                                  documentName={documentName}
                                  reviewID={reviewID}
                                  auditID={auditID}
                                  subsection={subsection}
                                  selectedTab={selectedTab}
                                  editSections={editSections}
                                  setEditSections={setEditSections}
                                  documentModified={documentModified}
                                  setDocumentModified={setDocumentModified}
                                />
                              );
                            }
                          )}
                        </article>
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
