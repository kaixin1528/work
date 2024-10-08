import React, { Fragment, useState } from "react";
import type { IHighlight } from "react-pdf-highlighter";
import { sortNumericData } from "src/utils/general";
import { pageSize } from "src/constants/general";
import { Popover, Transition } from "@headlessui/react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TablePagination from "src/components/General/TablePagination";

const PdfSidebar = ({
  highlights,
  query,
  setQuery,
  selectedHighlight,
  setSelectedHighlight,
  type,
}: {
  highlights: Array<IHighlight>;
  query: string;
  setQuery: (query: string) => void;
  selectedHighlight: string;
  setSelectedHighlight: (selectedHighlight: string) => void;
  type: string;
}) => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [filter, setFilter] = useState<boolean>(type === "source");

  const filteredHighlights = highlights?.filter(
    (highlight: any) =>
      highlight.content.text
        ?.toLowerCase()
        .replace(/\s+/g, "")
        .includes(query.toLowerCase().replace(/\s+/g, "")) &&
      (filter === false || (filter && highlight.mapped_policy_sections > 0))
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
          <aside className="flex flex-col flex-grow content-start gap-5 p-3 w-full h-full dark:text-white dark:bg-expand overflow-x-hidden overflow-y-auto scrollbar">
            <input
              type="input"
              placeholder="Search content"
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
            {type === "source" && (
              <article className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filter}
                  onChange={() => setFilter(!filter)}
                  className="form-checkbox w-4 h-4 dark:ring-0 dark:text-no dark:focus:border-no focus:ring dark:focus:ring-offset-0 dark:focus:ring-no focus:ring-opacity-50 rounded-full"
                />
                <span>Has mapping</span>
              </article>
            )}
            <ul className="flex flex-col flex-grow divide-y-1 dark:divide-checkbox/60 overflow-auto scrollbar">
              {sortedHighlights
                ?.slice(beginning - 1, end + 1)
                .map((highlight: any, index: number) => (
                  <li
                    key={index}
                    className={`grid gap-2 p-3 cursor-pointer ${
                      selectedHighlight === highlight.id
                        ? "dark:bg-signin/30"
                        : "dark:hover:bg-filter/60 duration-100"
                    } `}
                    onClick={() => setSelectedHighlight(highlight.id)}
                  >
                    {highlight.mapped_policy_sections && (
                      <span className="px-4 py-1 text-sm w-max bg-no rounded-full">
                        {highlight.mapped_policy_sections} mapping
                      </span>
                    )}
                    {highlight.content?.text ? (
                      <blockquote className="flex flex-wrap break-words text-sm">
                        {`${highlight.content.text.slice(0, 90).trim()}${
                          highlight.content.text.length > 90 ? "…" : ""
                        }`}
                      </blockquote>
                    ) : null}
                    {highlight.content?.image ? (
                      <span className="">
                        <img src={highlight.content.image} alt={"Screenshot"} />
                      </span>
                    ) : null}
                    <span className="text-xs">
                      Page {highlight?.pageNumber}
                    </span>
                  </li>
                ))}
            </ul>
          </aside>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default PdfSidebar;
