/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import EnforcementActions from "./EnforcementActions/EnforcementActions";
import { motion } from "framer-motion";
import { showVariants } from "src/constants/general";
import PageLayout from "src/layouts/PageLayout";
import { riskIntelligenceTabs } from "src/constants/grc";
import { useGRCStore } from "src/stores/grc";

const RiskIntelligence = () => {
  const { GRCCategory, setGRCCategory } = useGRCStore();

  useEffect(() => {
    sessionStorage.page = "Risk Intelligence";
    if (riskIntelligenceTabs.includes(sessionStorage.GRCCategory))
      setGRCCategory(sessionStorage.GRCCategory);
    else setGRCCategory("enforcement actions");
  }, []);

  return (
    <PageLayout>
      <motion.main
        variants={showVariants}
        initial="hidden"
        animate="visible"
        className="grid content-start gap-5 p-4 w-full h-full text-sm overflow-auto scrollbar"
      >
        <section className="flex flex-col flex-grow gap-5">
          <nav className="flex flex-wrap items-center gap-5 text-base">
            {riskIntelligenceTabs.map((tab) => {
              return (
                <button
                  key={tab}
                  className={`px-8 py-2 text-center capitalize border-b-2 ${
                    GRCCategory === tab
                      ? "dark:bg-signin/30 dark:border-signin"
                      : "dark:bg-filter/10 dark:hover:bg-filter/30 duration-100 dark:border-checkbox"
                  } rounded-full`}
                  onClick={() => setGRCCategory(tab)}
                >
                  {tab}
                </button>
              );
            })}
          </nav>
          {GRCCategory === "enforcement actions" && <EnforcementActions />}
        </section>
      </motion.main>
    </PageLayout>
  );
};

export default RiskIntelligence;
