import { faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { KeyStringVal } from "src/types/general";

const Sort = ({
  sortingTypes,
  sort,
  setSort,
}: {
  sortingTypes: string[];
  sort: KeyStringVal;
  setSort: (sort: KeyStringVal) => void;
}) => {
  return (
    <Popover className="relative">
      <Popover.Button className="px-3 py-1 dark:text-black dark:bg-checkbox dark:hover:bg-checkbox/60 duration-100 focus:outline-none rounded-full">
        <FontAwesomeIcon icon={faSort} /> <span>Sort</span>
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="pointer-events-auto absolute top-8 left-0">
          <nav className="grid w-max overflow-auto scrollbar rounded-sm">
            {sortingTypes.map((sortingType) => {
              return (
                <button
                  key={sortingType}
                  className={`flex items-center gap-2 px-2 py-1 w-full capitalize ${
                    sort.order_by === sortingType
                      ? "dark:text-black dark:bg-checkbox"
                      : "dark:bg-filter dark:hover:bg-expand duration-100"
                  } `}
                  onClick={() =>
                    setSort({
                      direction: sort.direction === "asc" ? "desc" : "asc",
                      order_by: sortingType,
                    })
                  }
                >
                  <FontAwesomeIcon icon={faSort} />
                  {sortingType.replace("_", " ").replace("framework", "")}
                </button>
              );
            })}
          </nav>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default Sort;
