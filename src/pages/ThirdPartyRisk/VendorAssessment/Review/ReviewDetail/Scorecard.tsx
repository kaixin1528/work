import { faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { attributeColors, initialSort } from "src/constants/general";
import TableLayout from "src/layouts/TableLayout";
import { GetVAScorecard } from "src/services/third-party-risk/vendor-assessment";
import { Sort } from "src/types/dashboard";
import { handleSort, sortRows } from "src/utils/general";

const Scorecard = ({
  reviewID,
  frameworkID,
}: {
  reviewID: string;
  frameworkID: string;
}) => {
  const [sort, setSort] = useState<Sort>(initialSort);

  const { data: scorecard } = GetVAScorecard(reviewID, frameworkID);

  const metadata = scorecard && JSON.parse(scorecard.header.metadata);
  const filteredMetadata = metadata?.required;
  const sortedRows = scorecard && sortRows(scorecard?.data, sort);

  return (
    <section className="flex flex-col flex-grow gap-5 overflow-auto scrollbar">
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
