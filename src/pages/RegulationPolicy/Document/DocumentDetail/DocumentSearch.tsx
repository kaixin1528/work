import {
  faMagnifyingGlass,
  faSquarePollHorizontal,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { LineWave } from "react-loader-spinner";

const DocumentSearch = ({
  search,
  isFetching,
  query,
  setQuery,
  setSearch,
  refetch,
}: {
  search: boolean;
  isFetching: boolean;
  query: string;
  setQuery: (query: string) => void;
  setSearch: (search: boolean) => void;
  refetch: any;
}) => {
  const handleSearch = () => {
    setSearch(true);
    refetch();
  };

  return (
    <section className="grid gap-3 w-2/5">
      <article className="flex items-center gap-5">
        <article className="flex items-center gap-2 w-full h-full">
          <input
            type="input"
            autoComplete="off"
            spellCheck="false"
            placeholder="Search content"
            value={query}
            onKeyUpCapture={(e) => {
              if (e.key === "Enter" && query !== "") handleSearch();
            }}
            onChange={(e) => {
              setSearch(false);
              setQuery(e.target.value);
            }}
            className="p-4 pr-12 w-[30rem] h-10 text-sm bg-gradient-to-b dark:bg-main border-t border-b dark:border-know/60 know focus:outline-none"
          />
          <article className="flex items-stretch gap-2 divide-x-1 dark:divide-checkbox/60">
            {query !== "" && (
              <button
                onClick={() => {
                  setQuery("");
                  setSearch(false);
                  refetch();
                }}
              >
                <FontAwesomeIcon
                  icon={faXmark}
                  className="text-reset hover:text-reset/60 duration-100"
                />
              </button>
            )}
            {search && isFetching ? (
              <LineWave
                visible={true}
                height="30"
                width="50"
                color="#4fa94d"
                ariaLabel="line-wave-loading"
                wrapperStyle={{}}
                wrapperClass=""
                firstLineColor=""
                middleLineColor=""
                lastLineColor=""
              />
            ) : (
              <button
                disabled={query === ""}
                className="px-2 dark:disabled:text-signin/30 dark:text-signin dark:hover:text-signin/60 duration-100"
                onClick={handleSearch}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            )}
          </article>
        </article>
      </article>
      {search && !isFetching && (
        <span className="flex items-center gap-1 text-sm text-investigation">
          <FontAwesomeIcon icon={faSquarePollHorizontal} />
          Showing content matching the search
        </span>
      )}
    </section>
  );
};

export default DocumentSearch;
