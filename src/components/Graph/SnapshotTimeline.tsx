/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  faBackward,
  faPlay,
  faPause,
  faForward,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { utcFormat } from "d3-time-format";
import SnapshotDatepicker from "../Datepicker/SnapshotDatepicker";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { RefObject, useEffect, useRef, useState } from "react";
import { SnapshotTimestampType } from "../../types/graph";
import { convertToDate, parseURL } from "../../utils/general";
import { handlePlayback } from "src/utils/graph";
import { useGraphStore } from "src/stores/graph";

import { useGeneralStore } from "src/stores/general";
import { GetSnapshotsAvailable } from "src/services/graph/snapshots";

const SnapshotTimeline = ({
  availableSnapshotIndexes,
  snapshotTimestamps,
}: {
  availableSnapshotIndexes: number[];
  snapshotTimestamps: SnapshotTimestampType;
}) => {
  const parsed = parseURL();

  const { env } = useGeneralStore();
  const { snapshotTime, setSnapshotTime, snapshotIndex, setSnapshotIndex } =
    useGraphStore();

  const snapshotRef = useRef() as RefObject<HTMLLIElement>;
  const [timer, setTimer] = useState<number>(0);
  const [startSnapshotPlayback, setStartSnapshotPlayback] =
    useState<boolean>(false);

  const { data: snapshotAvailable } = GetSnapshotsAvailable(
    env,
    parsed.section ? parsed.integration : "all",
    parsed.section ? String(parsed.section || "") : "main"
  );

  const earliestSnapshot = convertToDate(snapshotAvailable?.earliest_snapshot);
  const curSnapshotTime = snapshotTimestamps.timestamps[snapshotIndex];
  const sortedTimestamps = snapshotTimestamps.timestamps.sort();
  const today = new Date();

  useEffect(() => {
    const timeIndex = availableSnapshotIndexes.indexOf(snapshotIndex);
    if (timeIndex > -1) setTimer(timeIndex * 5);
  }, [availableSnapshotIndexes, snapshotIndex]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startSnapshotPlayback) {
      if (
        availableSnapshotIndexes.indexOf(snapshotIndex) ===
        availableSnapshotIndexes.length
      )
        setTimer(0);
      else
        interval = setInterval(() => {
          setTimer(timer + 1);
        }, 1000);
    }
    return () => clearInterval(interval);
  }, [startSnapshotPlayback, snapshotIndex, timer]);

  useEffect(() => {
    // go to previous/next snapshot
    const handleArrows = (event: {
      [x: string]: any;
      key: string;
      preventDefault: () => void;
    }) => {
      if (!event.target.type?.includes("text")) {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          if (snapshotIndex > availableSnapshotIndexes[0])
            setSnapshotIndex(
              availableSnapshotIndexes[
                availableSnapshotIndexes.indexOf(snapshotIndex) - 1
              ]
            );
          else
            setSnapshotTime(
              new Date(curSnapshotTime / 1000 - 3.6e6 * (snapshotIndex + 1))
            );
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          if (
            snapshotIndex <
            availableSnapshotIndexes[availableSnapshotIndexes.length - 1]
          )
            setSnapshotIndex(
              availableSnapshotIndexes[
                availableSnapshotIndexes.indexOf(snapshotIndex) + 1
              ]
            );
          else
            setSnapshotTime(
              new Date(curSnapshotTime / 1000 + 3.6e6 * (24 - snapshotIndex))
            );
        }
      }
    };
    document.addEventListener("keydown", handleArrows);
    return () => {
      document.removeEventListener("keydown", handleArrows);
    };
  }, [availableSnapshotIndexes, snapshotIndex]);

  useEffect(() => {
    handlePlayback(
      snapshotRef,
      startSnapshotPlayback,
      snapshotIndex ===
        availableSnapshotIndexes[availableSnapshotIndexes.length],
      setStartSnapshotPlayback,
      setSnapshotIndex,
      availableSnapshotIndexes[0],
      snapshotTimestamps && snapshotTimestamps.timestamps,
      availableSnapshotIndexes[snapshotIndex],
      availableSnapshotIndexes[
        availableSnapshotIndexes.indexOf(snapshotIndex) + 1
      ],
      5000
    );
  }, [startSnapshotPlayback, snapshotIndex]);

  return (
    <article className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-4 dark:text-filter z-10">
      <SnapshotDatepicker
        snapshotTime={snapshotTime}
        setSnapshotTime={setSnapshotTime}
      />
      <article className="flex items-center gap-2">
        <button
          data-test="prev-day"
          disabled={
            earliestSnapshot.getUTCDate() === snapshotTime?.getUTCDate() &&
            earliestSnapshot.getUTCMonth() === snapshotTime?.getUTCMonth() &&
            earliestSnapshot.getUTCFullYear() === snapshotTime?.getUTCFullYear()
          }
          className="dark:hover:text-filter/60 dark:disabled:text-filter/20 duration-100 focus:outline-none"
          onClick={() => {
            setSnapshotTime(
              new Date(curSnapshotTime / 1000 - 3.6e6 * (snapshotIndex + 1))
            );
            setStartSnapshotPlayback(false);
          }}
        >
          <FontAwesomeIcon icon={faBackward} />
        </button>
        <button
          style={{ width: "30px", height: "53px" }}
          disabled={availableSnapshotIndexes.length === 0}
          className="dark:disabled:text-filter/30 dark:hover:text-filter/60 duration-100 focus:outline-none"
          onClick={() => {
            if (!startSnapshotPlayback) setStartSnapshotPlayback(true);
            else if (
              startSnapshotPlayback &&
              snapshotIndex > 0 &&
              snapshotIndex < availableSnapshotIndexes.length
            ) {
              setStartSnapshotPlayback(false);
            }
          }}
        >
          <CircularProgressbarWithChildren
            strokeWidth={5}
            value={timer / (availableSnapshotIndexes.length * 5 - 1)}
            maxValue={1}
            styles={buildStyles({
              trailColor: "#FFF",
              pathColor: "#fcba03",
            })}
            className="w-20 h-20 -mt-[0.85rem]"
          >
            {!startSnapshotPlayback ? (
              <FontAwesomeIcon
                icon={faPlay}
                className="-mt-[6.3rem] -mr-[0.1rem] w-[0.82rem] h-[0.82rem]"
              />
            ) : (
              <FontAwesomeIcon
                icon={faPause}
                className="-mt-[6.3rem] -mr-[0.1rem] w-[0.82rem] h-[0.82rem]"
              />
            )}
          </CircularProgressbarWithChildren>
        </button>
        <button
          data-test="next-day"
          className="dark:hover:text-filter/60 dark:disabled:text-filter/20 duration-100 focus:outline-none"
          disabled={
            today.getUTCFullYear() === snapshotTime?.getUTCFullYear() &&
            today.getUTCMonth() === snapshotTime?.getUTCMonth() &&
            today.getUTCDate() === snapshotTime?.getUTCDate()
          }
          onClick={() => {
            setSnapshotTime(
              new Date(curSnapshotTime / 1000 + 3.6e6 * (24 - snapshotIndex))
            );
            setStartSnapshotPlayback(false);
            setSnapshotIndex(-1);
          }}
        >
          <FontAwesomeIcon icon={faForward} />
        </button>
      </article>
      <article className="flex items-center gap-2">
        {[...Array(24)].map((v, index) => {
          const missing = snapshotTimestamps.missing;
          return (
            <button
              data-test="snapshot-box"
              key={index}
              disabled={missing.includes(sortedTimestamps[index])}
              className={`group relative w-5 h-5 shadow-sm dark:shadow-black disabled:shadow-none dark:disabled:bg-card disabled:border dark:disabled:border-checkbox/60 disabled:bg-none focus:outline-none bg-gradient-to-b ${
                snapshotIndex === index
                  ? "dark:from-signin dark:to-signin/60"
                  : "dark:from-filter dark:to-filter/60"
              }`}
              onClick={() => {
                setSnapshotTime(convertToDate(sortedTimestamps[index]));
                setSnapshotIndex(index);
              }}
            >
              <article className="hidden group-hover:block absolute -top-9 -left-9 px-4 py-1 text-xs dark:text-white dark:bg-tooltip w-max rounded-sm">
                <p>
                  {" "}
                  {utcFormat("%H:%M")(
                    convertToDate(sortedTimestamps[index])
                  )}{" "}
                  UTC
                </p>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute h-4 -bottom-2 left-8"
                >
                  <path
                    d="M11.9592 0.640759L0.645508 11.9545L11.9592 23.2682L23.2729 11.9545L11.9592 0.640759Z"
                    fill="#23394F"
                  />
                </svg>
              </article>
            </button>
          );
        })}
      </article>
      {curSnapshotTime && (
        <p className="w-max text-center text-xs dark:text-signin">
          {utcFormat("%H:%M")(convertToDate(curSnapshotTime))} UTC
        </p>
      )}
    </article>
  );
};

export default SnapshotTimeline;
