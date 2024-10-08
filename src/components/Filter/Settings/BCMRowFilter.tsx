/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { KeyStringVal } from "src/types/general";

const BCMRowFilter = ({
  label,
  rowFilters,
  setRowFilters,
  setIsEdited,
}: {
  label?: string;
  rowFilters: KeyStringVal[];
  setRowFilters: (rowFilters: KeyStringVal[]) => void;
  setIsEdited: (isEdited: boolean) => void;
}) => {
  return (
    <section className="grid content-start gap-3 py-5">
      <h4>{label}</h4>
      <ul className="grid gap-2 w-full">
        {rowFilters.map((filter: KeyStringVal, index: number) => {
          return (
            <li key={index} className="flex items-center gap-5">
              <h4 className="px-3 py-1 w-max capitalize dark:bg-filter rounded-md">
                {filter.row_key}
              </h4>
              <input
                type="input"
                value={filter.row_value}
                onChange={(e) => {
                  setIsEdited(true);
                  setRowFilters(
                    rowFilters.map((curFilter) => {
                      if (curFilter.row_key === filter.row_key)
                        return { ...filter, row_value: e.target.value };
                      return curFilter;
                    })
                  );
                }}
                className="px-3 py-1 border-1 dark:border-signin focus:ring-0 focus:border bg-transparent focus:outline-none rounded-md"
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default BCMRowFilter;
