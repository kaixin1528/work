/* eslint-disable no-restricted-globals */
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getBezierPath } from "reactflow";
import { diffColors } from "../../../constants/graph";
import { useGraphStore } from "src/stores/graph";

const foreignObjectSize = 40;

const MainEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerStart,
  markerEnd,
}: any) => {
  const xEqual = sourceX === targetX;
  const yEqual = sourceY === targetY;

  const [edgePath, edgeLabelX, edgeLabelY] = getBezierPath({
    sourceX: xEqual ? sourceX + 0.0001 : sourceX,
    sourceY: yEqual ? sourceY + 0.0001 : sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const {
    setElementType,
    setSelectedEdge,
    setSelectedNode,
    graphInfo,
    setGraphInfo,
    setSelectedPanelTab,
  } = useGraphStore();

  const diffAction = data.diffEdge?.action || "";
  const color = data.impacted
    ? `url(#edge-gradient)`
    : diffColors[diffAction.toLowerCase()] || "#7894B0";

  return (
    <>
      <defs>
        <linearGradient id="edge-gradient">
          <stop offset="0%" stopColor="#ae53ba" />
          <stop offset="100%" stopColor="#2a8af6" />
        </linearGradient>

        <marker
          id="edge-circle"
          viewBox="-5 -5 10 10"
          refX="0"
          refY="0"
          markerUnits="strokeWidth"
          markerWidth="10"
          markerHeight="10"
          orient="auto"
        >
          <circle stroke="#2a8af6" strokeOpacity="0.75" r="2" cx="0" cy="0" />
        </marker>
      </defs>
      <path
        id={id}
        style={{
          ...style,
          stroke: color,
          strokeOpacity: 1,
          strokeWidth: data.impacted ? 30 : 4,
          strokeDasharray: data.impacted ? 30 : 0,
          strokeDashoffset: 0,
        }}
        className="react-flow__edge-path cursor-pointer"
        d={edgePath}
        markerStart={markerStart}
        markerEnd={markerEnd}
      />
      <path
        className="react-flow__edge-path cursor-pointer"
        style={{ ...style, strokeWidth: 40, stroke: "initial" }}
        d={edgePath}
        onClick={() => setSelectedPanelTab("Info")}
      />

      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={edgeLabelX - foreignObjectSize / 2}
        y={edgeLabelY - foreignObjectSize / 2}
        className="edgebutton-foreignobject cursor-pointer"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        {data.comments?.length > 0 && (
          <button
            className="grid content-center py-2 px-[0.6rem] dark:text-green-500 dark:hover:text-green-300 duration-100"
            onClick={() => {
              setElementType("edge");
              setSelectedEdge({
                id: data.id,
              });
              setSelectedNode(undefined);
              setGraphInfo({ ...graphInfo, showPanel: true });
              setSelectedPanelTab("Notes");
            }}
          >
            <FontAwesomeIcon icon={faComment} className="w-7 h-7" />
          </button>
        )}
      </foreignObject>
    </>
  );
};

export default MainEdge;
