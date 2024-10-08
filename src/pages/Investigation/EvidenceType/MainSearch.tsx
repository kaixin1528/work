/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import {
  useState,
  useEffect,
  useRef,
  MutableRefObject,
  useLayoutEffect,
} from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  useReactFlow,
  useStoreApi,
} from "reactflow";
import { nodeTypes, edgeTypes } from "../../../constants/general";
import {
  renderMainGraph,
  handleMainSearchResults,
  highlightPath,
  onInit,
  resetNodeStyles,
  handleViewContextMenu,
} from "../../../utils/graph";
import GraphControls from "../../../components/Graph/GraphControls";
import {
  faClock,
  faEyeSlash,
  faLandMineOn,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GraphInfo } from "../../../types/general";
import { AnimatePresence } from "framer-motion";
import Loader from "../../../components/Loader/Loader";
import { GeneralEvidenceType } from "../../../types/investigation";
import { convertToUTCString } from "src/utils/general";
import { defaultDepth } from "src/constants/graph";
import GraphListView from "src/components/Graph/GraphListView/GraphListView";
import TemporalTimeline from "src/components/Graph/TemporalTimeline";
import { useGraphStore } from "src/stores/graph";
import DetailPanel from "src/components/Graph/DetailPanel/DetailPanel";
import NoResults from "src/components/General/NoResults";
import { useGeneralStore } from "src/stores/general";
import ModalLayout from "src/layouts/ModalLayout";
import { GetMainGraph } from "src/services/graph/graph";
import { GetNodesInfo } from "src/services/graph/list-view";
import {
  SearchDays,
  GetMainSearchResults,
  GetGraphAnnotations,
} from "src/services/graph/search";
import { GetPrunedGraph } from "src/services/graph/temporal";
import FormatTabs from "src/pages/KnowledgeGraph/Cypher/FormatTabs";
import GraphMetadata from "src/components/Graph/GraphMetadata";
import GraphSearchSummary from "src/components/Graph/GraphSearchSummary";

const MainSearch = ({
  evidence,
  showModal,
}: {
  evidence: GeneralEvidenceType;
  showModal?: boolean;
}) => {
  const { env } = useGeneralStore();
  const {
    setSelectedEdge,
    setSelectedNode,
    setSelectedPanelTab,
    setElementType,
    showGraphAnnotations,
    setShowGraphAnnotations,
    selectedContextMenu,
  } = useGraphStore();

  const [localGraphInfo, setLocalGraphInfo] = useState<GraphInfo>({
    root: "",
    depth: defaultDepth,
    showOnlyAgg: true,
    showPanel: false,
  });
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [minZoom, setMinZoom] = useState<number>(0);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [curSearchSnapshot, setCurSearchSnapshot] = useState<any>(null);
  const [temporalSearchTimestamps, setTemporalSearchTimestamps] = useState({});
  const [selectedTemporalTimestamp, setSelectedTemporalTimestamp] =
    useState<number>(-1);
  const [selectedTemporalDay, setSelectedTemporalDay] = useState<string>("");
  const [selectedResourceCategory, setSelectedResourceCategory] =
    useState("qualifying_nodes");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedReturnType, setSelectedReturnType] = useState<string>("");

  const temporalRef = useRef() as MutableRefObject<HTMLLIElement>;
  const reactFlowInstance = useReactFlow();
  const store = useStoreApi();

  const navigationView =
    evidence.query_start_time !== evidence.query_end_time
      ? "temporal"
      : "snapshots";

  const curSnapshotTime =
    evidence.query_start_time !== evidence.query_end_time
      ? selectedTemporalTimestamp !== -1
        ? Number(selectedTemporalTimestamp)
        : 0
      : evidence.query_start_time;
  const regularTemporal =
    navigationView === "temporal" &&
    selectedTemporalTimestamp === -1 &&
    (Array.isArray(curSearchSnapshot?.qualifying_nodes) ||
      !(
        evidence.query_string.includes("radius") ||
        evidence.query_string.includes("aggregation_type")
      ));
  const startTime = regularTemporal
    ? evidence.query_start_time
    : curSnapshotTime;
  const endTime = regularTemporal ? evidence.query_end_time : curSnapshotTime;
  const cypherQuery = evidence.query_string.includes("MATCH");

  const { data: searchDays } = SearchDays(
    env,
    evidence.query_string,
    showDetails,
    evidence.query_start_time,
    evidence.query_end_time,
    navigationView
  );
  const { data: searchResults, status: searchResultsStatus } =
    GetMainSearchResults(
      env,
      evidence.query_string,
      showDetails,
      false,
      startTime,
      endTime,
      navigationView,
      1,
      pageNumber,
      selectedResourceCategory,
      selectedReturnType
    );

  const searchedNodes = curSearchSnapshot?.qualifying_nodes
    ? [...curSearchSnapshot.source_nodes, ...curSearchSnapshot.qualifying_nodes]
    : [];
  const showGraphView =
    (!cypherQuery && !curSearchSnapshot?.qualifying_nodes_pager) ||
    (cypherQuery && selectedReturnType === "graph");

  const { data: nodesInfo } = GetNodesInfo(
    env,
    showDetails,
    searchedNodes,
    curSnapshotTime,
    !showGraphView &&
      (!cypherQuery || (cypherQuery && selectedReturnType === "table"))
  );
  const { data: annotations } = GetGraphAnnotations(
    env,
    showDetails,
    curSearchSnapshot,
    curSnapshotTime
  );
  const { data: mainGraph, status: mainGraphStatus } = GetMainGraph(
    env,
    localGraphInfo.root,
    localGraphInfo.depth,
    localGraphInfo.showOnlyAgg,
    curSnapshotTime,
    false,
    showDetails,
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

  useEffect(() => {
    if (selectedContextMenu.id !== "")
      handleViewContextMenu(selectedContextMenu, setNodes);
  }, [selectedContextMenu]);

  useEffect(() => {
    handleMainSearchResults(
      showDetails,
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
      localGraphInfo,
      setLocalGraphInfo,
      temporalRef
    );
  }, [showDetails, searchDays, searchResults, selectedTemporalTimestamp]);

  useLayoutEffect(() => {
    let nodes = [];
    let edges = [];
    if (nodesInfo) {
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
    if (nodes.length > 0)
      renderMainGraph(
        nodes,
        edges,
        setNodes,
        setEdges,
        store,
        setMinZoom,
        reactFlowInstance,
        curSearchSnapshot,
        annotations?.annotations
      );
  }, [
    nodesInfo,
    prunedGraph,
    mainGraph,
    curSearchSnapshot,
    annotations,
    minZoom,
  ]);

  useEffect(() => {
    if (selectedReturnType === "") {
      const filteredString = evidence.query_string.slice(
        evidence.query_string.indexOf("content_type:") + "content_type:".length,
        evidence.query_string.lastIndexOf(")")
      );
      const firstReturnType = filteredString.split(",")[0].replace("uno/", "");
      if (firstReturnType.includes("*") || curSearchSnapshot?.graph === false)
        setSelectedReturnType("table");
      else setSelectedReturnType(firstReturnType);
    }
  }, [curSearchSnapshot]);

  const handleOnClose = () => setShowDetails(false);

  const GraphRendering = (
    <section className="grid content-start gap-5">
      {navigationView === "temporal" && (
        <TemporalTimeline
          searchResultsStatus={searchResultsStatus}
          searchDays={searchDays}
          temporalRef={temporalRef}
          temporalSearchTimestamps={temporalSearchTimestamps}
          selectedTemporalDay={selectedTemporalDay}
          selectedTemporalTimestamp={selectedTemporalTimestamp}
          setSelectedTemporalTimestamp={setSelectedTemporalTimestamp}
          setSelectedTemporalDay={setSelectedTemporalDay}
        />
      )}

      <section className="relative flex flex-col flex-grow p-4 h-[38rem] dark:bg-card rounded-sm">
        <header className="flex items-center justify-between gap-5">
          {cypherQuery && curSearchSnapshot && (
            <FormatTabs
              searchString={evidence.query_string}
              selectedReturnType={selectedReturnType}
              setSelectedReturnType={setSelectedReturnType}
              curSearchSnapshot={curSearchSnapshot}
            />
          )}
          {searchResultsStatus === "success" && showGraphView && (
            <section className="absolute top-7 right-7 flex items-center gap-5 text-xs">
              {searchSummary &&
                (!cypherQuery ||
                  (cypherQuery && selectedReturnType === "graph")) && (
                  <GraphSearchSummary
                    searchSummary={searchSummary}
                    nodes={nodes}
                  />
                )}
              {annotations?.annotations.length > 0 && (
                <button
                  className="flex items-center gap-2 px-2 py-1 dark:bg-signin/30 dark:hover:bg-signin/60 duration-100 border dark:border-signin z-10"
                  onClick={() => setShowGraphAnnotations(!showGraphAnnotations)}
                >
                  <FontAwesomeIcon icon={faLandMineOn} className="w-3 h-3" />
                  <p>{showGraphAnnotations ? "Hide" : "Show"} Annotations</p>
                </button>
              )}
            </section>
          )}
        </header>

        {[searchResultsStatus, mainGraphStatus, prunedGraphStatus].includes(
          "loading"
        ) ? (
          <Loader />
        ) : evidence.query_start_time === 0 ||
          (searchResultsStatus === "success" &&
            (!searchResults ||
              curSearchSnapshot?.qualifying_nodes_pager === null ||
              searchedNodes?.length === 0)) ||
          (navigationView === "temporal" &&
            Object.keys(temporalSearchTimestamps).length === 0) ? (
          <NoResults />
        ) : selectedReturnType === "metadata" ? (
          <GraphMetadata searchSummary={searchSummary} />
        ) : showGraphView &&
          (navigationView === "snapshots" ||
            (navigationView === "temporal" &&
              (!regularTemporal || prunedGraphStatus === "success"))) ? (
          <ReactFlow
            onInit={(reactFlowInstance) =>
              onInit(store, nodes, setMinZoom, reactFlowInstance)
            }
            minZoom={minZoom}
            maxZoom={1}
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            panOnDrag={true}
            panOnScroll={true}
            zoomOnScroll={true}
            zoomOnDoubleClick={true}
            onNodeMouseEnter={(_event, node) =>
              highlightPath(node, nodes, edges, setNodes, setEdges)
            }
            onNodeMouseLeave={() => resetNodeStyles(setNodes, setEdges)}
            onPaneClick={() =>
              setLocalGraphInfo({ ...localGraphInfo, showPanel: false })
            }
            onNodeClick={(e, node: any) => {
              setElementType("node");
              setLocalGraphInfo({ ...localGraphInfo, showPanel: true });
              setSelectedNode({
                id: node["id"],
                data: node["data"],
              });
              setSelectedEdge(undefined);
            }}
            onEdgeClick={(e, edge: any) => {
              setElementType("edge");
              setLocalGraphInfo({ ...localGraphInfo, showPanel: true });
              setSelectedNode(undefined);
              setSelectedEdge({
                id: edge["id"],
                data: edge["data"],
              });
              setSelectedPanelTab("Info");
            }}
          >
            <GraphControls nodes={nodes} setMinZoom={setMinZoom} />
          </ReactFlow>
        ) : (
          nodesInfo && (
            <GraphListView
              nodes={nodes}
              curSnapshotTime={curSnapshotTime}
              graphInfo={localGraphInfo}
              setGraphInfo={setLocalGraphInfo}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              curSearchSnapshot={curSearchSnapshot}
              selectedResourceCategory={selectedResourceCategory}
              setSelectedResourceCategory={setSelectedResourceCategory}
            />
          )
        )}
        <AnimatePresence exitBeforeEnter>
          {localGraphInfo.showPanel && (
            <DetailPanel
              graphType="main"
              graphInfo={localGraphInfo}
              setGraphInfo={setLocalGraphInfo}
              curSnapshotTime={curSnapshotTime}
            />
          )}
        </AnimatePresence>
      </section>
    </section>
  );

  return (
    <section className="grid gap-3 px-2 pb-2 text-xs w-full">
      <article className="flex items-start gap-3 dark:text-checkbox">
        <img
          src={`/investigation/evidence-type/${evidence.evidence_type.toLowerCase()}.svg`}
          alt={evidence.evidence_type}
          className="mt-[0.4rem] w-4 h-4"
        />
        <article className="grid gap-1 max-w-[40rem]">
          <p className="py-1 px-4 w-full hover:whitespace-normal truncate text-ellipsis break-all dark:text-white dark:bg-signin/20 border dark:border-signin rounded-sm overflow-auto scrollbar">
            {evidence.query_string}
          </p>
          <article className="flex items-center gap-2 break-all text-[0.65rem]">
            <FontAwesomeIcon icon={faClock} className="dark:text-admin" />
            {evidence.query_start_time !== 0 ? (
              <p>
                {convertToUTCString(evidence.query_start_time)}
                {evidence.query_start_time !== evidence.query_end_time &&
                  ` - ${convertToUTCString(evidence.query_end_time)}`}
              </p>
            ) : (
              <p>Time not selected</p>
            )}
          </article>
        </article>
        <button
          className="group flex items-center gap-2 mt-[0.4rem]"
          onClick={() => setShowDetails(!showDetails)}
        >
          <p className="w-max dark:group-hover:text-signin duration-100">
            {showDetails ? "Hide" : "Run"} query
          </p>

          <FontAwesomeIcon
            icon={showDetails ? faEyeSlash : faPlay}
            className="dark:group-hover:text-signin duration-100"
          />
        </button>
      </article>
      {showModal ? (
        <ModalLayout showModal={showDetails} onClose={handleOnClose}>
          {GraphRendering}
        </ModalLayout>
      ) : (
        showDetails && GraphRendering
      )}
    </section>
  );
};

export default MainSearch;
