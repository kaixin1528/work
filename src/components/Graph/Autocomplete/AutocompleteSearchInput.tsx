/* eslint-disable no-restricted-globals */
import React from "react";
import { handleAutocompleteQuery } from "src/utils/graph";
import { useGeneralStore } from "src/stores/general";

const AutocompleteSearchInput = ({
  enterKeyPress,
  setFocusInput,
  setQuery,
  setAutocompleteClick,
  setCursor,
  autocompleteClick,
  graphSearchString,
  setGraphSearchString,
  handleGraphSearch,
  setGraphSearching,
}: {
  enterKeyPress: boolean;
  setFocusInput: (focusInput: boolean) => void;
  setQuery: (query: string) => void;
  setAutocompleteClick: (autocompleteClick: string) => void;
  setCursor: (cursor: number) => void;
  autocompleteClick: string;
  graphSearchString: string;
  setGraphSearchString: (graphSearchString: string) => void;
  handleGraphSearch: Function;
  setGraphSearching: (graphSearching: boolean) => void;
}) => {
  const { setError } = useGeneralStore();

  return (
    <input
      id="autocomplete"
      data-test="graph-autocomplete"
      type="filter"
      autoComplete="off"
      spellCheck="false"
      placeholder="Search anything"
      value={graphSearchString}
      onKeyUpCapture={(e) => {
        // enter key enables search if enter key press is not doing autocomplete
        if (e.key === "Enter" && !enterKeyPress) handleGraphSearch();
      }}
      onChange={(e) => {
        handleAutocompleteQuery(
          e.target.value,
          setQuery,
          autocompleteClick,
          setAutocompleteClick
        );
        setGraphSearchString(e.target.value);
        setGraphSearching(true);
        setFocusInput(true);
        setCursor(-1);
        setError({ url: "", message: "" });
      }}
      onClick={() => {
        setFocusInput(true);
        setCursor(-1);
      }}
      className="px-3 w-full h-full text-xs placeholder:text-secondary placeholder:text-xs placeholder:font-medium dark:text-white dark:disabled:cursor-not-allowed border-transparent focus:ring-0 focus:border-transparent bg-transparent focus:outline-none dark:bg-search rounded-sm"
    />
  );
};

export default AutocompleteSearchInput;
