import { ReactFlowInstance } from "reactflow";
import { OriginalFirewallNode } from "../types/dashboard";
import { onInit } from "./graph";
import ELK from "elkjs/lib/elk.bundled.js";

// resets the nodes/edges positions according to directed graph layout
export const getELKLayoutedFirewallElements = async (
  nodes: any,
  edges: any,
  width: number,
  height: number,
  options = {}
) => {
  const elk = new ELK();

  const isHorizontal = options?.["elk.direction"] === "RIGHT";
  const graph = {
    id: "root",
    layoutOptions: options,
    children: nodes.map((node: any) => ({
      ...node,
      // Adjust the target and source handle positions based on the layout
      // direction.
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",

      // Hardcode a width and height for elk to use when layouting.
      width: width,
      height: height,
    })),
    edges: edges,
  };

  try {
    const layoutedGraph = await elk.layout(graph);
    return {
      nodes: layoutedGraph.children?.map((node_1: any) => ({
        ...node_1,
        // React Flow expects a position property on the node instead of `x`
        // and `y` fields.
        position: {
          x:
            (node_1.data.searchHasIngress === false &&
              node_1.data.level === 2) ||
            node_1.data.level === 1
              ? node_1.x
              : node_1.data.level === 2
              ? width
              : ((node_1.data.searchHasEgress === false &&
                  node_1.data.level === 2) ||
                  node_1.data.level === 3) &&
                node_1.x * 2,
          y: node_1.y,
        },
      })),
      edges: layoutedGraph.edges,
    };
  } catch (message) {
    throw new Error(String(message));
  }
};

// resets the nodes/edges positions according to directed graph layout
export const getELKLayoutedCPMElements = async (
  nodes: any,
  edges: any,
  width: number,
  height: number,
  options = {}
) => {
  const elk = new ELK();

  const isHorizontal = options?.["elk.direction"] === "RIGHT";
  const graph = {
    id: "root",
    layoutOptions: options,
    children: nodes.map((node: any) => ({
      ...node,
      // Adjust the target and source handle positions based on the layout
      // direction.
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",

      // Hardcode a width and height for elk to use when layouting.
      width: width,
      height: height,
    })),
    edges: edges,
  };

  try {
    const layoutedGraph = await elk.layout(graph);
    return {
      nodes: layoutedGraph.children?.map((node_1: any) => ({
        ...node_1,
        // React Flow expects a position property on the node instead of `x`
        // and `y` fields.
        position: {
          x: node_1.x,
          y: node_1.y,
        },
      })),
      edges: layoutedGraph.edges,
    };
  } catch (message) {
    throw new Error(String(message));
  }
};

// creates a list of react flow nodes and edges
// based on the original list of nodes/edges fetched from the API
export const renderFirewallGraph = (
  nodes: any,
  edges: any,
  setNodes: (nodes: any) => void,
  setEdges: (edges: any) => void,
  searchResults: any,
  store: any,
  setMinZoom: (minZoom: number) => void,
  reactFlowInstance: ReactFlowInstance
) => {
  // for each react flow node, store important info in the data object
  const tempNodes = nodes.map((node: any) => {
    return {
      id: node.node_id || "",
      integrationType: node.integration_type,
      type: "FIREWALL",
      nodeType: node.node_type,
      nodeTypeName: node.type,
      data: {
        id: node.node_id || "",
        integrationType: node.integration_type,
        type: "FIREWALL",
        nodeType: node.node_type,
        nodeTypeName: node.type,
        isEgress: node.is_egress,
        level: node.levels,
        searchHasIngress: searchResults?.qualifying_nodes.some(
          (node: OriginalFirewallNode) =>
            node.node_type === "EffectiveIP" && !node.is_egress
        ),
        searchHasEgress: searchResults?.qualifying_nodes.some(
          (node: OriginalFirewallNode) =>
            node.node_type === "EffectiveIP" && node.is_egress
        ),
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
      id: edge.edge_id || "",
      integrationType: edge.integration_type,
      type: edge.edge_type,
      source: edge.source,
      target: edge.target,
      animated: false,
      data: {
        id: edge.edge_id || "",
        integrationType: edge.integration_type,
        type: edge.edge_type,
        isEgress: edge.is_egress,
      },
    };
  });

  // resets the nodes/edges positions according to directed graph layout
  getELKLayoutedFirewallElements(tempNodes, tempEdges, 7000, 150, {
    "elk.direction": "RIGHT",
    "elk.algorithm": "layered",
    // "elk.spacing.nodeNode": "0",
  }).then(({ nodes: layoutedNodes, edges: layoutedEdges }: any) => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    onInit(store, layoutedNodes, setMinZoom, reactFlowInstance);
  });
};

// creates a list of react flow nodes and edges
// based on the original list of nodes/edges fetched from the API
export const renderCPMGraph = (
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
      id: node.node_id || "",
      integrationType: node.integration_type,
      type: "CPM",
      nodeType: node.node_type,
      nodeTypeName: node.type,
      data: {
        id: node.node_id || "",
        integrationType: node.integration_type,
        type: "CPM",
        nodeType: node.node_type,
        nodeTypeName: node.type,
        level: node.levels,
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
      id: edge.edge_id || "",
      integrationType: edge.integration_type,
      type: "cpm",
      source: edge.source,
      target: edge.target,
      animated: false,
      data: {
        id: edge.edge_id || "",
        integrationType: edge.integration_type,
        type: "cpm",
      },
    };
  });

  // resets the nodes/edges positions according to directed graph layout
  getELKLayoutedCPMElements(tempNodes, tempEdges, 7000, 150, {
    "elk.direction": "RIGHT",
    "elk.algorithm": "layered",
  }).then(({ nodes: layoutedNodes, edges: layoutedEdges }: any) => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    onInit(store, layoutedNodes, setMinZoom, reactFlowInstance);
  });
};
