/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from "react";
import { convertToUTCString, sortRows } from "src/utils/general";
import { ListHeader, KeyAllVal } from "src/types/general";
import SortColumn from "src/components/Button/SortColumn";
import { attributeColors, initialSort } from "src/constants/general";
import { useGraphStore } from "src/stores/graph";
import { GetStorageOverview } from "src/services/summaries/database-storage";
import { useNavigate } from "react-router-dom";
import { Sort } from "src/types/dashboard";
import { useSummaryStore } from "src/stores/summaries";
import { handleViewSnapshot } from "src/utils/graph";
import { GetQueryLookup } from "src/services/graph/search";
import Expanded from "./Expanded";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Storage = () => {
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

  const [sort, setSort] = useState<Sort>(initialSort);

  const integrationType = selectedReportAccount?.integration_type || "";

  const { data: storage } = GetStorageOverview(
    period,
    integrationType,
    selectedReportAccount?.customer_cloud_id || ""
  );
  const queryLookup = GetQueryLookup();

  const storageTypes = storage && Object.keys(storage);
  const filteredStorage =
    storage && selectedDSResourceType !== ""
      ? storage[selectedDSResourceType]?.data
      : [];
  const sortedStorage = filteredStorage && sortRows(filteredStorage, sort);
  const headers =
    storage && selectedDSResourceType !== ""
      ? storage[selectedDSResourceType]?.metadata.headers
      : [];

  useEffect(() => {
    if (storageTypes?.length > 0)
      if (selectedDSResourceType === "")
        setSelectedDSResourceType(storageTypes[0]);
      else document.getElementById(`${selectedDSResourceID}`)?.scrollIntoView();
  }, [storageTypes]);

  return (
    <section className="flex flex-col flex-grow gap-5 p-4 dark:bg-panel black-shadow">
      <nav className="flex items-center gap-2 text-sm w-full">
        {storageTypes ? (
          storageTypes.length > 0 ? (
            storageTypes.map((curStorage: string) => {
              return (
                <article
                  key={curStorage}
                  className={`flex items-center gap-2 p-2 cursor-pointer w-max text-center ${
                    selectedDSResourceType === curStorage
                      ? "selected-button"
                      : "not-selected-button"
                  }`}
                  onClick={() => setSelectedDSResourceType(curStorage)}
                >
                  {selectedDSResourceType !== "" && (
                    <img
                      src={`/graph/nodes/${integrationType.toLowerCase()}/${selectedDSResourceType.toLowerCase()}.svg`}
                      alt={selectedDSResourceType}
                      className="w-5 h-5"
                    />
                  )}
                  {storage[curStorage]?.node_type_name} (
                  {storage[curStorage]?.data?.length})
                </article>
              );
            })
          ) : (
            <p>No data available</p>
          )
        ) : null}
      </nav>

      {storage && selectedDSResourceType !== "" ? (
        sortedStorage?.length > 0 ? (
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
                {sortedStorage?.map((storage: KeyAllVal) => {
                  const resourceID = storage.resource_id;
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
                                            Number(storage.timestamp)
                                          ),
                                      }
                                    )
                                  }
                                >
                                  {storage[label.property_name]}
                                </article>
                              ) : label.property_name.includes("musecs") ? (
                                <p>
                                  {convertToUTCString(
                                    Number(storage[label.property_name])
                                  )}
                                </p>
                              ) : (
                                <p
                                  className={`${
                                    attributeColors[
                                      String(storage[label.property_name])
                                    ]
                                  }`}
                                >
                                  {String(storage[label.property_name])}
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
                          storage={storage}
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

export default Storage;
