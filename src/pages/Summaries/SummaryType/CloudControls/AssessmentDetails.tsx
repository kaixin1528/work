/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useState } from "react";
import TableFilter from "src/components/Filter/General/TableFilter/TableFilter";
import TablePagination from "src/components/General/TablePagination";
import SortColumn from "src/components/Button/SortColumn";
import { excludeCols } from "src/constants/dashboard";
import {
  attributeColors,
  initialFilter,
  initialSort,
} from "src/constants/general";
import { Filter } from "src/types/general";
import { sortRows } from "src/utils/general";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { severityColors } from "src/constants/summaries";
import { GetCCDetails } from "src/services/summaries/cloud-controls";
import { useSummaryStore } from "src/stores/summaries";
import { Sort } from "src/types/dashboard";

const AssessmentDetails = ({
  selectedCategory,
  selectedStatus,
  selectedService,
}: {
  selectedCategory: string;
  selectedStatus: string;
  selectedService: string;
}) => {
  const { selectedReportAccount } = useSummaryStore();

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedRow, setSelectedRow] = useState<number>(-1);
  const [allFilters, setAllFilters] = useState<Filter[]>([]);
  const [currentFilter, setCurrentFilter] = useState<Filter>(initialFilter);
  const [sort, setSort] = useState<Sort>(initialSort);

  const { data: cloudControlsDetails } = GetCCDetails(
    selectedReportAccount?.integration_type || "",
    selectedReportAccount?.customer_cloud_id || "",
    {
      filters: allFilters,
      pager: {
        page_number: pageNumber,
        page_size: 100,
      },
    }
  );

  const metadata =
    cloudControlsDetails && JSON.parse(cloudControlsDetails.header.metadata);

  const filteredMetadata = metadata?.required.filter((col: string) => {
    if (metadata.properties[col].hidden) return null;
    return !excludeCols.includes(col);
  });

  const sortedRows =
    cloudControlsDetails && sortRows(cloudControlsDetails.body, sort);
  const pageSize = cloudControlsDetails?.pager.page_size || 0;
  const totalCount = cloudControlsDetails?.pager.total_results || 0;
  const totalPages = cloudControlsDetails?.pager.num_pages || 0;
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  useEffect(() => {
    if (selectedCategory === "status") {
      if (selectedStatus !== "") {
        setAllFilters([
          {
            field: "status",
            op: "eq",
            value: selectedStatus,
            type: "string",
            set_op: "and",
          },
        ]);
      }
    } else {
      if (selectedService !== "")
        setAllFilters([
          {
            field: "service_name",
            op: "eq",
            value: selectedService,
            type: "string",
            set_op: "and",
          },
        ]);
    }
    setSelectedRow(-1);
  }, [selectedCategory, selectedStatus, selectedService]);

  return (
    <section className="grid gap-5 p-4 dark:bg-card black-shadow">
      <h4 className="underlined-label">Assessment Details</h4>
      <section className="grid grid-cols-6 text-sm">
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
      </section>
      <section className="flex flex-col flex-grow w-full h-[50rem] text-[0.8rem] dark:bg-card overflow-auto scrollbar">
        <table className="w-full table-auto overflow-auto">
          <thead className="sticky -top-1.5 z-10 bg-gradient-to-b dark:from-expand dark:to-table-header">
            <tr>
              {filteredMetadata?.map((col: string) => {
                const column = metadata.properties[col];
                if (column.hidden === "True") return null;
                return (
                  <th
                    scope="col"
                    key={col}
                    className="py-3 px-3 last:pr-10 text-left font-semibold"
                  >
                    <article className="capitalize flex gap-10 justify-between">
                      <h4>{column.title}</h4>
                      <SortColumn propertyName={col} setSort={setSort} />
                    </article>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedRows?.map((row: any, index: number) => {
              const curRowIndex = index * pageNumber;
              return (
                <Fragment key={curRowIndex}>
                  <tr
                    className={`relative p-5 gap-3 break-words cursor-pointer ${
                      selectedRow === curRowIndex
                        ? "dark:bg-expand border-b dark:border-filter/80"
                        : "dark:bg-card dark:even:bg-gradient-to-b from-panel to-panel/70 dark:hover:bg-gradient-to-b dark:hover:from-expand dark:hover:to-filter/60"
                    }`}
                    onMouseUp={(e) => {
                      if (document.getSelection()?.type === "Range")
                        e.preventDefault();
                      else {
                        if (selectedRow === curRowIndex) setSelectedRow(-1);
                        else setSelectedRow(curRowIndex);
                      }
                    }}
                  >
                    {filteredMetadata?.map((col: string, index: number) => {
                      return (
                        <td
                          key={`${curRowIndex}-${index}`}
                          className="relative py-3 px-3 last:pr-16 text-left truncate lg:whitespace-normal"
                        >
                          {Array.isArray(row[col]) ? (
                            <ul className="grid gap-1 list-disc">
                              {(row[col] as unknown as string[]).map(
                                (value) => {
                                  return (
                                    <li key={value} className="break-all">
                                      <p
                                        className={`${
                                          attributeColors[value.toLowerCase()]
                                        }
                                      `}
                                      >
                                        {value}
                                      </p>
                                    </li>
                                  );
                                }
                              )}
                            </ul>
                          ) : (
                            col !== "resource_tags" && (
                              <article className="flex items-center gap-2">
                                <p
                                  className={`break-all ${
                                    attributeColors[
                                      String(row[col]).toLowerCase()
                                    ]
                                  } ${
                                    row[col].toLowerCase() in severityColors &&
                                    `px-2 ${
                                      severityColors[row[col].toLowerCase()]
                                    }`
                                  }`}
                                >
                                  {row[col]}
                                </p>
                              </article>
                            )
                          )}
                          {index === filteredMetadata.length - 1 && (
                            <button className="absolute right-5 top-1/3 w-6 h-6 dark:hover:text-clear dark:text-checkbox duration-100 justify-self-end cursor-pointer">
                              <FontAwesomeIcon
                                icon={
                                  selectedRow === row.name
                                    ? faChevronUp
                                    : faChevronDown
                                }
                              />
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  {selectedRow === curRowIndex && (
                    <tr
                      key={`${curRowIndex}-expanded`}
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
                        <section className="relative grid grid-cols-1 gap-10 w-full pb-5 pr-40">
                          <section className="grid gap-3">
                            <h4 className="text-sm full-underlined-label w-max">
                              Description
                            </h4>
                            <p className="break-all">{row.description}</p>
                          </section>
                          <section className="grid gap-3">
                            <h4 className="text-sm full-underlined-label w-max">
                              Risk
                            </h4>
                            <p className="break-all">{row.risk}</p>
                          </section>
                          <section className="grid gap-3">
                            <h4 className="text-sm full-underlined-label w-max">
                              Status Extended
                            </h4>
                            <p className="break-all">{row.status_extended}</p>
                          </section>
                          <section className="grid gap-3">
                            <h4 className="text-sm full-underlined-label w-max">
                              GRC Copilot
                            </h4>
                            <ul className="grid gap-1 list-disc">
                              {Object.entries(row.compliance).map(
                                (keyVal: [string, unknown]) => {
                                  const versions = keyVal[1] as string[];
                                  return (
                                    <li
                                      key={keyVal[0]}
                                      className="flex flex-wrap items-center gap-x-2 break-all"
                                    >
                                      {keyVal[0]}:
                                      {
                                        <p className="flex flex-wrap items-center gap-x-2">
                                          {versions.map((version, index) => {
                                            return (
                                              <span
                                                key={version}
                                                className="w-max break-all"
                                              >
                                                {version}{" "}
                                                {index < versions.length - 1 &&
                                                  ","}
                                              </span>
                                            );
                                          })}
                                        </p>
                                      }
                                    </li>
                                  );
                                }
                              )}
                            </ul>
                          </section>
                          <section className="grid gap-3">
                            <h4 className="text-sm full-underlined-label w-max">
                              Recommendation
                            </h4>
                            <article className="flex items-center gap-2 break-all">
                              <a
                                href={row.remediation.Recommendation.Url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FontAwesomeIcon
                                  icon={faArrowUpRightFromSquare}
                                  className="w-4 h-4 dark:text-checkbox"
                                />
                              </a>
                              <p className="break-all">
                                {row.remediation.Recommendation.Text}
                              </p>
                            </article>
                          </section>
                        </section>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </section>
    </section>
  );
};

export default AssessmentDetails;
