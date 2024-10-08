/* eslint-disable no-restricted-globals */
import { Handle, Position } from "reactflow";
import { motion } from "framer-motion";
import { diffColors } from "../../../constants/graph";
import { GraphNodeData } from "../../../types/general";
import { useGraphStore } from "src/stores/graph";
import { memo } from "react";
import SideIcons from "./SideIcons";

const AGG = memo(({ data }: { data: GraphNodeData }) => {
  const { setSelectedPanelTab } = useGraphStore();

  const isHorizontal = data.isHorizontal;

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Handle
        type="target"
        position={isHorizontal ? Position.Left : Position.Top}
        style={{ opacity: 0 }}
      />
      <section className="relative group grid min-h-full content-center w-60 h-60 text-center text-white gap-3 font-bold">
        <article className="absolute -top-5 left-[7rem] py-2">
          {data.attributes?.length > 0 && (
            <span className="grid content-center px-5 py-2 text-2xl dark:bg-checkbox dark:hover:bg-checkbox/60 duration-100 rounded-full">
              {data.attributes[0].value}
            </span>
          )}
        </article>
        <SideIcons data={data} />
        {data.diffNode && (
          <svg
            width="223"
            height="207"
            viewBox="0 0 223 207"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute -bottom-3 -right-5"
          >
            <path
              opacity="0.3"
              d="M111.5 207C173.08 207 223 160.661 223 103.5C223 46.3384 173.08 0 111.5 0C49.9202 0 0 46.3384 0 103.5C0 160.661 49.9202 207 111.5 207Z"
              fill={diffColors[data.diffNode.action]}
            />
          </svg>
        )}
        <img
          src={`/graph/nodes/${data.integrationType?.toLowerCase()}/${data.nodeType?.toLowerCase()}.svg`}
          alt={data.nodeType}
          className="w-32 h-32 mx-auto regular"
          onClick={() => setSelectedPanelTab("Info")}
        />
        <h4 className="text-4xl dark:text-white mx-auto w-40 truncate">
          {data.id}
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

export default AGG;
