import { motion } from "framer-motion";
import { showVariants } from "../constants/general";
import PageLayout from "../layouts/PageLayout";

const Inference: React.FC = () => {
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
            src="/general/landing/inference-holding.svg"
            alt="inference"
            className=" w-full h-96"
          />
          <article className="grid gap-5">
            <h2 className="text-4xl">Understand, with context</h2>
            <p className="text-sm leading-6">
              Security vulnerabilities and threats are often very difficult to
              map and classify. Sure, you could scan items and discover
              misconfigurations. However, seldom, if ever, these relate directly
              to how attacks unfold and breaches take place. It’s often
              important to understand the context within which these
              vulnerabilities and threats reside and how these are exploitable.
              Uno’s mission is to build an autonomous security platform and
              effective inference is a foundational building block in making
              that happen.
            </p>
          </article>
        </section>
        <section className="flex justify-evenly text-lg">
          <p>Effective</p>
          <p>Timely</p>
          <p>System is an Analyst</p>
          <p>Continuously Learns</p>
        </section>
      </motion.main>
    </PageLayout>
  );
};

export default Inference;
