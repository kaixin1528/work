/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import { AnimatePresence } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Background,
  useReactFlow,
  useStoreApi,
} from "reactflow";
import { nodeTypes, edgeTypes } from "src/constants/general";
import { useGeneralStore } from "src/stores/general";
import { useGraphStore } from "src/stores/graph";
import { onInit, renderMainGraph } from "src/utils/graph";
import DetailPanel from "../Graph/DetailPanel/DetailPanel";
import GraphControls from "../Graph/GraphControls";
import { GetActiveSources } from "src/services/dashboard/dashboard";
import GraphListView from "src/components/Graph/GraphListView/GraphListView";
import { nodeThreshold } from "src/constants/graph";
import { GetNodesInfo } from "src/services/graph/list-view";
import NoResults from "../General/NoResults";
import Loader from "../Loader/Loader";
import KeyValuePair from "../General/KeyValuePair";
import { GetCVEUsageGraph } from "src/services/general/cve";

const UsageGraph = ({ selectedCVE }: { selectedCVE: string }) => {
  const { env } = useGeneralStore();
  const {
    setSelectedEdge,
    setSelectedNode,
    setSelectedPanelTab,
    setElementType,
    graphInfo,
    setGraphInfo,
  } = useGraphStore();

  const [selectedSource, setSelectedSource] = useState<string>("");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [minZoom, setMinZoom] = useState<number>(0);
  const [selectedResourceCategory, setSelectedResourceCategory] =
    useState("qualifying_nodes");
  const [pageNumber, setPageNumber] = useState<number>(1);

  const reactFlowInstance = useReactFlow();
  const store = useStoreApi();

  const { data: activeSources } = GetActiveSources(env);
  const { data: usageGraph, status: usageGraphStatus } = GetCVEUsageGraph(
    env,
    selectedCVE,
    selectedSource,
    selectedResourceCategory,
    pageNumber
  );

  const curSnapshotTime = usageGraph?.graph
    ? Number(Object.keys(usageGraph.graph)[0])
    : 0;
  const curSearchSnapshot = usageGraph && usageGraph.graph[curSnapshotTime];
  const showGraphView =
    usageGraphStatus === "success" && nodes.length <= nodeThreshold;
  const noResults = nodes.length === 0;

  const { data: nodesInfo } = GetNodesInfo(
    env,
    true,
    selectedResourceCategory.includes("source")
      ? curSearchSnapshot?.source_nodes || []
      : curSearchSnapshot?.qualifying_nodes || [],
    curSnapshotTime,
    !showGraphView
  );

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "mapping",
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: "#7894B0",
            },
          },
          eds
        )
      ),
    [setEdges]
  );

  useEffect(() => {
    if (activeSources && selectedSource === "") {
      const firstSource = Object.keys(activeSources.clouds).find(
        (integration) => activeSources.clouds[integration] === true
      );
      if (firstSource) setSelectedSource(firstSource);
    }
  }, [activeSources]);

  useEffect(() => {
    let nodes = [];
    let edges = [];
    if (nodesInfo) {
      nodes = nodesInfo;
    } else if (curSearchSnapshot?.subgraph) {
      nodes = curSearchSnapshot.subgraph.nodes;
      edges = curSearchSnapshot.subgraph.edges;
    }
    renderMainGraph(
      nodes,
      edges,
      setNodes,
      setEdges,
      store,
      setMinZoom,
      reactFlowInstance,
      curSearchSnapshot
    );
  }, [curSearchSnapshot, nodesInfo, minZoom]);

  return (
    <section className="grid gap-3 content-start text-sm">
      <h4 className="dark:text-checkbox">Resource Usage Graph</h4>
      {activeSources && (
        <nav className="flex items-center gap-2">
          {Object.entries(activeSources.clouds).map((keyVal: any) => {
            if (keyVal[1] === false) return null;
            return (
              <button
                key={keyVal[0]}
                className={`px-4 py-1 ${
                  selectedSource === keyVal[0]
                    ? "selected-button"
                    : "dark:hover:bg-signin/60 duration-100"
                }`}
                onClick={() => setSelectedSource(keyVal[0])}
              >
                <img
                  src={`/general/integrations/${keyVal[0].toLowerCase()}.svg`}
                  alt={keyVal[0]}
                  className="w-7 h-7"
                />
              </button>
            );
          })}
        </nav>
      )}
      {selectedSource !== "" && (
        <section className="flex flex-col flex-grow w-full h-full overflow-auto scrollbar">
          {usageGraphStatus === "loading" ? (
            <Loader />
          ) : noResults ? (
            <NoResults isCVE />
          ) : (
            <section className="flex flex-col flex-grow content-start gap-5 w-full h-[30rem]">
              <header className="flex items-center gap-5 text-xs">
                {usageGraph.first_observed !== -1 && (
                  <KeyValuePair
                    label="First Observed"
                    value={usageGraph.first_observed}
                  />
                )}
                <KeyValuePair label="Snapshot Time" value={curSnapshotTime} />
                <KeyValuePair
                  label="Total Containers"
                  value={usageGraph.total_containers}
                />
                <KeyValuePair
                  label="Days Unaddressed for"
                  value={usageGraph.unaddressed_for}
                />
              </header>
              {showGraphView ? (
                <section className="relative flex flex-col flex-grow w-full h-full dark:bg-card overflow-x-hidden overflow-y-auto">
                  <ReactFlow
                    onInit={() =>
                      onInit(store, nodes, setMinZoom, reactFlowInstance)
                    }
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    panOnScroll
                    minZoom={0.1}
                    onNodeClick={(e, node: any) => {
                      setElementType("node");
                      setGraphInfo({ ...graphInfo, showPanel: true });
                      setSelectedNode({
                        id: node["id"],
                        data: node["data"],
                      });
                      setSelectedEdge(undefined);
                    }}
                    onEdgeClick={(e, edge: any) => {
                      setElementType("edge");
                      setGraphInfo({ ...graphInfo, showPanel: true });
                      setSelectedNode(undefined);
                      setSelectedEdge({
                        id: edge["id"],
                        data: edge["data"],
                      });
                      setSelectedPanelTab("Info");
                    }}
                  >
                    <Background />
                  </ReactFlow>
                  <GraphControls nodes={nodes} setMinZoom={setMinZoom} />
                </section>
              ) : (
                nodesInfo && (
                  <GraphListView
                    nodes={nodes}
                    curSnapshotTime={curSnapshotTime}
                    graphInfo={graphInfo}
                    setGraphInfo={setGraphInfo}
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                    curSearchSnapshot={curSearchSnapshot}
                    selectedResourceCategory={selectedResourceCategory}
                    setSelectedResourceCategory={setSelectedResourceCategory}
                  />
                )
              )}
            </section>
          )}
          <AnimatePresence exitBeforeEnter>
            {graphInfo.showPanel && (
              <DetailPanel
                graphType="main"
                curSnapshotTime={curSnapshotTime}
                graphInfo={graphInfo}
                setGraphInfo={setGraphInfo}
              />
            )}
          </AnimatePresence>
        </section>
      )}
    </section>
  );
};

export default UsageGraph;
