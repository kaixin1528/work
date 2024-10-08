/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  useEdgesState,
  MarkerType,
  useStoreApi,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { edgeTypes, nodeTypes } from "src/constants/general";
import { useGRCStore } from "src/stores/grc";
import { createMappingNodes, onInit } from "src/utils/grc";
import GraphControls from "src/components/Graph/GraphControls";
import Loader from "src/components/Loader/Loader";
import { KeyStringVal } from "src/types/general";

const MappedGraph = ({
  mapping,
  mappingStatus,
  selectedFormat,
  nodes,
  setNodes,
  onNodesChange,
  filters,
}: {
  mapping: any;
  mappingStatus: string;
  selectedFormat: string;
  nodes: any;
  setNodes: any;
  onNodesChange: any;
  filters: any;
}) => {
  const store = useStoreApi();
  const reactFlowInstance = useReactFlow();

  const { setSelectedMappingNode } = useGRCStore();

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [minZoom, setMinZoom] = useState<number>(0);

  const documents = [
    ...new Set(
      mapping?.data.reduce((pV: string[], cV: KeyStringVal) => {
        if (cV.policy_id) return [...pV, cV.policy_id];
        else return [...pV, cV.framework_id];
      }, [])
    ),
  ] as string[];

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
    if (mapping)
      createMappingNodes(
        mapping,
        setNodes,
        setEdges,
        store,
        setMinZoom,
        reactFlowInstance,
        filters,
        documents
      );
  }, [
    mapping,
    mappingStatus,
    selectedFormat,
    minZoom,
    store,
    reactFlowInstance,
    setEdges,
    setNodes,
    filters,
  ]);

  return (
    <section className="flex flex-col flex-grow w-full h-full overflow-auto scrollbar">
      {mappingStatus === "success" ? (
        nodes.length > 0 ? (
          <section className="relative grid m-4 h-full overflow-auto scrollbar">
            <ReactFlow
              onInit={(reactFlowInstance) =>
                onInit(store, nodes, setMinZoom, reactFlowInstance)
              }
              minZoom={minZoom}
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              panOnScroll
              onNodeClick={(e, node) => setSelectedMappingNode(node)}
            >
              <Background />
              <GraphControls nodes={nodes} setMinZoom={setMinZoom} />
            </ReactFlow>
          </section>
        ) : (
          <p>No mappings found</p>
        )
      ) : (
        <Loader />
      )}
    </section>
  );
};

export default MappedGraph;
