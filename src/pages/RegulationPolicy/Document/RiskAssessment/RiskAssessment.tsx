import { motion } from "framer-motion";
import React, { useState } from "react";
import ReturnPage from "src/components/Button/ReturnPage";
import { showVariants } from "src/constants/general";
import PageLayout from "src/layouts/PageLayout";
import { parseURL } from "src/utils/general";
import Coverage from "./Coverage";
import SelectFrameworkFilter from "src/components/Filter/RegulationPolicy/SelectFrameworkFilter";
import { GetFrameworks } from "src/services/regulation-policy/framework";
import { KeyStringVal } from "src/types/general";

const RiskAssessment = () => {
  const parsed = parseURL();

  const [selectedFramework, setSelectedFramework] = useState<KeyStringVal>({
    id: "",
    name: "",
  });

  const { data: frameworks } = GetFrameworks();

  return (
    <PageLayout>
      <motion.main
        variants={showVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col flex-grow content-start gap-3 p-4 w-full h-full shadow-2xl dark:shadow-card overflow-y-auto scrollbar"
      >
        <header className="flex items-center gap-5">
          <ReturnPage />
          <h4 className="text-xl">
            Policy Drift Risk Assessment - {parsed.policy_name}
          </h4>
        </header>
        <SelectFrameworkFilter
          label="Framework"
          selectedFramework={selectedFramework}
          setSelectedFramework={setSelectedFramework}
          list={frameworks?.data}
          width="w-[30rem]"
        />
        <section className="grid md:grid-cols-2 gap-10">
          <Coverage selectedFramework={selectedFramework} />
          <Coverage selectedFramework={selectedFramework} />
        </section>
      </motion.main>
    </PageLayout>
  );
};

export default RiskAssessment;
