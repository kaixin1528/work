import { motion } from "framer-motion";
import { showVariants } from "../constants/general";
import PageLayout from "../layouts/PageLayout";

const Recommendation: React.FC = () => {
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
            src="/general/landing/recommendation-holding.svg"
            alt="recommendation"
            className=" w-full h-96"
          />
          <article className="grid gap-5">
            <h2 className="text-4xl">
              Before autonomous control, there is a stage of decision assistance
            </h2>
            <p className="text-sm leading-6">
              Same as driver assist and intelligent controls precede a fully
              autonomous and driverless vehicle, Uno’s recommendation system
              could be thought of as an expert system assists in effective
              decision making. Reducing errors and making reliable decision
              making repeatable and regular, Uno is targeting to reduce the
              stress and cognitive overload that security teams are struggling
              with globally.
            </p>
          </article>
        </section>
        <section className="flex justify-evenly text-lg">
          <p>Repeatable Effective Decisions</p>
          <p>Avoid Mistakes</p>
          <p>On Top of Things at Scale</p>
          <p>Simplify</p>
        </section>
      </motion.main>
    </PageLayout>
  );
};

export default Recommendation;
