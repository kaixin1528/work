import { getBezierPath } from "reactflow";

const FirewallEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
}: any) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const stroke = data.isEgress ? "#B8060C" : "#22B573";

  return (
    <>
      <defs>
        {["gray", "black", "red"].map((color) => (
          <marker
            id={`${color}-end`}
            key={color}
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
        style={{
          ...style,
          stroke: stroke,
          strokeWidth: 15,
        }}
        className="react-flow__edge-path cursor-pointer"
        d={edgePath}
        markerStart={`url(#gray-start)`}
        markerEnd={`url(#gray-end)`}
      />
    </>
  );
};

export default FirewallEdge;
