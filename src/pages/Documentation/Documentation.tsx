/* eslint-disable no-restricted-globals */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { documentationTabs, showVariants } from "../../constants/general";
import Videos from "./Videos";
import KnowledgeBase from "./KnowledgeBase";
import Feedback from "./Feedback";
import PageLayout from "../../layouts/PageLayout";
import { parseURL } from "../../utils/general";

const Documentation = () => {
  const navigate = useNavigate();
  const parsed = parseURL();

  return (
    <PageLayout>
      <motion.main
        variants={showVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col flex-grow content-start w-full h-full z-10 shadow-2xl dark:shadow-expand overflow-auto scrollbar"
      >
        <section className="relative flex flex-grow m-4 dark:bg-card black-shadow">
          {/* documentation navigation */}
          <nav className="grid gap-6 p-6 pr-10 content-start text-sm bg-gradient-to-b dark:from-tooltip dark:to-tooltip/0">
            {documentationTabs.map((nav, index) => {
              return (
                <button
                  key={index}
                  className={`w-max text-left tracking-wide uppercase ${
                    parsed.section === nav
                      ? "w-max dark:text-white border-b-2 dark:border-signin"
                      : "dark:text-settings-nav"
                  }`}
                  onClick={() =>
                    navigate(`/documentation/details?section=${nav}`)
                  }
                >
                  {nav}
                </button>
              );
            })}
          </nav>

          {/* knowledge base page */}
          {parsed.section?.includes("keyboard") && <KnowledgeBase />}

          {/* videos page */}
          {parsed.section === "videos" && <Videos />}

          {/* feedback page */}
          {parsed.section === "feedback" && <Feedback />}
        </section>
      </motion.main>
    </PageLayout>
  );
};

export default Documentation;
