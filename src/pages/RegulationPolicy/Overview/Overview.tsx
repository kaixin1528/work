import { motion } from "framer-motion";
import React, { useState } from "react";
import { showVariants } from "src/constants/general";
import Coverage from "./Coverage/Coverage";
import Activities from "./Activities/Activities";
// import Scorecard from "./Scorecard";

const Overview = () => {
  const [selectedTab, setSelectedTab] = useState<string>("coverage");

  return (
    <motion.main
      variants={showVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col flex-grow content-start gap-5 w-full h-full overflow-x-hidden overflow-auto scrollbar"
    >
      <nav className="flex flex-wrap items-center">
        {["coverage", "activities"].map((tab) => {
          return (
            <button
              key={tab}
              className={`px-8 py-2 text-center capitalize border-b-2 ${
                selectedTab === tab
                  ? "dark:text-white dark:border-signin"
                  : "dark:text-checkbox dark:hover:text-white dark:border-checkbox"
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          );
        })}
      </nav>

      {selectedTab === "coverage" ? <Coverage /> : <Activities />}
    </motion.main>
  );
};

export default Overview;
