import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { convertToDate, convertToUTCString } from "src/utils/general";
import { filterIndex } from "../../../../constants/general";
import { Filter } from "../../../../types/general";
import Operator from "../Operator";

const FilterStatements = ({
  allFilters,
  setAllFilters,
  metadata,
}: {
  allFilters: Filter[];
  setAllFilters: (allFilters: Filter[]) => void;
  metadata: any;
}) => {
  return (
    <ul className="flex flex-wrap items-center gap-3 pt-3 text-xs">
      {allFilters.map((filter, index) => {
        if (
          filter.op === "le" &&
          convertToDate(Number(filter.value)).getFullYear() >= 1970
        )
          return null;

        return (
          <li
            data-test="filter-display"
            key={index}
            className="flex items-center gap-8"
          >
            {index > 0 && index < allFilters.length && (
              <Operator
                index={index - 1}
                allFilters={allFilters}
                setAllFilters={setAllFilters}
              />
            )}
            <article
              key={index}
              className="flex items-center gap-3 py-1.5 px-4 w-full dark:bg-filter rounded-full"
            >
              <p className="flex items-center gap-2 text-center">
                <span className="capitalize">
                  {metadata?.properties[filter.field].title}
                </span>
                {convertToDate(Number(filter.value)).getFullYear() >= 1970 ? (
                  <>
                    <span className="dark:text-signin">from</span>{" "}
                    {convertToUTCString(Number(filter.value))}
                    <span className="dark:text-signin">to</span>{" "}
                    {convertToUTCString(Number(allFilters[index + 1].value))}
                  </>
                ) : (
                  <>
                    <span className="dark:text-signin">
                      {Object.keys(filterIndex).find(
                        (key) => filterIndex[key] === filter.op
                      )}{" "}
                    </span>{" "}
                    {filter.value}
                  </>
                )}
              </p>
              <button
                id={String(index)}
                onClick={(e) => {
                  const clickedIndex = Number(e.currentTarget.id);
                  let newFilters: Filter[] = [...allFilters];

                  // remove last filter
                  if (clickedIndex === allFilters.length - 1) {
                    newFilters = allFilters.map(
                      (filter: Filter, filterIndex: number) =>
                        filterIndex === clickedIndex
                          ? { ...filter, set_op: "and" }
                          : filter
                    );
                  }
                  // remove in between filter
                  else if (
                    clickedIndex > 0 &&
                    clickedIndex < allFilters.length - 1
                  ) {
                    newFilters = allFilters.map(
                      (filter: Filter, filterIndex: number) =>
                        filterIndex === clickedIndex - 1
                          ? convertToDate(
                              Number(newFilters[clickedIndex].value)
                            ).getFullYear() >= 1970
                            ? {
                                ...filter,
                                set_op: allFilters[clickedIndex + 1].set_op,
                              }
                            : {
                                ...filter,
                                set_op: allFilters[clickedIndex].set_op,
                              }
                          : filter
                    );
                  }
                  setAllFilters(
                    newFilters.filter((filter, filterIndex) =>
                      (filterIndex === Number(e.currentTarget.id) ||
                        filterIndex === Number(e.currentTarget.id) + 1) &&
                      convertToDate(Number(filter.value)).getFullYear() >= 1970
                        ? ![
                            Number(e.currentTarget.id),
                            Number(e.currentTarget.id) + 1,
                          ].includes(filterIndex)
                        : filterIndex !== Number(e.currentTarget.id)
                    )
                  );
                }}
              >
                <FontAwesomeIcon
                  icon={faXmark}
                  className="dark:text-main cursor-pointer"
                />
              </button>
            </article>
          </li>
        );
      })}
    </ul>
  );
};

export default FilterStatements;
