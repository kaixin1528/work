import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Filter } from "../../../types/general";

const Operator = ({
  index,
  allFilters,
  setAllFilters,
}: {
  index: number;
  allFilters: Filter[];
  setAllFilters: (allFilters: Filter[]) => void;
}) => {
  return (
    <section
      className={`${
        allFilters[index].set_op === "and" ? "w-16" : "w-[3.5rem]"
      } text-right`}
    >
      <Menu as="article" className="relative inline-block text-left">
        <article>
          <Menu.Button className="flex items-center uppercase px-4 py-1 w-full text-xs dark:text-white font-medium dark:bg-expand focus:outline-none rounded-full ">
            {allFilters[index].set_op}
            <ChevronDownIcon
              className="ml-2 -mr-1 w-5 h-5"
              aria-hidden="true"
            />
          </Menu.Button>
        </article>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-0 w-24 origin-top-right dark:text-white dark:bg-card divide-y dark:divide-gray-100 focus:outline-none rounded-sm z-50">
            <article className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    id="1"
                    className={`${
                      active ? "dark:bg-expand" : ""
                    } group flex items-center p-2 w-full text-xs`}
                    onClick={() => {
                      setAllFilters(
                        allFilters.map((filter: Filter, filterIndex: number) =>
                          filterIndex === index
                            ? { ...filter, set_op: "and" }
                            : filter
                        )
                      );
                    }}
                  >
                    AND
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    id="2"
                    className={`${
                      active ? "dark:bg-expand" : ""
                    } group flex items-center p-2 w-full text-sm`}
                    onClick={() => {
                      setAllFilters(
                        allFilters.map((filter: Filter, filterIndex: number) =>
                          filterIndex === index
                            ? { ...filter, set_op: "or" }
                            : filter
                        )
                      );
                    }}
                  >
                    OR
                  </button>
                )}
              </Menu.Item>
            </article>
          </Menu.Items>
        </Transition>
      </Menu>
    </section>
  );
};

export default Operator;
