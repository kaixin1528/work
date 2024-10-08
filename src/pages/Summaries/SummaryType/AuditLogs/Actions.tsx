import {
  faChevronDown,
  faChevronUp,
  faMinusCircle,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import PaginatedListLayout from "src/layouts/PaginatedListLayout";
import {
  GetAuditLogActions,
  GetAuditLogEventInfo,
} from "src/services/summaries/audit-logs";
import { useSummaryStore } from "src/stores/summaries";
import { KeyStringVal } from "src/types/general";

const Actions = ({
  widgetType,
  expandAction,
  setExpandAction,
}: {
  widgetType: string;
  expandAction: string;
  setExpandAction: (expandAction: string) => void;
}) => {
  const { period, selectedReportAccount } = useSummaryStore();

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [query, setQuery] = useState<string>("");

  const sourceAccountID = selectedReportAccount?.customer_cloud_id || "";

  const { data: actions } = GetAuditLogActions(
    period,
    widgetType,
    sourceAccountID,
    pageNumber
  );
  const { data: eventInfo, status: eventInfoStatus } = GetAuditLogEventInfo(
    sourceAccountID,
    selectedEvent
  );

  const filteredActions = actions
    ? actions.data.filter((event: KeyStringVal) =>
        event.event_name
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(query.replace('"', "").toLowerCase().replace(/\s+/g, ""))
      )
    : [];
  const pageSize = 5;
  const totalCount = actions?.pager.total_results || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  useEffect(() => {
    setPageNumber(1);
  }, [selectedReportAccount]);

  return (
    <section
      className={`${
        expandAction !== ""
          ? expandAction === widgetType
            ? "col-span-8"
            : "col-span-2 h-max"
          : "col-span-1"
      } flex flex-col flex-grow content-start p-6 w-full dark:bg-card black-shadow`}
    >
      <header className="flex items-center justify-between gap-10">
        <h4 className="capitalize">
          {widgetType}{" "}
          <span
            className={`${
              !["", widgetType].includes(expandAction) ? "hidden" : ""
            }`}
          >
            common actions
          </span>
        </h4>
        <article className="flex items-center gap-2">
          <button onClick={() => setExpandAction("")}>
            <FontAwesomeIcon
              icon={faMinusCircle}
              className="w-4 h-4 text-reset"
            />
          </button>
          <button onClick={() => setExpandAction(widgetType)}>
            <FontAwesomeIcon icon={faPlusCircle} className="w-4 h-4 text-no" />
          </button>
        </article>
      </header>
      {["", widgetType].includes(expandAction) && (
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
          <ul className="grid">
            {filteredActions?.map((event: KeyStringVal, index: number) => {
              return (
                <li
                  key={index}
                  className={`grid p-2 px-4 ${
                    selectedEvent === event.event_name
                      ? ""
                      : "dark:hover:bg-filter/30 duration-100"
                  } dark:bg-tooltip dark:even:bg-panel`}
                >
                  <header
                    className="flex items-center justify-between gap-2 cursor-pointer"
                    onClick={() => {
                      if (selectedEvent !== event.event_name)
                        setSelectedEvent(event.event_name);
                      else setSelectedEvent("");
                    }}
                  >
                    <article className="flex flex-wrap items-center gap-2 cursor-pointer">
                      <img
                        src={`/graph/nodes/${String(
                          event.integration_type
                        ).toLowerCase()}/${String(
                          event.resource_type
                        ).toLowerCase()}.svg`}
                        alt={String(event.resource_type)}
                        className="w-7 h-7"
                      />
                      <p className="break-all">{event.event_name}</p>
                      <span className="px-3 py-1 bg-reset/30 border-1 border-reset rounded-full">
                        {event.count}
                      </span>
                    </article>
                    <FontAwesomeIcon
                      icon={
                        selectedEvent === event.event_name
                          ? faChevronUp
                          : faChevronDown
                      }
                      className="w-3 h-3"
                    />
                  </header>
                  {selectedEvent === event.event_name &&
                  eventInfoStatus === "success" ? (
                    eventInfo && Object.keys(eventInfo).length > 0 ? (
                      <section className="grid gap-5 p-4 w-full dark:bg-gradient-to-b from-expand to-expand/60">
                        <p className="italic">
                          Description: {eventInfo.description}
                        </p>
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
      )}
    </section>
  );
};

export default Actions;
