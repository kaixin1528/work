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
import { showVariants, nodeTypes, edgeTypes } from "src/constants/general";
import GraphControls from "src/components/Graph/GraphControls";
import SnapshotTimeline from "src/components/Graph/SnapshotTimeline";
import { GetFirewallGraph } from "src/services/dashboard/effective-networking/firewall";
import {
  GetSnapshotsAvailable,
  GetSnapshotTimestamps,
} from "src/services/graph/snapshots";
import { useGeneralStore } from "src/stores/general";
import { useGraphStore } from "src/stores/graph";
import { renderFirewallGraph } from "src/utils/dashboard";
import { parseURL, convertToMicrosec } from "src/utils/general";
import {
  onInit,
  highlightPath,
  resetNodeStyles,
  handleGetSnapshotTime,
} from "src/utils/graph";

const FirewallGraph = ({
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
    "firewall"
  );
  const { data: snapshotTimestamps, status: snapshotTimestampsStatus } =
    GetSnapshotTimestamps(
      env,
      parsed.integration,
      snapshotAvailable ? snapshotAvailable.earliest_snapshot !== -1 : false,
      convertToMicrosec(snapshotTime),
      "snapshots",
      "firewall"
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

  const { data: firewallGraph, status: firewallGraphStatus } = GetFirewallGraph(
    env,
    parsed.integration,
    curSnapshotTime
  );

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
    let nodes = [];
    let edges = [];
    if (enSearchResults) {
      nodes = enSearchResults.qualifying_nodes;
      edges = enSearchResults.qualifying_edges;
    } else if (firewallGraph) {
      nodes = firewallGraph.nodes;
      edges = firewallGraph.edges;
    }
    if (nodes.length > 0 && !graphSearching)
      renderFirewallGraph(
        nodes,
        edges,
        setNodes,
        setEdges,
        enSearchResults,
        store,
        setMinZoom,
        reactFlowInstance
      );
  }, [firewallGraph, enSearchResults, graphSearch, graphSearching, minZoom]);

  return (
    <section className="flex flex-col flex-grow h-full dark:bg-card black-shadow overflow-hidden">
      <section className="relative flex flex-grow flex-col pb-11 h-full">
        <AnimatePresence>
          {[
            snapshotTimestampsStatus,
            firewallGraphStatus,
            enSearchResultsStatus,
          ].includes("loading") ? (
            <Loader />
          ) : (enSearchResultsStatus === "success" &&
              (!enSearchResults ||
                enSearchResults?.qualifying_nodes.length === 0)) ||
            firewallGraph?.nodes.length === 0 ? (
            <NoResults />
          ) : (
            (firewallGraphStatus === "success" ||
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
            graphType="firewall"
            graphInfo={graphInfo}
            setGraphInfo={setGraphInfo}
            curSnapshotTime={curSnapshotTime}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default FirewallGraph;
