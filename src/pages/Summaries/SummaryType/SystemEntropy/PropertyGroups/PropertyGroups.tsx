/* eslint-disable react-hooks/exhaustive-deps */
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { utcFormat } from "d3-time-format";
import { motion } from "framer-motion";
import React, { Fragment } from "react";
import { accordionColors, showVariants } from "src/constants/general";
import { severityTooltipColors } from "src/constants/summaries";
import { GetPropertyGroupsByTime } from "src/services/summaries/system-entropy";
import { useSummaryStore } from "src/stores/summaries";
import { KeyNumVal } from "src/types/general";
import { convertToDate, convertToUTCString } from "src/utils/general";
import Aggregate from "./Aggregate";

const PropertyGroups = ({ setNav }: { setNav: (nav: string[]) => void }) => {
  const { period } = useSummaryStore();

  const { data: propertyGroupsByTime } = GetPropertyGroupsByTime(period);

  return (
    <motion.section
      variants={showVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col flex-grow gap-20 w-full h-full"
    >
      <Aggregate />
      {propertyGroupsByTime ? (
        <section className="grid content-start gap-10 px-10 w-full h-full text-center">
          <h4 className="text-base">Property group changes by time</h4>
          {Object.keys(propertyGroupsByTime).length > 0 ? (
            <section className="flex gap-5 w-full text-xs">
              <article className="grid gap-2 w-full text-xs">
                {Object.values(propertyGroupsByTime).map(
                  (property: any, valueIndex: number) => {
                    return (
                      <Fragment key={valueIndex}>
                        <article className="flex items-center gap-5">
                          <h4 className="w-28 capitalize">
                            {Object.keys(propertyGroupsByTime)[
                              valueIndex
                            ].replaceAll("_", " ")}
                          </h4>
                          <article className="flex items-center gap-1 w-full h-full">
                            {property.map((bucket: any, index: number) => {
                              const levelColor =
                                accordionColors[bucket.level.toLowerCase()];
                              return (
                                <button
                                  key={index}
                                  disabled={bucket.disabled}
                                  className="group relative grid w-full h-max"
                                  onClick={() => {
                                    setNav([
                                      "property groups",
                                      `${bucket.timestamp}+${
                                        Object.keys(propertyGroupsByTime)[
                                          valueIndex
                                        ]
                                      }`,
                                    ]);
                                  }}
                                >
                                  {bucket.disabled ? (
                                    <article className="relative group h-5 bg-filter">
                                      <article className="absolute -top-20 left-1/2 -translate-x-1/2 hidden group-hover:grid gap-2 p-4 w-max text-left font-extralight bg-expand z-10">
                                        <h4>No changes</h4>
                                        <p>
                                          {convertToUTCString(
                                            Number(bucket.timestamp)
                                          )}
                                        </p>
                                      </article>
                                    </article>
                                  ) : (
                                    <article className="disabled:animate-none group-hover:animate-bounce grid w-full h-max cursor-pointer black-shadow/70">
                                      <span
                                        className={`${levelColor[0]}`}
                                      ></span>
                                      <span
                                        className={`${levelColor[1]}`}
                                      ></span>
                                      <span
                                        className={`${levelColor[0]}`}
                                      ></span>
                                    </article>
                                  )}
                                  {!bucket.disabled && (
                                    <article
                                      className={`absolute -top-20 left-1/2 -translate-x-1/2 hidden group-hover:grid gap-2 p-4 w-max text-left font-extralight ${
                                        severityTooltipColors[
                                          bucket.level.toLowerCase()
                                        ]
                                      } z-10`}
                                    >
                                      <h4 className="uppercase text-sm">
                                        {bucket.level}
                                      </h4>
                                      <p>
                                        {convertToUTCString(
                                          Number(bucket.timestamp)
                                        )}
                                      </p>
                                      <p className="flex items-center gap-2 italic">
                                        View more{" "}
                                        <FontAwesomeIcon
                                          icon={faArrowRightLong}
                                        />{" "}
                                      </p>
                                    </article>
                                  )}
                                </button>
                              );
                            })}
                          </article>
                        </article>
                        {valueIndex ===
                          Object.keys(propertyGroupsByTime).length - 1 && (
                          <article className="flex items-center gap-5">
                            <span className="w-28"></span>
                            <ul className="flex items-center gap-1 w-full h-full">
                              {property.map(
                                (bucket: KeyNumVal, index: number) => {
                                  return (
                                    <li
                                      key={index}
                                      className="grid gap-1 w-full"
                                    >
                                      {[1, 2].includes(period) ? (
                                        <span>
                                          {utcFormat("%H:%M")(
                                            convertToDate(bucket.timestamp)
                                          )}
                                        </span>
                                      ) : (
                                        <>
                                          <span>
                                            {utcFormat("%b")(
                                              convertToDate(bucket.timestamp)
                                            )}
                                          </span>
                                          <span>
                                            {utcFormat("%d")(
                                              convertToDate(bucket.timestamp)
                                            )}
                                          </span>
                                        </>
                                      )}
                                    </li>
                                  );
                                }
                              )}
                            </ul>
                          </article>
                        )}
                      </Fragment>
                    );
                  }
                )}
              </article>
            </section>
          ) : (
            <p>No data available</p>
          )}
        </section>
      ) : null}
    </motion.section>
  );
};

export default PropertyGroups;
