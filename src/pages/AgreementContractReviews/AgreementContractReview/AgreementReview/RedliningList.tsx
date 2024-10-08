import React, { Fragment, useState } from "react";
import type { IHighlight } from "react-pdf-highlighter";
import { sortNumericData } from "src/utils/general";
import { pageSize } from "src/constants/general";
import { Popover, Transition } from "@headlessui/react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TablePagination from "src/components/General/TablePagination";
import RedliningDetail from "./RedliningDetail";

const RedliningList = ({
  agreementID,
  highlights,
  selectedHighlight,
  setSelectedHighlight,
}: {
  agreementID: string;
  highlights: Array<IHighlight>;
  selectedHighlight: string;
  setSelectedHighlight: (selectedHighlight: string) => void;
}) => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [query, setQuery] = useState<string>("");

  const filteredHighlights = highlights?.filter((redline: any) =>
    `${redline.old_content.text} ${redline.new_edits}`
      ?.toLowerCase()
      .replace(/\s+/g, "")
      .includes(query.toLowerCase().replace(/\s+/g, ""))
  );
  const sortedHighlights = sortNumericData(
    filteredHighlights,
    "pageNumber",
    "asc"
  );
  const totalCount = filteredHighlights?.length || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <Popover className="relative">
      <Popover.Button className="px-2 py-1 dark:text-black dark:bg-checkbox dark:hover:bg-checkbox/60 duration-100 focus:outline-none rounded-full">
        <FontAwesomeIcon icon={faBars} className="w-4 h-4" />
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
        <Popover.Panel className="pointer-events-auto absolute top-10 left-0 flex flex-col flex-grow m-4 md:w-[18rem] xl:w-[30rem] h-[35rem] break-words z-10">
          <aside className="flex flex-col flex-grow content-start gap-2 p-3 w-full h-full dark:text-white dark:bg-expand overflow-x-hidden overflow-y-auto scrollbar">
            <h4>Redlining</h4>
            <input
              type="input"
              placeholder="Search redlining"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPageNumber(1);
              }}
              className="px-4 py-1 w-full h-8 text-sm placeholder:text-filter dark:bg-card focus:outline-none"
            />
            <TablePagination
              totalPages={totalPages}
              beginning={beginning}
              end={end}
              totalCount={totalCount}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
            />
            <ul className="flex flex-col flex-grow divide-y-1 dark:divide-checkbox/60 overflow-auto scrollbar">
              {sortedHighlights
                ?.slice(beginning - 1, end + 1)
                .map((redline: any, index: number) => {
                  return (
                    <RedliningDetail
                      key={index}
                      agreementID={agreementID}
                      redline={redline}
                      selectedHighlight={selectedHighlight}
                      setSelectedHighlight={setSelectedHighlight}
                    />
                  );
                })}
            </ul>
          </aside>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default RedliningList;
