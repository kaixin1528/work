/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Subsection from "./Subsection/Subsection";
import TablePagination from "src/components/General/TablePagination";
import Loader from "src/components/Loader/Loader";
import { pageSize } from "src/constants/general";
import { GetPrivacyReviewSections } from "src/services/third-party-risk/privacy-review";

const Sections = ({
  auditID,
  selectedTab,
}: {
  auditID: string;
  selectedTab: string;
}) => {
  const [pageNumber, setPageNumber] = useState<number>(1);

  const { data: sections, status: sectionStatus } = GetPrivacyReviewSections(
    auditID,
    pageNumber
  );

  const sortedTable = sections?.data;
  const totalCount = sections?.pager?.total_results || 0;
  const totalPages = sections?.pager?.num_pages || 0;
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  useEffect(() => {
    setPageNumber(1);
  }, [selectedTab]);

  return (
    <>
      {sectionStatus === "loading" ? (
        <Loader />
      ) : (
        sectionStatus === "success" && (
          <section className="flex flex-col flex-grow content-start gap-5 h-full">
            <TablePagination
              totalPages={totalPages}
              beginning={beginning}
              end={end}
              totalCount={totalCount}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
            />
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
                                  subsection={subsection}
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
