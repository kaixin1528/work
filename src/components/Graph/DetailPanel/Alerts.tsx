/* eslint-disable no-restricted-globals */
import { Fragment, useState } from "react";
import { Filter, ListHeader } from "../../../types/general";
import AlertFilter from "../../Filter/Graph/AlertFilter";
import { calcTimeFromSnapshot, convertToUTCString } from "src/utils/general";
import TablePagination from "../../General/TablePagination";
import { useGeneralStore } from "src/stores/general";
import { attributeColors, pageSize } from "src/constants/general";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { Disclosure } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { GetDBEvents, GetNodeAlerts } from "src/services/graph/alerts";
import TableLayout from "src/layouts/TableLayout";

const Alerts = ({
  integrationType,
  elementID,
  curSnapshotTime,
  showLimited,
}: {
  integrationType: string | undefined;
  elementID: string | (string | null)[] | null;
  curSnapshotTime?: number | undefined;
  showLimited?: boolean;
}) => {
  const navigate = useNavigate();

  const { env } = useGeneralStore();

  const [selectedTab, setSelectedTab] = useState<string>("Alerts");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [filter, setFilter] = useState<Filter[]>([
    {
      field: "timestamp",
      op: "ge",
      value: calcTimeFromSnapshot(2.592e12, Number(curSnapshotTime)),
      type: "integer",
      set_op: "and",
    },
  ]);

  const { data: dbEvents } = GetDBEvents(env, integrationType, elementID, {
    filters: filter,
    pager: {
      page_number: pageNumber,
      page_size: pageSize,
    },
  });
  const { data: alerts } = GetNodeAlerts(env, integrationType, elementID, {
    filters: filter,
    pager: {
      page_number: pageNumber,
      page_size: pageSize,
    },
  });

  const totalCount =
    selectedTab === "Alerts"
      ? alerts?.pager.total_results
      : dbEvents?.pager.total_results || 0;
  const totalPages =
    selectedTab === "Alerts"
      ? alerts?.pager.num_pages
      : dbEvents?.pager.num_pages || 0;
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <section className="flex flex-col flex-grow content-start gap-5 pt-4 px-4 mt-3 h-full dark:bg-card overflow-auto scrollbar">
      {!showLimited && (
        <AlertFilter setFilter={setFilter} curSnapshotTime={curSnapshotTime} />
      )}
      <header className="flex flex-wrap items-center justify-between gap-10">
        <nav className="flex items-center gap-5">
          {["Alerts", "DB Events"].map((tab) => {
            return (
              <button key={tab} onClick={() => setSelectedTab(tab)}>
                <h4
                  className={`w-max text-sm ${
                    selectedTab === tab
                      ? "full-underlined-label"
                      : "hover:full-underlined-label"
                  }`}
                >
                  {tab}
                </h4>
              </button>
            );
          })}
        </nav>
        <TablePagination
          totalPages={totalPages}
          beginning={beginning}
          end={end}
          totalCount={totalCount}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
        />
      </header>
      {selectedTab === "Alerts" ? (
        <section className="grid h-full">
          {alerts ? (
            alerts.event_items.length > 0 ? (
              <section className="grid gap-5">
                <ul className="grid content-start gap-3 pb-4 w-full text-sm">
                  {alerts.event_items
                    .slice(0, showLimited ? 3 : alerts.length)
                    .map((alert: any) => {
                      const type = alert.context.findings_type.toLowerCase();
                      return (
                        <Fragment key={alert.event_cluster_id}>
                          <li className="grid content-start p-2 pl-3 pr-5 gap-2 text-xs dark:bg-tooltip shadow-sm dark:shadow-filter">
                            <header className="flex items-start justify-between">
                              <article className="flex flex-wrap items-center gap-3">
                                <article className="flex flex-wrap items-center gap-2">
                                  <img
                                    src={`/graph/alerts/${type}.svg`}
                                    alt={type.name}
                                    className="w-5 h-5"
                                  />
                                  <p className="capitalize">
                                    {type.replaceAll("_", " ")}
                                  </p>
                                </article>
                                <p className="px-3 py-1 bg-red-700/30 border border-red-700 rounded-full">
                                  {alert.count}
                                </p>
                                <button
                                  className="flex items-center gap-2 px-2 py-1 dark:hover:text-checkbox/70 duration-100"
                                  onClick={() =>
                                    navigate(
                                      `/graph/alert-analysis/details?graph_artifact_id=${alert.graph_artifact_id}&event_cluster_id=${alert.event_cluster_id}`
                                    )
                                  }
                                >
                                  <FontAwesomeIcon
                                    icon={faChartSimple}
                                    className="dark:text-checkbox"
                                  />
                                  <p>Analyze</p>
                                </button>
                              </article>
                              <article className="grid dark:text-checkbox">
                                <h4 className="justify-self-end">First seen</h4>
                                <p>
                                  {convertToUTCString(alert.first_recorded)}
                                </p>
                              </article>
                            </header>
                            <section className="grid gap-5">
                              <Disclosure>
                                {({ open }) => (
                                  <>
                                    <Disclosure.Button className="flex items-center gap-2">
                                      <FontAwesomeIcon
                                        icon={
                                          open
                                            ? faChevronCircleDown
                                            : faChevronCircleRight
                                        }
                                        className="dark:text-checkbox"
                                      />
                                      <p>
                                        {open ? "Hide" : "Show"} latest alert
                                      </p>
                                    </Disclosure.Button>
                                    <Disclosure.Panel className="grid gap-5 p-4 dark:bg-panel">
                                      <header className="flex flex-wrap items-center gap-2">
                                        <img
                                          src={`/graph/alerts/${alert.context.severity?.toLowerCase()}.svg`}
                                          alt={alert.context.severity}
                                          className="w-4 h-4"
                                        />
                                        <p>{alert.context.description}</p>
                                      </header>
                                      <article className="grid gap-2">
                                        <h4 className="underlined-label">
                                          Remediation
                                        </h4>
                                        <p>{alert.context.remediation}</p>
                                      </article>
                                      <article className="grid gap-2">
                                        <h4 className="underlined-label">
                                          References
                                        </h4>
                                        <ul className="grid gap-2 px-4 break-all list-disc">
                                          {alert.context.references?.map(
                                            (reference: string) => {
                                              return (
                                                <li key={reference}>
                                                  <a
                                                    href={reference}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-max hover:text-signin hover:underline"
                                                  >
                                                    {reference}
                                                  </a>
                                                </li>
                                              );
                                            }
                                          )}
                                        </ul>
                                      </article>
                                    </Disclosure.Panel>
                                  </>
                                )}
                              </Disclosure>
                            </section>
                          </li>
                        </Fragment>
                      );
                    })}
                </ul>
              </section>
            ) : (
              <article className="grid gap-2 place-self-center py-10 text-center">
                <img
                  src="/general/checkmark.svg"
                  alt="checkmark"
                  className="mx-auto"
                />
                <p>No alerts detected</p>
              </article>
            )
          ) : null}
        </section>
      ) : dbEvents ? (
        <section className="flex flex-col flex-grow content-start gap-5">
          {dbEvents?.data.length > 0 ? (
            <TableLayout>
              <thead className="sticky -top-1.5 z-10 bg-gradient-to-b dark:from-expand dark:to-table-header">
                <tr>
                  {dbEvents.header.map((col: ListHeader) => {
                    return (
                      <th
                        scope="col"
                        key={col.display_name}
                        className="py-3 px-5 text-left font-semibold"
                      >
                        <article className="capitalize flex gap-10 justify-between">
                          <h4>{col.display_name}</h4>
                        </article>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {dbEvents?.data.map((row: any, rowIndex: number) => {
                  return (
                    <tr
                      key={rowIndex}
                      className="relative p-5 gap-3 break-words dark:bg-card dark:even:bg-gradient-to-b from-panel to-panel/70"
                    >
                      {dbEvents.header.map((col: ListHeader, index: number) => {
                        return (
                          <td
                            key={index}
                            className="relative py-3 px-5 text-left"
                          >
                            {col.data_type === "timestamp" ? (
                              convertToUTCString(row[col.property_name])
                            ) : col.data_type === "list" ? (
                              <ul className="grid list-disc px-4">
                                {row[col.property_name].map((value: string) => (
                                  <li key={value}>{value}</li>
                                ))}
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
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </TableLayout>
          ) : (
            <p className="text-sm">No events available</p>
          )}
        </section>
      ) : null}
    </section>
  );
};

export default Alerts;
