/* eslint-disable react-hooks/exhaustive-deps */
import { AnimatePresence, motion } from "framer-motion";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import ReactFlow, {
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useStoreApi,
} from "reactflow";
import DetailPanel from "src/components/Graph/DetailPanel/DetailPanel";
import Loader from "src/components/Loader/Loader";
import NoResults from "src/components/General/NoResults";
import {
  showVariants,
  nodeTypes,
  edgeTypes,
  pageSize,
} from "src/constants/general";
import PaginatedListLayout from "src/layouts/PaginatedListLayout";
import GraphControls from "src/components/Graph/GraphControls";
import SnapshotTimeline from "src/components/Graph/SnapshotTimeline";
import {
  GetCPMGraph,
  GetCPMServiceList,
} from "src/services/dashboard/effective-networking/cpm";
import {
  GetSnapshotsAvailable,
  GetSnapshotTimestamps,
} from "src/services/graph/snapshots";
import { useGeneralStore } from "src/stores/general";
import { useGraphStore } from "src/stores/graph";
import { renderCPMGraph } from "src/utils/dashboard";
import { parseURL, convertToMicrosec } from "src/utils/general";
import {
  onInit,
  highlightPath,
  resetNodeStyles,
  handleGetSnapshotTime,
} from "src/utils/graph";

const CPMGraph = ({
  enSearchResults,
  enSearchResultsStatus,
}: {
  enSearchResults: any;
  enSearchResultsStatus: string;
}) => {
  const parsed = parseURL();

  const { env } = useGeneralStore();
  const {
    graphInfo,
    setGraphInfo,
    graphSearch,
    graphSearching,
    snapshotTime,
    setSnapshotTime,
    snapshotIndex,
    setSnapshotIndex,
    setElementType,
    setSelectedPanelTab,
    setSelectedNode,
    setSelectedEdge,
  } = useGraphStore();

  const [query, setQuery] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<string>("");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );
  const [minZoom, setMinZoom] = useState<number>(0);
  const store = useStoreApi();
  const reactFlowInstance = useReactFlow();

  const { data: snapshotAvailable } = GetSnapshotsAvailable(
    env,
    parsed.integration,
    "cpm"
  );
  const { data: snapshotTimestamps, status: snapshotTimestampsStatus } =
    GetSnapshotTimestamps(
      env,
      parsed.integration,
      snapshotAvailable ? snapshotAvailable.earliest_snapshot !== -1 : false,
      convertToMicrosec(snapshotTime),
      "snapshots",
      "cpm"
    );

  const sortedSnapshotTimes = snapshotTimestamps?.timestamps.sort();
  const availableSnapshotIndexes = sortedSnapshotTimes
    ? sortedSnapshotTimes.reduce((pV: number[], cV: number) => {
        if (snapshotTimestamps.missing.includes(cV)) return [...pV];
        else return [...pV, sortedSnapshotTimes.indexOf(cV)];
      }, [])
    : [];
  const curSnapshotTime =
    snapshotTimestamps && snapshotIndex !== -1
      ? snapshotTimestamps.timestamps[snapshotIndex]
      : 0;

  const { data: serviceList, status: serviceListStatus } = GetCPMServiceList(
    env,
    parsed.integration,
    curSnapshotTime,
    pageNumber
  );

  const { data: cpmGraph, status: cpmGraphStatus } = GetCPMGraph(
    env,
    parsed.integration,
    curSnapshotTime,
    selectedService
  );

  const filteredServiceList = (
    enSearchResults?.qualifying_services ||
    serviceList?.svc_list ||
    []
  )?.filter((nodeID: string) =>
    nodeID
      .toLowerCase()
      .replace(/\s+/g, "")
      .includes(query.toLowerCase().replace(/\s+/g, ""))
  );
  const totalCount = filteredServiceList?.length || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  useEffect(() => {
    let services = [];
    if (enSearchResults) services = enSearchResults.qualifying_services;
    else if (serviceList) services = serviceList.svc_list;
    if (services.length > 0) setSelectedService(services[0]);
  }, [serviceList, enSearchResults]);

  useEffect(() => {
    handleGetSnapshotTime(
      snapshotAvailable,
      snapshotTimestamps,
      snapshotTime,
      setSnapshotTime,
      setSnapshotIndex
    );
  }, [snapshotTimestamps, snapshotAvailable]);

  useLayoutEffect(() => {
    if (cpmGraph?.nodes.length > 0 && !graphSearching)
      renderCPMGraph(
        cpmGraph.nodes,
        cpmGraph.edges,
        setNodes,
        setEdges,
        store,
        setMinZoom,
        reactFlowInstance
      );
  }, [cpmGraph, graphSearch, graphSearching, minZoom, selectedService]);

  return (
    <section className="flex flex-col flex-grow w-full h-full dark:bg-card black-shadow overflow-hidden">
      <section className="flex flex-grow h-full overflow-auto scrollbar">
        <aside className="grid content-start px-3 w-1/4 h-full text-xs dark:bg-card overflow-auto scrollbar z-10">
          <PaginatedListLayout
            placeholderText="Filter services"
            query={query}
            totalCount={totalCount}
            totalPages={totalPages}
            beginning={beginning}
            end={end}
            setQuery={setQuery}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          >
            <ul className="grid">
              {filteredServiceList
                ?.slice(beginning - 1, end + 1)
                .map((service: string) => {
                  return (
                    <li
                      key={service}
                      className={`flex items-center gap-2 p-2 px-4 cursor-pointer ${
                        selectedService === service
                          ? "dark:bg-signin/60"
                          : "dark:bg-tooltip dark:hover:bg-signin/30 duration-100 dark:even:bg-panel"
                      } `}
                      onClick={() => setSelectedService(service)}
                    >
                      <p className="w-full break-all">{service}</p>
                    </li>
                  );
                })}
            </ul>
          </PaginatedListLayout>
        </aside>
        <section className="relative flex flex-grow flex-col pb-11 overflow-hidden">
          <AnimatePresence>
            {[
              snapshotTimestampsStatus,
              serviceListStatus,
              cpmGraphStatus,
              enSearchResultsStatus,
            ].includes("loading") ? (
              <Loader />
            ) : (enSearchResultsStatus === "success" &&
                (!enSearchResults ||
                  enSearchResults?.qualifying_services.length === 0)) ||
              cpmGraph?.nodes.length === 0 ? (
              <NoResults />
            ) : (
              (cpmGraphStatus === "success" ||
                (graphSearch && graphSearching) ||
                enSearchResults) &&
              nodes.length > 0 && (
                <motion.section
                  variants={showVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col flex-grow w-full h-full"
                >
                  <ReactFlow
                    onInit={(reactFlowInstance) =>
                      onInit(store, nodes, setMinZoom, reactFlowInstance)
                    }
                    minZoom={minZoom}
                    maxZoom={1}
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    panOnDrag={true}
                    panOnScroll={true}
                    zoomOnScroll={true}
                    zoomOnDoubleClick={false}
                    selectNodesOnDrag={false}
                    onNodeMouseEnter={(_event, node) =>
                      highlightPath(node, nodes, edges, setNodes, setEdges)
                    }
                    onNodeMouseLeave={() => resetNodeStyles(setNodes, setEdges)}
                    onPaneClick={() =>
                      setGraphInfo({ ...graphInfo, showPanel: false })
                    }
                    onNodeClick={(e, node) => {
                      setElementType("node");
                      setSelectedNode({
                        id: node["id"],
                        data: node["data"],
                      });
                      setSelectedEdge(undefined);
                      setGraphInfo({ ...graphInfo, showPanel: true });
                      setSelectedPanelTab("Info");
                    }}
                    onEdgeClick={(e, edge) => {
                      setElementType("edge");
                      setSelectedNode(undefined);
                      setSelectedEdge({
                        id: edge["id"],
                        data: edge["data"],
                      });
                      setGraphInfo({ ...graphInfo, showPanel: true });
                      setSelectedPanelTab("Info");
                    }}
                  ></ReactFlow>
                </motion.section>
              )
            )}
          </AnimatePresence>
          <GraphControls nodes={nodes} setMinZoom={setMinZoom} />
          {snapshotTimestamps && (
            <SnapshotTimeline
              availableSnapshotIndexes={availableSnapshotIndexes}
              snapshotTimestamps={snapshotTimestamps}
            />
          )}
        </section>
        <AnimatePresence exitBeforeEnter>
          {graphInfo.showPanel && (
            <DetailPanel
              graphType="cpm"
              graphInfo={graphInfo}
              setGraphInfo={setGraphInfo}
              curSnapshotTime={curSnapshotTime}
            />
          )}
        </AnimatePresence>
      </section>
    </section>
  );
};

export default CPMGraph;
