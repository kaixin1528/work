/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import SortColumn from "src/components/Button/SortColumn";
import ViewInGraph from "src/components/Button/ViewInGraph";
import Alerts from "src/components/Graph/DetailPanel/Alerts";
import Timeline from "src/components/Graph/DetailPanel/Timeline";
import TimestampFilter from "src/components/Filter/General/TimestampFilter";
import KeyValuePair from "src/components/General/KeyValuePair";
import TablePagination from "src/components/General/TablePagination";
import { attributeColors, initialSort, pageSize } from "src/constants/general";
import TableLayout from "src/layouts/TableLayout";
import {
  GetDatabaseEvents,
  GetDatabaseSnapshots,
} from "src/services/summaries/database-storage";
import { useSummaryStore } from "src/stores/summaries";
import { KeyStringVal, ListHeader } from "src/types/general";
import { convertToUTCString, sortRows } from "src/utils/general";

const Expanded = ({
  resourceID,
  database,
  headers,
}: {
  resourceID: string;
  database: any;
  headers: any;
}) => {
  const {
    period,
    selectedReportAccount,
    selectedDSResourceType,
    selectedDSResourceID,
  } = useSummaryStore();

  const [selectedSnapshot, setSelectedSnapshot] = useState<number>(0);
  const [query, setQuery] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [sort, setSort] = useState(initialSort);

  const integrationType = selectedReportAccount?.integration_type || "";
  const sourceAccountID = selectedReportAccount?.customer_cloud_id || "";

  const { data: databaseSnapshots } = GetDatabaseSnapshots(
    period,
    integrationType,
    sourceAccountID,
    selectedDSResourceID
  );
  const { data: databaseEvents } = GetDatabaseEvents(
    period,
    integrationType,
    sourceAccountID,
    selectedDSResourceID,
    pageNumber
  );

  const filteredEvents =
    query !== ""
      ? databaseEvents?.data.filter((event: KeyStringVal) =>
          event.event_message
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        )
      : databaseEvents?.data;
  const totalCount = databaseEvents?.pager.total_results || 0;
  const totalPages = databaseEvents?.pager.num_pages || 0;
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;
  const sortedEvents = sortRows(filteredEvents, sort);

  useEffect(() => {
    if (databaseSnapshots?.length > 0 && selectedSnapshot === 0)
      setSelectedSnapshot(databaseSnapshots[0]);
  }, [databaseSnapshots]);

  return (
    <tr
      key={`${resourceID}-expanded`}
      className="relative py-5 px-10 gap-10 bg-gradient-to-b dark:from-expand dark:to-expand/60"
    >
      <td colSpan={headers?.length + 1} className="p-5 pl-10 pr-20 pb-10 w-5">
        <header className="grid gap-3 break-all">
          <KeyValuePair label="Resource ID" value={resourceID} />
          {database.encryption_details !== "" && (
            <KeyValuePair
              label="Encryption Details"
              value={String(database.encryption_details)}
            />
          )}
          <TimestampFilter
            label="Snapshots"
            list={databaseSnapshots}
            value={selectedSnapshot}
            setValue={setSelectedSnapshot}
          />
        </header>
        {databaseEvents && (
          <section className="flex flex-col flex-grow content-start gap-5 mt-5">
            <h4 className="w-max text-sm full-underlined-label">Events</h4>
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
            {sortedEvents?.length > 0 ? (
              <TableLayout height="max-h-[20rem]">
                <thead className="sticky -top-1.5 z-10 bg-gradient-to-b dark:from-expand dark:to-table-header">
                  <tr>
                    {databaseEvents.header.map((col: ListHeader) => {
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
                  {sortedEvents?.map((row: any, rowIndex: number) => {
                    return (
                      <tr
                        key={rowIndex}
                        className="relative p-5 gap-3 break-words dark:bg-card dark:even:bg-gradient-to-b from-panel to-panel/70"
                      >
                        {databaseEvents.header.map(
                          (col: ListHeader, index: number) => {
                            return (
                              <td
                                key={index}
                                className="relative py-3 px-5 text-left"
                              >
                                {col.data_type === "timestamp" ? (
                                  convertToUTCString(row[col.property_name])
                                ) : col.data_type === "list" ? (
                                  <ul className="grid list-disc px-4">
                                    {row[col.property_name].map(
                                      (value: string) => (
                                        <li key={value}>{value}</li>
                                      )
                                    )}
                                  </ul>
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
                              </td>
                            );
                          }
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </TableLayout>
            ) : (
              <p>No data available</p>
            )}
          </section>
        )}

        <section className="grid md:grid-cols-2 content-start gap-10 mt-10">
          <article className="grid content-start">
            <h4 className="text-sm underlined-label">Alerts</h4>
            <Alerts
              elementID={resourceID}
              integrationType={integrationType}
              curSnapshotTime={selectedSnapshot}
              showLimited
            />
          </article>
          <article className="grid content-start">
            <h4 className="text-sm underlined-label">Timeline</h4>
            <Timeline
              elementID={resourceID}
              nodeType={selectedDSResourceType}
              uniqueID={String(database.unique_id)}
              showLimited
            />
          </article>
          <article className="grid gap-3 text-sm">
            <h4 className="underlined-label">Connected Resources</h4>
            <ViewInGraph
              requestData={{
                query_type: "blast_radius",
                id: resourceID,
              }}
              curSnapshotTime={selectedSnapshot}
            />
          </article>
          {selectedDSResourceType.toLowerCase() !== "gcs" && (
            <article className="grid gap-3 text-sm">
              <h4 className="underlined-label">
                {integrationType === "AWS" ? "Security group" : "Firewall"}{" "}
                resources used with {selectedDSResourceType}
              </h4>
              <ViewInGraph
                requestData={{
                  query_type: "connected_with_id_generic",
                  id: resourceID,
                  connected: integrationType === "AWS" ? "SG" : "GF",
                }}
                curSnapshotTime={selectedSnapshot}
              />
            </article>
          )}
        </section>
      </td>
    </tr>
  );
};

export default Expanded;
