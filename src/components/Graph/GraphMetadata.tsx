/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from "framer-motion";
import React from "react";
import ReactJson from "react-json-view";
import { showVariants } from "src/constants/general";

const GraphMetadata = ({ searchSummary }: { searchSummary: any }) => {
  return (
    <motion.section
      variants={showVariants}
      className="grid gap-5 px-10 my-10 overflow-auto scrollbar"
    >
      <ReactJson
        src={searchSummary?.grouped_nodes}
        name={null}
        quotesOnKeys={false}
        displayDataTypes={false}
        theme="ashes"
      />
    </motion.section>
  );
};

export default GraphMetadata;
