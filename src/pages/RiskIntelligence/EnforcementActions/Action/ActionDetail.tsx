/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import TablePagination from "src/components/General/TablePagination";
import Loader from "src/components/Loader/Loader";
import { pageSize } from "src/constants/general";
import DocumentSummary from "src/pages/RegulationPolicy/Document/DocumentDetail/DocumentSummary";
import FAQ from "src/pages/RegulationPolicy/Document/DocumentDetail/FAQ";
import { GetSections } from "src/services/risk-intelligence/enforcement-actions";
import CopyToClipboard from "src/components/General/CopyToClipboard";
import ViewInFile from "src/pages/RegulationPolicy/Document/ViewInFile/ViewInFile";

const ActionDetail = ({ actionID }: { actionID: string }) => {
  const [pageNumber, setPageNumber] = useState<number>(1);

  const { data: table, status: tableStatus } = GetSections(
    actionID,
    pageNumber
  );

  const documentType = "enforcement_actions";

  const sortedTable = table?.data;
  const totalCount = table?.pager?.total_results || 0;
  const totalPages = table?.pager?.num_pages || 0;
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <section className="flex flex-col flex-grow mb-4">
      {tableStatus === "loading" ? (
        <Loader />
      ) : (
        tableStatus === "success" && (
          <section className="flex flex-col flex-grow content-start gap-3 h-full">
            <FAQ documentID={actionID} />
            <DocumentSummary documentID={actionID} />
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
                        <header className="grid pb-4 border-b dark:border-black">
                          <h4 className="text-xl">
                            {section.section_id}{" "}
                            {Boolean(section.section_name) &&
                              section.section_name}
                          </h4>
                          <ViewInFile
                            generatedID={section.generated_id}
                            section={section}
                            bbox={section.page_metadata}
                            documentType={documentType}
                          />
                        </header>
                        <section className="grid gap-5 p-4 text-sm dark:bg-black/60 rounded-md">
                          <article className="flex gap-2 break-words">
                            <article className="w-max">
                              <CopyToClipboard copiedValue={section.content} />
                            </article>
                            <p className="grid gap-2 w-full">
                              {section.content
                                .split("\n")
                                .map((phrase: string, index: number) => (
                                  <span
                                    key={index}
                                    className="flex flex-wrap items-center gap-1 w-full"
                                  >
                                    {phrase
                                      .split(" ")
                                      .map((word, wordIndex) => (
                                        <span key={wordIndex}>{word}</span>
                                      ))}
                                  </span>
                                ))}
                            </p>
                          </article>
                        </section>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>No enforcement actions found</p>
              )
            ) : null}
          </section>
        )
      )}
    </section>
  );
};

export default ActionDetail;
