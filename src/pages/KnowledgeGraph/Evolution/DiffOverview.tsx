/* eslint-disable react-hooks/exhaustive-deps */
import { utcFormat } from "d3-time-format";
import { motion } from "framer-motion";
import React from "react";
import { accordionColors, showVariants } from "src/constants/general";
import { useGraphStore } from "src/stores/graph";
import { convertToDate } from "src/utils/general";
import { GetDiffSummary } from "src/services/graph/evolution";
import { useGeneralStore } from "src/stores/general";
import { KeyNumVal, KeyStringVal } from "src/types/general";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";

const DiffOverview = () => {
  const { env } = useGeneralStore();
  const { diffView, diffStartTime, navigationView, diffIntegrationType } =
    useGraphStore();

  const { data: diffSummary } = GetDiffSummary(
    env,
    diffView,
    diffStartTime,
    navigationView,
    diffIntegrationType
  );

  return (
    <>
      {diffSummary && (
        <motion.section
          variants={showVariants}
          initial="hidden"
          animate="visible"
          className="grid content-start gap-5 px-10 w-full h-full text-center"
        >
          <header className="grid gap-3">
            <h4>Significant Changes</h4>
            <p className="text-xs">
              Changes with higher impact in terms of security and resilience
            </p>
          </header>
          <section className="grid gap-2">
            <ul className="flex items-center gap-1 justify-self-center w-full h-full">
              {diffSummary?.by_time?.map(
                (bucket: KeyStringVal, index: number) => {
                  const levelColor =
                    accordionColors[bucket.level.toLowerCase()];
                  return (
                    <li
                      key={index}
                      className="grid w-full h-max shadow-xl dark:shadow-black/70"
                    >
                      <span className={`${levelColor[0]}`}></span>
                      <span className={`${levelColor[1]}`}></span>
                      <span className={`${levelColor[0]}`}></span>
                    </li>
                  );
                }
              )}
            </ul>
            <ul className="flex items-center gap-1 justify-self-center w-full h-full">
              {diffSummary?.by_time?.map((bucket: KeyNumVal, index: number) => {
                return (
                  <li key={index} className="grid w-full text-xs">
                    {diffView === "hour" ? (
                      <span>
                        {utcFormat("%H:%M")(convertToDate(bucket.timestamp))}
                      </span>
                    ) : diffView === "day" ? (
                      <>
                        <span>
                          {utcFormat("%b")(convertToDate(bucket.timestamp))}
                        </span>
                        <span>
                          {utcFormat("%d")(convertToDate(bucket.timestamp))}
                        </span>
                      </>
                    ) : (
                      <span>
                        {utcFormat("%b")(convertToDate(bucket.timestamp))}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
          <section className="grid gap-3">
            <ul className="flex items-center gap-1 justify-self-center w-full h-full">
              {diffSummary?.by_category?.map(
                (bucket: KeyStringVal, index: number) => {
                  const levelColor =
                    accordionColors[bucket.level.toLowerCase()];
                  return (
                    <li
                      key={index}
                      className="grid w-full h-max shadow-xl dark:shadow-black/70"
                    >
                      <span className={`${levelColor[0]}`}></span>
                      <span className={`${levelColor[1]}`}></span>
                      <span className={`${levelColor[0]}`}></span>
                    </li>
                  );
                }
              )}
            </ul>
            <ul className="flex items-center gap-1 justify-self-center w-full h-full">
              {diffSummary?.by_category?.map(
                (bucket: KeyStringVal, index: number) => {
                  return (
                    <li key={index} className="grid gap-1 w-full text-xs">
                      <img
                        src={`/graph/evolution/${bucket.category.toLowerCase()}.svg`}
                        alt={bucket.category}
                        className="w-5 h-5 mx-auto"
                      />
                      <h4>{bucket.category}</h4>
                    </li>
                  );
                }
              )}
            </ul>
          </section>
          <a
            href="/summaries/details?summary=overall_system_entropy"
            className="flex items-center gap-1 mx-auto text-xs dark:text-checkbox hover:underline"
          >
            <FontAwesomeIcon icon={faLink} />
            Overall System Entropy
          </a>
        </motion.section>
      )}
    </>
  );
};

export default DiffOverview;
