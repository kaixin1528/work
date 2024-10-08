import { Popover, Transition } from "@headlessui/react";
import AdjustmentsIcon from "@heroicons/react/solid/AdjustmentsIcon";
import { useState } from "react";
import { Filter } from "../../../../types/general";
import FilterStatements from "./FilterStatements";
import ApplyFilter from "./ApplyFilter";

const TableFilter = ({
  metadata,
  currentFilter,
  setCurrentFilter,
  allFilters,
  setAllFilters,
  setPageNumber,
}: {
  metadata: any;
  currentFilter: Filter;
  setCurrentFilter: (currentFilter: Filter) => void;
  allFilters: Filter[];
  setAllFilters: (allFilters: Filter[]) => void;
  setPageNumber: (pageNumber: number) => void;
}) => {
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [type, setType] = useState<string>("");

  return (
    <section className="col-span-5 grid gap-2 mb-2 select-none">
      {/* filter statements display */}
      <FilterStatements
        allFilters={allFilters}
        setAllFilters={setAllFilters}
        metadata={metadata}
      />

      <section className="w-max dark:text-white z-20">
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                data-test="table-filter"
                className="relative group flex items-center"
              >
                <AdjustmentsIcon className="w-6 h-6 dark:text-checkbox" />
                {allFilters.length === 0 && (
                  <span
                    className={`absolute -top-1 -right-1.5 grid content-center w-3 h-3 text-[0.5rem] leading-4 gradient-button rounded-sm ${
                      !open && allFilters.length === 0 ? "animate-bounce" : ""
                    }`}
                  >
                    +
                  </span>
                )}
              </Popover.Button>
              <Transition
                enter="transition ease-out duration-100"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute w-60 shadow-xl shadow-filter/50 rounded-sm z-10">
                  <section className="grid gap-6 p-7 dark:bg-main rounded-sm">
                    {metadata?.required.map((col: string) => {
                      const column = metadata.properties[col];
                      if (
                        [true, "true"].includes(column.hidden) ||
                        col === "node_id"
                      )
                        return null;

                      return (
                        <section
                          data-test="options"
                          key={column.title}
                          className={`relative flex items-center p-2 -m-3 capitalize duration-100 cursor-default ${
                            currentFilter.field === col
                              ? "dark:bg-tooltip"
                              : "dark:bg-main"
                          } focus:outline-none`}
                          onMouseEnter={() => {
                            setCurrentFilter({
                              field: col,
                              op: "",
                              value: "",
                              type: "",
                              set_op: "",
                            });
                            setType(column.format || column.type);
                            setOpenFilter(true);
                          }}
                          onMouseLeave={() => setOpenFilter(false)}
                        >
                          <p className="text-[0.8rem] font-medium break-all">
                            {column.title}
                          </p>
                          {openFilter && currentFilter.field === col && (
                            <ApplyFilter
                              type={type}
                              currentFilter={currentFilter}
                              setCurrentFilter={setCurrentFilter}
                              allFilters={allFilters}
                              setAllFilters={setAllFilters}
                              setOpenFilter={setOpenFilter}
                              setPageNumber={setPageNumber}
                            />
                          )}
                        </section>
                      );
                    })}
                  </section>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </section>
    </section>
  );
};

export default TableFilter;
