/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Subsection from "./Subsection/Subsection";
import TablePagination from "src/components/General/TablePagination";
import Loader from "src/components/Loader/Loader";
import { pageSize } from "src/constants/general";

const Sections = ({
  table,
  tableStatus,
  sopName,
  versionID,
  selectedTab,
  pageNumber,
  setPageNumber,
}: {
  table: any;
  tableStatus: string;
  sopName: string;
  versionID: string;
  selectedTab: string;
  pageNumber: number;
  setPageNumber: (pageNumber: number) => void;
}) => {
  const filteredTable = table?.data;

  const totalCount = table?.pager?.total_results || 0;
  const totalPages = table?.pager?.num_pages || 0;
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <>
      {tableStatus === "loading" ? (
        <Loader />
      ) : (
        tableStatus === "success" && (
          <section className="flex flex-col flex-grow content-start gap-3 h-full">
            <TablePagination
              totalPages={totalPages}
              beginning={beginning}
              end={end}
              totalCount={totalCount}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
            />
            {filteredTable ? (
              filteredTable.length > 0 ? (
                <ul className="grid gap-5">
                  {filteredTable.map((section: any, sectionIndex: number) => {
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
