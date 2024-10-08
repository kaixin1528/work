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
import { nodeTypes, edgeTypes } from "src/constants/general";
import {
  onInit,
  highlightPath,
  resetNodeStyles,
  renderMainGraph,
} from "src/utils/graph";
import { useGraphStore } from "src/stores/graph";
import { AnimatePresence } from "framer-motion";
import DetailPanel from "../Graph/DetailPanel/DetailPanel";
import { GetAlertAnalysis } from "src/services/graph/alerts";
import { useGeneralStore } from "src/stores/general";
import { convertToMicrosec, parseURL } from "src/utils/general";
import ModalLayout from "src/layouts/ModalLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiagramProject } from "@fortawesome/free-solid-svg-icons";
import NoResults from "../General/NoResults";

const Subgraph = () => {
  const parsed = parseURL();

  const { env } = useGeneralStore();
  const {
    setSelectedEdge,
    setSelectedNode,
    setElementType,
    graphInfo,
    setGraphInfo,
    snapshotTime,
  } = useGraphStore();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [minZoom, setMinZoom] = useState<number>(0);
  const [show, setShow] = useState<boolean>(false);
  const reactFlowInstance = useReactFlow();
  const store = useStoreApi();

  const { data: alertAnalysis, status: analysisStatus } = GetAlertAnalysis(
    env,
    String(parsed.graph_artifact_id) || "",
    String(parsed.event_cluster_id) || "",
    convertToMicrosec(snapshotTime),
    true
  );

  const handleOnClose = () => setShow(false);

  useEffect(() => {
    if (alertAnalysis) {
      renderMainGraph(
        alertAnalysis.sub_graph?.node_list,
        alertAnalysis.sub_graph?.edge_list,
        setNodes,
        setEdges,
        store,
        setMinZoom,
        reactFlowInstance,
        alertAnalysis.sub_graph,
        null,
        null,
        null,
        null,
        null,
        true
      );
    }
  }, [alertAnalysis, minZoom]);

  useEffect(() => {
    setGraphInfo({ ...graphInfo, showPanel: false });
  }, []);

  return (
    <section className="text-xs">
      <button className="flex items-center gap-2" onClick={() => setShow(true)}>
        <FontAwesomeIcon icon={faDiagramProject} /> View Breadcrumbs
      </button>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        {analysisStatus === "loading" ? (
          <Loader />
        ) : analysisStatus === "success" &&
          alertAnalysis?.sub_graph.node_list?.length === 0 ? (
          <NoResults />
        ) : (
          <section className="flex flex-col flex-grow">
            <h4>
              <span className="text-base">
                &lt;{parsed.graph_artifact_id}&gt;
              </span>{" "}
              Breadcrumbs
            </h4>
            <section className="flex flex-col flex-grow mt-5 w-full h-[30rem] dark:bg-card">
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
              >
                <GraphControls nodes={nodes} setMinZoom={setMinZoom} />
              </ReactFlow>
            </section>
          </section>
        )}
      </ModalLayout>
      <AnimatePresence exitBeforeEnter>
        {graphInfo.showPanel && (
          <DetailPanel
            graphType="main"
            curSnapshotTime={alertAnalysis?.first_recorded}
            graphInfo={graphInfo}
            setGraphInfo={setGraphInfo}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Subgraph;
