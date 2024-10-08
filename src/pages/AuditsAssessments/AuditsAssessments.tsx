/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { showVariants } from "src/constants/general";
import PageLayout from "src/layouts/PageLayout";
import InternalAudit from "./InternalAudit/InternalAudit";
import Questionnaire from "./Questionnaire/Questionnaire";
import { useGRCStore } from "src/stores/grc";
import { auditAssessmentTabs } from "src/constants/grc";

const AuditsAssessments = () => {
  const { GRCCategory, setGRCCategory } = useGRCStore();

  useEffect(() => {
    sessionStorage.page = "Audits & Assessments";
    if (auditAssessmentTabs.includes(sessionStorage.GRCCategory))
      setGRCCategory(sessionStorage.GRCCategory);
    else setGRCCategory("internal audit");
  }, []);

  return (
    <PageLayout>
      <motion.main
        variants={showVariants}
        initial="hidden"
        animate="visible"
        className="grid content-start gap-5 p-4 w-full h-full overflow-auto scrollbar"
      >
        <nav className="flex flex-wrap items-center gap-5 text-base">
          {auditAssessmentTabs.map((tab) => {
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
        {GRCCategory === "internal audit" ? (
          <InternalAudit />
        ) : (
          <Questionnaire />
        )}
      </motion.main>
    </PageLayout>
  );
};

export default AuditsAssessments;
