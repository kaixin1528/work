/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { useState } from "react";
import New from "./New";
import Suspicious from "./Suspicious";
import What from "./What";
import When from "./When";
import Where from "./Where";
import Who from "./Who";
import { rollUp } from "../../../../constants/dashboard";
import ReturnPage from "../../../../components/Button/ReturnPage";
import PageLayout from "../../../../layouts/PageLayout";
import { motion } from "framer-motion";
import { showVariants } from "../../../../constants/general";
import { parseURL } from "../../../../utils/general";

const Activity = () => {
  const parsed = parseURL();

  const [time, setTime] = useState<string>("weekly");

  return (
    <PageLayout>
      <motion.main
        variants={showVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col flex-grow h-full w-full overflow-auto scrollbar z-10 shadow-2xl dark:shadow-expand"
      >
        <header className="flex px-4 gap-5 items-center dark:text-checkbox">
          <ReturnPage />
          <article className="flex items-center gap-5 mr-8 dark:text-white">
            <img
              src={`/general/integrations/${parsed.integration}.svg`}
              alt={String(parsed.integration)}
              className="hidden sm:block w-10 h-10"
            />
            <h4 className="hidden sm:block text-sm">Activity</h4>
            <nav className="flex ml-5 text-xs dark:text-white dark:bg-filter">
              {Object.keys(rollUp).map((bucket) => {
                return (
                  <button
                    key={bucket}
                    className={`px-4 py-1 font-semibold  ${
                      time === bucket
                        ? "bg-gradient-to-b dark:from-main dark:to-checkbox dark:text-white"
                        : "dark:text-expand dark:hover:text-white dark:bg-filter hover:bg-gradient-to-b dark:hover:from-filter dark:hover:to-checkbox duration-500"
                    }`}
                    onClick={() => {
                      setTime(bucket);
                    }}
                  >
                    {bucket}
                  </button>
                );
              })}
            </nav>
          </article>
        </header>
        <section className="relative m-4 flex flex-grow gap-5 p-4 dark:bg-card black-shadow">
          <section className="grid grid-cols-2 gap-x-10 gap-y-2 content-start w-full">
            <Suspicious />
            <New />
            <Who />
            <What />
            <When time={time} />
            <Where />
          </section>
        </section>
      </motion.main>
    </PageLayout>
  );
};

export default Activity;
