/* eslint-disable no-restricted-globals */
import { Handle, Position } from "reactflow";
import { motion } from "framer-motion";
import { GraphNodeData } from "../../../types/general";
import { memo } from "react";
import SideIcons from "./SideIcons";

const CPM = memo(({ data }: { data: GraphNodeData }) => {
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <section className="relative group grid min-h-full content-center w-44 h-48 text-center text-white gap-3 font-bold">
        <SideIcons data={data} />
        <img
          src={`/graph/nodes/${data.integrationType?.toLowerCase()}/${data.nodeType?.toLowerCase()}.svg`}
          alt={data.nodeType}
          className="w-24 h-24 mx-auto"
        />
        <h4 className="text-4xl mx-auto w-36 truncate group-hover:w-full group-hover:break-all">
          {data.id}
        </h4>
      </section>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </motion.section>
  );
});

export default CPM;
