/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import {
  diffColors,
  nodeTimelineColors,
  timelineTabs,
} from "../../../constants/graph";
import TableLayout from "../../../layouts/TableLayout";
import DiffAttribute from "../../Attribute/DiffAttribute";
import { convertToDate, sortNumericData } from "src/utils/general";
import { useGeneralStore } from "src/stores/general";
import { KeyStringVal } from "src/types/general";
import TablePagination from "../../General/TablePagination";
import { pageSize } from "src/constants/general";
import { useGraphStore } from "src/stores/graph";
import {
  GetNodeInfoInTimeline,
  GetNodeTimeline,
} from "src/services/graph/timeline";

const Timeline = ({
  elementID,
  nodeType,
  uniqueID,
  showLimited,
}: {
  elementID: string;
  nodeType: string;
  uniqueID: string;
  showLimited?: boolean;
}) => {
  const { env } = useGeneralStore();
  const { selectedNode, selectedEdge } = useGraphStore();

  const [selectedChangeType, setSelectedChangeType] = useState<KeyStringVal>({
    short: "diff",
    name: "Config & State Change",
  });
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [selectedTimestamp, setSelectedTimestamp] = useState<number>(0);
  const [selectedEventID, setSelectedEventID] = useState<string>("");

  const integrationType =
    (selectedNode || selectedEdge)?.data?.integrationType || "";

  const { data: nodeTimeline } = GetNodeTimeline(
    env,
    nodeType,
    elementID,
    uniqueID,
    selectedChangeType.short,
    pageNumber
  );
  const { data: nodeInfo } = GetNodeInfoInTimeline(
    env,
    nodeType,
    elementID,
    uniqueID,
    selectedChangeType.short,
    selectedEventID,
    integrationType === "AWS" ? "cloudtrail" : "gcpauditlog",
    selectedTimestamp
  );

  const filteredTimeline = sortNumericData(
    nodeTimeline?.items
      ?.filter((action: any) => action.change_type === selectedChangeType.name)
      ?.slice(0, showLimited ? 3 : nodeTimeline?.items.length),
    "timestamp",
    "desc"
  );
  const totalCount =
    (showLimited && filteredTimeline?.length) ||
    nodeTimeline?.pager.total_results ||
    0;
  const totalPages = nodeTimeline?.pager.num_pages || 0;
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = showLimited
    ? filteredTimeline?.length
    : pageNumber === totalPages
    ? totalCount
    : beginning + pageSize - 1;

  return (
    <section className="grid gap-5 mt-3 overflow-auto scrollbar">
      <nav className="flex items-center justify-between gap-5 text-sm">
        {timelineTabs.map((type: KeyStringVal) => {
          return (
            <button
              key={type.short}
              className={`p-2 w-full ${
                selectedChangeType.short === type.short
                  ? "full-underlined-label"
                  : "hover:border-b dark:hover:border-signin"
              }`}
              onClick={() => {
                setSelectedChangeType(type);
                setPageNumber(1);
                setSelectedTimestamp(0);
                setSelectedIndex(-1);
              }}
            >
              {type.name}
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
      {filteredTimeline ? (
        filteredTimeline.length > 0 ? (
          <ul className="flex flex-col flex-grow content-start gap-5 text-xs overflow-auto scrollbar">
            {filteredTimeline.map((action: any, index: number) => {
              const actionTime = convertToDate(action.timestamp);
              return (
                <li key={index} className="flex items-start gap-10 px-4">
                  <article className="grid w-8">
                    <h4>
                      {actionTime.getUTCMonth() + 1}/{actionTime.getUTCDate()}
                    </h4>
                    <p className="text-[0.65rem]">
                      {actionTime.getUTCHours()}:
                      {String(actionTime.getUTCMinutes()).padStart(2, "0")}
                    </p>
                  </article>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10"
                  >
                    <path
                      d="M16.0829 31.3981C24.6596 31.3981 31.6124 24.4454 31.6124 15.8688C31.6124 7.29211 24.6596 0.339355 16.0829 0.339355C7.50626 0.339355 0.553513 7.29211 0.553513 15.8688C0.553513 24.4454 7.50626 31.3981 16.0829 31.3981Z"
                      fill={diffColors[action.action.toLowerCase()]}
                    />
                  </svg>
                  <article className="grid w-full">
                    <h4
                      className={`uppercase font-medium ${
                        nodeTimelineColors[action.action.toLowerCase()]
                      }`}
                    >
                      {action.action}
                    </h4>
                    <button
                      className="flex items-center gap-2 mb-1 dark:text-checkbox"
                      onClick={() => {
                        if (selectedIndex !== index) setSelectedIndex(index);
                        else setSelectedIndex(-1);
                        switch (action.change_type) {
                          case "Audit":
                            if (selectedEventID === action.event_id)
                              setSelectedEventID("");
                            else setSelectedEventID(action.event_id);
                            break;
                          default:
                            if (selectedTimestamp === action.timestamp)
                              setSelectedTimestamp(0);
                            else setSelectedTimestamp(action.timestamp);
                        }
                      }}
                    >
                      {selectedIndex === index ? (
                        <FontAwesomeIcon icon={faChevronCircleDown} />
                      ) : (
                        <FontAwesomeIcon icon={faChevronCircleRight} />
                      )}
                      <p>
                        {selectedIndex === index ? "Hide" : "Show"} attributes
                      </p>
                    </button>
                    {selectedIndex === index && nodeInfo ? (
                      nodeInfo[
                        ["created", "modified", "update"].includes(
                          nodeInfo.action.toLowerCase()
                        )
                          ? "new_state"
                          : "old_state"
                      ].length > 0 ? (
                        <TableLayout fullHeight>
                          <thead>
                            <tr className="text-sm dark:text-checkbox">
                              <th className="px-4 py-3 font-medium">
                                Attribute
                              </th>
                              <th className="px-4 py-3 break-words font-medium">
                                Detail
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {nodeInfo[
                              ["created", "modified", "update"].includes(
                                nodeInfo.action.toLowerCase()
                              )
                                ? "new_state"
                                : "old_state"
                            ]?.map((attribute: any) => {
                              const oldAttribute =
                                ["removed", "modified", "delete"].includes(
                                  nodeInfo.action.toLowerCase()
                                ) &&
                                nodeInfo.old_state.find(
                                  (d: KeyStringVal) =>
                                    d.property_name ===
                                      attribute.property_name &&
                                    d.data_type === attribute.data_type
                                );
                              const newAttribute =
                                ["created", "modified", "update"].includes(
                                  nodeInfo.action.toLowerCase()
                                ) &&
                                nodeInfo.new_state.find(
                                  (d: KeyStringVal) =>
                                    d.property_name ===
                                      attribute.property_name &&
                                    d.data_type === attribute.data_type
                                );

                              if (
                                oldAttribute === null ||
                                newAttribute === null
                              )
                                return null;

                              return (
                                <DiffAttribute
                                  key={`${action}-${
                                    newAttribute?.display_name ||
                                    oldAttribute?.display_name
                                  }-${
                                    newAttribute?.data_type ||
                                    oldAttribute?.data_type
                                  }`}
                                  action={nodeInfo.action}
                                  oldAttribute={oldAttribute}
                                  newAttribute={newAttribute}
                                />
                              );
                            })}
                          </tbody>
                        </TableLayout>
                      ) : (
                        <p>No attributes available</p>
                      )
                    ) : null}
                  </article>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm">No data available</p>
        )
      ) : null}
    </section>
  );
};

export default Timeline;
