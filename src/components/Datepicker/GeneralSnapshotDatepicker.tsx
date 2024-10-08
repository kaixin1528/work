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
  convertToMicrosec,
  convertToUTCString,
  convertToDate,
} from "../../utils/general";

const GeneralSnapshotDatepicker = ({
  label,
  keyName,
  inputs,
  setInputs,
  onlyFutureDate,
}: {
  label?: string;
  keyName: string;
  inputs: any;
  setInputs: (inputs: any) => void;
  onlyFutureDate?: boolean;
}) => {
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
          {typeof inputs[keyName] === "number"
            ? convertToUTCString(inputs[keyName])
            : inputs[keyName] instanceof Date
            ? convertToUTCString(convertToMicrosec(inputs[keyName]))
            : "Select Time"}
        </p>
      </article>
    )
  );

  return (
    <section className="flex items-center gap-2">
      {label && <h4>{label}</h4>}
      <article className="relative flex items-center w-max">
        <DatePicker
          selected={convertUTCToLocalDate(convertToDate(inputs[keyName]))}
          onChange={(date) =>
            setInputs({
              ...inputs,
              [keyName]: convertToMicrosec(convertLocalToUTCDate(date)),
            })
          }
          selectsStart
          filterDate={
            onlyFutureDate
              ? (date) => {
                  const timestamp = convertToMicrosec(date);
                  return timestamp > Date.now() * 1000;
                }
              : (date) => {
                  return true;
                }
          }
          startDate={convertUTCToLocalDate(convertToDate(inputs[keyName]))}
          showTimeSelect
          timeFormat="h:mm aa"
          timeIntervals={60}
          dateFormat="MMMM d, yyyy h:mm aa"
          placeholderText="From"
          nextMonthButtonLabel=">"
          previousMonthButtonLabel="<"
          popperClassName="react-datepicker"
          customInput={<DateInput />}
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => {
            return (
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
            );
          }}
        />
      </article>
    </section>
  );
};

export default GeneralSnapshotDatepicker;
