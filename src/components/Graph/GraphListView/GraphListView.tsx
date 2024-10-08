/* eslint-disable react-hooks/exhaustive-deps */
import {
  faEye,
  faHandPointDown,
  faLandMineOn,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import React, { Fragment, useEffect, useState } from "react";
import { pageSize } from "src/constants/general";
import {
  annotationBGColors,
  annotationTextColors,
  diffTextColors,
  searchedNodesColors,
} from "src/constants/graph";
import PaginatedListLayout from "src/layouts/PaginatedListLayout";
import { useGeneralStore } from "src/stores/general";
import { useGraphStore } from "src/stores/graph";
import { GraphInfo, GraphNode } from "src/types/general";
import ContextMenu from "src/components/Graph/NodeType/ContextMenu";
import { GetConnectedNodes } from "src/services/graph/list-view";
import Subgraph from "./Subgraph";
import { ReactFlowProvider } from "reactflow";
import ModalLayout from "src/layouts/ModalLayout";

const GraphListView = ({
  nodes,
  curSnapshotTime,
  graphInfo,
  setGraphInfo,
  pageNumber,
  setPageNumber,
  curSearchSnapshot,
  diffSnapshot,
  selectedResourceCategory,
  setSelectedResourceCategory,
}: {
  nodes: any;
  curSnapshotTime: number;
  graphInfo: GraphInfo;
  setGraphInfo: (graphInfo: GraphInfo) => void;
  pageNumber: number;
  setPageNumber: (pageNumber: number) => void;
  curSearchSnapshot?: any;
  diffSnapshot?: any;
  selectedResourceCategory: string;
  setSelectedResourceCategory: (selectedResourceCategory: string) => void;
}) => {
  const { env } = useGeneralStore();
  const {
    setSelectedNode,
    setSelectedEdge,
    setElementType,
    setSelectedPanelTab,
  } = useGraphStore();

  const getConnectedNodes = GetConnectedNodes(env);

  const [showContextMenu, setShowContextMenu] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [viewResourceIDs, setViewResourceIDs] = useState<string[]>([]);
  const [showConnectedNodes, setShowConnectedNodes] = useState<string>("");

  const filteredNodes =
    query === ""
      ? nodes
      : nodes?.filter((node: GraphNode) =>
          node.id
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  const totalCount =
    diffSnapshot?.pager?.total_results ||
    (curSearchSnapshot &&
      curSearchSnapshot[`${selectedResourceCategory}_pager`]?.total_results) ||
    nodes?.length ||
    0;
  const totalPages =
    diffSnapshot?.pager?.num_pages ||
    (curSearchSnapshot &&
      curSearchSnapshot[`${selectedResourceCategory}_pager`]?.num_pages) ||
    Math.ceil(totalCount / pageSize);
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  const handleOnClose = () => setShowConnectedNodes("");

  useEffect(() => {
    setViewResourceIDs([]);
  }, [pageNumber]);

  useEffect(() => {
    const handleClickOutside = () => setShowContextMenu("");
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 0.5 },
      }}
      className="flex flex-grow flex-col content-start gap-3 m-5 p-4 text-sm dark:bg-panel overflow-auto scrollbar"
    >
      {curSearchSnapshot?.graph === false && (
        <p className="flex items-center gap-2 py-2 px-4 mx-auto text-center text-xs bg-reset/60 rounded-md">
          Table view is rendered instead due to the searched resources being
          greater than the limit. Try increase the limit to render graph and
          metadata view.
        </p>
      )}
      {curSearchSnapshot?.source_nodes.length > 0 && (
        <nav className="flex items-center justify-between full-underlined-label">
          {["source_nodes", "qualifying_nodes"].map((category) => {
            return (
              <button
                key={category}
                className={`p-2 w-full capitalize dark:disabled:bg-filter/20 dark:disabled:text-filter ${
                  selectedResourceCategory === category
                    ? "dark:bg-signin/30"
                    : "dark:hover:bg-signin/60 duration-100"
                }`}
                onClick={() => setSelectedResourceCategory(category)}
              >
                {category.includes("qualifying")
                  ? "Connected Elements"
                  : "Assets, Services, and Resources"}
              </button>
            );
          })}
        </nav>
      )}

      <PaginatedListLayout
        placeholderText="Search resource ID"
        totalCount={totalCount}
        totalPages={totalPages}
        beginning={beginning}
        end={end}
        query={query}
        setQuery={setQuery}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        hideSearch={curSearchSnapshot}
      >
        <section className="grid content-start gap-3 w-full h-full text-sm overflow-auto scrollbar">
          <p className="flex flex-wrap items-center gap-2">
            <FontAwesomeIcon icon={faHandPointDown} className="text-signin" />{" "}
            You can select resources below to view subgraph
          </p>
          <article className="flex items-center gap-5 divide-x dark:divide-checkbox">
            <button
              className="dark:hover:text-checkbox/60 duration-100"
              onClick={() => {
                setViewResourceIDs(
                  filteredNodes
                    ?.slice(
                      curSearchSnapshot ? 0 : beginning - 1,
                      curSearchSnapshot ? totalCount : end + 1
                    )
                    .reduce((pV: string[], cV: GraphNode) => [...pV, cV.id], [])
                );
              }}
            >
              Select All
            </button>
            <button
              className="pl-5 dark:hover:text-checkbox/60 duration-100"
              onClick={() => setViewResourceIDs([])}
            >
              Deselect All
            </button>
          </article>
          {viewResourceIDs.length > 0 && (
            <ReactFlowProvider>
              <Subgraph viewResourceIDs={viewResourceIDs} />
            </ReactFlowProvider>
          )}

          <ul className="flex flex-grow flex-col content-start gap-1 w-full h-full overflow-auto scrollbar">
            {filteredNodes
              ?.slice(0, curSearchSnapshot ? totalCount : pageSize)
              .map((node: GraphNode, index: number) => {
                const annotation =
                  node.data?.simulationAnnotation?.annotation ||
                  node.data?.graphAnnotation?.annotation ||
                  "";
                const connected = selectedResourceCategory.includes(
                  "qualifying"
                )
                  ? "Assets, Services, and Resources"
                  : "Connected Elements";

                return (
                  <li
                    key={index}
                    className="relative grid content-start gap-2 p-2 w-full h-full border-b-1 border-checkbox/30"
                    onContextMenu={(e) => {
                      e.preventDefault();
                      if (showContextMenu !== "") setShowContextMenu("");
                      else setShowContextMenu(node.id);
                    }}
                  >
                    <header className="flex flex-grow flex-col content-start gap-2 w-full">
                      <article className="flex items-center gap-2 max-w-1/2 h-full">
                        <input
                          type="checkbox"
                          checked={viewResourceIDs.includes(node.id)}
                          className="form-checkbox w-4 h-4 border-0 dark:focus:ring-0 dark:text-checkbox dark:focus:border-checkbox focus:ring dark:focus:ring-offset-0 dark:focus:ring-checkbox focus:ring-opacity-50"
                          onChange={() => {
                            if (viewResourceIDs.includes(node.id)) {
                              setViewResourceIDs(
                                viewResourceIDs.filter(
                                  (value: string) => value !== node.id
                                )
                              );
                            } else
                              setViewResourceIDs([...viewResourceIDs, node.id]);
                          }}
                        />
                        <img
                          src={`/graph/nodes/${node.integrationType?.toLowerCase()}/${node.nodeType?.toLowerCase()}.svg`}
                          alt={node.nodeType}
                          className="w-7 h-7"
                        />
                        <p
                          className={`break-all cursor-pointer ${
                            annotationTextColors[annotation.toLowerCase()] ||
                            diffTextColors[node.data?.diffNode?.action] ||
                            searchedNodesColors[node.data?.isSearched || ""] ||
                            "dark:hover:text-signin/70 duration-100"
                          }`}
                          onClick={() => {
                            setElementType("node");
                            setSelectedPanelTab("Info");
                            setSelectedNode({
                              id: node["id"],
                              data: node["data"],
                            });
                            setSelectedEdge(undefined);
                            setGraphInfo({
                              ...graphInfo,
                              showPanel: true,
                            });
                          }}
                        >
                          {node.id}
                        </p>
                      </article>
                      {showContextMenu === node.id && <ContextMenu />}
                      {curSearchSnapshot?.source_nodes.length > 0 && (
                        <>
                          <button className="dark:text-checkbox inline-flex items-center gap-1 px-6 text-xs focus:outline-none">
                            <FontAwesomeIcon
                              icon={faEye}
                              className="w-3 h-3 z-0"
                            />
                            <p
                              onClick={() => {
                                setShowConnectedNodes(node.id);
                                getConnectedNodes.mutate({
                                  nodeID: node.id,
                                  timestamp: curSnapshotTime,
                                  targetNodeTypes:
                                    curSearchSnapshot[
                                      `${
                                        selectedResourceCategory.includes(
                                          "source"
                                        )
                                          ? "target"
                                          : "source"
                                      }_node_classes`
                                    ],
                                });
                              }}
                            >
                              {connected}
                            </p>
                          </button>
                          <ModalLayout
                            showModal={showConnectedNodes === node.id}
                            onClose={handleOnClose}
                          >
                            <section className="grid gap-5">
                              <h4 className="text-base full-underlined-label">
                                {connected}
                              </h4>
                              {getConnectedNodes?.data ? (
                                getConnectedNodes?.data.length > 0 ? (
                                  <ul className="grid content-start gap-1 list-disc px-8 h-[25rem] overflow-auto scrollbar">
                                    {getConnectedNodes?.data?.map(
                                      (nodeID: string) => {
                                        return (
                                          <li
                                            key={nodeID}
                                            className="cursor-pointer hover:underline"
                                            onClick={() => {
                                              setShowConnectedNodes("");
                                              setElementType("node");
                                              setSelectedNode({ id: nodeID });
                                              setSelectedEdge(undefined);
                                              setGraphInfo({
                                                ...graphInfo,
                                                showPanel: true,
                                              });
                                              setSelectedPanelTab("Info");
                                            }}
                                          >
                                            {nodeID}
                                          </li>
                                        );
                                      }
                                    )}
                                  </ul>
                                ) : (
                                  <p>No resources available</p>
                                )
                              ) : null}
                            </section>
                          </ModalLayout>
                        </>
                      )}
                    </header>

                    {node.data?.graphAnnotation?.message && (
                      <article
                        className={`flex items-center gap-2 px-2 py-1 w-max uppercase break-all ${
                          annotationBGColors[annotation.toLowerCase()]
                        } border border-black`}
                      >
                        <FontAwesomeIcon
                          icon={faLandMineOn}
                          className="w-3 h-3"
                        />
                        {node.data?.graphAnnotation?.message}
                      </article>
                    )}
                  </li>
                );
              })}
          </ul>
        </section>
      </PaginatedListLayout>
    </motion.section>
  );
};

export default GraphListView;
