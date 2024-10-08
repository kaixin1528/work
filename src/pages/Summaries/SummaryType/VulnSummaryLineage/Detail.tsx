import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SortColumn from "src/components/Button/SortColumn";
import TablePagination from "src/components/General/TablePagination";
import {
  attributeColors,
  initialSort,
  pageSize,
  slaBGColors,
} from "src/constants/general";
import TableLayout from "src/layouts/TableLayout";
import CRI from "src/pages/Dashboard/DetailTable/ExpandedView/CRI/CRI";
import { GetVSLDetails } from "src/services/summaries/vuln-summary-lineage";
import { useSummaryStore } from "src/stores/summaries";
import { KeyStringVal, ListHeader } from "src/types/general";
import { convertToUTCString, sortRows } from "src/utils/general";

const Detail = ({ selectedSeverity }: { selectedSeverity: string }) => {
  const navigate = useNavigate();

  const { period } = useSummaryStore();

  const [query, setQuery] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [sort, setSort] = useState(initialSort);
  const [selectedResourceID, setSelectedResourceID] = useState<string>("");

  const { data: details } = GetVSLDetails(
    period,
    selectedSeverity,
    pageNumber,
    Object.keys(slaBGColors)
  );

  const filteredDetails =
    query !== ""
      ? details?.data.filter((resource: KeyStringVal) =>
          resource.resource_id
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        )
      : details?.data;
  const totalCount = details?.pager.total_results || 0;
  const totalPages = details?.pager.num_pages || 0;
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;
  const sortedDetails = sortRows(filteredDetails, sort);

  const handleCloseExpandedView = () => {
    navigate("/summaries/details?summary=vulnerability_summary_lineage");
    setSelectedResourceID("");
  };

  useEffect(() => {
    setPageNumber(1);
  }, [selectedSeverity]);

  return (
    <>
      {details && (
        <section className="flex flex-col flex-grow content-start gap-5">
          <h4>Images with Open CVES</h4>
          <article className="flex items-center justify-between gap-10">
            <input
              id="autocomplete"
              type="filter"
              autoComplete="off"
              spellCheck="false"
              placeholder="Search "
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="px-5 w-2/5 h-8 text-xs placeholder:text-secondary placeholder:text-xs placeholder:font-medium dark:text-white dark:disabled:cursor-not-allowed border-transparent focus:ring-0 focus:border-transparent bg-transparent focus:outline-none dark:bg-searchrounded-sm dark:bg-search"
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
          {sortedDetails?.length > 0 ? (
            <TableLayout>
              <thead className="sticky -top-1.5 z-10 bg-gradient-to-b dark:from-expand dark:to-table-header">
                <tr>
                  {details?.metadata.headers.map((col: ListHeader) => {
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
                {sortedDetails?.map((row: any, rowIndex: number) => {
                  const rowID = `${row.resource_id}+${rowIndex}`;
                  return (
                    <Fragment key={rowIndex}>
                      <tr
                        className={`relative p-5 gap-3 break-words cursor-pointer ${
                          selectedResourceID === rowID
                            ? "dark:bg-expand border-b dark:border-filter/80"
                            : "dark:bg-card dark:even:bg-gradient-to-b from-panel to-panel/70 dark:hover:bg-gradient-to-b dark:hover:from-expand dark:hover:to-filter/60"
                        }`}
                        onClick={(e) => {
                          if (document.getSelection()?.type === "Range")
                            e.preventDefault();
                          else {
                            if (selectedResourceID === rowID)
                              handleCloseExpandedView();
                            else {
                              navigate(
                                `/summaries/details?summary=vulnerability_summary_lineage&integration=${row.integration_type}&node_type=${row.image_type}`
                              );
                              setSelectedResourceID(rowID);
                            }
                          }
                        }}
                      >
                        {details?.metadata.headers.map(
                          (col: ListHeader, index: number) => {
                            return (
                              <td
                                key={index}
                                className="relative py-3 px-5 text-left"
                              >
                                {col.property_name === "resource_type_name" ? (
                                  <img
                                    src={`/graph/nodes/${row.integration_type.toLowerCase()}/${row.image_type.toLowerCase()}.svg`}
                                    alt=""
                                    className="w-10 h-10"
                                  />
                                ) : col.data_type === "timestamp" ? (
                                  convertToUTCString(row[col.property_name])
                                ) : (
                                  <p
                                    className={`text-left ${
                                      attributeColors[
                                        String(
                                          row[col.property_name]
                                        )?.toLowerCase()
                                      ]
                                    }`}
                                  >
                                    {row[col.property_name]}
                                  </p>
                                )}
                                {index ===
                                  details?.metadata.headers.length - 1 && (
                                  <button className="absolute right-5 top-1/3 w-6 h-6 dark:hover:text-clear dark:text-checkbox duration-100 justify-self-end cursor-pointer">
                                    <FontAwesomeIcon
                                      icon={
                                        selectedResourceID === rowID
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
                      {selectedResourceID === rowID && (
                        <tr
                          key={`${rowID}-expanded`}
                          className="relative py-5 px-10 gap-10 bg-gradient-to-b dark:from-expand dark:to-expand/60"
                        >
                          <td
                            colSpan={details?.metadata.headers.length}
                            className="p-5 w-5"
                          >
                            <section className="relative grid grid-cols-1 w-full pb-5 pr-20">
                              <CRI
                                selectedNodeID={
                                  selectedResourceID.split("+")[0]
                                }
                              />
                            </section>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </TableLayout>
          ) : (
            <p>No data available</p>
          )}
        </section>
      )}
    </>
  );
};

export default Detail;
