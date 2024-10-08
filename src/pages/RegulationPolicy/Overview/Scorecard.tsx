import { faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import TablePagination from "src/components/General/TablePagination";
import { attributeColors, initialSort, pageSize } from "src/constants/general";
import TableLayout from "src/layouts/TableLayout";
import { GetCSFScorecard } from "src/services/regulation-policy/overview";
import { Sort } from "src/types/dashboard";
import { handleSort, sortRows } from "src/utils/general";

const Scorecard = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [sort, setSort] = useState<Sort>(initialSort);

  const { data: scorecard } = GetCSFScorecard(pageNumber);

  const metadata = scorecard && JSON.parse(scorecard.header.metadata);
  const filteredMetadata = metadata?.required;
  const sortedRows = scorecard && sortRows(scorecard?.data, sort);
  const totalCount = scorecard?.pager.total_results || 0;
  const totalPages = scorecard?.pager.num_pages || 0;
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <section className="flex flex-col flex-grow gap-5 overflow-auto scrollbar">
      <TablePagination
        totalPages={totalPages}
        beginning={beginning}
        end={end}
        totalCount={totalCount}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
      />
      <TableLayout fullHeight>
        <thead className="sticky -top-1.5 z-10 bg-gradient-to-b dark:from-expand dark:to-table-header">
          <tr>
            {filteredMetadata?.map((col: string) => {
              const column = metadata.properties[col];
              if (column.hidden === "True") return null;
              return (
                <th
                  scope="col"
                  key={col}
                  className="py-3 px-3 last:pr-10 w-full text-left font-semibold"
                >
                  <article className="capitalize flex gap-10 justify-between">
                    <h4 className="break-all">{column.title}</h4>
                    <button aria-label="sort">
                      <FontAwesomeIcon
                        icon={faSort}
                        className="mt-0.5 dark:text-secondary"
                        onClick={() => handleSort(col, setSort)}
                      />
                    </button>
                  </article>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedRows?.map(
            (row: { [key: string]: string | number | null }, index: number) => {
              return (
                <tr
                  key={index}
                  data-test="table-row"
                  className="relative p-5 gap-3 break-words dark:bg-card dark:even:bg-gradient-to-b from-panel to-panel/70 dark:hover:bg-gradient-to-b dark:hover:from-expand dark:hover:to-filter/60"
                >
                  {filteredMetadata?.map((col: string, colIndex: number) => {
                    return (
                      <td
                        key={`${index}-${colIndex}`}
                        className="relative py-3 px-3 last:pr-16 text-left break-all"
                      >
                        <p
                          className={`${
                            attributeColors[String(row[col]).toLowerCase()]
                          }`}
                        >
                          {String(row[col])}
                        </p>
                      </td>
                    );
                  })}
                </tr>
              );
            }
          )}
        </tbody>
      </TableLayout>
    </section>
  );
};

export default Scorecard;
