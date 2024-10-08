/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import Header from "../components/Header/Header";
import Sidebar from "../components/General/Sidebar";
import { showVariants } from "../constants/general";
import { useGeneralStore } from "../stores/general";
import { useHotkeys } from "react-hotkeys-hook";
import { downloadScreenshot, parseURL } from "src/utils/general";
import ReturnPage from "src/components/Button/ReturnPage";
import { GetSnapshotsAvailable } from "src/services/graph/snapshots";

const GraphLayout: React.FC<{
  integrationType: string;
  graphType: string;
}> = ({ integrationType, graphType, children }) => {
  const parsed = parseURL();

  const { env, openSidebar, setError } = useGeneralStore();

  const { data: snapshotAvailable } = GetSnapshotsAvailable(
    env,
    integrationType,
    graphType
  );

  useHotkeys("shift+d", downloadScreenshot);

  useEffect(() => {
    setError({ url: "", message: "" });
  }, []);

  return (
    <section className="relative flex flex-grow flex-col w-screen h-screen dark:text-white dark:bg-main overflow-x-hidden overflow-y-auto scrollbar">
      <Header />
      <section className="flex flex-grow w-full h-full overflow-auto scrollbar">
        <Sidebar />
        <span className={`${openSidebar ? "w-[4rem]" : "w-0"}`}></span>
        {snapshotAvailable ? (
          snapshotAvailable.earliest_snapshot !== -1 ? (
            <motion.main
              variants={showVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col flex-grow w-full h-full shadow-2xl dark:shadow-expand z-10"
            >
              {children}
            </motion.main>
          ) : (
            <section className="grid px-6 w-full h-full">
              {parsed.section && <ReturnPage />}
              <img
                src="/general/landing/graph-holding.svg"
                alt="graph holding"
                className="w-3/5 h-full mx-auto p-10"
              />
              <p className="-mt-5 text-xl dark:text-white mx-auto">
                Configuration is still in progress......
              </p>
            </section>
          )
        ) : null}
      </section>
    </section>
  );
};

export default GraphLayout;
