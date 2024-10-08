/* eslint-disable no-restricted-globals */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretLeft,
  faCaretRight,
  faForward,
  faBackward,
} from "@fortawesome/free-solid-svg-icons";

const TablePagination = ({
  totalPages,
  beginning,
  end,
  totalCount,
  pageNumber,
  setPageNumber,
}: {
  totalPages: number;
  beginning: number;
  end: number;
  totalCount: number;
  pageNumber: number;
  setPageNumber: (pageNumber: number) => void;
}) => {
  return (
    <section className="flex flex-wrap items-center place-self-end gap-5 w-max font-light">
      <nav className="flex flex-items-center gap-2 text-xs">
        {/* first page */}
        <button
          disabled={pageNumber === 1}
          className="font-medium dark:text-checkbox dark:hover:text-expand dark:disabled:text-secondary disabled:opacity-40"
          onClick={() => setPageNumber(1)}
        >
          <FontAwesomeIcon
            icon={faBackward}
            className="w-4 h-4"
            aria-hidden="true"
          />
        </button>

        {/* previous page */}
        <button
          data-test="prev-page"
          disabled={pageNumber === 1}
          className="font-medium dark:text-checkbox dark:hover:text-expand dark:disabled:text-secondary disabled:opacity-40"
          onClick={() => setPageNumber(pageNumber - 1)}
        >
          <FontAwesomeIcon
            icon={faCaretLeft}
            className="w-4 h-4"
            aria-hidden="true"
          />
        </button>

        <p className="dark:text-checkbox">
          <span className="font-medium">
            {totalCount === 0 ? "0" : beginning}
          </span>{" "}
          - <span className="font-medium">{totalCount === 0 ? "0" : end}</span>{" "}
          of{" "}
          <span className="font-medium">
            {totalCount === 0 ? "0" : totalCount}
          </span>{" "}
        </p>

        {/* next page */}
        <button
          data-test="next-page"
          disabled={pageNumber === totalPages || totalCount === 0}
          className="font-medium dark:text-checkbox dark:hover:text-expand dark:disabled:text-secondary disabled:opacity-40"
          onClick={() => setPageNumber(pageNumber + 1)}
        >
          <FontAwesomeIcon
            icon={faCaretRight}
            className="w-4 h-4"
            aria-hidden="true"
          />
        </button>

        {/* last page */}
        <button
          disabled={pageNumber === totalPages || totalCount === 0}
          className="font-medium dark:text-checkbox dark:hover:text-expand dark:disabled:text-secondary disabled:opacity-40"
          onClick={() => setPageNumber(totalPages)}
        >
          <FontAwesomeIcon
            icon={faForward}
            className="w-4 h-4"
            aria-hidden="true"
          />
        </button>
      </nav>
    </section>
  );
};

export default TablePagination;
