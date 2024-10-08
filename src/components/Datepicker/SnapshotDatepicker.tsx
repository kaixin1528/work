/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import DatePicker from "react-datepicker";
import { forwardRef, LegacyRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { utcFormat } from "d3-time-format";
import {
  convertUTCToLocalDate,
  convertLocalToUTCDate,
  parseURL,
  convertToUTCString,
  convertToMicrosec,
  convertToDate,
} from "../../utils/general";
import { useGeneralStore } from "src/stores/general";
import {
  GetSnapshotsAvailable,
  GetSnapshotTimestamps,
} from "src/services/graph/snapshots";

const SnapshotDatepicker = ({
  snapshotTime,
  setSnapshotTime,
  simulation,
}: {
  snapshotTime: Date | null;
  setSnapshotTime: (snapshotTime: Date | null) => void;
  simulation?: boolean;
}) => {
  const parsed = parseURL();

  const { env } = useGeneralStore();

  const { data: snapshotAvailable } = GetSnapshotsAvailable(
    env,
    parsed.section ? parsed.integration : "all",
    parsed.section ? String(parsed.section || "") : "main"
  );
  const { data: snapshotTimestamps } = GetSnapshotTimestamps(
    env,
    parsed.section ? parsed.integration : "all",
    snapshotAvailable ? snapshotAvailable.earliest_snapshot !== -1 : false,
    snapshotTime ? convertToMicrosec(snapshotTime) : 0,
    "snapshots",
    parsed.section ? String(parsed.section || "") : "main"
  );

  const currentHour = new Date().getUTCHours();
  const filteredTimestamps = snapshotTime
    ? snapshotTimestamps?.timestamps.reduce((pV: Date[], cV: number) => {
        const date = convertToDate(cV);
        if (
          !snapshotTimestamps.missing.includes(cV) &&
          date.getUTCHours() !== currentHour
        )
          return [...pV, convertUTCToLocalDate(date)];
        else return [...pV];
      }, [])
    : [];

  const DateInput = forwardRef(
    (
      { value, onClick }: any,
      ref: LegacyRef<HTMLButtonElement> | undefined
    ) => (
      <article className="flex items-center gap-2">
        <button onClick={onClick} ref={ref} type="button">
          <FontAwesomeIcon
            icon={faCalendarDays}
            className="w-5 h-5 dark:text-checkbox"
          />
        </button>
        <p className="inline-flex justify-start w-full py-2 text-xs font-medium dark:text-white focus:outline-none">
          {snapshotTime
            ? simulation
              ? convertToUTCString(convertToMicrosec(snapshotTime))
              : `${utcFormat("%b %d")(snapshotTime as Date)} Snapshots`
            : "Select Time"}
        </p>
      </article>
    )
  );

  return (
    <section className="flex items-center gap-2">
      <article className="relative flex items-center w-max">
        <DatePicker
          disabled={snapshotAvailable?.earliest_snapshot === -1}
          selected={convertUTCToLocalDate(snapshotTime)}
          onChange={(date) => {
            if (
              snapshotAvailable?.earliest_snapshot <=
              Number(date?.getTime()) * 1000
            )
              setSnapshotTime(convertLocalToUTCDate(date));
          }}
          selectsStart
          startDate={convertUTCToLocalDate(snapshotTime)}
          showTimeSelect
          timeFormat="h:mm aa"
          timeIntervals={60}
          dateFormat="MMMM d, yyyy h:mm aa"
          placeholderText="From"
          nextMonthButtonLabel=">"
          previousMonthButtonLabel="<"
          popperClassName="react-datepicker"
          includeDateIntervals={[
            {
              start: snapshotAvailable
                ? (convertUTCToLocalDate(
                    convertToDate(snapshotAvailable.earliest_snapshot)
                  ) as Date)
                : (convertUTCToLocalDate(new Date()) as Date),
              end: snapshotAvailable
                ? (convertUTCToLocalDate(
                    convertToDate(snapshotAvailable.latest_snapshot)
                  ) as Date)
                : (convertUTCToLocalDate(new Date()) as Date),
            },
          ]}
          includeTimes={filteredTimestamps}
          customInput={<DateInput />}
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <article className="flex items-center justify-between px-2 py-2 dark:text-white">
              <button
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                type="button"
                className={`${
                  prevMonthButtonDisabled ? "cursor-not-allowed opacity-50" : ""
                } inline-flex text-xs font-medium shadow-sm dark:hover:bg-checkbox focus:outline-none rounded`}
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <p className="text-sm">
                {utcFormat("%b")(date)}{" "}
                <span className="dark:text-checkbox">
                  {utcFormat("%Y")(date)}
                </span>
              </p>

              <button
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                type="button"
                className={`${
                  nextMonthButtonDisabled ? "cursor-not-allowed opacity-50" : ""
                } inline-flex text-xs font-medium shadow-sm dark:hover:bg-checkbox focus:outline-none rounded`}
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </article>
          )}
        />
      </article>
    </section>
  );
};

export default SnapshotDatepicker;
