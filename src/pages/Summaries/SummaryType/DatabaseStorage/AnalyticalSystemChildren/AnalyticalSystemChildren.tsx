/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from "react";
import { convertToUTCString, parseURL, sortRows } from "src/utils/general";
import { KeyAllVal, ListHeader } from "src/types/general";
import SortColumn from "src/components/Button/SortColumn";
import { attributeColors, initialSort } from "src/constants/general";
import KeyValuePair from "src/components/General/KeyValuePair";
import {
  GetAnalyticalSystemChildren,
  GetAnalyticalSystemOverview,
} from "src/services/summaries/database-storage";
import { Sort } from "src/types/dashboard";
import TablePagination from "src/components/General/TablePagination";
import { useSummaryStore } from "src/stores/summaries";
import Expanded from "./Expanded";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AnalyticalSystemChildren = () => {
  const parsed = parseURL();

  const { period, selectedReportAccount, selectedDSResourceType } =
    useSummaryStore();

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedChildType, setSelectedChildType] = useState<string>("");
  const [selectedSystem, setSelectedSystem] = useState<string>("");
  const [sort, setSort] = useState<Sort>(initialSort);

  const integrationType = selectedReportAccount?.integration_type || "";
  const accountID = selectedReportAccount?.customer_cloud_id || "";

  const { data: systems } = GetAnalyticalSystemOverview(
    period,
    integrationType,
    accountID
  );
  const { data: systemChildren } = GetAnalyticalSystemChildren(
    period,
    integrationType,
    accountID,
    String(parsed.cve_id),
    selectedChildType,
    100,
    pageNumber
  );

  const systemTypes =
    systems && Object.keys(systems).length > 0 && selectedDSResourceType !== ""
      ? systems[selectedDSResourceType].children_classes
      : [];
  const sortedSystems = systemChildren && sortRows(systemChildren.data, sort);
  const headers = systemChildren ? systemChildren?.metadata?.headers : [];
  const pageSize = systemChildren?.pager?.page_size || 0;
  const totalCount = systemChildren?.pager?.total_results || 0;
  const totalPages = systemChildren?.pager?.num_pages || 0;
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  useEffect(() => {
    if (
      systems &&
      Object.keys(systems).length > 0 &&
      selectedDSResourceType !== ""
    )
      setSelectedChildType(systems[selectedDSResourceType].children_classes[0]);
  }, [systems]);

  useEffect(() => {
    setSelectedSystem("");
  }, [selectedChildType]);

  return (
    <section className="flex flex-col flex-grow gap-5 p-4 text-sm dark:bg-panel black-shadow">
      <header className="flex items-center gap-5">
        <article className="flex items-center gap-2">
          <img
            src={`/general/integrations/${integrationType.toLowerCase()}.svg`}
            alt={integrationType}
            className="w-7 h-7"
          />
          <p>{accountID}</p>
        </article>
        <KeyValuePair
          label={`${selectedDSResourceType} ID`}
          value={String(parsed.resource_id)}
        />
      </header>
      <nav className="flex items-center gap-2 text-sm w-full">
        {systemChildren ? (
          systemTypes?.length > 0 ? (
            systemTypes.map((system: string) => {
              return (
                <article
                  key={system}
                  className={`flex items-center gap-2 p-2 cursor-pointer w-max text-center ${
                    selectedChildType === system
                      ? "selected-button"
                      : "not-selected-button"
                  }`}
                  onClick={() => setSelectedChildType(system)}
                >
                  {selectedChildType !== "" && (
                    <img
                      src={`/graph/nodes/${String(
                        integrationType
                      ).toLowerCase()}/${selectedChildType.toLowerCase()}.svg`}
                      alt={selectedChildType}
                      className="w-5 h-5"
                    />
                  )}
                  {systemChildren?.node_type_name} (
                  {systemChildren?.data?.length || 0})
                </article>
              );
            })
          ) : (
            <p>No data available</p>
          )
        ) : null}
      </nav>

      {systemChildren && selectedChildType !== "" && systemTypes?.length > 0 ? (
        sortedSystems?.length > 0 ? (
          <section className="grid gap-5">
            <TablePagination
              totalPages={totalPages}
              beginning={beginning}
              end={end}
              totalCount={totalCount}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
            />
            <section className="flex flex-col flex-grow w-full h-[50rem] text-[0.8rem] dark:bg-card overflow-auto scrollbar">
              <table className="w-full table-auto md:table-fixed overflow-auto">
                <thead className="sticky -top-1.5 z-10 bg-gradient-to-b dark:from-expand dark:to-table-header">
                  <tr>
                    {headers?.map((label: ListHeader) => {
                      return (
                        <th
                          scope="col"
                          key={label.property_name}
                          className="py-3 px-3 last:pr-10 w-full text-left font-semibold"
                        >
                          <article className="capitalize flex gap-10 justify-between">
                            <h4>{label.display_name}</h4>
                            <SortColumn
                              propertyName={label.property_name}
                              setSort={setSort}
                            />
                          </article>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {sortedSystems?.map((system: KeyAllVal) => {
                    const resourceID = system.resource_id;
                    return (
                      <Fragment key={String(resourceID)}>
                        <tr
                          className={`relative p-5 gap-3 break-words cursor-pointer ${
                            selectedSystem === resourceID
                              ? "dark:bg-expand border-b dark:border-filter/80"
                              : "dark:bg-card dark:even:bg-gradient-to-b from-panel to-panel/70 dark:hover:bg-gradient-to-b dark:hover:from-expand dark:hover:to-filter/60"
                          }`}
                          onMouseUp={(e) => {
                            if (document.getSelection()?.type === "Range")
                              e.preventDefault();
                            else {
                              if (selectedSystem === resourceID)
                                setSelectedSystem("");
                              else setSelectedSystem(String(resourceID));
                            }
                          }}
                        >
                          {headers?.map((label: ListHeader, index: number) => {
                            return (
                              <td
                                key={`${label.property_name}-${index}`}
                                className="relative py-3 px-3 last:pr-16 text-left truncate lg:whitespace-normal"
                              >
                                {label.property_name.includes("musecs") ? (
                                  <p>
                                    {convertToUTCString(
                                      Number(system[label.property_name])
                                    )}
                                  </p>
                                ) : (
                                  <p
                                    className={`${
                                      attributeColors[
                                        String(system[label.property_name])
                                      ]
                                    }`}
                                  >
                                    {String(system[label.property_name])}
                                  </p>
                                )}
                                {index === headers?.length - 1 && (
                                  <button className="absolute right-5 top-1/3 w-6 h-6 dark:hover:text-clear dark:text-checkbox duration-100 justify-self-end cursor-pointer">
                                    <FontAwesomeIcon
                                      icon={
                                        selectedSystem === resourceID
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
                        {selectedSystem === resourceID && (
                          <Expanded
                            resourceID={resourceID}
                            system={system}
                            headers={headers}
                            selectedChildType={selectedChildType}
                          />
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </section>
          </section>
        ) : (
          <p>No data available</p>
        )
      ) : null}
    </section>
  );
};

export default AnalyticalSystemChildren;
