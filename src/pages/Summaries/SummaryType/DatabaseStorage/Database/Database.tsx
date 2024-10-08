/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from "react";
import { convertToUTCString, sortRows } from "src/utils/general";
import { ListHeader, KeyAllVal } from "src/types/general";
import SortColumn from "src/components/Button/SortColumn";
import { GetDatabaseOverview } from "src/services/summaries/database-storage";
import { useGraphStore } from "src/stores/graph";
import { useNavigate } from "react-router-dom";
import { attributeColors, initialSort } from "src/constants/general";
import { useSummaryStore } from "src/stores/summaries";
import { handleViewSnapshot } from "src/utils/graph";
import { GetQueryLookup } from "src/services/graph/search";
import Expanded from "./Expanded";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Database = () => {
  const navigate = useNavigate();

  const {
    period,
    selectedReportAccount,
    selectedDSResourceType,
    setSelectedDSResourceType,
    selectedDSResourceID,
    setSelectedDSResourceID,
  } = useSummaryStore();
  const {
    setNavigationView,
    setGraphSearch,
    setGraphSearching,
    setGraphSearchString,
    setSnapshotTime,
  } = useGraphStore();

  const [sort, setSort] = useState(initialSort);

  const integrationType = selectedReportAccount?.integration_type || "";
  const sourceAccountID = selectedReportAccount?.customer_cloud_id || "";

  const { data: databases } = GetDatabaseOverview(
    period,
    integrationType,
    sourceAccountID
  );
  const queryLookup = GetQueryLookup();

  const databaseTypes = databases && Object.keys(databases);
  const filteredDatabases =
    databases && selectedDSResourceType !== ""
      ? databases[selectedDSResourceType]?.data
      : [];
  const sortedDatabases =
    filteredDatabases && sortRows(filteredDatabases, sort);
  const headers =
    databases && selectedDSResourceType !== ""
      ? databases[selectedDSResourceType]?.metadata.headers
      : [];

  useEffect(() => {
    if (databaseTypes?.length > 0)
      if (selectedDSResourceType === "")
        setSelectedDSResourceType(databaseTypes[0]);
      else document.getElementById(`${selectedDSResourceID}`)?.scrollIntoView();
  }, [databaseTypes]);

  return (
    <section className="flex flex-col flex-grow gap-5 p-4 dark:bg-panel black-shadow">
      <nav className="flex items-center gap-2 text-sm w-full">
        {databaseTypes ? (
          databaseTypes.length > 0 ? (
            databaseTypes?.map((database: string) => {
              return (
                <article
                  key={database}
                  className={`flex items-center gap-2 p-2 cursor-pointer w-max text-center ${
                    selectedDSResourceType === database
                      ? "selected-button"
                      : "not-selected-button"
                  }`}
                  onClick={() => setSelectedDSResourceType(database)}
                >
                  {selectedDSResourceType !== "" && (
                    <img
                      src={`/graph/nodes/${integrationType.toLowerCase()}/${selectedDSResourceType.toLowerCase()}.svg`}
                      alt={selectedDSResourceType}
                      className="w-5 h-5"
                    />
                  )}
                  <h4>
                    {databases[database]?.node_type_name} (
                    {databases[database]?.data?.length})
                  </h4>
                </article>
              );
            })
          ) : (
            <p>No data available</p>
          )
        ) : null}
      </nav>

      {databases && selectedDSResourceType !== "" ? (
        sortedDatabases?.length > 0 ? (
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
                {sortedDatabases?.map((database: KeyAllVal) => {
                  const resourceID = String(database.resource_id);
                  return (
                    <Fragment key={resourceID}>
                      <tr
                        id={resourceID}
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
                            else setSelectedDSResourceID(resourceID);
                          }
                        }}
                      >
                        {headers?.map((label: ListHeader, index: number) => {
                          return (
                            <td
                              key={`${label.property_name}-${index}`}
                              className="relative py-3 px-3 last:pr-16 break-all"
                            >
                              {label.property_name === "resource_id" ? (
                                <p
                                  className="max-w-60 break-all truncate text-ellipsis hover:underline hover:cursor-pointer"
                                  onClick={() =>
                                    queryLookup.mutate(
                                      {
                                        requestData: {
                                          query_type: "view_in_graph",
                                          id: resourceID,
                                        },
                                      },
                                      {
                                        onSuccess: (queryString) =>
                                          handleViewSnapshot(
                                            queryString,
                                            setNavigationView,
                                            setGraphSearch,
                                            setGraphSearching,
                                            setGraphSearchString,
                                            navigate,
                                            setSnapshotTime,
                                            Number(database.timestamp)
                                          ),
                                      }
                                    )
                                  }
                                >
                                  {database[label.property_name]}
                                </p>
                              ) : label.property_name.includes("musecs") ? (
                                <p>
                                  {convertToUTCString(
                                    Number(database[label.property_name])
                                  )}
                                </p>
                              ) : (
                                <p
                                  className={`${
                                    attributeColors[
                                      String(database[label.property_name])
                                    ]
                                  }`}
                                >
                                  {String(database[label.property_name])}
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
                          database={database}
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

export default Database;
