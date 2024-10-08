/* eslint-disable react-hooks/exhaustive-deps */
import {
  faChevronUp,
  faChevronDown,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import ViewInGraph from "src/components/Button/ViewInGraph";
import { userColors } from "src/constants/general";
import { severityColors } from "src/constants/summaries";
import PaginatedListLayout from "src/layouts/PaginatedListLayout";
import {
  GetAuditLogSignificantChanges,
  GetAuditEvents,
  GetAuditLogUserInfo,
  GetAuditLogUsers,
  FavoriteAuditEvent,
  GetAuditLogSummaryInfo,
} from "src/services/summaries/audit-logs";
import { useSummaryStore } from "src/stores/summaries";
import { KeyStringVal } from "src/types/general";

const AuditEvents = () => {
  const { period, selectedReportAccount } = useSummaryStore();

  const [selectedResourceType, setSelectedResourceType] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [query, setQuery] = useState<string>("");

  const sourceAccountID = selectedReportAccount?.customer_cloud_id || "";

  const { data: users } = GetAuditLogUsers(period, sourceAccountID);
  const { data: userInfo, status: userInfoStatus } = GetAuditLogUserInfo(
    period,
    sourceAccountID,
    selectedUser
  );
  const { data: significantChanges } = GetAuditLogSignificantChanges(
    period,
    sourceAccountID
  );
  const { data: events } = GetAuditEvents(
    period,
    sourceAccountID,
    selectedResourceType,
    selectedUser,
    pageNumber
  );
  const { data: eventInfo, status: eventInfoStatus } = GetAuditLogSummaryInfo(
    sourceAccountID,
    selectedEvent
  );
  const favoriteEvent = FavoriteAuditEvent();

  const filteredEvents = events
    ? events.data.filter((event: KeyStringVal) =>
        event.description
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(query.replace('"', "").toLowerCase().replace(/\s+/g, ""))
      )
    : [];
  const pageSize = 5;
  const totalCount = events?.pager.total_results || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  useEffect(() => {
    setPageNumber(1);
    setSelectedResourceType("");
    setSelectedUser("");
    setSelectedEvent("");
  }, [selectedReportAccount]);

  return (
    <section className="grid gap-16 p-6 w-full dark:bg-card black-shadow">
      <section className="grid md:grid-cols-3 gap-10">
        <article className="col-span-2 grid content-start gap-3 text-sm">
          <h4>Identities ({users?.length})</h4>
          {users ? (
            users.length > 0 ? (
              <ul className="grid max-h-[30rem] overflow-auto scrollbar">
                {users.map((user: string) => (
                  <li
                    key={user}
                    className={`grid gap-2 px-4 py-2 ${
                      selectedUser === user
                        ? ""
                        : "dark:hover:bg-filter duration-100"
                    } dark:bg-tooltip dark:even:bg-panel`}
                  >
                    <header
                      className="flex items-center justify-between gap-10 cursor-pointer"
                      onClick={() => {
                        if (selectedUser !== user) setSelectedUser(user);
                        else setSelectedUser("");
                      }}
                    >
                      <article className="flex items-center gap-2">
                        <span
                          className={`grid content-center w-5 h-5 capitalize text-center text-sm dark:text-white font-medium bg-gradient-to-b ${
                            userColors[user[0].toLowerCase()]
                          } shadow-sm dark:shadow-checkbox rounded-full`}
                        >
                          {user[0]}
                        </span>
                        <h4>{user}</h4>
                      </article>
                      <FontAwesomeIcon
                        icon={
                          selectedUser === user ? faChevronUp : faChevronDown
                        }
                        className="w-3 h-3"
                      />
                    </header>
                    {selectedUser === user && userInfoStatus === "success" ? (
                      userInfo?.length > 0 ? (
                        <ul className="grid gap-2 list-disc px-6">
                          {userInfo.map((role: any) => {
                            return (
                              <li
                                key={role.title}
                                className="grid gap-5 p-4 w-full dark:bg-expand overflow-auto scrollbar"
                              >
                                <article className="grid content-start gap-1">
                                  <h4>{role.title}</h4>
                                  <p className="text-xs">{role.name}</p>
                                  <p className="italic text-xs">
                                    {role.description}
                                  </p>
                                </article>
                                <article className="grid gap-1 w-full overflow-auto scrollbar">
                                  <h4>Permissions</h4>
                                  <ul className="grid gap-2 list-disc px-4 w-full max-h-[20rem] overflow-auto scrollbar">
                                    {role.permissions.map(
                                      (permission: string) => (
                                        <li key={permission}>{permission}</li>
                                      )
                                    )}
                                  </ul>
                                </article>
                              </li>
                            );
                          })}
                        </ul>
                      ) : userInfo.is_admin || userInfo.kind ? (
                        <article className="flex items-center gap-3 p-2 text-xs">
                          {userInfo.is_admin === true && (
                            <span className="px-2 py-1 w-max dark:bg-admin/30 border dark:border-admin rounded-md">
                              Admin
                            </span>
                          )}
                          {userInfo.kind && (
                            <p className="px-2 py-1 w-max selected-button rounded-md">
                              {userInfo.kind}
                            </p>
                          )}
                        </article>
                      ) : (
                        <p className="text-xs">No info available</p>
                      )
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No users available</p>
            )
          ) : null}
        </article>
        <article className="grid content-start gap-3 text-sm">
          <h4>Resources ({significantChanges?.length})</h4>
          {significantChanges ? (
            significantChanges.length > 0 ? (
              <ul className="grid md:grid-cols-3 items-center gap-10">
                {significantChanges.map((resource: KeyStringVal) => (
                  <li
                    key={resource.service_type}
                    className={`grid gap-2 px-4 py-2 cursor-pointer text-center ${
                      selectedResourceType === resource.service_type
                        ? "dark:bg-filter/30"
                        : "dark:hover:bg-filter/30 duration-100"
                    } rounded-md`}
                    onClick={() => {
                      if (selectedResourceType !== resource.service_type)
                        setSelectedResourceType(resource.service_type);
                      else setSelectedResourceType("");
                    }}
                  >
                    <span
                      className={`px-2 py-1 ${
                        severityColors[resource.level.toLowerCase()]
                      }`}
                    >
                      {resource.level}
                    </span>
                    <img
                      src={`/graph/nodes/${resource.integration_type.toLowerCase()}/${resource.service_type.toLowerCase()}.svg`}
                      alt={resource.service_type}
                      className="w-7 h-7 mx-auto"
                    />
                    <h4>{resource.service_type}</h4>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs">No resources available</p>
            )
          ) : null}
        </article>
      </section>
      {events && (
        <section className="flex flex-col flex-grow content-start max-h-[50rem] dark:bg-card">
          <h4>Audit Events</h4>
          <PaginatedListLayout
            totalCount={totalCount}
            totalPages={totalPages}
            beginning={beginning}
            end={end}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            query={query}
            setQuery={setQuery}
          >
            <ul className="grid overflow-auto scrollbar">
              {filteredEvents?.map((event: KeyStringVal, index: number) => {
                return (
                  <li
                    key={index}
                    className={`grid gap-5 p-2 px-4 cursor-pointer ${
                      selectedEvent === event.event_id
                        ? ""
                        : "dark:hover:bg-filter duration-100"
                    } dark:bg-tooltip dark:even:bg-panel`}
                  >
                    <header className="flex items-center justify-between gap-20">
                      <article className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            favoriteEvent.mutate({
                              eventID: event.event_id,
                            })
                          }
                        >
                          <FontAwesomeIcon
                            icon={faStar}
                            className={`${
                              event.is_favorite
                                ? "dark:text-qualifying"
                                : "dark:text-checkbox"
                            }`}
                          />
                        </button>
                        <p
                          className="break-all cursor-pointer"
                          onClick={() => {
                            if (selectedEvent !== event.event_id)
                              setSelectedEvent(event.event_id);
                            else setSelectedEvent("");
                          }}
                        >
                          {event.description}
                        </p>
                      </article>
                      <FontAwesomeIcon
                        icon={
                          selectedEvent === event.event_id
                            ? faChevronUp
                            : faChevronDown
                        }
                        className="w-3 h-3"
                      />
                    </header>
                    {selectedEvent === event.event_id &&
                    eventInfoStatus === "success" ? (
                      eventInfo ? (
                        <section className="grid gap-5 p-4 w-full">
                          {eventInfo.node_id && eventInfo.timestamp && (
                            <ViewInGraph
                              requestData={{
                                query_type: "view_in_graph",
                                id: eventInfo.node_id,
                              }}
                              curSnapshotTime={Number(eventInfo.timestamp)}
                            />
                          )}
                          <p>Description: {eventInfo.description || "N/A"}</p>
                          {eventInfo.parameters && (
                            <article className="grid gap-2">
                              <h4>Parameters</h4>
                              <ReactJson
                                src={eventInfo.parameters}
                                name={null}
                                quotesOnKeys={false}
                                displayDataTypes={false}
                                theme="harmonic"
                                collapsed={2}
                              />
                            </article>
                          )}
                          {eventInfo.request && (
                            <article className="grid gap-2">
                              <h4>Request</h4>
                              <ReactJson
                                src={eventInfo.request}
                                name={null}
                                quotesOnKeys={false}
                                displayDataTypes={false}
                                theme="harmonic"
                                collapsed={2}
                              />
                            </article>
                          )}
                          {eventInfo.responses && (
                            <article className="grid gap-2">
                              <h4>Responses</h4>
                              <ReactJson
                                src={eventInfo.responses}
                                name={null}
                                quotesOnKeys={false}
                                displayDataTypes={false}
                                theme="harmonic"
                                collapsed={2}
                              />
                            </article>
                          )}
                        </section>
                      ) : (
                        <p className="p-4">No info available</p>
                      )
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </PaginatedListLayout>
        </section>
      )}
    </section>
  );
};

export default AuditEvents;
