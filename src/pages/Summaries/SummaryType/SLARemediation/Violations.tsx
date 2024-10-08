import React, { useState } from "react";
import SortColumn from "src/components/Button/SortColumn";
import TablePagination from "src/components/General/TablePagination";
import { initialSort, pageSize, severities } from "src/constants/general";
import { severityColors } from "src/constants/summaries";
import TableLayout from "src/layouts/TableLayout";
import { GetSLAViolations } from "src/services/summaries/sla-remediation";
import { ListHeader } from "src/types/general";
import { convertToUTCString, sortRows } from "src/utils/general";

const Violations = ({
  selectedIntegrationType,
  selectedSourceAccountID,
  selectedService,
  selectedSeverity,
  earliestTime,
  latestTime,
}: {
  selectedIntegrationType: string;
  selectedSourceAccountID: string;
  selectedService: string;
  selectedSeverity: string;
  earliestTime: number;
  latestTime: number;
}) => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [sort, setSort] = useState(initialSort);

  const { data: violations } = GetSLAViolations(
    selectedIntegrationType,
    selectedSourceAccountID,
    selectedService,
    selectedSeverity,
    earliestTime,
    latestTime
  );

  const totalCount = violations?.pager.total_results || 0;
  const totalPages = violations?.pager.num_pages;
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;
  const sortedViolations = sortRows(violations?.data, sort);

  return (
    <section className="grid p-4 dark:bg-card">
      {violations && (
        <section className="flex flex-col flex-grow content-start gap-5">
          <TablePagination
            totalPages={totalPages}
            beginning={beginning}
            end={end}
            totalCount={totalCount}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          />
          {sortedViolations?.length > 0 ? (
            <TableLayout height="max-h-[20rem]">
              <thead className="sticky -top-1.5 z-10 bg-gradient-to-b dark:from-expand dark:to-table-header">
                <tr>
                  {violations.metadata.headers.map((col: ListHeader) => {
                    return (
                      <th
                        scope="col"
                        key={col.display_name}
                        className="py-3 px-5 text-left font-semibold"
                      >
                        <article className="capitalize flex gap-10 justify-between">
                          <h4>{col.display_name}</h4>
                          <SortColumn
                            propertyName={col.property_name}
                            setSort={setSort}
                          />
                        </article>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {sortedViolations?.map((row: any, rowIndex: number) => {
                  return (
                    <tr
                      key={rowIndex}
                      className="relative p-5 gap-3 break-words dark:bg-card dark:even:bg-gradient-to-b from-panel to-panel/70"
                    >
                      {violations.metadata.headers.map(
                        (col: ListHeader, index: number) => {
                          return (
                            <td
                              key={index}
                              className="relative py-3 px-5 text-left"
                            >
                              {col.property_name === "cve_id" ? (
                                <a
                                  href={`/cves/details?cve_id=${row.cve_id}`}
                                  className="hover:underline"
                                >
                                  {row.cve_id}
                                </a>
                              ) : col.data_type === "timestamp" ? (
                                convertToUTCString(row[col.property_name])
                              ) : col.data_type === "list" ? (
                                <ul className="grid list-disc px-4">
                                  {row[col.property_name].map(
                                    (value: string) => (
                                      <li key={value}>{value}</li>
                                    )
                                  )}
                                </ul>
                              ) : (
                                <p
                                  className={`text-left ${
                                    severities.includes(
                                      String(
                                        row[col.property_name]
                                      )?.toLowerCase()
                                    )
                                      ? `px-2 py-1 w-max ${
                                          severityColors[
                                            String(
                                              row[col.property_name]
                                            )?.toLowerCase()
                                          ]
                                        }`
                                      : ""
                                  } `}
                                >
                                  {row[col.property_name]}
                                </p>
                              )}
                            </td>
                          );
                        }
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </TableLayout>
          ) : (
            <p>No data available</p>
          )}
        </section>
      )}
    </section>
  );
};

export default Violations;
