/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ReactFlow, {
  useEdgesState,
  useNodesState,
  useReactFlow,
  useStoreApi,
} from "reactflow";
import GraphControls from "src/components/Graph/GraphControls";
import Loader from "src/components/Loader/Loader";
import NoResults from "src/components/General/NoResults";
import { nodeTypes, edgeTypes } from "src/constants/general";
import {
  onInit,
  highlightPath,
  resetNodeStyles,
  renderMainGraph,
} from "src/utils/graph";
import {
  GetDiffGraphFromList,
  GetGraphFromList,
} from "src/services/graph/list-view";
import { useGeneralStore } from "src/stores/general";
import { useGraphStore } from "src/stores/graph";
import { convertToMicrosec } from "src/utils/general";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Subgraph = ({ viewResourceIDs }: { viewResourceIDs: string[] }) => {
  const { env } = useGeneralStore();
  const {
    setSelectedEdge,
    setSelectedNode,
    setSelectedPanelTab,
    setElementType,
    graphInfo,
    setGraphInfo,
    snapshotTime,
    navigationView,
    diffStartTime,
  } = useGraphStore();

  const [showGraph, setShowGraph] = useState<boolean>(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [minZoom, setMinZoom] = useState<number>(0);
  const reactFlowInstance = useReactFlow();
  const store = useStoreApi();

  const graphFromList = GetGraphFromList(env);
  const diffGraphFromList = GetDiffGraphFromList(env);

  const timestamp =
    navigationView === "evolution"
      ? Number(diffStartTime.snapshot)
      : convertToMicrosec(snapshotTime);
  const curSearchSnapshot =
    navigationView === "evolution"
      ? diffGraphFromList.data && diffGraphFromList.data[timestamp]
      : graphFromList.data && graphFromList.data[timestamp];

  useEffect(() => {
    if (showGraph) setShowGraph(false);
  }, [viewResourceIDs]);

  useEffect(() => {
    if (curSearchSnapshot) {
      renderMainGraph(
        curSearchSnapshot.subgraph.nodes,
        curSearchSnapshot.subgraph.edges,
        setNodes,
        setEdges,
        store,
        setMinZoom,
        reactFlowInstance,
        curSearchSnapshot,
        null,
        navigationView === "evolution"
          ? curSearchSnapshot.subgraph.nodes
          : null,
        navigationView === "evolution" ? curSearchSnapshot.subgraph.edges : null
      );
    }
  }, [curSearchSnapshot, minZoom]);

  return (
    <section className="grid gap-5">
      <article className="flex items-center gap-2">
        <span className="px-3 py-1 border dark:border-white rounded-full">
          {viewResourceIDs.length}
        </span>
        <p>Resources Selected</p>
        <FontAwesomeIcon icon={faArrowRightLong} />
        <button
          className="px-4 py-1 dark:bg-admin/60 dark:hover:bg-admin/30 duration-100 rounded-full"
          onClick={() => {
            setShowGraph(!showGraph);
            if (navigationView === "evolution")
              diffGraphFromList.mutate({
                timestamp: timestamp,
                resourceIDs: viewResourceIDs,
              });
            else
              graphFromList.mutate({
                timestamp: timestamp,
                resourceIDs: viewResourceIDs,
              });
          }}
        >
          {showGraph ? "Hide" : "View"} graph
        </button>
      </article>
      {showGraph && (
        <section className="flex flex-col flex-grow w-full h-[20rem] dark:bg-panel">
          {graphFromList.status === "loading" ||
          diffGraphFromList.status === "loading" ? (
            <Loader />
          ) : graphFromList.status === "success" &&
            curSearchSnapshot?.subgraph.nodes?.length === 0 ? (
            <NoResults />
          ) : (
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
                setGraphInfo({ ...graphInfo, showPanel: false })
              }
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
              <GraphControls nodes={nodes} setMinZoom={setMinZoom} />
            </ReactFlow>
          )}
        </section>
      )}
    </section>
  );
};

export default Subgraph;
