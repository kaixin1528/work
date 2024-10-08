/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { Handle, Position } from "reactflow";
import { motion } from "framer-motion";
import { diffColors } from "../../../constants/graph";
import { GraphNodeData } from "../../../types/general";
import SideIcons from "./SideIcons";
import { useGraphStore } from "src/stores/graph";
import { memo } from "react";
import { faSkullCrossbones } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NON_AGG = memo(({ data }: { data: GraphNodeData }) => {
  const { setSelectedPanelTab } = useGraphStore();

  const annotation =
    data.simulationAnnotation?.annotation ||
    data.graphAnnotation?.annotation ||
    "";
  const color = annotation.toLowerCase() || data.isSearched;
  const isHorizontal = data.isHorizontal;

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Handle
        type="target"
        position={isHorizontal ? Position.Left : Position.Top}
        style={{ opacity: 0 }}
      />
      <section
        className={`${
          data.impacted ? "wrapper gradient" : ""
        } relative group grid min-h-full content-center w-60 h-60 text-center text-white gap-3 font-bold`}
      >
        <SideIcons data={data} />
        {data.diffNode && (
          <svg
            width="243"
            height="224"
            viewBox="0 0 243 224"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute bottom-8 -right-0"
          >
            <path
              opacity="0.3"
              d="M121.5 224C188.603 224 243 173.856 243 112C243 50.144 188.603 0 121.5 0C54.3974 0 0 50.144 0 112C0 173.856 54.3974 224 121.5 224Z"
              fill={diffColors[data.diffNode.action]}
            />
          </svg>
        )}
        {annotation === "malicious" && (
          <FontAwesomeIcon
            icon={faSkullCrossbones}
            className="absolute -right-[22rem] w-60 h-60 text-high"
          />
        )}
        <img
          src={`/graph/nodes/${data.integrationType?.toLowerCase()}/${data.nodeType?.toLowerCase()}.svg`}
          alt={data.nodeType}
          className={`w-32 h-32 mx-auto ${
            data.impacted ? "animate-pulse" : ""
          } ${color}`}
          onClick={() => {
            switch (data.simulationAnnotation?.annotation_type) {
              case "impact":
                setSelectedPanelTab("Impact");
                break;
              case "damage":
                setSelectedPanelTab("Damages");
                break;
              default:
                setSelectedPanelTab("Info");
            }
          }}
        />
        <h4 className="text-4xl mx-auto w-36 truncate group-hover:w-full group-hover:break-all">
          {["CUSTOMERCLD"].includes(String(data.nodeType))
            ? data.nodeTypeName
            : data.id}
        </h4>
      </section>
      <Handle
        type="source"
        position={isHorizontal ? Position.Right : Position.Bottom}
        style={{ opacity: 0 }}
      />
    </motion.section>
  );
});

export default NON_AGG;
