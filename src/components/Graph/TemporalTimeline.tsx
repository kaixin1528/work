/* eslint-disable react-hooks/exhaustive-deps */
import {
  faArrowLeft,
  faArrowRight,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { utcFormat } from "d3-time-format";
import { motion } from "framer-motion";
import { LegacyRef, useEffect, useRef, useState } from "react";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { SearchDaysResult, SearchTemporalIndexes } from "../../types/graph";
import { handlePlayback } from "../../utils/graph";
import { convertToDate } from "src/utils/general";
import { useGraphStore } from "src/stores/graph";

const TemporalTimeline = ({
  searchResultsStatus,
  searchDays,
  temporalRef,
  collapseSummary,
  setCollapseSummary,
  temporalSearchTimestamps,
  selectedTemporalDay,
  selectedTemporalTimestamp,
  setSelectedTemporalTimestamp,
  setSelectedTemporalDay,
}: {
  searchResultsStatus: string;
  searchDays: SearchDaysResult;
  temporalRef: LegacyRef<HTMLLIElement> | undefined;
  collapseSummary?: boolean;
  setCollapseSummary?: (collapseSummary: boolean) => void;
  temporalSearchTimestamps: SearchTemporalIndexes;
  selectedTemporalDay: string;
  selectedTemporalTimestamp: number;
  setSelectedTemporalTimestamp: (selectedTemporalTimestamp: number) => void;
  setSelectedTemporalDay: (selectedTemporalDay: string) => void;
}) => {
  const { graphSearch } = useGraphStore();

  const searchTemporalRef = useRef();
  const [timer, setTimer] = useState<number>(0);
  const [startTemporalPlayback, setStartTemporalPlayback] =
    useState<boolean>(false);

  useEffect(() => {
    if (
      Object.keys(temporalSearchTimestamps).length > 0 &&
      selectedTemporalDay !== ""
    )
      setTimer(
        temporalSearchTimestamps[selectedTemporalDay].indexOf(
          selectedTemporalTimestamp
        ) * 5
      );
  }, [temporalSearchTimestamps, selectedTemporalTimestamp]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (
      startTemporalPlayback &&
      Object.keys(temporalSearchTimestamps).length > 0 &&
      selectedTemporalDay !== ""
    ) {
      if (
        temporalSearchTimestamps[selectedTemporalDay].indexOf(
          selectedTemporalTimestamp
        ) === temporalSearchTimestamps[selectedTemporalDay].length
      )
        setTimer(0);
      else
        interval = setInterval(() => {
          setTimer(timer + 1);
        }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTemporalPlayback, selectedTemporalTimestamp, timer]);

  useEffect(() => {
    handlePlayback(
      searchTemporalRef,
      startTemporalPlayback,
      Object.keys(temporalSearchTimestamps).length > 0 &&
        selectedTemporalDay !== "" &&
        selectedTemporalTimestamp ===
          temporalSearchTimestamps[selectedTemporalDay][
            temporalSearchTimestamps[selectedTemporalDay].length - 1
          ],
      setStartTemporalPlayback,
      setSelectedTemporalTimestamp,
      Object.keys(temporalSearchTimestamps).length > 0 &&
        selectedTemporalDay !== "" &&
        temporalSearchTimestamps[selectedTemporalDay][0],
      temporalSearchTimestamps[selectedTemporalDay],
      Object.keys(temporalSearchTimestamps).length > 0 &&
        selectedTemporalDay !== "" &&
        temporalSearchTimestamps[selectedTemporalDay][
          temporalSearchTimestamps[selectedTemporalDay].indexOf(
            selectedTemporalTimestamp
          )
        ],
      Object.keys(temporalSearchTimestamps).length > 0 &&
        selectedTemporalDay !== "" &&
        temporalSearchTimestamps[selectedTemporalDay][
          temporalSearchTimestamps[selectedTemporalDay].indexOf(
            selectedTemporalTimestamp
          ) + 1
        ],
      5000
    );
  }, [startTemporalPlayback, selectedTemporalTimestamp]);

  const handlePreviousDay = () => {
    const prevDay =
      Object.keys(searchDays)[
        Object.keys(searchDays).indexOf(selectedTemporalDay) - 1
      ];

    setSelectedTemporalDay(prevDay);
    setSelectedTemporalTimestamp(
      temporalSearchTimestamps[prevDay][
        temporalSearchTimestamps[prevDay].length - 1
      ]
    );
  };

  const handleNextDay = () => {
    const nextDay =
      Object.keys(searchDays)[
        Object.keys(searchDays).indexOf(selectedTemporalDay) + 1
      ];

    setSelectedTemporalDay(nextDay);
    setSelectedTemporalTimestamp(
      temporalSearchTimestamps[nextDay][
        temporalSearchTimestamps[nextDay].length - 1
      ]
    );
  };

  useEffect(() => {
    // navigate previous/next day
    const handleArrows = (event: {
      [x: string]: any;
      key: string;
      preventDefault: () => void;
    }) => {
      if (!event.target.type?.includes("text")) {
        if (
          event.key === "ArrowLeft" &&
          searchDays &&
          !(
            selectedTemporalDay === "" ||
            selectedTemporalDay === Object.keys(temporalSearchTimestamps)[0]
          )
        ) {
          event.preventDefault();
          handlePreviousDay();
        }
        if (
          event.key === "ArrowRight" &&
          searchDays &&
          !(
            selectedTemporalDay === "" ||
            selectedTemporalDay ===
              Object.keys(temporalSearchTimestamps)[
                Object.keys(temporalSearchTimestamps).length - 1
              ]
          )
        ) {
          event.preventDefault();
          handleNextDay();
        }
      }
    };
    document.addEventListener("keydown", handleArrows);
    return () => {
      document.removeEventListener("keydown", handleArrows);
    };
  }, [searchDays, temporalSearchTimestamps, selectedTemporalDay]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      className={`grid content-start mx-5 dark:text-filter ${
        collapseSummary ? "h-[1.5rem]" : "h-[7rem]"
      }`}
    >
      <header className="flex items-center gap-3">
        <h4 className="dark:text-checkbox text-sm">Query Result</h4>
        <button
          onClick={() => {
            if (setCollapseSummary) setCollapseSummary(!collapseSummary);
          }}
        >
          {!collapseSummary ? (
            <svg
              width="17"
              height="11"
              viewBox="0 0 17 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3"
            >
              <path
                d="M15.7467 7.15567C16.2171 7.6136 16.2275 8.38191 15.7695 8.85236L14.6484 10.0041C14.1904 10.4746 13.4221 10.485 12.9517 10.027L8.06873 5.274L3.31579 10.1569C2.85786 10.6274 2.08955 10.6377 1.6191 10.1798L0.46728 9.05864C-0.00316756 8.60071 -0.0135248 7.83239 0.444408 7.36195L7.15549 0.467458C7.61342 -0.00298962 8.36572 -0.013131 8.85218 0.444586L15.7467 7.15567Z"
                fill="#7993B0"
              />
            </svg>
          ) : (
            <svg
              width="16"
              height="11"
              viewBox="0 0 16 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3"
            >
              <path
                d="M0.348174 3.18159C-0.116058 2.71736 -0.116058 1.94897 0.348174 1.48474L1.48478 0.348174C1.94901 -0.116058 2.71739 -0.116058 3.18162 0.348174L8.00005 5.16658L12.8184 0.348174C13.2826 -0.116058 14.051 -0.116058 14.5152 0.348174L15.6518 1.48474C16.1161 1.94897 16.1161 2.71736 15.6518 3.18159L8.84842 9.98499C8.38419 10.4492 7.63182 10.4492 7.15158 9.98499L0.348174 3.18159Z"
                fill="#7993B0"
              />
            </svg>
          )}
        </button>
      </header>

      {!collapseSummary && (
        <>
          {!graphSearch && searchResultsStatus === "idle" && (
            <p className="grid py-7 mx-auto dark:text-checkbox text-sm">
              Try search across time
            </p>
          )}
          {searchResultsStatus === "loading" &&
            Object.keys(temporalSearchTimestamps).length === 0 && (
              <p className="grid py-7 mx-auto dark:text-checkbox text-sm">
                Searching...
              </p>
            )}
          {Object.keys(temporalSearchTimestamps).length > 0 && (
            <article className="grid gap-2 dark:text-checkbox text-xs">
              <header className="flex items-center gap-2 mx-auto">
                <button
                  data-test="prev-day"
                  className="dark:disabled:text-gray-500/50"
                  disabled={
                    selectedTemporalDay === "" ||
                    selectedTemporalDay ===
                      Object.keys(temporalSearchTimestamps)[0]
                  }
                  onClick={handlePreviousDay}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <p>
                  {selectedTemporalDay === ""
                    ? "Select Date"
                    : selectedTemporalDay}
                </p>
                <button
                  data-test="next-day"
                  className="dark:disabled:text-gray-500/50"
                  disabled={
                    selectedTemporalDay === "" ||
                    selectedTemporalDay ===
                      Object.keys(temporalSearchTimestamps)[
                        Object.keys(temporalSearchTimestamps).length - 1
                      ]
                  }
                  onClick={handleNextDay}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </header>
              <article className="w-full overflow-auto scrollbar">
                <ul
                  data-test="search-days"
                  className="flex items-center divide-x dark:divide-checkbox/40 w-max h-max mx-auto"
                >
                  {Object.keys(temporalSearchTimestamps).map(
                    (day: string, index: number) => {
                      const fixedDay = day.replace(/-/g, "/");
                      return (
                        <li
                          key={index}
                          ref={temporalRef}
                          className={`grid px-4 py-1 text-center cursor-pointer ${
                            day === selectedTemporalDay
                              ? "dark:text-white bg-gradient-to-b dark:from-signin dark:to-signin/40"
                              : "dark:hover:bg-filter/20 duration-100"
                          }`}
                          onClick={() => {
                            setSelectedTemporalDay(day);
                            setSelectedTemporalTimestamp(
                              temporalSearchTimestamps[day][
                                temporalSearchTimestamps[day].length - 1
                              ]
                            );
                          }}
                        >
                          <p>{utcFormat("%b")(new Date(fixedDay))}</p>
                          <p>{utcFormat("%d")(new Date(fixedDay))}</p>
                        </li>
                      );
                    }
                  )}
                </ul>
              </article>
              {selectedTemporalDay !== "" && (
                <article className="flex items-center gap-3 mx-auto -mt-5 pt-1">
                  <button
                    style={{ width: "40px", height: "50px" }}
                    className="dark:disabled:text-filter/30 dark:hover:text-filter/60 duration-100"
                    onClick={() => {
                      if (!startTemporalPlayback)
                        setStartTemporalPlayback(true);
                      else if (
                        startTemporalPlayback &&
                        selectedTemporalTimestamp !== -1
                      ) {
                        setStartTemporalPlayback(false);
                      }
                    }}
                  >
                    <CircularProgressbarWithChildren
                      strokeWidth={7}
                      value={
                        timer /
                        (temporalSearchTimestamps[selectedTemporalDay].length *
                          5 -
                          1)
                      }
                      maxValue={1}
                      styles={buildStyles({
                        trailColor: "#FFF",
                        pathColor: "#fcba03",
                      })}
                      className="w-7 h-7"
                    >
                      {!startTemporalPlayback ? (
                        <FontAwesomeIcon
                          icon={faPlay}
                          className="mt-6 -mr-[0.08rem] w-3 h-3"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faPause}
                          className="mt-6 -mr-[0.08rem] w-3 h-3"
                        />
                      )}
                    </CircularProgressbarWithChildren>
                  </button>
                  {temporalSearchTimestamps[selectedTemporalDay].map(
                    (time: number, index: number) => {
                      return (
                        <button
                          key={index}
                          className={`group relative rounded-full disabled:border dark:disabled:border-checkbox bg-gradient-to-b ${
                            temporalSearchTimestamps[
                              selectedTemporalDay
                            ]?.includes(selectedTemporalTimestamp)
                              ? time === selectedTemporalTimestamp
                                ? "w-3 h-3 border-2 dark:border-signin dark:from-yellow-500 dark:to-yellow-500/60"
                                : "w-2 h-2 dark:from-yellow-500 dark:to-yellow-500/60"
                              : time === selectedTemporalTimestamp
                              ? "w-3 h-3 dark:from-signin dark:to-signin/60"
                              : "w-2 h-2 dark:bg-none"
                          }`}
                          onClick={() => setSelectedTemporalTimestamp(time)}
                        >
                          <article className="hidden group-hover:block absolute -top-9 -left-[2.7rem] z-50 w-max px-4 py-1 text-xs dark:text-white dark:bg-tooltip rounded-sm">
                            <p>
                              {utcFormat("%H:%M")(convertToDate(Number(time)))}{" "}
                              UTC
                            </p>
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="absolute h-4 -bottom-2 left-9"
                            >
                              <path
                                d="M11.9592 0.640759L0.645508 11.9545L11.9592 23.2682L23.2729 11.9545L11.9592 0.640759Z"
                                fill="#23394F"
                              />
                            </svg>
                          </article>
                        </button>
                      );
                    }
                  )}
                </article>
              )}
            </article>
          )}
        </>
      )}
    </motion.section>
  );
};

export default TemporalTimeline;
