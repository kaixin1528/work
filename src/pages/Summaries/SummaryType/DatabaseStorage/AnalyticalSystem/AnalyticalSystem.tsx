/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from "react";
import { convertToUTCString, parseURL, sortRows } from "src/utils/general";
import { KeyAllVal, ListHeader } from "src/types/general";
import SortColumn from "src/components/Button/SortColumn";
import { attributeColors, initialSort } from "src/constants/general";
import { GetAnalyticalSystemOverview } from "src/services/summaries/database-storage";
import { Sort } from "src/types/dashboard";
import { useSummaryStore } from "src/stores/summaries";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import Expanded from "./Expanded";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AnalyticalSystem = () => {
  const navigate = useNavigate();
  const parsed = parseURL();

  const {
    period,
    selectedReportAccount,
    selectedDSResourceType,
    setSelectedDSResourceType,
    selectedDSResourceID,
    setSelectedDSResourceID,
  } = useSummaryStore();

  const [sort, setSort] = useState<Sort>(initialSort);

  const integrationType = selectedReportAccount?.integration_type || "";
  const sourceAccountID = selectedReportAccount?.customer_cloud_id || "";

  const { data: systems } = GetAnalyticalSystemOverview(
    period,
    integrationType,
    sourceAccountID
  );

  const systemTypes = systems && Object.keys(systems);
  const filteredSystems =
    systems && selectedDSResourceType !== ""
      ? systems[selectedDSResourceType]?.data
      : [];
  const sortedSystems = filteredSystems && sortRows(filteredSystems, sort);
  const headers =
    systems && selectedDSResourceType !== ""
      ? systems[selectedDSResourceType]?.metadata.headers
      : [];

  useEffect(() => {
    if (systemTypes?.length > 0)
      if (selectedDSResourceType === "")
        setSelectedDSResourceType(systemTypes[0]);
      else document.getElementById(`${selectedDSResourceID}`)?.scrollIntoView();
  }, [systemTypes]);

  return (
    <section className="flex flex-col flex-grow gap-5 p-4 dark:bg-panel black-shadow">
      <nav className="flex items-center gap-2 text-sm w-full">
        {systemTypes ? (
          systemTypes.length > 0 ? (
            systemTypes.map((system: string) => {
              return (
                <article
                  key={system}
                  className={`flex items-center gap-2 p-2 cursor-pointer w-max text-center ${
                    selectedDSResourceType === system
                      ? "selected-button"
                      : "not-selected-button"
                  }`}
                  onClick={() => setSelectedDSResourceType(system)}
                >
                  {selectedDSResourceType !== "" && (
                    <img
                      src={`/graph/nodes/${integrationType.toLowerCase()}/${selectedDSResourceType.toLowerCase()}.svg`}
                      alt={selectedDSResourceType}
                      className="w-5 h-5"
                    />
                  )}
                  {systems[system]?.node_type_name} (
                  {systems[system]?.data?.length})
                </article>
              );
            })
          ) : (
            <p>No data available</p>
          )
        ) : null}
      </nav>

      {systems && selectedDSResourceType !== "" ? (
        sortedSystems?.length > 0 ? (
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
                        id={String(resourceID)}
                        className={`relative p-5 gap-3 break-words cursor-pointer ${
                          selectedDSResourceID === resourceID
                            ? "dark:bg-expand border-b dark:border-filter/80"
                            : "dark:bg-card dark:even:bg-gradient-to-b from-panel to-panel/70 dark:hover:bg-gradient-to-b dark:hover:from-expand dark:hover:to-filter/60"
                        }`}
                        onMouseUp={(e) => {
                          if (document.getSelection()?.type === "Range")
                            e.preventDefault();
                          else {
                            if (selectedDSResourceID === resourceID)
                              setSelectedDSResourceID("");
                            else setSelectedDSResourceID(String(resourceID));
                          }
                        }}
                      >
                        {headers?.map((label: ListHeader, index: number) => {
                          return (
                            <td
                              key={`${label.property_name}-${index}`}
                              className="relative py-3 px-3 last:pr-16 text-left truncate lg:whitespace-normal"
                            >
                              {label.property_name === "resource_id" ? (
                                <article
                                  className="w-max break-all truncate text-ellipsis hover:underline cursor-pointer"
                                  onClick={() =>
                                    navigate(
                                      `/summaries/details?${queryString.stringify(
                                        parsed
                                      )}&resource_id=${resourceID}`
                                    )
                                  }
                                >
                                  {system[label.property_name]}
                                </article>
                              ) : label.property_name.includes("musecs") ? (
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
                                      selectedDSResourceID === resourceID
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
                      {selectedDSResourceID === resourceID && (
                        <Expanded
                          resourceID={resourceID}
                          system={system}
                          headers={headers}
                        />
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </section>
        ) : (
          <p>No data available</p>
        )
      ) : null}
    </section>
  );
};

export default AnalyticalSystem;
