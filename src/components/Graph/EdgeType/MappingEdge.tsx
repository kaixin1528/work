import { useCallback } from "react";
import { useStore, getBezierPath } from "reactflow";
import { getEdgeParams } from "src/utils/grc";

const MappingEdge = ({ id, source, target, markerEnd, style }: any) => {
  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(source), [source])
  );
  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(target), [target])
  );

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode
  );

  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  return (
    <>
      <defs>
        {["#7894B0"].map((color) => (
          <marker
            id={`${color}-end`}
            key="#7894B0"
            markerWidth="5"
            markerHeight="7"
            viewBox="-10 -10 20 20"
            markerUnits="strokeWidth"
            orient="auto"
            refX="0"
            refY="0"
          >
            <polyline
              fill="#7894B0"
              points="-10,-5 6,0 -10,5 -15,-5"
            ></polyline>
          </marker>
        ))}
      </defs>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: 8,
          stroke: "#7894B0",
        }}
      />
    </>
  );
};

export default MappingEdge;
