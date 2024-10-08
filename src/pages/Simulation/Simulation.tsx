/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from "framer-motion";
import { useEffect } from "react";
import { showVariants } from "../../constants/general";
import SimulationSettings from "./SimulationSettings/SimulationSettings";
import PageLayout from "src/layouts/PageLayout";
import PackageRemedies from "./PackageRemedies";
import PackageInfo from "./PackageInfo";
import { simulationTabs } from "src/constants/simulation";
import SimulationResult from "./SimulationResult";
import AttackWorkflow from "./AttackWorkflow";
import { useSimulationStore } from "src/stores/simulation";
import { RunSimulationImpact } from "src/services/simulation";

const Simulation: React.FC = () => {
  const {
    selectedSimulationPackage,
    selectedSimulationTab,
    setSelectedSimulationTab,
  } = useSimulationStore();

  const runSimulationImpact = RunSimulationImpact();

  useEffect(() => {
    sessionStorage.page = "Simulation";
  }, []);

  return (
    <PageLayout>
      <motion.main
        variants={showVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col flex-grow w-full h-full shadow-2xl dark:shadow-expand overflow-auto scrollbar z-10"
      >
        <section className="relative grid md:flex flex-grow gap-5 m-4 h-full overflow-auto scrollbar">
          <SimulationSettings runSimulationImpact={runSimulationImpact} />

          <section className="flex flex-col flex-grow gap-5 w-full h-full dark:bg-card black-shadow overflow-auto scrollbar">
            <header className="flex items-start justify-between gap-10 w-full">
              <h2 className="px-6 py-2 capitalize text-xl">
                {selectedSimulationPackage.replaceAll("_", " ")} Simulation
              </h2>
              <nav className="flex flex-wrap items-center gap-5">
                {simulationTabs.map((tab: string) => {
                  return (
                    <button
                      key={tab}
                      className={`py-3 px-5 cursor-pointer text-sm ${
                        selectedSimulationTab === tab
                          ? "full-underlined-label"
                          : "hover:border-b dark:hover:border-signin"
                      }`}
                      onClick={() => setSelectedSimulationTab(tab)}
                    >
                      <p className="w-max">{tab}</p>
                    </button>
                  );
                })}
              </nav>
            </header>

            {selectedSimulationTab === "Package Info" && <PackageInfo />}
            {selectedSimulationTab === "Attack Workflow" && <AttackWorkflow />}
            {selectedSimulationTab === "Simulation Result" && (
              <SimulationResult runSimulationImpact={runSimulationImpact} />
            )}
            {selectedSimulationTab === "Package Remedies" && (
              <PackageRemedies />
            )}
          </section>
        </section>
      </motion.main>
    </PageLayout>
  );
};

export default Simulation;
