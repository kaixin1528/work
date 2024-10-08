import { motion } from "framer-motion";
import { showVariants } from "../constants/general";
import PageLayout from "../layouts/PageLayout";
import React from "react";

const Detection: React.FC = () => {
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
            src="/general/landing/detection-holding.svg"
            alt="detection"
            className=" w-full h-96"
          />
          <article className="grid gap-5">
            <h2 className="text-4xl">
              Malicious activity is not always anomalous
            </h2>
            <p className="text-sm leading-6">
              There is a big misunderstanding among researchers and
              practitioners that detection is either about looking for rule
              based triggers when thresholds are crossed or using machine
              learning to ascertain anomalies. Alerts are far too noisy. False
              positives and unnecessary triggers make it very difficult to
              separate wheat from chaff! Uno’s detection system is about
              reducing noise. Focus is on ingesting existing operational data
              sets and alerts and triggers from current controls and combining
              them with contextual learning to reduce it down to an actionable
              and meaningful set.
            </p>
          </article>
        </section>
        <section className="flex justify-evenly text-lg">
          <p>Cuts Noise</p>
          <p>Actionable</p>
          <p>With Context</p>
          <p>Smart, Like the Adversary</p>
        </section>
      </motion.main>
    </PageLayout>
  );
};

export default Detection;
