/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Fragment, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { excludeCols, expandedViewTypes } from "../../../constants/dashboard";
import {
  sortRows,
  handleSort,
  convertToUTCString,
} from "../../../utils/general";
import TableFilter from "../../../components/Filter/General/TableFilter/TableFilter";
import { Filter } from "../../../types/general";
import TablePagination from "../../../components/General/TablePagination";
import CategoryTabs from "./TableTab/CategoryTabs";
import NodeTypeTabs from "./TableTab/NodeTypeTabs";
import { convertBytes, parseURL } from "../../../utils/general";
import { motion } from "framer-motion";
import {
  attributeColors,
  initialFilter,
  initialSort,
  showVariants,
  pageSize,
} from "../../../constants/general";
import ReturnPage from "src/components/Button/ReturnPage";
import { Sort } from "src/types/dashboard";
import PageLayout from "src/layouts/PageLayout";
import { useGeneralStore } from "src/stores/general";
import { GetInfraDetails } from "src/services/dashboard/infra";
import TableLayout from "src/layouts/TableLayout";

const DetailTable: React.FC = () => {
  const parsed = parseURL();

  const { env } = useGeneralStore();

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedNodeType, setSelectedNodeType] = useState<string>("");
  const [selectedNodeID, setSelectedNodeID] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [multiSelect, setMultiSelect] = useState<string[]>([]);
  const [allFilters, setAllFilters] = useState<Filter[]>([]);
  const [currentFilter, setCurrentFilter] = useState<Filter>(initialFilter);
  const [sort, setSort] = useState<Sort>(initialSort);

  const { data: details } = GetInfraDetails(
    env,
    parsed.integration,
    parsed.category,
    parsed.node_type,
    {
      filters: allFilters,
      pager: {
        page_number: pageNumber,
        page_size: pageSize,
      },
    }
  );

  useEffect(() => {
    setAllFilters([]);
  }, [selectedCategory, selectedNodeType]);

  useEffect(() => {
    setSelectedNodeID("");
    setPageNumber(1);
  }, [selectedCategory, selectedNodeType]);

  const metadata = details && JSON.parse(details.header.metadata);
  const filteredMetadata = metadata?.required.filter((col: string) => {
    if (metadata.properties[col].hidden === "true") return null;
    return !excludeCols.includes(col);
  });
  const sortedRows = details && sortRows(details?.body, sort);
  const totalCount = details?.pager.total_results || 0;
  const totalPages = details?.pager.num_pages || 0;
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  const ExpandedView =
    expandedViewTypes[String(parsed.node_type).toLowerCase()];

  return (
    <PageLayout>
      {details && (
        <motion.main
          variants={showVariants}
          initial="hidden"
          animate="visible"
          className="relative flex flex-col flex-grow gap-5 h-full w-full shadow-2xl dark:shadow-expand overflow-auto scrollbar z-10"
        >
          {details.metadata && (
            <p className="hidden xl:block absolute right-5 mt-7 text-xs dark:text-white">
              Last updated at{" "}
              {convertToUTCString(details.metadata.last_updated_time)}
            </p>
          )}
          <header className="flex px-4 gap-5 items-center dark:text-checkbox">
            <ReturnPage />
            <CategoryTabs setSelectedCategory={setSelectedCategory} />
          </header>
          <section className="grid content-start gap-5 h-full mx-4 mb-5 dark:bg-card shadow-lg dark:shadow-black overflow-auto scrollbar">
            <NodeTypeTabs setSelectedNodeType={setSelectedNodeType} />
            <section className="flex flex-col flex-grow gap-5 overflow-auto scrollbar">
              <article className="grid grid-cols-6 px-5">
                <TableFilter
                  metadata={metadata}
                  currentFilter={currentFilter}
                  setCurrentFilter={setCurrentFilter}
                  allFilters={allFilters}
                  setAllFilters={setAllFilters}
                  setPageNumber={setPageNumber}
                />
                <TablePagination
                  totalPages={totalPages}
                  beginning={beginning}
                  end={end}
                  totalCount={totalCount}
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                />
              </article>
              <TableLayout>
                <thead className="sticky -top-1.5 z-10 bg-gradient-to-b dark:from-expand dark:to-table-header">
                  <tr>
                    {filteredMetadata?.length > 0 && (
                      <th className="px-5 pr-6 w-5">
                        <input
                          id="row"
                          type="checkbox"
                          checked={
                            sortedRows?.length > 0 &&
                            multiSelect.length === totalCount
                          }
                          className="form-checkbox w-4 h-4 border-0 dark:focus:ring-0 dark:text-checkbox dark:focus:border-checkbox focus:ring dark:focus:ring-offset-0 dark:focus:ring-checkbox focus:ring-opacity-50"
                          onChange={(e) => {
                            e.stopPropagation();
                            if (multiSelect.length < totalCount) {
                              setMultiSelect(
                                [...Array(totalCount)].map(
                                  (_: number, index: number) => String(index)
                                )
                              );
                            } else setMultiSelect([]);
                          }}
                        />
                      </th>
                    )}
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
                                onClick={() => {
                                  handleSort(col, setSort);
                                  setSelectedNodeID("");
                                }}
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
                    (
                      row: { [key: string]: string | number | null },
                      index: number
                    ) => {
                      return (
                        <Fragment key={row.node_id}>
                          <tr
                            data-test="table-row"
                            className={`relative p-5 gap-3 break-words cursor-pointer ${
                              selectedNodeID === row.node_id
                                ? "dark:bg-expand border-b dark:border-filter/80"
                                : "dark:bg-card dark:even:bg-gradient-to-b from-panel to-panel/70 dark:hover:bg-gradient-to-b dark:hover:from-expand dark:hover:to-filter/60"
                            }`}
                            onMouseUp={(e) => {
                              if (document.getSelection()?.type === "Range")
                                e.preventDefault();
                              else {
                                if (selectedNodeID === row.node_id)
                                  setSelectedNodeID("");
                                else
                                  setSelectedNodeID(String(row.node_id || ""));
                              }
                            }}
                          >
                            <td className="px-5 w-5">
                              <input
                                type="checkbox"
                                checked={multiSelect.includes(
                                  String(row.node_id)
                                )}
                                className="form-checkbox w-4 h-4 border-0 dark:focus:ring-0 dark:text-checkbox dark:focus:border-checkbox focus:ring dark:focus:ring-offset-0 dark:focus:ring-checkbox focus:ring-opacity-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                onChange={() => {
                                  if (multiSelect.includes(String(row.node_id)))
                                    setMultiSelect(
                                      multiSelect.filter(
                                        (currentRow) =>
                                          currentRow !== String(row.node_id)
                                      )
                                    );
                                  else
                                    setMultiSelect([
                                      ...multiSelect,
                                      String(row.node_id),
                                    ]);
                                }}
                              />
                            </td>
                            {filteredMetadata?.map(
                              (col: string, index: number) => {
                                const isDate =
                                  metadata.properties[col].format ===
                                  "date-time"
                                    ? row[col] === "1970-01-01T00:00:00+00:00"
                                      ? "N/A"
                                      : typeof row[col] === "number"
                                      ? convertToUTCString(Number(row[col]))
                                      : row[col]
                                    : null;

                                const imageSize =
                                  col === "image_size"
                                    ? convertBytes(Number(row[col]))
                                    : null;

                                if (col === "node_id") return null;

                                return (
                                  <td
                                    key={`${row.node_id}-${index}`}
                                    className="relative py-3 px-3 last:pr-16 text-left break-all"
                                  >
                                    <p
                                      className={`${
                                        attributeColors[
                                          String(row[col]).toLowerCase()
                                        ]
                                      }`}
                                    >
                                      {isDate || imageSize || String(row[col])}
                                    </p>
                                    {index === filteredMetadata.length - 1 && (
                                      <button className="absolute right-5 top-1/3 w-6 h-6 dark:hover:text-clear dark:text-checkbox duration-100 justify-self-end cursor-pointer">
                                        <FontAwesomeIcon
                                          icon={
                                            selectedNodeID === row.node_id
                                              ? faChevronUp
                                              : faChevronDown
                                          }
                                        />
                                      </button>
                                    )}
                                  </td>
                                );
                              }
                            )}
                          </tr>
                          {selectedNodeID === row.node_id && (
                            <tr
                              key={`${row.node_id}-expanded`}
                              className="relative py-5 px-10 gap-10 bg-gradient-to-b dark:from-expand dark:to-expand/60"
                            >
                              <td
                                colSpan={
                                  metadata.required.filter(
                                    (col: string) => !excludeCols.includes(col)
                                  ).length + 1
                                }
                                className="p-5 w-5"
                              >
                                <section className="relative grid grid-cols-1 w-full pb-5 pr-20">
                                  <ExpandedView
                                    selectedNodeID={selectedNodeID}
                                  />
                                </section>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    }
                  )}
                </tbody>
              </TableLayout>
            </section>
          </section>
        </motion.main>
      )}
    </PageLayout>
  );
};

export default DetailTable;
