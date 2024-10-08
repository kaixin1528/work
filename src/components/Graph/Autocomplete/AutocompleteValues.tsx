/* eslint-disable no-restricted-globals */
import { MutableRefObject } from "react";
import { AutocompleteMetadata } from "../../../types/general";
import { parseURL } from "../../../utils/general";
import { handleAutocompleValuesToggle } from "src/utils/graph";

const AutocompleteValues = ({
  filteredAutocompleteValues,
  autocompleteRef,
  cursor,
  setCursor,
  nodeTypeMetadata,
  propertyMetadata,
  setAutocompleteClick,
  setQuery,
  autocompleteClick,
  graphSearchString,
  setGraphSearchString,
  setGraphSearching,
}: {
  filteredAutocompleteValues: string[];
  autocompleteRef: MutableRefObject<any[]>;
  cursor: number;
  setCursor: (cursor: number) => void;
  nodeTypeMetadata: AutocompleteMetadata;
  propertyMetadata?: AutocompleteMetadata;
  setAutocompleteClick: (autocompleteClick: string) => void;
  setQuery: (query: string) => void;
  autocompleteClick: string;
  graphSearchString: string;
  setGraphSearchString: (graphSearchString: string) => void;
  setGraphSearching: (graphSearching: boolean) => void;
}) => {
  const parsed = parseURL();

  return (
    <ul
      data-test="query-values"
      className={`grid content-start -ml-4 w-full max-h-[13rem] select-none text-xs sm:text-sm dark:bg-search focus:outline-none ${
        filteredAutocompleteValues?.length > 6
          ? "overflow-y-auto scrollbar"
          : ""
      } z-40`}
    >
      <li className="sticky top-0 pl-4 pb-2 w-full text-xs dark:text-gray-500 dark:bg-search z-10">
        Suggest values ({filteredAutocompleteValues?.length})
      </li>
      {filteredAutocompleteValues?.map((value: string, index: number) => (
        <li
          ref={(el) => (autocompleteRef.current[index] = el)}
          key={index}
          className={`group flex items-center gap-2 px-8 py-2 w-full text-left break-words ${
            cursor === index ? "dark:bg-checkbox/20" : ""
          } cursor-pointer`}
          onMouseOver={() => setCursor(index)}
          onMouseEnter={() => setCursor(index)}
          onMouseLeave={() => setCursor(-1)}
          onClick={() => {
            handleAutocompleValuesToggle(
              graphSearchString,
              setGraphSearchString,
              value,
              autocompleteClick
            );
            setQuery("");
            setGraphSearching(true);
            setAutocompleteClick(value);
          }}
        >
          <button className="relative flex items-center gap-2 w-full text-xs dark:text-white text-left">
            <h4>{value}</h4>
            {nodeTypeMetadata[value] && (
              <ul
                className={`absolute left-1/2 ${
                  index < Math.ceil(filteredAutocompleteValues.length / 2)
                    ? "-top-2"
                    : "bottom-0"
                } hidden group-hover:grid gap-1 px-4 py-1 dark:bg-tooltip border-1 dark:border-checkbox z-10`}
              >
                {nodeTypeMetadata[value].name.map(
                  (name: string, index: number) => {
                    return (
                      <li key={index} className="flex items-start gap-2">
                        {
                          <img
                            src={`/general/integrations/${nodeTypeMetadata[
                              value
                            ].cloud[index].toLowerCase()}.svg`}
                            alt={String(parsed.integration)}
                            className="w-4 h-4"
                          />
                        }
                        {name}
                      </li>
                    );
                  }
                )}
              </ul>
            )}
            {propertyMetadata &&
              propertyMetadata[value]?.name?.every(
                (value) => value !== null
              ) && (
                <ul
                  className={`absolute left-1/2 ${
                    index < Math.ceil(filteredAutocompleteValues.length / 2)
                      ? "-top-2"
                      : "bottom-0"
                  } hidden group-hover:grid gap-1 px-4 py-1 dark:bg-tooltip border-1 dark:border-checkbox z-10`}
                >
                  {propertyMetadata[value].name.map(
                    (name: string, index: number) => {
                      return (
                        <li key={index} className="flex items-start gap-2">
                          {propertyMetadata[value].cloud &&
                            value !== "CUSTOMERCLD" && (
                              <img
                                src={`/general/integrations/${propertyMetadata[
                                  value
                                ].cloud[index].toLowerCase()}.svg`}
                                alt={String(parsed.integration)}
                                className="w-4 h-4"
                              />
                            )}
                          {name}
                        </li>
                      );
                    }
                  )}
                </ul>
              )}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default AutocompleteValues;
