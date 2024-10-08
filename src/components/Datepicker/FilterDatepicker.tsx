/* eslint-disable react-hooks/exhaustive-deps */
import DatePicker from "react-datepicker";
import { forwardRef, LegacyRef, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { Filter } from "../../types/general";
import { utcFormat } from "d3-time-format";
import {
  convertLocalToUTCDate,
  convertToMicrosec,
  convertToUTCString,
  convertUTCToLocalDate,
} from "../../utils/general";

const FilterDatepicker = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  currentFilter,
  setCurrentFilter,
  endDateFilter,
  setEndDateFilter,
}: {
  startDate: Date;
  setStartDate: (startDate: Date) => void;
  endDate: Date;
  setEndDate: (endDate: Date) => void;
  currentFilter: Filter;
  setCurrentFilter: (currentFilter: Filter) => void;
  endDateFilter: Filter;
  setEndDateFilter: (endDateFilter: Filter) => void;
}) => {
  useEffect(() => {
    if (startDate > endDate) setStartDate(endDate);
    if (startDate > endDate) setEndDate(startDate);
  }, [startDate, endDate]);

  return (
    <section className="flex flex-col gap-2">
      {/* from date */}
      <article className="relative flex items-center gap-2 w-60">
        <h5 className="w-10 text-[0.8rem]">From</h5>
        <DatePicker
          selected={convertUTCToLocalDate(startDate)}
          onChange={(date: Date) => {
            setStartDate(convertLocalToUTCDate(date) as Date);
            setCurrentFilter({
              ...currentFilter,
              op: "ge",
              value: Date.parse(String(convertLocalToUTCDate(date))) * 1000,
              type: "integer",
              set_op: "and",
            });
          }}
          selectsStart
          startDate={convertUTCToLocalDate(startDate)}
          endDate={convertUTCToLocalDate(endDate)}
          showTimeSelect
          timeFormat="h:mm aa"
          timeIntervals={60}
          dateFormat="MMMM d, yyyy h:mm aa"
          placeholderText="From"
          nextMonthButtonLabel=">"
          previousMonthButtonLabel="<"
          popperClassName="react-datepicker-left"
          customInput={<DateInput startDate={startDate} endDate={endDate} />}
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <article className="flex items-center justify-between px-2 py-2">
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
              <p className="text-sm dark:text-white">
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
                  nextMonthButtonDisabled ? "cursor-not-allowed opacity-50" : ""
                } inline-flex text-xs font-medium shadow-sm dark:hover:bg-checkbox focus:outline-none rounded`}
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </article>
          )}
        />
      </article>

      {/* to date */}
      <article className="relative flex items-center gap-2 w-max">
        <h5 className="w-10 text-[0.8rem]">To</h5>
        <DatePicker
          selected={convertUTCToLocalDate(endDate)}
          onChange={(date: Date) => {
            setEndDate(convertLocalToUTCDate(date) as Date);
            setEndDateFilter({
              ...endDateFilter,
              op: "le",
              value: Date.parse(String(convertLocalToUTCDate(date))) * 1000,
              type: "integer",
              set_op: "and",
            });
          }}
          selectsEnd
          startDate={convertUTCToLocalDate(startDate)}
          endDate={convertUTCToLocalDate(endDate)}
          showTimeSelect
          timeFormat="h:mm aa"
          timeIntervals={60}
          dateFormat="MMMM d, yyyy h:mm aa"
          placeholderText="To"
          nextMonthButtonLabel=">"
          previousMonthButtonLabel="<"
          popperClassName="react-datepicker-right"
          customInput={<DateInput startDate={startDate} endDate={endDate} />}
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

export default FilterDatepicker;

const DateInput = forwardRef(
  (
    { value, onClick, startDate, endDate }: any,
    ref: LegacyRef<HTMLButtonElement> | undefined
  ) => (
    <button
      onClick={onClick}
      ref={ref}
      type="button"
      className="inline-flex justify-start w-full px-3 py-2 text-xs font-medium dark:text-white dark:bg-search border shadow-sm hover:bg-gray-50 focus:outline-none rounded"
    >
      {convertToMicrosec(startDate) === convertToMicrosec(endDate)
        ? "Select Date"
        : convertToUTCString(value)}
    </button>
  )
);
