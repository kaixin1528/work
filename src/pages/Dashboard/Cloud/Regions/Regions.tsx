/* eslint-disable no-restricted-globals */
import { motion, AnimatePresence } from "framer-motion";
import RegionMap from "./RegionMap";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import ReturnPage from "../../../../components/Button/ReturnPage";
import PageLayout from "../../../../layouts/PageLayout";
import { showVariants } from "../../../../constants/general";
import { parseURL } from "../../../../utils/general";
import { useGraphStore } from "src/stores/graph";

import DetailPanel from "src/components/Graph/DetailPanel/DetailPanel";

const Regions = () => {
  const parsed = parseURL();

  const { graphInfo, setGraphInfo } = useGraphStore();

  return (
    <PageLayout>
      <motion.main
        variants={showVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col flex-grow h-full w-full overflow-auto scrollbar shadow-2xl dark:shadow-expand z-10"
      >
        <header className="flex px-4 gap-5 items-center dark:text-checkbox">
          <ReturnPage />
          <article className="flex items-center gap-5 mr-5 dark:text-white">
            <img
              src={`/general/integrations/${parsed.integration}.svg`}
              alt={String(parsed.integration)}
              className="w-10 h-10"
            />
            <h4 className="w-max">Regions</h4>
          </article>
        </header>
        <section className="relative flex m-4 flex-grow dark:bg-card black-shadow">
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
            className="grid grid-cols-1 w-full h-full"
          >
            <ParentSize>
              {({ width, height }) => (
                <RegionMap
                  integration={String(parsed.integration)}
                  width={width}
                  height={height}
                />
              )}
            </ParentSize>
          </motion.section>
        </section>
        <AnimatePresence exitBeforeEnter>
          {graphInfo.showPanel && (
            <DetailPanel
              graphType="region"
              graphInfo={graphInfo}
              setGraphInfo={setGraphInfo}
            />
          )}
        </AnimatePresence>
      </motion.main>
    </PageLayout>
  );
};

export default Regions;
