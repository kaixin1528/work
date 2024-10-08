/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { useEffect, useState } from "react";
import {
  diffBorderColors,
  initialDiffFilter,
} from "../../../../constants/graph";
import TableLayout from "../../../../layouts/TableLayout";
import DiffAttribute from "src/components/Attribute/DiffAttribute";
import { convertToUTCString } from "src/utils/general";
import { GetComputeServicesDetails } from "src/services/summaries/compute-services";
import { useSummaryStore } from "src/stores/summaries";
import { useGeneralStore } from "src/stores/general";
import TablePagination from "src/components/General/TablePagination";
import { faDiagramProject } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGraphStore } from "src/stores/graph";
import { useNavigate } from "react-router-dom";
import { pageSize } from "src/constants/general";
import { KeyStringVal } from "src/types/general";

const ResourceChangeDetails = () => {
  const navigate = useNavigate();

  const { spotlightSearchString } = useGeneralStore();
  const {
    selectedCSNodeType,
    selectedCSNodeID,
    setSelectedCSNodeID,
    selectedCSAction,
  } = useSummaryStore();
  const {
    setElementType,
    setSelectedNode,
    setNavigationView,
    setDiffIntegrationType,
    setDiffView,
    setDiffStartTime,
    setDiffFilter,
    graphInfo,
    setGraphInfo,
  } = useGraphStore();

  const [query, setQuery] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);

  const { data: resourceChangeDetails } = GetComputeServicesDetails(
    selectedCSNodeType,
    pageNumber
  );

  const filteredNodes = resourceChangeDetails?.data.filter(
    (resource: KeyStringVal) =>
      resource.node_id
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(query.toLowerCase().replace(/\s+/g, ""))
  );
  const totalCount = resourceChangeDetails?.pager.total_results || 0;
  const totalPages = resourceChangeDetails?.pager.num_pages || 0;
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;
  const diffNodeInfo = resourceChangeDetails?.data.find(
    (resource: KeyStringVal) => resource.node_id === selectedCSNodeID
  );

  useEffect(() => {
    if (resourceChangeDetails?.data.length > 0)
      if (selectedCSNodeID === "")
        setSelectedCSNodeID(resourceChangeDetails.data[0].node_id);
      else if (spotlightSearchString !== "")
        document.getElementById(`${selectedCSNodeID}`)?.scrollIntoView();
  }, [resourceChangeDetails, selectedCSAction, selectedCSNodeType]);

  useEffect(() => {
    setPageNumber(1);
  }, [selectedCSNodeType, selectedCSNodeID]);

  return (
    <section className="grid grid-cols-5 gap-5 overflow-auto">
      <section className="col-span-1 grid content-start gap-3 text-xs overflow-auto">
        <article className="flex items-center px-4 dark:bg-account border-l dark:border-signin">
          <img src="/general/search.svg" alt="search" className="w-5 h-5" />
          <input
            type="input"
            placeholder="Search Resources"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="p-4 placeholder:text-checkbox w-full dark:bg-account focus:outline-none rounded-sm"
          />
        </article>
        <section className="grid gap-5">
          <TablePagination
            totalPages={totalPages}
            beginning={beginning}
            end={end}
            totalCount={totalCount}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          />
          <ul className="col-span-1 grid list-decimal max-h-[100rem] dark:bg-card black-shadow rounded-sm overflow-auto scrollbar">
            {filteredNodes?.map((resource: KeyStringVal) => {
              return (
                <li
                  id={resource.node_id}
                  key={resource.node_id}
                  className={`grid gap-2 p-4 cursor-pointer ${
                    selectedCSNodeID === resource.node_id
                      ? "dark:bg-signin/30"
                      : "dark:hover:bg-signin/10 duration-100"
                  }  border-b-1 dark:border-checkbox`}
                  onClick={() => setSelectedCSNodeID(resource.node_id)}
                >
                  <header className="flex items-center gap-2">
                    <img
                      src={`/graph/nodes/${resource.integration_type.toLowerCase()}/${resource.node_class.toLowerCase()}.svg`}
                      alt={resource.node_class}
                      className="w-8 h-8"
                    />
                    <p className="break-all">{resource.node_id}</p>
                  </header>
                </li>
              );
            })}
          </ul>
        </section>
      </section>
      {resourceChangeDetails ? (
        diffNodeInfo ? (
          <section className="col-span-4 grid content-start gap-5 p-4 dark:bg-card overflow-auto scrollbar">
            <header className="flex items-center gap-2">
              <img
                src={`/graph/nodes/${diffNodeInfo.integration_type.toLowerCase()}/${diffNodeInfo.node_class.toLowerCase()}.svg`}
                alt={diffNodeInfo.node_class}
                className="w-8 h-8"
              />
              <p className="text-sm break-all">{diffNodeInfo.node_id}</p>
            </header>

            {diffNodeInfo.diffs.length > 0 ? (
              <ul className="grid gap-10">
                {diffNodeInfo.diffs.map((diff: any, index: number) => {
                  return (
                    <li
                      key={index}
                      className="flex flex-col flex-grow content-start gap-3 w-full h-max text-sm"
                    >
                      <header className="flex items-center gap-5">
                        <p className="text-xs">
                          {convertToUTCString(diff.old_record_time)} -{" "}
                          {convertToUTCString(diff.new_record_time)}
                        </p>
                        <button
                          className="flex items-center gap-2"
                          onClick={() => {
                            setNavigationView("evolution");
                            setDiffIntegrationType(diff.integration_type || "");
                            setDiffView("snapshot");
                            setDiffStartTime({
                              hour: diff.new_record_time,
                              snapshot: diff.new_record_time,
                            });
                            setDiffFilter(initialDiffFilter);
                            setSelectedNode({
                              id: diff.node_id,
                              data: {
                                id: diff.node_id,
                                integrationType: diff.integration_type,
                                nodeType: diff.node_class,
                                uniqueID: diff.unique_id,
                                diffNode: diff,
                              },
                            });
                            setElementType("node");
                            setGraphInfo({ ...graphInfo, showPanel: true });
                            navigate("/graph/summary");
                          }}
                        >
                          <FontAwesomeIcon icon={faDiagramProject} />
                          <p className="text-xs">View in graph</p>
                        </button>
                      </header>
                      <TableLayout fullHeight>
                        <thead>
                          <tr className="text-sm text-left dark:text-checkbox dark:bg-panel">
                            <th className="px-4 py-3 font-medium">Attribute</th>
                            <th className="px-4 py-3 break-words font-medium">
                              Detail
                            </th>
                          </tr>
                        </thead>
                        <tbody
                          className={`pt-0 p-2 text-sm dark:bg-card ${
                            diffBorderColors[diff.action]
                          } ml-1`}
                        >
                          {Object.keys(
                            diff[
                              diff.action === "removed"
                                ? "old_state"
                                : "new_state"
                            ]
                          ).map((attribute: string, index: number) => {
                            const oldAttribute = diff.old_state[attribute];
                            const newAttribute = diff.new_state[attribute];

                            if (oldAttribute === null || newAttribute === null)
                              return null;
                            return (
                              <DiffAttribute
                                key={index}
                                action={diff.action}
                                oldAttribute={oldAttribute}
                                newAttribute={newAttribute}
                              />
                            );
                          })}
                        </tbody>
                      </TableLayout>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>No data available</p>
            )}
          </section>
        ) : (
          <p>No data available</p>
        )
      ) : null}
    </section>
  );
};

export default ResourceChangeDetails;
