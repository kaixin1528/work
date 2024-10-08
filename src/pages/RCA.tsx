import { motion } from "framer-motion";
import { showVariants } from "../constants/general";
import PageLayout from "../layouts/PageLayout";

const RCA: React.FC = () => {
  return (
    <PageLayout>
      <motion.main
        variants={showVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-10 pl-10 px-20 py-20 w-full h-full dark:text-white font-light z-10 shadow-2xl dark:shadow-expand"
      >
        <section className="grid grid-cols-2 gap-16 items-center">
          <img
            src="/general/landing/rca-holding.svg"
            alt="rca"
            className=" w-full h-96"
          />
          <article className="grid gap-5">
            <h2 className="text-4xl">A security analyst, not a tool for one</h2>
            <p className="text-sm leading-6">
              What pathways and probabilities are more likely and what could be
              the underlying reason for a given threat or attack in progress, is
              exactly where the best security analysts and experts thrive. There
              aren’t many of such outstanding experts! Complexity of the cloud
              with massive amounts of dynamic systems and large amounts of
              east-west traffic and data flow, it’s even hard for an expert to
              always be on top. Uno’s intelligent system reasons and surfaces
              possible root cause.
            </p>
          </article>
        </section>
        <section className="flex justify-evenly text-lg">
          <p>Reason through Possibilities</p>
          <p>Cut the Complexity</p>
          <p>Understand Data Traffic</p>
          <p>Analyze at Scale</p>
        </section>
      </motion.main>
    </PageLayout>
  );
};

export default RCA;
