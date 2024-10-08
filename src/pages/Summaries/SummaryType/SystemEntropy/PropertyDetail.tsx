/* eslint-disable no-useless-escape */
import {
  faChevronDown,
  faChevronUp,
  faDiagramProject,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment, useState } from "react";
import ReactJson from "react-json-view";
import { useNavigate } from "react-router-dom";
import TablePagination from "src/components/General/TablePagination";
import { attributeColors, initialSort, pageSize } from "src/constants/general";
import { initialDiffFilter } from "src/constants/graph";
import { percentageWidths } from "src/constants/summaries";
import {
  GetPropertyValueChanges,
  GetPropertyValueDistribution,
} from "src/services/summaries/system-entropy";
import { useGraphStore } from "src/stores/graph";
import { useSummaryStore } from "src/stores/summaries";
import { Sort } from "src/types/dashboard";
import { KeyNumVal } from "src/types/general";
import {
  convertToUTCString,
  handleSort,
  isEpoch,
  isValidJson,
  isValidTimestamp,
  sortRows,
} from "src/utils/general";
import { closestValue } from "src/utils/graph";

const PropertyDetail = ({ nav }: { nav: string[] }) => {
  const navigate = useNavigate();

  const { period } = useSummaryStore();
  const {
    diffStartTime,
    setNavigationView,
    setDiffIntegrationType,
    setDiffView,
    setDiffStartTime,
    setDiffFilter,
  } = useGraphStore();

  const [selectedNodeID, setSelectedNodeID] = useState<number>(-1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [sort, setSort] = useState<Sort>(initialSort);

  const propertyGroupInfo = nav[nav.length - 2].split("+");
  const propertyInfo = nav[nav.length - 1].split("+");
  const bucketStart = Number(propertyGroupInfo[0]);
  const propertyGroup = propertyGroupInfo[1];
  const nodeType = propertyInfo[0];
  const propertyName = propertyInfo[1];

  const { data: distribution } = GetPropertyValueDistribution(
    period,
    propertyGroup,
    bucketStart,
    nodeType,
    propertyName
  );
  const { data: changes } = GetPropertyValueChanges(
    period,
    propertyGroup,
    bucketStart,
    nodeType,
    propertyName,
    pageNumber
  );

  const metadata = changes && JSON.parse(changes.header.metadata);
  const sortedRows =
    changes?.data.length > 0 ? sortRows(changes?.data, sort) : [];
  const totalCount = changes?.pager.total_results || 0;
  const totalPages = changes?.pager.num_pages || 0;
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;
  const maxBefore = distribution
    ? Math.max(
        ...distribution.distribution.reduce(
          (pV: number[], cV: KeyNumVal) => [...pV, cV.before],
          []
        )
      )
    : 0;
  const maxAfter = distribution
    ? Math.max(
        ...distribution.distribution.reduce(
          (pV: number[], cV: KeyNumVal) => [...pV, cV.after],
          []
        )
      )
    : 0;
  const maxValue = Math.max(maxBefore, maxAfter);

  return (
    <section className="grid gap-16 w-full h-full">
      {distribution && (
        <header className="grid gap-5 p-4 dark:bg-tooltip rounded-md">
          <h4 className="font-bold">{distribution.short_description}</h4>
          <p className="font-extralight">
            Description: {distribution.long_description}
          </p>
        </header>
      )}
      <section className="grid content-start gap-5 text-center">
        <h4>Value Distribution</h4>
        {distribution ? (
          distribution.distribution.length > 0 ? (
            <>
              <article className="grid grid-cols-10 gap-5">
                <h4 className="col-span-4">Before</h4>
                <span className="col-span-2"></span>
                <h4 className="col-span-4">After</h4>
              </article>
              <ul className="grid content-start gap-1 max-h-[30rem] font-extralight overflow-auto scrollbar">
                {distribution.distribution?.map((value: any) => {
                  const before = closestValue(
                    Number(value.before) / maxValue,
                    Object.keys(percentageWidths)
                  );
                  const after = closestValue(
                    Number(value.after) / maxValue,
                    Object.keys(percentageWidths)
                  );
                  return (
                    <li
                      key={value.value}
                      className="grid grid-cols-10 items-center gap-5 w-full text-center"
                    >
                      <span
                        className={`col-span-4 justify-self-end pr-4 pl-2 ${percentageWidths[before]} text-left dark:bg-reset`}
                      >
                        {value.before !== 0 && value.before}
                      </span>
                      <h4 className="col-span-2 w-full break-all text-sm">
                        {isValidJson(value.value.replaceAll("'", '"')) ? (
                          <ReactJson
                            src={JSON.parse(value.value.replaceAll("'", '"'))}
                            name={null}
                            quotesOnKeys={false}
                            displayDataTypes={false}
                            theme="harmonic"
                            collapsed={2}
                          />
                        ) : value.value === "None" ? (
                          "Not Set"
                        ) : isValidTimestamp(value.value) ? (
                          convertToUTCString(value.value)
                        ) : (
                          value.value
                        )}
                      </h4>
                      <span
                        className={`col-span-4 pr-4 pl-2 ${percentageWidths[after]} text-right dark:bg-no`}
                      >
                        {value.after !== 0 && value.after}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <p>No data available</p>
          )
        ) : null}
      </section>
      {changes?.data.length > 0 && (
        <section className="grid gap-5">
          <h4 className="text-center">Value Changes</h4>
          <TablePagination
            totalPages={totalPages}
            beginning={beginning}
            end={end}
            totalCount={totalCount}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          />
          <section className="flex flex-col flex-grow w-full h-[30rem] text-[0.8rem] dark:bg-card overflow-auto scrollbar">
            <table className="w-full table-auto md:table-fixed overflow-auto scrollbar">
              <thead className="sticky -top-1.5 z-10 bg-gradient-to-b dark:from-expand dark:to-table-header">
                <tr>
                  {Object.entries(metadata.properties)?.map((keyVal: any) => {
                    return (
                      <th
                        scope="col"
                        key={keyVal[0]}
                        className="py-3 px-3 last:pr-10 w-full text-left font-semibold"
                      >
                        <article className="capitalize flex gap-10 justify-between">
                          <h4>{keyVal[1].title}</h4>
                          <button aria-label="sort">
                            <FontAwesomeIcon
                              icon={faSort}
                              className="mt-0.5 dark:text-secondary"
                              onClick={() => {
                                handleSort(keyVal[0], setSort);
                                setSelectedNodeID(-1);
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
                {sortedRows?.map((row: any, index: number) => {
                  return (
                    <Fragment key={index}>
                      <tr
                        className={`relative p-5 gap-3 break-words cursor-pointer ${
                          selectedNodeID === index
                            ? "dark:bg-expand border-b dark:border-filter/80"
                            : "dark:bg-card dark:even:bg-gradient-to-b from-panel to-panel/70 dark:hover:bg-gradient-to-b dark:hover:from-expand dark:hover:to-filter/60"
                        }`}
                        onMouseUp={(e) => {
                          if (document.getSelection()?.type === "Range")
                            e.preventDefault();
                          else {
                            if (selectedNodeID === index) setSelectedNodeID(-1);
                            else setSelectedNodeID(index);
                          }
                        }}
                      >
                        {Object.entries(metadata.properties)?.map(
                          (keyVal: any, colIndex: number) => {
                            return (
                              <td
                                key={`${row.node_id}-${colIndex}`}
                                className="relative py-3 px-3 last:pr-16 text-left break-all"
                              >
                                {keyVal[1].type === "array" ? (
                                  <ul className="grid list-disc px-3">
                                    {row[keyVal[0]]?.map((item: string) => (
                                      <li key={item}>{item}</li>
                                    ))}
                                  </ul>
                                ) : isValidJson(row[keyVal[0]]) ? (
                                  <ReactJson
                                    src={JSON.parse(
                                      row[keyVal[0]].replaceAll("'", '"')
                                    )}
                                    name={null}
                                    quotesOnKeys={false}
                                    displayDataTypes={false}
                                    theme="harmonic"
                                    collapsed={2}
                                  />
                                ) : (
                                  <p
                                    className={`${
                                      attributeColors[
                                        String(row[keyVal[0]]).toLowerCase()
                                      ]
                                    }`}
                                  >
                                    {row[keyVal[0]] === "None"
                                      ? "—"
                                      : isValidTimestamp(row[keyVal[0]])
                                      ? convertToUTCString(row[keyVal[0]])
                                      : String(row[keyVal[0]]).replaceAll(
                                          '"',
                                          ""
                                        )}
                                  </p>
                                )}
                                {colIndex === metadata.required.length - 1 && (
                                  <button className="absolute right-5 top-1/3 w-6 h-6 dark:hover:text-clear dark:text-checkbox duration-100 justify-self-end cursor-pointer">
                                    <FontAwesomeIcon
                                      icon={
                                        selectedNodeID === index
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
                      {selectedNodeID === index && (
                        <tr
                          key={`${index}-expanded`}
                          className="relative py-5 px-10 gap-10 bg-gradient-to-b dark:from-expand dark:to-expand/60"
                        >
                          <td
                            colSpan={metadata.required.length + 1}
                            className="p-5"
                          >
                            <section className="relative grid grid-cols-1 gap-10 py-5 w-full">
                              <button
                                className="flex items-center gap-2 dark:text-checkbox"
                                onClick={() => {
                                  setNavigationView("evolution");
                                  setDiffIntegrationType(row.integration_type);
                                  setDiffView("snapshot");
                                  setDiffStartTime({
                                    ...diffStartTime,
                                    month: 0,
                                    snapshot: row.new_record_time,
                                  });
                                  setDiffFilter(initialDiffFilter);
                                  navigate("/graph/summary");
                                }}
                              >
                                <FontAwesomeIcon icon={faDiagramProject} />
                                View Evolution
                              </button>
                              <section className="grid gap-5 w-full break-all">
                                {["before", "after"].map((state) => {
                                  return (
                                    <article
                                      key={state}
                                      className="flex flex-wrap items-center gap-2"
                                    >
                                      <h4 className="w-12 capitalize">
                                        {state}
                                      </h4>
                                      <article
                                        className={`${attributeColors[state]}`}
                                      >
                                        {isValidJson(row[state]) ? (
                                          <ReactJson
                                            src={JSON.parse(
                                              row[state].replaceAll("'", '"')
                                            )}
                                            name={null}
                                            quotesOnKeys={false}
                                            displayDataTypes={false}
                                            theme="harmonic"
                                            collapsed={2}
                                          />
                                        ) : (
                                          <p className="break-all">
                                            {isEpoch(row[state])
                                              ? convertToUTCString(row[state])
                                              : row[state]}
                                          </p>
                                        )}
                                      </article>
                                    </article>
                                  );
                                })}
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
      )}
    </section>
  );
};

export default PropertyDetail;
