/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect, useRef, RefObject, useLayoutEffect } from "react";
import ReactFlow, {
  useReactFlow,
  useNodesState,
  useEdgesState,
  useStoreApi,
} from "reactflow";
import { motion, AnimatePresence } from "framer-motion";
import { nodeTypes, edgeTypes, showVariants } from "../../constants/general";
import GraphControls from "../../components/Graph/GraphControls";
import Loader from "../../components/Loader/Loader";
import TemporalDatepicker from "../../components/Datepicker/TemporalDatepicker";
import {
  renderMainGraph,
  handleMainSearchResults,
  onInit,
  highlightPath,
  resetNodeStyles,
  handleGetSnapshotTime,
  handleViewContextMenu,
  onNodeContextMenu,
} from "../../utils/graph";
import Evolution from "./Evolution/Evolution";
import SnapshotTimeline from "../../components/Graph/SnapshotTimeline";
import ViewTabs from "./ViewTabs";
import TemporalTimeline from "../../components/Graph/TemporalTimeline";
import Lottie from "react-lottie-player";
import temporalEmpty from "../../lottie/temporal-empty-result.json";
import { useGraphStore } from "../../stores/graph";
import AddToInvestigation from "../../components/General/AddToInvestigation";
import { GraphNav } from "../../types/graph";
import {
  convertToMicrosec,
  convertToUTCString,
  getCustomerCloud,
} from "../../utils/general";
import DepthFilter from "../../components/Filter/Graph/DepthFilter";
import GraphLayout from "../../layouts/GraphLayout";
import GraphSearchSummary from "../../components/Graph/GraphSearchSummary";
import {
  defaultDepth,
  initialContextMenu,
  nodeThreshold,
  orgCloud,
} from "../../constants/graph";
import GraphListView from "../../components/Graph/GraphListView/GraphListView";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLandMineOn } from "@fortawesome/free-solid-svg-icons";
import GraphNavigation from "./GraphNavigation";
import React from "react";
import Autocomplete from "src/components/Graph/Autocomplete/Autocomplete";
import GraphScreenshot from "../../components/Graph/GraphScreenshot";
import DetailPanel from "src/components/Graph/DetailPanel/DetailPanel";
import Reset from "./Reset";
import NoResults from "src/components/General/NoResults";
import { useGeneralStore } from "src/stores/general";
import ContextMenu from "src/components/Graph/NodeType/ContextMenu";
import { GetDiffSummary, GetDiffSnapshot } from "src/services/graph/evolution";
import { GetMainGraph } from "src/services/graph/graph";
import { GetNodesInfo } from "src/services/graph/list-view";
import {
  SearchDays,
  GetMainSearchResults,
  SaveMainSearchQuery,
  GetGraphAnnotations,
} from "src/services/graph/search";
import {
  GetSnapshotsAvailable,
  GetSnapshotTimestamps,
} from "src/services/graph/snapshots";
import { GetPrunedGraph } from "src/services/graph/temporal";
import DiffOverview from "./Evolution/DiffOverview";
import DiffLegend from "./Evolution/DiffLegend";
import FormatTabs from "./Cypher/FormatTabs";
import GraphMetadata from "../../components/Graph/GraphMetadata";

export const KnowledgeGraph: React.FC = () => {
  const customerCloud = getCustomerCloud();

  const { env } = useGeneralStore();
  const {
    setElementType,
    setSelectedEdge,
    setSelectedNode,
    graphInfo,
    setGraphInfo,
    showGraphAnnotations,
    setShowGraphAnnotations,
    graphNav,
    setGraphNav,
    graphSearchString,
    setGraphSearchString,
    diffView,
    diffStartTime,
    graphSearch,
    graphSearching,
    navigationView,
    snapshotTime,
    setSnapshotTime,
    snapshotIndex,
    setSnapshotIndex,
    diffIntegrationType,
    setSelectedPanelTab,
    curSearchSnapshot,
    setCurSearchSnapshot,
    selectedNode,
    temporalStartDate,
    temporalEndDate,
    temporalSearchTimestamps,
    selectedTemporalDay,
    selectedTemporalTimestamp,
    setTemporalStartDate,
    setTemporalEndDate,
    setSelectedTemporalDay,
    setTemporalSearchTimestamps,
    setSelectedTemporalTimestamp,
    selectedContextMenu,
    setSelectedContextMenu,
    setGraphSearch,
    setGraphSearching,
    diffFilter,
  } = useGraphStore();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [minZoom, setMinZoom] = useState<number>(0);
  const [collapseSummary, setCollapseSummary] = useState<boolean>(false);
  const [selectedResourceCategory, setSelectedResourceCategory] =
    useState("qualifying_nodes");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedReturnType, setSelectedReturnType] = useState<string>("");
  const ref = useRef(null);
  const temporalRef = useRef() as RefObject<HTMLLIElement>;
  const store = useStoreApi();
  const reactFlowInstance = useReactFlow();

  const { data: snapshotAvailable } = GetSnapshotsAvailable(env, "all", "main");
  const { data: snapshotTimestamps, status: snapshotTimestampsStatus } =
    GetSnapshotTimestamps(
      env,
      "all",
      snapshotAvailable ? snapshotAvailable.earliest_snapshot !== -1 : false,
      convertToMicrosec(snapshotTime),
      navigationView,
      "main"
    );

  const sortedSnapshotTimes = snapshotTimestamps?.timestamps.sort();
  const availableSnapshotIndexes = sortedSnapshotTimes
    ? sortedSnapshotTimes.reduce((pV: number[], cV: number) => {
        if (snapshotTimestamps.missing.includes(cV)) return [...pV];
        else return [...pV, sortedSnapshotTimes.indexOf(cV)];
      }, [])
    : [];
  const curSnapshotTime =
    navigationView === "snapshots" && snapshotTimestamps && snapshotIndex !== -1
      ? snapshotTimestamps.timestamps[snapshotIndex]
      : navigationView === "evolution" && diffView === "snapshot"
      ? diffStartTime.snapshot || 0
      : navigationView === "temporal" && selectedTemporalTimestamp !== -1
      ? selectedTemporalTimestamp
      : 0;
  const regularTemporal =
    navigationView === "temporal" &&
    selectedTemporalTimestamp === -1 &&
    (Array.isArray(curSearchSnapshot?.qualifying_nodes) ||
      !graphSearchString.includes("radius"));

  const startTime = regularTemporal
    ? convertToMicrosec(temporalStartDate)
    : curSnapshotTime;
  const endTime = regularTemporal
    ? convertToMicrosec(temporalEndDate)
    : curSnapshotTime;

  const { data: searchDays } = SearchDays(
    env,
    graphSearchString,
    graphSearch,
    convertToMicrosec(temporalStartDate),
    convertToMicrosec(temporalEndDate),
    navigationView
  );
  const { data: searchResults, status: searchResultsStatus } =
    GetMainSearchResults(
      env,
      graphSearchString,
      graphSearch,
      graphSearching,
      startTime,
      endTime,
      navigationView,
      snapshotIndex,
      pageNumber,
      selectedResourceCategory,
      selectedReturnType
    );
  SaveMainSearchQuery(
    env,
    graphSearch,
    graphSearching,
    graphSearchString,
    startTime,
    endTime
  );

  const searchedNodes = Array.isArray(curSearchSnapshot?.qualifying_nodes)
    ? [...curSearchSnapshot.source_nodes, ...curSearchSnapshot.qualifying_nodes]
    : [];

  const { data: annotations } = GetGraphAnnotations(
    env,
    graphSearch,
    curSearchSnapshot,
    curSnapshotTime
  );
  const { data: diffSummary } = GetDiffSummary(
    env,
    diffView,
    diffStartTime,
    navigationView,
    diffIntegrationType
  );
  const { data: diffSnapshot, status: diffSnapshotStatus } = GetDiffSnapshot(
    env,
    diffIntegrationType,
    selectedNode?.data?.uniqueID || "",
    navigationView,
    diffView,
    diffStartTime,
    pageNumber,
    diffFilter
  );
  const { data: mainGraph, status: mainGraphStatus } = GetMainGraph(
    env,
    graphInfo.root,
    graphInfo.depth,
    graphInfo.showOnlyAgg,
    curSnapshotTime,
    graphSearching,
    graphSearch,
    navigationView,
    searchedNodes
  );
  const { data: prunedGraph, status: prunedGraphStatus } = GetPrunedGraph(
    env,
    curSnapshotTime,
    searchResultsStatus,
    navigationView,
    searchedNodes,
    regularTemporal
  );

  const searchSummary = curSearchSnapshot?.metadata || prunedGraph?.metadata;
  const cypherQuery = graphSearchString.includes("MATCH");
  const showGraphView =
    navigationView === "evolution"
      ? diffSnapshot?.graph
      : (!graphSearch && nodes.length <= nodeThreshold) ||
        (graphSearch &&
          ((!cypherQuery && !curSearchSnapshot?.qualifying_nodes_pager) ||
            (cypherQuery && selectedReturnType === "graph")));
  const emptyDiffGraph =
    diffFilter.reduce(
      (pV: number, cV: string) => pV + diffSnapshot?.stats[cV],
      0
    ) === 0;
  const noResults =
    (navigationView !== "evolution" &&
      ((searchResultsStatus === "success" &&
        !graphSearching &&
        (!searchResults ||
          (searchResults &&
            (searchResults[curSnapshotTime]?.qualifying_nodes?.length === 0 ||
              searchResults[curSnapshotTime]?.subgraph?.nodes.length ===
                0)))) ||
        (navigationView === "temporal" &&
          graphSearch &&
          Object.keys(temporalSearchTimestamps).length === 0) ||
        searchResults?.qualifying_nodes?.length === 0)) ||
    (navigationView === "evolution" &&
      diffView === "snapshot" &&
      emptyDiffGraph);

  const { data: nodesInfo } = GetNodesInfo(
    env,
    graphSearch,
    selectedResourceCategory.includes("source")
      ? curSearchSnapshot?.source_nodes || []
      : curSearchSnapshot?.qualifying_nodes || [],
    curSnapshotTime,
    !showGraphView && selectedReturnType === "table"
  );

  useEffect(() => {
    setGraphInfo({
      ...graphInfo,
      root: customerCloud,
      depth: defaultDepth,
    });
    setGraphNav([
      {
        nodeID: customerCloud,
        nodeType: orgCloud,
      },
    ]);
    setCurSearchSnapshot(null);
    sessionStorage.page = "Enterprise Knowledge Graph";
  }, []);

  useEffect(() => {
    setPageNumber(1);
    setSelectedResourceCategory("qualifying_nodes");
  }, [
    navigationView,
    snapshotIndex,
    selectedTemporalTimestamp,
    graphSearchString,
    diffStartTime.snapshot,
  ]);

  useEffect(() => {
    if (selectedContextMenu.id !== "")
      handleViewContextMenu(selectedContextMenu, setNodes);
    const handleClickOutside = () => {
      if (selectedContextMenu.id !== "")
        setSelectedContextMenu(initialContextMenu);
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [selectedContextMenu]);

  useEffect(() => {
    handleGetSnapshotTime(
      snapshotAvailable,
      snapshotTimestamps,
      snapshotTime,
      setSnapshotTime,
      setSnapshotIndex
    );
  }, [snapshotTimestamps, snapshotAvailable]);

  useEffect(() => {
    handleMainSearchResults(
      graphSearch,
      searchDays,
      searchResults,
      navigationView,
      curSnapshotTime,
      setCurSearchSnapshot,
      selectedTemporalTimestamp,
      selectedTemporalDay,
      temporalSearchTimestamps,
      setSelectedTemporalDay,
      setTemporalSearchTimestamps,
      setSelectedTemporalTimestamp,
      graphInfo,
      setGraphInfo,
      temporalRef
    );
  }, [
    graphSearch,
    searchDays,
    searchResults,
    snapshotIndex,
    selectedTemporalTimestamp,
  ]);

  useLayoutEffect(() => {
    let nodes = [];
    let edges = [];
    if (diffSnapshot) {
      if (diffSnapshot.graph) {
        nodes = diffSnapshot.graph.node_list;
        edges = diffSnapshot.graph.edge_list;
      } else nodes = diffSnapshot.node_diffs || [];
    } else if (nodesInfo) {
      nodes = nodesInfo;
    } else if (curSearchSnapshot?.subgraph) {
      nodes = curSearchSnapshot.subgraph.nodes;
      edges = curSearchSnapshot.subgraph.edges;
    } else if (prunedGraph) {
      nodes = prunedGraph.subgraph.nodes;
      edges = prunedGraph.subgraph.edges;
    } else if (mainGraph) {
      nodes = mainGraph.node_list;
      edges = mainGraph.edge_list;
    }
    if (!graphSearching)
      renderMainGraph(
        nodes,
        edges,
        setNodes,
        setEdges,
        store,
        setMinZoom,
        reactFlowInstance,
        curSearchSnapshot,
        annotations?.annotations,
        diffSnapshot?.node_diffs,
        diffSnapshot?.edge_diffs
      );
  }, [
    nodesInfo,
    prunedGraph,
    mainGraph,
    snapshotTime,
    diffSnapshot,
    curSearchSnapshot,
    annotations,
    diffIntegrationType,
    collapseSummary,
    minZoom,
    graphSearching,
    reactFlowInstance,
    pageNumber,
  ]);

  useEffect(() => {
    if (selectedReturnType === "") {
      const filteredString = graphSearchString.slice(
        graphSearchString.indexOf("content_type:") + "content_type:".length,
        graphSearchString.lastIndexOf(")")
      );
      const firstReturnType = filteredString.split(",")[0].replace("uno/", "");
      if (firstReturnType.includes("*") || curSearchSnapshot?.graph === false)
        setSelectedReturnType("table");
      else setSelectedReturnType(firstReturnType);
    }
  }, [curSearchSnapshot]);

  return (
    <GraphLayout integrationType="all" graphType="main">
      <section className="flex items-center w-full mt-4 px-4 gap-4 dark:text-white">
        <ViewTabs />
        {navigationView === "snapshots" && <DepthFilter />}
        {navigationView === "temporal" && (
          <TemporalDatepicker
            temporalStartDate={temporalStartDate}
            setTemporalStartDate={setTemporalStartDate}
            temporalEndDate={temporalEndDate}
            setTemporalEndDate={setTemporalEndDate}
          />
        )}
        {navigationView !== "evolution" && (
          <>
            <Autocomplete
              graphType="main"
              startTime={startTime}
              endTime={endTime}
              graphSearchString={graphSearchString}
              setGraphSearchString={setGraphSearchString}
              graphSearching={graphSearching}
              setGraphSearch={setGraphSearch}
              setGraphSearching={setGraphSearching}
              setSelectedReturnType={setSelectedReturnType}
            />
            <AddToInvestigation
              evidenceType="MAIN_GRAPH_SEARCH"
              graphSearch={graphSearch}
              graphSearchString={graphSearchString}
              startTime={startTime}
              endTime={endTime}
            />
          </>
        )}
        <Reset setSelectedReturnType={setSelectedReturnType} />
      </section>
      {navigationView !== "snapshots" && (
        <section className="relative grid grid-cols-1 py-4 mx-4 mt-4 dark:bg-card black-shadow">
          {navigationView === "temporal" && (
            <TemporalTimeline
              searchResultsStatus={searchResultsStatus}
              searchDays={searchDays}
              temporalRef={temporalRef}
              collapseSummary={collapseSummary}
              setCollapseSummary={setCollapseSummary}
              temporalSearchTimestamps={temporalSearchTimestamps}
              selectedTemporalDay={selectedTemporalDay}
              selectedTemporalTimestamp={selectedTemporalTimestamp}
              setSelectedTemporalTimestamp={setSelectedTemporalTimestamp}
              setSelectedTemporalDay={setSelectedTemporalDay}
            />
          )}
          {navigationView === "evolution" && (
            <Evolution
              diffSummary={diffSummary?.diff_buckets}
              collapseSummary={collapseSummary}
              setCollapseSummary={setCollapseSummary}
            />
          )}
        </section>
      )}
      <section className="relative flex flex-col flex-grow pt-5 pb-10 m-4 dark:bg-card black-shadow overflow-hidden no-scrollbar z-0">
        <header className="flex items-center justify-between gap-10">
          {navigationView === "snapshots" && showGraphView && !graphSearch && (
            <GraphNavigation />
          )}
          {cypherQuery &&
            graphSearch &&
            searchResultsStatus === "success" &&
            (nodesInfo ||
              showGraphView ||
              selectedReturnType === "metadata") && (
              <FormatTabs
                searchString={graphSearchString}
                selectedReturnType={selectedReturnType}
                setSelectedReturnType={setSelectedReturnType}
                curSearchSnapshot={curSearchSnapshot}
              />
            )}
          <section className="absolute top-10 right-10 flex items-center gap-5 text-xs">
            {graphSearch &&
              showGraphView &&
              annotations?.annotations.length > 0 && (
                <button
                  className="flex items-center gap-2 px-2 py-1 dark:bg-signin/30 dark:hover:bg-signin/60 duration-100 border dark:border-signin z-10"
                  onClick={() => setShowGraphAnnotations(!showGraphAnnotations)}
                >
                  <FontAwesomeIcon icon={faLandMineOn} className="w-3 h-3" />
                  <p>{showGraphAnnotations ? "Hide" : "Show"} Annotations</p>
                </button>
              )}
            {searchResultsStatus === "success" &&
              searchSummary &&
              ((!cypherQuery && showGraphView) ||
                (cypherQuery && selectedReturnType === "graph")) && (
                <GraphSearchSummary
                  searchSummary={searchSummary}
                  nodes={nodes}
                />
              )}
            {showGraphView && (
              <GraphScreenshot curSnapshotTime={curSnapshotTime} />
            )}
          </section>
        </header>
        {navigationView === "evolution" &&
          diffView === "snapshot" &&
          diffSnapshot?.stats && (
            <article className="flex items-center justify-between gap-3 px-6">
              <p className="text-xs dark:text-signin">
                {convertToUTCString(Number(diffStartTime.snapshot))} -{" "}
                {convertToUTCString(Number(diffStartTime.snapshot) + 3.6e9)}
              </p>
              {diffSnapshot?.stats && (
                <DiffLegend
                  legend={diffSnapshot?.stats}
                  setPageNumber={setPageNumber}
                />
              )}
            </article>
          )}
        {navigationView === "snapshots" && snapshotTimestamps && (
          <SnapshotTimeline
            availableSnapshotIndexes={availableSnapshotIndexes}
            snapshotTimestamps={snapshotTimestamps}
          />
        )}
        {snapshotTimestampsStatus === "loading" ||
        (diffView === "snapshot" && diffSnapshotStatus === "loading") ||
        searchResultsStatus === "loading" ||
        prunedGraphStatus === "loading" ||
        mainGraphStatus === "loading" ? (
          <Loader />
        ) : noResults ? (
          <NoResults noResults={noResults} />
        ) : navigationView === "evolution" && diffView !== "snapshot" ? (
          <DiffOverview />
        ) : navigationView === "temporal" &&
          Object.keys(temporalSearchTimestamps).length === 0 ? (
          <article className="grid place-content-center mx-auto pt-10 w-full h-full">
            <article data-test="temporal-lottie" className="h-[20rem]">
              <Lottie
                loop
                animationData={temporalEmpty}
                play={true}
                rendererSettings={{
                  preserveAspectRatio: "xMidYMid slice",
                }}
                style={{ width: "100%", height: "100%" }}
              />
            </article>
          </article>
        ) : (navigationView !== "evolution" &&
            (!graphSearch ||
              (graphSearch && graphSearching) ||
              curSearchSnapshot)) ||
          (navigationView === "evolution" &&
            diffView === "snapshot" &&
            !emptyDiffGraph) ? (
          navigationView !== "evolution" &&
          selectedReturnType === "metadata" ? (
            <GraphMetadata searchSummary={searchSummary} />
          ) : // show graph if less than node threshold
          showGraphView ? (
            <motion.section
              data-test="subgraph"
              variants={showVariants}
              initial="hidden"
              animate="visible"
              className="grid w-full h-full"
            >
              <ReactFlow
                onInit={(reactFlowInstance) =>
                  onInit(store, nodes, setMinZoom, reactFlowInstance)
                }
                ref={ref}
                minZoom={minZoom}
                maxZoom={1}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                panOnDrag={true}
                panOnScroll={true}
                zoomOnScroll={true}
                zoomOnDoubleClick={false}
                selectNodesOnDrag={false}
                onNodeContextMenu={(e, node) =>
                  onNodeContextMenu(e, node, ref, setSelectedContextMenu)
                }
                onNodeMouseEnter={(_event, node) =>
                  highlightPath(node, nodes, edges, setNodes, setEdges)
                }
                onNodeMouseLeave={() => resetNodeStyles(setNodes, setEdges)}
                onPaneClick={() => {
                  setSelectedContextMenu(initialContextMenu);
                  setGraphInfo({ ...graphInfo, showPanel: false });
                }}
                onNodeClick={(e, node) => {
                  setElementType("node");
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
                onNodeDoubleClick={(e, node) => {
                  if (navigationView !== "evolution") {
                    setGraphInfo({
                      root: node.id,
                      depth: node.id.includes("agg") ? 1 : 2,
                      showOnlyAgg: false,
                      showPanel: false,
                    });

                    if (
                      !graphNav.some(
                        (nodeInfo: GraphNav) => nodeInfo.nodeID === node.id
                      )
                    )
                      setGraphNav([
                        ...graphNav,
                        {
                          nodeID: node["id"],
                          nodeType: node["nodeTypeName"],
                        },
                      ]);
                  }
                }}
                onEdgeClick={(e, edge) => {
                  setElementType("edge");
                  setSelectedNode(undefined);
                  setSelectedEdge({
                    id: edge["id"],
                    data: edge["data"],
                  });
                  setGraphInfo({
                    ...graphInfo,
                    showPanel: true,
                  });
                  setSelectedPanelTab("Info");
                }}
              >
                {selectedContextMenu.id !== "" && <ContextMenu />}
              </ReactFlow>
            </motion.section>
          ) : (
            // show list view if more than node threshold
            (nodesInfo || !graphSearch) && (
              <GraphListView
                nodes={nodes}
                curSnapshotTime={curSnapshotTime}
                graphInfo={graphInfo}
                setGraphInfo={setGraphInfo}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                curSearchSnapshot={curSearchSnapshot}
                diffSnapshot={diffSnapshot}
                selectedResourceCategory={selectedResourceCategory}
                setSelectedResourceCategory={setSelectedResourceCategory}
              />
            )
          )
        ) : null}
        {(navigationView === "snapshots" ||
          (navigationView === "evolution" && diffView === "snapshot") ||
          (navigationView === "temporal" &&
            Object.keys(temporalSearchTimestamps).length > 0)) &&
          showGraphView && (
            <GraphControls nodes={nodes} setMinZoom={setMinZoom} />
          )}
      </section>
      <AnimatePresence exitBeforeEnter>
        {graphInfo.showPanel && (
          <DetailPanel
            graphType="main"
            graphInfo={graphInfo}
            setGraphInfo={setGraphInfo}
            curSnapshotTime={curSnapshotTime}
            curSearchSnapshot={curSearchSnapshot}
          />
        )}
      </AnimatePresence>
    </GraphLayout>
  );
};

export default KnowledgeGraph;
