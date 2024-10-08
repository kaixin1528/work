/* eslint-disable react-hooks/exhaustive-deps */
import DatePicker from "react-datepicker";
import { forwardRef, LegacyRef, RefObject, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import { Popover } from "@headlessui/react";
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
import { validVariants } from "../../constants/general";
import { motion } from "framer-motion";
import { useGraphStore } from "../../stores/graph";

const GeneralTemporalDatepicker = ({
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

  const { graphSearch, setGraphSearching } = useGraphStore();

  const [selected, setSelected] = useState<boolean>(false);
  const [apply, setApply] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(true);

  const timeDiff = Math.abs(
    new Date(temporalEndDate).getTime() - new Date(temporalStartDate).getTime()
  );

  const earliestDate = earliest ? convertToDate(earliest) : new Date();
  const latestDate = latest ? convertToDate(latest) : new Date();

  useEffect(() => {
    if (temporalStartDate > temporalEndDate)
      setTemporalStartDate(temporalEndDate);
    if (temporalStartDate > temporalEndDate)
      setTemporalEndDate(temporalStartDate);
  }, [temporalStartDate, temporalEndDate]);

  useEffect(() => {
    if (earliestDate && latestDate) {
      setTemporalStartDate(earliestDate);
      setTemporalEndDate(latestDate);
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
                  start: convertUTCToLocalDate(earliestDate) as Date,
                  end: convertUTCToLocalDate(latestDate) as Date,
                },
              ]}
              customInput={
                <StartInput
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
                  start: convertUTCToLocalDate(earliestDate) as Date,
                  end: convertUTCToLocalDate(latestDate) as Date,
                },
              ]}
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

export default GeneralTemporalDatepicker;

const StartInput = forwardRef(
  ({ onClick, temporalStartDate, temporalEndDate }: any, ref) => (
    <button
      onClick={onClick}
      ref={ref as RefObject<HTMLButtonElement>}
      type="button"
      className="inline-flex w-full px-3 py-2 text-xs font-medium dark:text-white dark:bg-[#0A1B23] shadow-sm focus:outline-none"
    >
      {convertToMicrosec(temporalStartDate) ===
      convertToMicrosec(temporalEndDate)
        ? "Select Date"
        : convertToUTCString(convertToMicrosec(temporalStartDate))}
    </button>
  )
);

const EndInput = forwardRef(
  (
    { onClick, temporalStartDate, temporalEndDate }: any,
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
        : convertToUTCString(convertToMicrosec(temporalEndDate))}
    </button>
  )
);
