import { MutableRefObject } from "react";
import { handleAutocompleteParamsToggle } from "src/utils/graph";

const AutocompleteParams = ({
  filteredAutocompleteParams,
  autocompleteRef,
  cursor,
  setCursor,
  setAutocompleteClick,
  setQuery,
  graphSearchString,
  setGraphSearchString,
  setGraphSearching,
}: {
  filteredAutocompleteParams: string[];
  autocompleteRef: MutableRefObject<any[]>;
  cursor: number;
  setCursor: (cursor: number) => void;
  setAutocompleteClick: (autocompleteClick: string) => void;
  setQuery: (query: string) => void;
  graphSearchString: string;
  setGraphSearchString: (graphSearchString: string) => void;
  setGraphSearching: (graphSearching: boolean) => void;
}) => {
  return (
    <ul
      data-test="query-params"
      className="grid content-start -ml-4 w-full max-h-[13rem] select-none text-xs sm:text-sm dark:bg-search focus:outline-none overflow-auto scrollbar z-40"
    >
      <li className="sticky top-0 pl-4 pb-2 w-full text-xs dark:text-gray-500 dark:bg-search">
        Search Parameters ({filteredAutocompleteParams?.length})
      </li>
      {filteredAutocompleteParams?.map((value: string, index: number) => (
        <li
          ref={(el) => (autocompleteRef.current[index] = el)}
          key={index}
          className={`flex items-center gap-2 px-8 py-2 w-full text-left break-all ${
            cursor === index ? "dark:bg-checkbox/20" : ""
          } cursor-pointer`}
          onMouseOver={() => setCursor(index)}
          onMouseEnter={() => setCursor(index)}
          onMouseLeave={() => setCursor(-1)}
          onClick={() => {
            handleAutocompleteParamsToggle(
              graphSearchString,
              setGraphSearchString,
              value
            );
            setQuery("");
            setGraphSearching(true);
            setAutocompleteClick(value);
          }}
        >
          <button className="text-xs dark:text-white">{value}</button>
        </li>
      ))}
    </ul>
  );
};

export default AutocompleteParams;
