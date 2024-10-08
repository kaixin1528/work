import { motion } from "framer-motion";
import React, { RefObject } from "react";
import { leftPanelVariants, rightPanelVariants } from "../constants/general";

const PanelLayout: React.FC<{
  showPanel: boolean;
  panelRef: RefObject<HTMLElement>;
  showLeft?: boolean;
  graph?: boolean;
}> = ({ showPanel, panelRef, showLeft, graph, children }) => {
  return (
    <motion.aside
      ref={panelRef}
      variants={showLeft ? leftPanelVariants : rightPanelVariants}
      initial="hidden"
      animate={showPanel ? "visible" : "hidden"}
      exit="hidden"
      className={`absolute inset-y-0 ${
        showLeft ? "left-0 pr-16" : "right-0 pl-16"
      }  flex flex-col flex-wrap px-10 pb-5 ${
        graph ? "w-4/5" : "w-2/5"
      } h-full dark:text-gray-200 dark:bg-panel shadow-lg dark:shadow-black z-50`}
    >
      {children}
    </motion.aside>
  );
};

export default PanelLayout;
