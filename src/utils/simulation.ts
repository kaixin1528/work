import { ReactFlowInstance } from "reactflow";
import { getELKLayoutedMainElements, onInit } from "./graph";
import { Account } from "src/types/settings";

// render attack workflow for a simulation package
export const renderAttackWorkflow = (
  nodes: any,
  edges: any,
  setNodes: (nodes: any) => void,
  setEdges: (edges: any) => void,
  store: any,
  setMinZoom: (minZoom: number) => void,
  reactFlowInstance: ReactFlowInstance
) => {
  // for each react flow node, store important info in the data object
  const tempNodes = nodes.map((node: any) => {
    return {
      id: node.node_id,
      type: "ATTACK",
      data: {
        id: node.node_id,
      },
      position: {
        x: 0,
        y: 0,
      },
    };
  });

  // for each react flow edge, store important info in the data object
  const tempEdges = edges.map((edge: any) => {
    return {
      id: edge.edge_id,
      type: "straight",
      source: edge.source,
      target: edge.target,
      animated: false,
      markerEnd: {
        width: 40,
        height: 40,
        type: "arrowclosed",
      },
      data: {
        id: edge.edge_id,
      },
    };
  });

  // resets the nodes/edges positions according to directed graph layout
  getELKLayoutedMainElements(tempNodes, tempEdges, 500, 150, {
    "elk.direction": "DOWN",
    "elk.algorithm": "mrtree",
  }).then(({ nodes: layoutedNodes, edges: layoutedEdges }: any) => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    onInit(store, layoutedNodes, setMinZoom, reactFlowInstance);
  });
};

export const handleRunSimulationImpact = (
  setSelectedSimulationTab: (selectedSimulationTab: string) => void,
  runSimulationImpact: any,
  selectedSimulationAccount: Account | undefined,
  curSnapshotTime: number,
  selectedSimulationPackage: string
) => {
  setSelectedSimulationTab("Simulation Result");
  runSimulationImpact.mutate({
    integrationType: selectedSimulationAccount?.integration_type,
    integrationID: selectedSimulationAccount?.integration_id,
    snapshotTime: curSnapshotTime,
    packageType: selectedSimulationPackage,
    impactScope: "key_compromise",
  });
};
