import React from "react";
import TablePagination from "src/components/General/TablePagination";

const PaginatedListLayout: React.FC<{
  totalCount: number;
  totalPages: number;
  beginning: number;
  end: number;
  pageNumber: any;
  setPageNumber: any;
  placeholderText?: string;
  query?: string;
  setQuery?: (query: string) => void;
  hideSearch?: boolean;
}> = ({
  totalCount,
  totalPages,
  beginning,
  end,
  placeholderText,
  query,
  setQuery,
  pageNumber,
  setPageNumber,
  hideSearch,
  children,
}) => {
  return (
    <section className="flex flex-col flex-grow content-start gap-3 p-4 w-full h-full text-sm dark:bg-card overflow-auto scrollbar">
      {!hideSearch && setQuery && (
        <article className="h-10 w-full">
          <input
            type="filter"
            autoComplete="off"
            spellCheck="false"
            placeholder={placeholderText}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPageNumber(1);
            }}
            className="w-full h-8 pl-3 text-sm placeholder:text-secondary placeholder:text-xs placeholder:font-medium dark:disabled:cursor-not-allowed border-transparent focus:ring-0 focus:border-transparent bg-transparent focus:outline-none dark:bg-search rounded-sm"
          />
        </article>
      )}

      <section className="flex flex-col flex-grow gap-3 overflow-auto scrollbar">
        <TablePagination
          totalPages={totalPages}
          beginning={beginning}
          end={end}
          totalCount={totalCount}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
        />

        {/* filtered list */}
        {children}
      </section>
    </section>
  );
};

export default PaginatedListLayout;
