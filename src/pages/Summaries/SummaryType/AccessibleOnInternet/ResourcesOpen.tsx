/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useState } from "react";
import TableFilter from "src/components/Filter/General/TableFilter/TableFilter";
import TablePagination from "src/components/General/TablePagination";
import SortColumn from "src/components/Button/SortColumn";
import {
  attributeColors,
  initialFilter,
  initialSort,
} from "src/constants/general";
import { Filter } from "src/types/general";
import { sortRows } from "src/utils/general";
import { GetAccessibleInternetDetails } from "src/services/summaries/accessible-on-internet";
import { useSummaryStore } from "src/stores/summaries";
import { useGraphStore } from "src/stores/graph";
import { useNavigate } from "react-router-dom";
import { Sort } from "src/types/dashboard";
import { GetQueryLookup } from "src/services/graph/search";
import { handleViewSnapshot } from "src/utils/graph";

const ResourcesOpen = () => {
  const navigate = useNavigate();

  const { period, selectedReportAccount } = useSummaryStore();
  const {
    setNavigationView,
    setGraphSearch,
    setGraphSearching,
    setGraphSearchString,
    setSnapshotTime,
  } = useGraphStore();

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [allFilters, setAllFilters] = useState<Filter[]>([]);
  const [currentFilter, setCurrentFilter] = useState<Filter>(initialFilter);
  const [sort, setSort] = useState<Sort>(initialSort);

  const { data: accessibleInternet } = GetAccessibleInternetDetails(
    period,
    selectedReportAccount?.customer_cloud_id || "",
    {
      filters: allFilters,
      pager: {
        page_number: pageNumber,
        page_size: 100,
      },
    }
  );
  const queryLookup = GetQueryLookup();

  const metadata =
    accessibleInternet && JSON.parse(accessibleInternet.header.metadata);
  const filteredMetadata = metadata?.required.filter(
    (col: string) => metadata.properties[col].hidden !== "true"
  );
  const sortedResources =
    accessibleInternet && sortRows(accessibleInternet.resources, sort);
  const pageSize = accessibleInternet?.pager.page_size || 0;
  const totalCount = accessibleInternet?.pager.total_results || 0;
  const totalPages = accessibleInternet?.pager.num_pages || 0;
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  useEffect(() => {
    setAllFilters([]);
  }, [selectedReportAccount]);

  return (
    <section className="flex flex-col flex-grow gap-5">
      <h4 className="underlined-label">Resources Open</h4>
      {accessibleInternet ? (
        sortedResources?.length > 0 ? (
          <>
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
            <section className="flex flex-col flex-grow w-full h-[30rem] text-[0.8rem] dark:bg-card overflow-auto scrollbar">
              <table className="w-full table-auto md:table-fixed overflow-auto">
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
                            <h4>{column.title}</h4>
                            <SortColumn propertyName={col} setSort={setSort} />
                          </article>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {sortedResources?.map(
                    (
                      resource: { [key: string]: string | number | null },
                      index: number
                    ) => {
                      const curRowIndex = index * pageNumber;
                      return (
                        <Fragment key={curRowIndex}>
                          <tr className="relative p-5 gap-3 break-words dark:bg-card dark:even:bg-gradient-to-b from-panel to-panel/70">
                            {filteredMetadata?.map(
                              (col: string, index: number) => {
                                return (
                                  <td
                                    key={`${curRowIndex}-${index}`}
                                    className="relative py-3 px-3 last:pr-16 text-left truncate lg:whitespace-normal"
                                  >
                                    {Array.isArray(resource[col]) ? (
                                      <ul className="grid gap-1">
                                        {(
                                          resource[col] as unknown as string[]
                                        ).map((ip) => {
                                          return (
                                            <li key={ip} className="break-all">
                                              <p
                                                className={`${
                                                  attributeColors[
                                                    ip.toLowerCase()
                                                  ]
                                                }`}
                                              >
                                                {ip}
                                              </p>
                                            </li>
                                          );
                                        })}
                                      </ul>
                                    ) : (
                                      <p
                                        className={`${
                                          col === "name"
                                            ? "cursor-pointer hover:underline"
                                            : ""
                                        }`}
                                        onClick={() => {
                                          if (col === "name") {
                                            queryLookup.mutate(
                                              {
                                                requestData: {
                                                  query_type: "view_in_graph",
                                                  id: resource.name,
                                                },
                                              },
                                              {
                                                onSuccess: (
                                                  queryString: string
                                                ) =>
                                                  handleViewSnapshot(
                                                    queryString,
                                                    setNavigationView,
                                                    setGraphSearch,
                                                    setGraphSearching,
                                                    setGraphSearchString,
                                                    navigate,
                                                    setSnapshotTime
                                                  ),
                                              }
                                            );
                                          }
                                        }}
                                      >
                                        {resource[col]}
                                      </p>
                                    )}
                                  </td>
                                );
                              }
                            )}
                          </tr>
                        </Fragment>
                      );
                    }
                  )}
                </tbody>
              </table>
            </section>
          </>
        ) : (
          <p className="text-sm">No data available</p>
        )
      ) : null}
    </section>
  );
};

export default ResourcesOpen;
