/* eslint-disable no-restricted-globals */
import { Handle, Position } from "reactflow";
import { motion } from "framer-motion";
import { GraphNodeData } from "../../../types/general";
import { memo } from "react";

const ATTACK = memo(({ data }: { data: GraphNodeData }) => {
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <section className="relative group grid min-h-full content-center w-96 text-center text-white gap-3 font-bold">
        <h4 className="p-4 text-2xl dark:text-white mx-auto dark:bg-event/10 border border-event">
          {data.id}
        </h4>
      </section>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </motion.section>
  );
});

export default ATTACK;
