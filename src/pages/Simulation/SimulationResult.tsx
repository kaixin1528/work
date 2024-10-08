/* eslint-disable react-hooks/exhaustive-deps */
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useLayoutEffect, useState } from "react";
import ReactFlow, {
  useStoreApi,
  useReactFlow,
  useNodesState,
  useEdgesState,
} from "reactflow";
import DetailPanel from "src/components/Graph/DetailPanel/DetailPanel";
import Loader from "src/components/Loader/Loader";
import { edgeTypes, nodeTypes, pageSize } from "src/constants/general";
import {
  GetSimulationGraph,
  GetSimulationPackageInfo,
  GetSimulationPossibleDamages,
} from "src/services/simulation";
import { useGraphStore } from "src/stores/graph";
import { KeyStringVal } from "src/types/general";
import {
  handleViewContextMenu,
  highlightPath,
  onInit,
  renderMainGraph,
  resetNodeStyles,
} from "src/utils/graph";
import GraphScreenshot from "../../components/Graph/GraphScreenshot";
import GraphSearchSummary from "../../components/Graph/GraphSearchSummary";
import TablePagination from "src/components/General/TablePagination";
import GraphControls from "../../components/Graph/GraphControls";
import NoResults from "src/components/General/NoResults";
import { useGeneralStore } from "src/stores/general";
import { convertToMicrosec, convertToUTCString } from "src/utils/general";
import { useSimulationStore } from "src/stores/simulation";
import { handleRunSimulationImpact } from "src/utils/simulation";

const SimulationResult = ({
  runSimulationImpact,
}: {
  runSimulationImpact: any;
}) => {
  const { env } = useGeneralStore();
  const {
    graphInfo,
    setGraphInfo,
    setElementType,
    setSelectedNode,
    setSelectedEdge,
    setShowGraphAnnotations,
    selectedNode,
    selectedContextMenu,
  } = useGraphStore();
  const {
    selectedSimulationAccount,
    selectedSimulationPackage,
    simulationSnapshotTime,
    selectedSimulationScope,
    setSelectedSimulationScope,
    selectedSimulationNodeObj,
    setSelectedSimulationNodeObj,
    selectedSimulationAnnotationType,
    setSelectedSimulationAnnotationType,
    setSelectedSimulationTab,
  } = useSimulationStore();

  const store = useStoreApi();
  const reactFlowInstance = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [minZoom, setMinZoom] = useState<number>(0);
  const [query, setQuery] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);

  const { data: getPackageInfo } = GetSimulationPackageInfo(
    selectedSimulationPackage
  );
  const getSimulationGraph = GetSimulationGraph(env);
  const getPossibleDamages = GetSimulationPossibleDamages(env);

  const curSnapshotTime = convertToMicrosec(simulationSnapshotTime) || 0;
  const scopes =
    getPackageInfo && selectedSimulationAnnotationType !== ""
      ? (Object.keys(
          getPackageInfo[selectedSimulationAnnotationType]
        ) as string[])
      : [];

  const impactedIDs = runSimulationImpact.data?.node_ids?.reduce(
    (pV: string[], cV: { source: string }) => [...pV, cV.source],
    []
  );
  const filteredSourceIDs = impactedIDs?.filter((nodeID: string) =>
    nodeID
      .toLowerCase()
      .replace(/\s+/g, "")
      .includes(query.toLowerCase().replace(/\s+/g, ""))
  );
  const annotations =
    selectedSimulationAnnotationType === "damage"
      ? getPossibleDamages.data?.annotations
      : selectedSimulationAnnotationType === "impact"
      ? runSimulationImpact.data?.annotations
      : [];
  const filteredAnnotations = annotations?.filter(
    (annotation: { scope: string }) =>
      annotation.scope === selectedSimulationScope
  );

  const totalCount = filteredSourceIDs?.length || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;
  const annotationStatus =
    ((selectedSimulationAnnotationType === "impact" &&
      runSimulationImpact.status === "success") ||
      (selectedSimulationAnnotationType === "damage" &&
        getPossibleDamages.status === "success")) &&
    getSimulationGraph.status === "success";
  const simulationAnnotation = filteredAnnotations?.find(
    (obj: KeyStringVal) => obj.node_id === selectedNode?.id
  );
  const firstScope = "key_compromise";

  useEffect(() => {
    if (selectedContextMenu.id !== "")
      handleViewContextMenu(selectedContextMenu, setNodes);
  }, [selectedContextMenu]);

  useLayoutEffect(() => {
    if (annotationStatus) {
      const nodeIDs = ["", "impact"].includes(selectedSimulationAnnotationType)
        ? runSimulationImpact.data?.node_ids
        : selectedSimulationAnnotationType === "damage"
        ? getPossibleDamages.data?.node_ids
        : [];
      const affectedNodeIDs = nodeIDs?.find(
        (obj: { source: string }) =>
          obj.source === selectedSimulationNodeObj?.source
      )?.target;
      renderMainGraph(
        getSimulationGraph.data.subgraph?.nodes || [],
        getSimulationGraph.data.subgraph?.edges || [],
        setNodes,
        setEdges,
        store,
        setMinZoom,
        reactFlowInstance,
        null,
        null,
        null,
        null,
        filteredAnnotations,
        affectedNodeIDs
      );
    }
  }, [
    annotationStatus,
    selectedSimulationScope,
    getSimulationGraph.data,
    minZoom,
  ]);

  const handleViewImpactDamage = (
    annotationType: string,
    nodeObj: any,
    scope: string
  ) => {
    const nodeID = nodeObj?.source;
    if (annotationType === "damage") {
      getPossibleDamages.mutate(
        {
          integrationType: selectedSimulationAccount?.integration_type,
          integrationID: selectedSimulationAccount?.integration_id,
          packageType: selectedSimulationPackage,
          snapshotTime: curSnapshotTime,
          sourceNodeID: nodeID,
          affectedNodeIDs: nodeObj,
          damageScope: scope,
        },
        {
          onSuccess: (data) =>
            getSimulationGraph.mutate({
              snapshotTime: curSnapshotTime,
              sourceNodeID: nodeID,
              simulationType: annotationType,
              affectedNodeIDs: data?.node_ids?.find(
                (obj: { source: string }) => obj.source === nodeID
              ),
            }),
        }
      );
    } else
      getSimulationGraph.mutate({
        snapshotTime: curSnapshotTime,
        sourceNodeID: nodeID,
        simulationType: annotationType,
        affectedNodeIDs: nodeObj,
      });
  };

  const handleViewAnnotation = (annotationType: string, nodeID: string) => {
    if (
      selectedSimulationNodeObj?.source === nodeID &&
      selectedSimulationAnnotationType === annotationType
    ) {
      setSelectedSimulationNodeObj(null);
      setSelectedSimulationAnnotationType("");
    } else {
      const impactedNodeObj = runSimulationImpact.data?.node_ids?.find(
        (obj: { source: string }) => obj.source === nodeID
      );
      setShowGraphAnnotations(true);
      setSelectedSimulationAnnotationType(annotationType);
      setSelectedSimulationScope(firstScope);
      setSelectedSimulationNodeObj(impactedNodeObj);
      handleViewImpactDamage(annotationType, impactedNodeObj, firstScope);
    }
  };

  useEffect(() => {
    if (
      selectedSimulationAnnotationType !== "" &&
      selectedSimulationNodeObj?.source !== "" &&
      selectedSimulationNodeObj
    ) {
      handleRunSimulationImpact(
        setSelectedSimulationTab,
        runSimulationImpact,
        selectedSimulationAccount,
        curSnapshotTime,
        selectedSimulationPackage
      );
      handleViewImpactDamage(
        selectedSimulationAnnotationType,
        selectedSimulationNodeObj,
        firstScope
      );
    }
  }, []);

  return (
    <section className="relative grid gap-5 px-6 w-full h-full overflow-auto scrollbar">
      {runSimulationImpact.status === "idle" && (
        <img
          src="/simulation/simulation-graph-placeholder.svg"
          alt="simulated graph placeholder"
          className="absolute top-1/3 left-1/2 -translate-x-1/2 px-10 w-[40rem]"
        />
      )}

      {runSimulationImpact.status === "loading" && (
        <article className="grid content-start place-self-center gap-5 mx-auto">
          <Loader />
          <p>Simulation Running... It make take a while...</p>
        </article>
      )}

      {runSimulationImpact.status === "success" ? (
        runSimulationImpact.data?.node_ids.length > 0 ? (
          <section className="grid content-start gap-10 overflow-auto scrollbar">
            <header className="flex items-center gap-5">
              <section className="flex items-center gap-10 pb-2 w-full text-sm full-underlined-label">
                <article className="grid">
                  <h4>{convertToUTCString(curSnapshotTime)}</h4>
                  <article className="flex items-center gap-3">
                    <img
                      src={`/general/integrations/${selectedSimulationAccount?.integration_type.toLowerCase()}.svg`}
                      alt={selectedSimulationAccount?.integration_type}
                      className="w-4 h-4"
                    />
                    <h4 className="w-36 break-all">
                      {selectedSimulationAccount?.customer_cloud_id}
                    </h4>
                  </article>
                </article>
                <article className="flex items-center justify-between gap-5">
                  <h2 className="text-2xl">{impactedIDs?.length}</h2>
                  <p className="text-sm">impacted resources</p>
                </article>
              </section>
              <article className="py-2 px-6 w-full text-xs dark:bg-search">
                <input
                  spellCheck="false"
                  autoComplete="off"
                  placeholder="Filter impacted resources by ID"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="input"
                  className="py-1 w-full h-6 dark:placeholder:text-checkbox focus:outline-none dark:bg-transparent dark:border-transparent dark:focus:ring-0 dark:focus:border-transparent"
                />
              </article>
              <article className="mt-3">
                <TablePagination
                  totalPages={totalPages}
                  beginning={beginning}
                  end={end}
                  totalCount={totalCount}
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                />
              </article>
            </header>
            <ul className="grid gap-5 px-4 pb-4 -mt-5 text-sm dark:bg-panel divide-y dark:divide-checkbox/30 overflow-x-hidden overflow-auto scrollbar">
              {filteredSourceIDs
                ?.slice(beginning - 1, end + 1)
                .map((nodeID: string) => {
                  const nodeObj = runSimulationImpact.data?.node_ids?.find(
                    (obj: { source: string }) => obj.source === nodeID
                  );
                  return (
                    <li key={nodeID} className="grid gap-5 pt-5">
                      <header className="flex items-center justify-between gap-32">
                        <article className="flex items-center gap-2 break-all">
                          <img
                            src={`/graph/nodes/${nodeObj?.integration_type?.toLowerCase()}/${nodeObj?.node_class?.toLowerCase()}.svg`}
                            alt={nodeObj?.node_class}
                            className="w-6 h-6"
                          />
                          <h4>{nodeID}</h4>
                        </article>
                        <section className="flex items-center gap-7 pr-4">
                          {["impact", "damage"].map((annotationType) => {
                            return (
                              <article
                                key={annotationType}
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() =>
                                  handleViewAnnotation(annotationType, nodeID)
                                }
                              >
                                <img
                                  src={`/simulation/${annotationType}.svg`}
                                  alt={annotationType}
                                  className="w-4 h-4"
                                />
                                <p>
                                  {selectedSimulationNodeObj?.source ===
                                    nodeID &&
                                  selectedSimulationAnnotationType ===
                                    annotationType
                                    ? "Hide"
                                    : "View"}{" "}
                                  {annotationType === "impact"
                                    ? "Impact"
                                    : "Possible Damages"}
                                </p>
                              </article>
                            );
                          })}
                        </section>
                      </header>
                      {selectedSimulationNodeObj?.source === nodeID && (
                        <section className="relative grid mx-6 h-[40rem] dark:bg-card black-shadow">
                          {[
                            getPossibleDamages.status,
                            getSimulationGraph.status,
                          ].includes("loading") && <Loader />}
                          <motion.section
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: 1,
                              transition: { duration: 0.5 },
                            }}
                          >
                            <section className="absolute top-5 px-6 flex items-center justify-between gap-5 w-full text-xs">
                              {scopes?.length > 0 && (
                                <nav className="grid gap-2 text-sm z-10">
                                  <h4 className="underlined-label">Scope</h4>
                                  {scopes.map((scope: string) => {
                                    return (
                                      <article
                                        key={scope}
                                        className="flex items-center gap-2 text-xs capitalize"
                                      >
                                        <input
                                          id="row"
                                          type="checkbox"
                                          checked={
                                            selectedSimulationScope === scope
                                          }
                                          className="form-checkbox w-4 h-4 border-0 dark:focus:ring-0 dark:text-checkbox dark:focus:border-checkbox focus:ring dark:focus:ring-offset-0 dark:focus:ring-checkbox focus:ring-opacity-50"
                                          onChange={() => {
                                            setSelectedSimulationScope(scope);
                                            handleViewImpactDamage(
                                              selectedSimulationAnnotationType,
                                              nodeObj,
                                              scope
                                            );
                                          }}
                                        />
                                        <h4>{scope?.replaceAll("_", " ")}</h4>
                                      </article>
                                    );
                                  })}
                                </nav>
                              )}
                              <nav className="flex items-center gap-5">
                                {getSimulationGraph.status === "success" && (
                                  <GraphSearchSummary
                                    searchSummary={
                                      getSimulationGraph.data?.metadata
                                    }
                                    nodes={nodes}
                                  />
                                )}
                                <GraphScreenshot
                                  curSnapshotTime={curSnapshotTime}
                                />
                              </nav>
                            </section>
                            {annotationStatus ? (
                              impactedIDs.length > 0 ? (
                                <section className="flex items-start justify-self-start w-full h-full">
                                  <ReactFlow
                                    onInit={(reactFlowInstance) =>
                                      onInit(
                                        store,
                                        nodes,
                                        setMinZoom,
                                        reactFlowInstance
                                      )
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
                                    zoomOnDoubleClick={false}
                                    selectNodesOnDrag={false}
                                    onNodeMouseEnter={(_event, node) =>
                                      highlightPath(
                                        node,
                                        nodes,
                                        edges,
                                        setNodes,
                                        setEdges
                                      )
                                    }
                                    onNodeMouseLeave={() =>
                                      resetNodeStyles(setNodes, setEdges)
                                    }
                                    onPaneClick={() =>
                                      setGraphInfo({
                                        ...graphInfo,
                                        showPanel: false,
                                      })
                                    }
                                    onNodeClick={(e, node) => {
                                      if (
                                        ![
                                          "malicious",
                                          "non-malicious",
                                        ].includes(node.id.toLowerCase())
                                      ) {
                                        setElementType("node");
                                        setSelectedNode({
                                          id: node["id"],
                                        });
                                        setSelectedEdge(undefined);
                                        setGraphInfo({
                                          ...graphInfo,
                                          showPanel: true,
                                        });
                                      }
                                    }}
                                    onEdgeClick={(e, edge) => {
                                      setElementType("edge");
                                      setSelectedNode(undefined);
                                      setSelectedEdge({
                                        id: edge["id"],
                                      });
                                      setGraphInfo({
                                        ...graphInfo,
                                        showPanel: true,
                                      });
                                    }}
                                  >
                                    <GraphControls
                                      nodes={nodes}
                                      setMinZoom={setMinZoom}
                                    />
                                  </ReactFlow>
                                  <AnimatePresence exitBeforeEnter>
                                    {graphInfo.showPanel && (
                                      <DetailPanel
                                        graphType={
                                          selectedSimulationAnnotationType
                                        }
                                        graphInfo={graphInfo}
                                        setGraphInfo={setGraphInfo}
                                        curSnapshotTime={curSnapshotTime}
                                        simulationAnnotation={
                                          simulationAnnotation
                                        }
                                      />
                                    )}
                                  </AnimatePresence>
                                </section>
                              ) : (
                                <NoResults />
                              )
                            ) : null}
                          </motion.section>
                        </section>
                      )}
                    </li>
                  );
                })}
            </ul>
          </section>
        ) : (
          <NoResults />
        )
      ) : null}
    </section>
  );
};

export default SimulationResult;
