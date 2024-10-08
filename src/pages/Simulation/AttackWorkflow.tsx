/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ReactFlow, {
  useEdgesState,
  useNodesState,
  useReactFlow,
  useStoreApi,
} from "reactflow";
import Loader from "src/components/Loader/Loader";
import NoResults from "src/components/General/NoResults";
import { nodeTypes } from "src/constants/general";
import {
  GetSimulationAttackWorkflow,
  GetSimulationPackageInfo,
} from "src/services/simulation";
import { useSimulationStore } from "src/stores/simulation";
import { renderAttackWorkflow } from "src/utils/simulation";

const AttackWorkflow = () => {
  const { selectedSimulationPackage } = useSimulationStore();

  const store = useStoreApi();
  const reactFlowInstance = useReactFlow();

  const [selectedScope, setSelectedScope] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [minZoom, setMinZoom] = useState<number>(0);

  const { data: getPackageInfo, status: getPackageInfoStatus } =
    GetSimulationPackageInfo(selectedSimulationPackage);

  const scopes = getPackageInfo
    ? ([
        ...new Set(
          Object.keys(getPackageInfo.damage)?.reduce(
            (pV: string[], cV: string) => [...pV, cV],
            []
          )
        ),
      ] as string[])
    : [];

  const { data: attackWorkflow, status: attackWorkflowStatus } =
    GetSimulationAttackWorkflow(selectedSimulationPackage, selectedScope);

  useEffect(() => {
    if (scopes && selectedScope === "") setSelectedScope(scopes[0]);
  }, [scopes]);

  useEffect(() => {
    if (attackWorkflow) {
      renderAttackWorkflow(
        attackWorkflow.nodes,
        attackWorkflow.edges,
        setNodes,
        setEdges,
        store,
        setMinZoom,
        reactFlowInstance
      );
    }
  }, [attackWorkflow, minZoom]);

  return (
    <section className="relative grid gap-5 w-full h-full text-sm overflow-auto scrollbar">
      {scopes?.length > 0 && (
        <nav className="absolute top-5 left-5 grid gap-2 p-2 text-sm dark:bg-tooltip z-10">
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
                  checked={selectedScope === scope}
                  className="form-checkbox w-4 h-4 border-0 dark:focus:ring-0 dark:text-checkbox dark:focus:border-checkbox focus:ring dark:focus:ring-offset-0 dark:focus:ring-checkbox focus:ring-opacity-50"
                  onChange={() => setSelectedScope(scope)}
                />
                <h4>{scope?.replaceAll("_", " ")}</h4>
              </article>
            );
          })}
        </nav>
      )}
      {attackWorkflowStatus === "success" ? (
        nodes.length > 0 ? (
          <ReactFlow
            fitView
            minZoom={minZoom}
            maxZoom={1}
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            panOnDrag={true}
            panOnScroll={true}
            zoomOnScroll={true}
            zoomOnDoubleClick={false}
            selectNodesOnDrag={false}
          />
        ) : (
          <NoResults />
        )
      ) : [getPackageInfoStatus, attackWorkflowStatus].includes("loading") ? (
        <Loader />
      ) : (
        <img
          src="/simulation/simulation-graph-placeholder.svg"
          alt="simulated graph placeholder"
          className="absolute top-1/3 left-1/2 -translate-x-1/2 px-10 w-[40rem]"
        />
      )}
    </section>
  );
};

export default AttackWorkflow;
