import { Popover } from "@headlessui/react";
import React, { RefObject, useRef, useState } from "react";
import { filterIndex } from "../../../../constants/general";
import { Filter } from "../../../../types/general";
import FilterDatepicker from "../../../Datepicker/FilterDatepicker";
import { convertToDate } from "src/utils/general";

const ApplyFilter = ({
  type,
  currentFilter,
  setCurrentFilter,
  allFilters,
  setAllFilters,
  setOpenFilter,
  setPageNumber,
}: {
  type: string;
  currentFilter: Filter;
  setCurrentFilter: (currentFilter: Filter) => void;
  allFilters: Filter[];
  setAllFilters: (allFilters: Filter[]) => void;
  setOpenFilter: (openFilter: boolean) => void;
  setPageNumber: (pageNumber: number) => void;
}) => {
  const [checked, setChecked] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [endDateFilter, setEndDateFilter] = useState<Filter>({
    field: "",
    op: "le",
    value: "",
    type: "integer",
    set_op: "and",
  });

  const filterConditions =
    type === "array"
      ? ["contains", "does not contain"]
      : type === "string"
      ? ["is", "is not", "contains", "does not contain"]
      : type === "boolean"
      ? ["is true", "is false"]
      : ["=", "!=", ">=", "<="];

  const buttonRef = useRef() as RefObject<HTMLButtonElement>;
  const positionRef = useRef() as RefObject<HTMLDivElement>;

  return (
    <section
      ref={positionRef}
      className="absolute left-52 -top-4 mt-3 w-72 shadow-xl shadow-filter/50 rounded-sm z-10"
    >
      <article
        data-test="option-second-level"
        className="relative grid gap-8 p-7 w-72 dark:bg-main rounded-sm"
      >
        {/* non-date filter */}
        {type !== "date-time" &&
          filterConditions.map((method: string) => (
            <article
              key={method}
              className="gridp-2 gap-2 py-1 -m-3 w-60 lowercase duration-100 dark:bg-main focus:outline-none"
            >
              <article className="flex items-center gap-3">
                <input
                  data-test="option-radio"
                  type="radio"
                  className="form-radio w-4 h-4 self-start mb-0.5 dark:ring-0 dark:text-signin dark:focus:border-signin focus:ring dark:focus:ring-offset-0 dark:focus:ring-signin focus:ring-opacity-50 rounded-full"
                  checked={checked === method}
                  onChange={() => {
                    setChecked(method);
                    setCurrentFilter({
                      ...currentFilter,
                      op: filterIndex[method],
                      ...(type === "boolean" && {
                        value: method.split(" ")[1],
                      }),
                      ...(type === "boolean" && {
                        type: "string",
                      }),
                      ...(type === "boolean" && {
                        set_op: "and",
                      }),
                    });
                  }}
                />
                <label className="text-[0.8rem] font-medium">{method}</label>
              </article>

              {/* only show input field if type is not boolean */}
              {checked === method && type !== "boolean" && (
                <input
                  data-test="option-input"
                  type="input"
                  value={currentFilter.value}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  onChange={(e) => {
                    setCurrentFilter({
                      ...currentFilter,
                      value:
                        type === "integer"
                          ? Number(e.target.value)
                          : e.target.value,
                      type: type,
                      set_op: "and",
                    });
                  }}
                  className={`form-input w-56 h-8 dark:text-white text-[0.8rem] ml-1 mt-1 py-1 px-4 dark:bg-search dark:ring-card dark:border-transparent focus:ring dark:focus:ring-transparent dark:focus:border-transparent`}
                />
              )}
            </article>
          ))}

        {/* date filter */}
        {type === "date-time" && (
          <FilterDatepicker
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
            endDateFilter={endDateFilter}
            setEndDateFilter={setEndDateFilter}
          />
        )}
        <article className="flex justify-between gap-3 w-full text-xs">
          <Popover.Button
            ref={buttonRef}
            className="py-2 px-4 bg-gradient-to-b dark:from-expand dark:to-expand/60 dark:hover:from-filter dark:hover:to-filter/30 rounded-sm"
            onClick={() => buttonRef.current?.click()}
          >
            Cancel
          </Popover.Button>
          <button
            data-test="apply"
            className="py-2 px-4 self-stretch gradient-button rounded-sm"
            onClick={() => {
              // if both dates are selected
              if (
                convertToDate(Number(currentFilter.value)).getFullYear() >=
                  1970 &&
                endDateFilter.value !== ""
              )
                setAllFilters([...allFilters, currentFilter, endDateFilter]);
              // if only start date is selected
              else if (
                convertToDate(Number(currentFilter.value)).getFullYear() >=
                  1970 &&
                endDateFilter.value === ""
              )
                setAllFilters([
                  ...allFilters,
                  currentFilter,
                  {
                    ...endDateFilter,
                    field: currentFilter.field,
                    value: Date.parse(String(endDate)) * 1000,
                  },
                ]);
              // if only end date is selected
              else if (currentFilter.value === "" && endDateFilter.value !== "")
                setAllFilters([
                  ...allFilters,
                  {
                    ...currentFilter,
                    field: endDateFilter.field,
                    op: "ge",
                    type: "integer",
                    value: Date.parse(String(startDate)) * 1000,
                    set_op: "and",
                  },
                  endDateFilter,
                ]);
              // if  no dates are selected, then date filter will be now
              else if (currentFilter.value === "" && endDateFilter.value === "")
                setAllFilters([
                  ...allFilters,
                  {
                    ...currentFilter,
                    field: endDateFilter.field,
                    op: "ge",
                    type: "integer",
                    value: Date.parse(String(startDate)) * 1000,
                    set_op: "and",
                  },
                  {
                    ...endDateFilter,
                    value: Date.parse(String(endDate)) * 1000,
                  },
                ]);
              // non-date filter
              else setAllFilters([...allFilters, currentFilter]);
              setCurrentFilter({
                field: "",
                op: "",
                value: "",
                type: "",
                set_op: "",
              });
              setEndDateFilter({
                field: "",
                op: "le",
                value: "",
                type: "integer",
                set_op: "and",
              });
              setOpenFilter(false);
              setChecked("");
              setStartDate(new Date());
              setEndDate(new Date());
              setPageNumber(1);
              buttonRef.current?.click();
            }}
          >
            Apply Filter
          </button>
        </article>
      </article>
    </section>
  );
};

export default ApplyFilter;
