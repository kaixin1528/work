/* eslint-disable react-hooks/exhaustive-deps */
import DatePicker from "react-datepicker";
import {
  forwardRef,
  LegacyRef,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import { Popover, Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Fragment } from "react";
import { utcFormat } from "d3-time-format";
import {
  convertUTCToLocalDate,
  convertLocalToUTCDate,
  convertToUTCString,
  convertToMicrosec,
  parseURL,
  convertToDate,
} from "../../utils/general";
import {
  datePickerTimes,
  quickSelect,
  validVariants,
} from "../../constants/general";
import { motion } from "framer-motion";
import { useGraphStore } from "../../stores/graph";
import { useGeneralStore } from "src/stores/general";
import {
  GetSnapshotsAvailable,
  GetSnapshotTimestamps,
} from "src/services/graph/snapshots";

const calcTimeFromSnapshot = (timeInterval: number) =>
  new Date(Date.now() - timeInterval);
const calcQuickSelect = (timeValue: number, unit: string) =>
  new Date(Date.now() - timeValue * quickSelect[unit]);

const TemporalDatepicker = ({
  temporalStartDate,
  setTemporalStartDate,
  temporalEndDate,
  setTemporalEndDate,
  earliest,
  latest,
}: {
  temporalStartDate: Date;
  setTemporalStartDate: (temporalStartDate: Date) => void;
  temporalEndDate: Date;
  setTemporalEndDate: (temporalEndDate: Date) => void;
  earliest?: number;
  latest?: number;
}) => {
  const parsed = parseURL();

  const { env } = useGeneralStore();
  const { graphSearch, setGraphSearching, navigationView } = useGraphStore();

  const [timeValue, setTimeValue] = useState<number>(0);
  const [unit, setUnit] = useState<string>("hours");
  const [selected, setSelected] = useState<boolean>(false);
  const [apply, setApply] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(true);

  const buttonRef = useRef([]) as RefObject<HTMLButtonElement[]>;

  const timeDiff = Math.abs(
    new Date(temporalEndDate).getTime() - new Date(temporalStartDate).getTime()
  );

  const { data: snapshotAvailable } = GetSnapshotsAvailable(env, "all", "main");
  const { data: snapshotTimestamps } = GetSnapshotTimestamps(
    env,
    "all",
    snapshotAvailable ? snapshotAvailable.earliest_snapshot !== -1 : false,
    convertToMicrosec(temporalEndDate),
    navigationView,
    "main"
  );

  const sortedSnapshotTimes = snapshotTimestamps?.timestamps.sort();
  const availableTimestamps = sortedSnapshotTimes?.reduce(
    (pV: number[], cV: number) => {
      if (snapshotTimestamps.missing.includes(cV)) return [...pV];
      else return [...pV, cV];
    },
    []
  );
  const currentHour = new Date().getUTCHours();
  const filteredTimestamps = snapshotTimestamps?.timestamps.reduce(
    (pV: Date[], cV: number) => {
      const date = convertToDate(cV);
      if (
        !snapshotTimestamps.missing.includes(cV) &&
        date.getUTCHours() !== currentHour
      )
        return [...pV, convertUTCToLocalDate(date)];
      else return [...pV];
    },
    []
  );
  const latestSnapshotDate =
    availableTimestamps?.length > 0
      ? convertToDate(availableTimestamps[availableTimestamps.length - 1])
      : new Date();

  useEffect(() => {
    if (temporalStartDate > temporalEndDate)
      setTemporalStartDate(temporalEndDate);
    if (temporalStartDate > temporalEndDate)
      setTemporalEndDate(temporalStartDate);
  }, [temporalStartDate, temporalEndDate]);

  useEffect(() => {
    if (temporalStartDate.getTime() === temporalEndDate.getTime()) {
      setTemporalStartDate(latestSnapshotDate);
      setTemporalEndDate(latestSnapshotDate);
    }
  }, []);

  return (
    <section className="hidden md:flex items-center gap-2">
      <article className="w-max">
        <Popover className="relative">
          {({ open }) => (
            <>
              <article
                className={`
                ${open ? "" : "text-opacity-90"}
                group inline-flex items-center text-base font-medium focus:outline-none rounded-md`}
              >
                <FontAwesomeIcon
                  icon={faCalendarDays}
                  className="w-5 h-5 dark:text-checkbox cursor-pointer"
                  onClick={() => {
                    setShowCalendar(!showCalendar);
                  }}
                />
                <Popover.Button>
                  <ChevronDownIcon
                    data-test="show-selection"
                    className="h-4 w-4 font-bold dark:text-checkbox duration-100 group-hover:text-opacity-80"
                    aria-hidden="true"
                    onClick={() => {
                      if (open) setShowCalendar(false);
                      else setShowCalendar(true);
                    }}
                  />
                </Popover.Button>
              </article>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute left-0 mt-3 w-max z-10">
                  <article className="grid gap-2 text-xs dark:bg-tooltip shadow-lg overflow-hidden">
                    {/* custom selection */}
                    <article className="relative grid gap-3 px-4 pt-4">
                      <header className="flex items-center gap-2">
                        <h5>Quick select</h5>
                        <button
                          disabled={timeValue === 0}
                          className="px-4 text-[0.6rem] dark:disabled:text-gray-500 dark:disabled:bg-red-800/40 dark:hover:bg-red-800 dark:bg-red-800/80 duration-100 rounded-full"
                          onClick={() => {
                            setGraphSearching(true);
                            setTimeValue(0);
                            setUnit("hours");
                            setTemporalStartDate(latestSnapshotDate);
                            setTemporalEndDate(latestSnapshotDate);
                            setSelected(false);
                            setApply(false);
                          }}
                        >
                          Clear Select
                        </button>
                      </header>
                      <article className="flex items-center gap-5">
                        <article className="flex items-center gap-2 px-4 dark:bg-main rounded-full">
                          Last
                          <input
                            type="input"
                            value={timeValue}
                            onChange={(e) => {
                              setGraphSearching(true);
                              if (e.target.value === "") setTimeValue(0);
                              else if (Number(e.target.value))
                                setTimeValue(Number(e.target.value));
                            }}
                            className="w-8 h-8 px-2 dark:bg-main border-none border-transparent focus:ring-0 focus:border-transparent bg-transparent focus:outline-none"
                          />
                          <article className="w-max text-right">
                            <Menu
                              as="article"
                              className="relative inline-block text-left"
                            >
                              <span>
                                <Menu.Button className="inline-flex w-full justify-center text-white hover:bg-opacity-30 focus:outline-none">
                                  {unit === "hour" ? "hours" : unit}
                                  <ChevronDownIcon
                                    className={`${
                                      open ? "" : "text-opacity-70"
                                    } h-4 w-4 font-semibold dark:text-white transition duration-150 ease-in-out group-hover:text-opacity-80`}
                                    aria-hidden="true"
                                  />
                                </Menu.Button>
                              </span>
                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                              >
                                <Menu.Items className="absolute -left-2 mt-2 w-max origin-top-right dark:text-white text-xs divide-y dark:divide-filter dark:bg-main shadow-lg focus:outline-none">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        className={`${
                                          active ? "dark:bg-filter" : ""
                                        } group flex w-full items-center px-2 py-2`}
                                        onClick={() => setUnit("hours")}
                                      >
                                        hours
                                      </button>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        className={`${
                                          active ? "dark:bg-filter" : ""
                                        } group flex w-full items-center px-2 py-2`}
                                        onClick={() => setUnit("days")}
                                      >
                                        days
                                      </button>
                                    )}
                                  </Menu.Item>
                                </Menu.Items>
                              </Transition>
                            </Menu>
                          </article>
                        </article>
                        <article
                          onClick={() => {
                            setGraphSearching(true);
                            setTemporalStartDate(
                              calcQuickSelect(timeValue, unit)
                            );
                            setTemporalEndDate(latestSnapshotDate);
                            setApply(true);
                          }}
                        >
                          <button
                            disabled={timeValue === 0}
                            className={`${
                              timeValue !== 0
                                ? "dark:text-signin border border-signin dark:hover:text-signin/60 dark:hover:border-signin/60 duration-100"
                                : "dark:text-checkbox border border-checkbox"
                            } py-1.5 px-4`}
                          >
                            Apply
                          </button>
                        </article>
                      </article>
                    </article>

                    {/* common selection */}
                    <article className="grid gap-3 p-4">
                      <h5>Common Selections</h5>
                      <ul className="grid grid-cols-2 gap-y-1 gap-x-10 dark:text-signin">
                        {datePickerTimes.map((time, index: number) => {
                          return (
                            <li
                              data-test="common-selection"
                              key={index}
                              className="cursor-pointer"
                              onClick={() => {
                                setTemporalStartDate(
                                  calcTimeFromSnapshot(time.value)
                                );
                                setTemporalEndDate(latestSnapshotDate);
                                setTimeValue(time.number);
                                setUnit(time.unit);
                                setSelected(true);
                                setGraphSearching(true);
                                buttonRef?.current &&
                                  buttonRef?.current[index]?.click();
                              }}
                            >
                              <button
                                ref={(el: any) => {
                                  if (buttonRef?.current)
                                    buttonRef.current[index] = el;
                                }}
                              >
                                {time.name}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </article>
                  </article>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </article>
      {showCalendar && (
        <article className="relative flex items-center justify-content-start gap-3 py-0.5 select-none dark:bg-search rounded-sm">
          {graphSearch &&
            temporalStartDate.getTime() === temporalEndDate.getTime() && (
              <motion.p
                data-test="invalid"
                variants={validVariants}
                initial="hidden"
                animate={
                  graphSearch &&
                  temporalStartDate.getTime() === temporalEndDate.getTime()
                    ? "visible"
                    : "hidden"
                }
                className="absolute -top-4 w-max text-xs dark:text-reset"
              >
                Please select dates first
              </motion.p>
            )}

          {/* if not within 7 days */}
          {timeDiff > 604800000 && !parsed.summary && !parsed.diary_id && (
            <motion.p
              data-test="invalid"
              variants={validVariants}
              initial="hidden"
              animate={
                graphSearch && timeDiff > 604800000 ? "visible" : "hidden"
              }
              className="absolute -top-4 w-max text-xs dark:text-reset"
            >
              Please select within 7 days of range
            </motion.p>
          )}

          {/* from date */}
          <article className="relative flex items-center w-max">
            <DatePicker
              selected={convertUTCToLocalDate(temporalStartDate)}
              onChange={(date: Date) => {
                setGraphSearching(true);
                setSelected(false);
                setApply(false);
                setTemporalStartDate(convertLocalToUTCDate(date) as Date);
              }}
              selectsStart
              startDate={convertUTCToLocalDate(temporalStartDate)}
              endDate={convertUTCToLocalDate(temporalEndDate)}
              showTimeSelect
              timeFormat="h:mm aa"
              timeIntervals={60}
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="From"
              nextMonthButtonLabel=">"
              previousMonthButtonLabel="<"
              popperClassName="react-datepicker-left"
              includeDateIntervals={[
                {
                  start: earliest
                    ? (convertUTCToLocalDate(convertToDate(earliest)) as Date)
                    : snapshotAvailable
                    ? (convertUTCToLocalDate(
                        convertToDate(snapshotAvailable.earliest_snapshot)
                      ) as Date)
                    : (convertUTCToLocalDate(new Date()) as Date),
                  end: latest
                    ? (convertUTCToLocalDate(convertToDate(latest)) as Date)
                    : snapshotAvailable
                    ? (convertUTCToLocalDate(
                        convertToDate(snapshotAvailable.latest_snapshot)
                      ) as Date)
                    : (convertUTCToLocalDate(new Date()) as Date),
                },
              ]}
              includeTimes={filteredTimestamps}
              customInput={
                <StartInput
                  timeValue={timeValue}
                  unit={unit}
                  selected={selected}
                  apply={apply}
                  temporalStartDate={temporalStartDate}
                  temporalEndDate={temporalEndDate}
                />
              }
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
                      prevMonthButtonDisabled
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    } inline-flex text-xs font-medium shadow-sm dark:hover:bg-checkbox focus:outline-none rounded`}
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                  <p className="text-sm">
                    {utcFormat("%B")(date)}{" "}
                    <span className="dark:text-checkbox">
                      {utcFormat("%Y")(date)}
                    </span>
                  </p>

                  <button
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    type="button"
                    className={`${
                      nextMonthButtonDisabled
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    } inline-flex text-xs font-medium shadow-sm dark:hover:bg-checkbox focus:outline-none rounded`}
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </article>
              )}
            />
          </article>

          <FontAwesomeIcon icon={faArrowRightLong} className="w-3 h-3" />

          {/* to date */}
          <article className="relative flex items-center w-max">
            <DatePicker
              selected={convertUTCToLocalDate(temporalEndDate)}
              onChange={(date: Date) => {
                setGraphSearching(true);
                setSelected(false);
                setApply(false);
                setTemporalEndDate(convertLocalToUTCDate(date) as Date);
              }}
              selectsEnd
              startDate={convertUTCToLocalDate(temporalStartDate)}
              endDate={convertUTCToLocalDate(temporalEndDate)}
              showTimeSelect
              timeFormat="h:mm aa"
              timeIntervals={60}
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="To"
              nextMonthButtonLabel=">"
              previousMonthButtonLabel="<"
              popperClassName="react-datepicker-right"
              includeDateIntervals={[
                {
                  start: earliest
                    ? (convertUTCToLocalDate(convertToDate(earliest)) as Date)
                    : snapshotAvailable
                    ? (convertUTCToLocalDate(
                        convertToDate(snapshotAvailable.earliest_snapshot)
                      ) as Date)
                    : (convertUTCToLocalDate(new Date()) as Date),
                  end: latest
                    ? (convertUTCToLocalDate(convertToDate(latest)) as Date)
                    : snapshotAvailable
                    ? (convertUTCToLocalDate(
                        convertToDate(snapshotAvailable.latest_snapshot)
                      ) as Date)
                    : (convertUTCToLocalDate(new Date()) as Date),
                },
              ]}
              includeTimes={filteredTimestamps}
              customInput={
                <EndInput
                  selected={selected}
                  apply={apply}
                  temporalStartDate={temporalStartDate}
                  temporalEndDate={temporalEndDate}
                />
              }
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
                      prevMonthButtonDisabled
                        ? "cursor-not-allowed opacity-50"
                        : ""
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
                      nextMonthButtonDisabled
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    } inline-flex text-xs font-medium shadow-sm dark:hover:bg-checkbox focus:outline-none rounded`}
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </article>
              )}
            />
          </article>
        </article>
      )}
    </section>
  );
};

export default TemporalDatepicker;

const StartInput = forwardRef(
  (
    {
      onClick,
      timeValue,
      unit,
      selected,
      apply,
      temporalStartDate,
      temporalEndDate,
    }: any,
    ref
  ) => (
    <button
      onClick={onClick}
      ref={ref as RefObject<HTMLButtonElement>}
      type="button"
      className="inline-flex w-full px-3 py-2 text-xs font-medium dark:text-white dark:bg-[#0A1B23] shadow-sm focus:outline-none"
    >
      {convertToMicrosec(temporalStartDate) ===
      convertToMicrosec(temporalEndDate)
        ? "Select Date"
        : selected || apply
        ? `- ${timeValue} ${unit} ago`
        : convertToUTCString(convertToMicrosec(temporalStartDate))}
    </button>
  )
);

const EndInput = forwardRef(
  (
    { onClick, selected, apply, temporalStartDate, temporalEndDate }: any,
    ref: LegacyRef<HTMLButtonElement> | undefined
  ) => (
    <button
      onClick={onClick}
      ref={ref}
      type="button"
      className="inline-flex w-full px-3 py-2 text-xs font-medium dark:text-white dark:bg-[#0A1B23] shadow-sm focus:outline-none"
    >
      {convertToMicrosec(temporalStartDate) ===
      convertToMicrosec(temporalEndDate)
        ? "Select Date"
        : selected || apply
        ? "now"
        : convertToUTCString(convertToMicrosec(temporalEndDate))}
    </button>
  )
);
