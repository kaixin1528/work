/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  MutableRefObject,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { GetSuggestMainSearchQueries } from "src/services/graph/autocomplete";
import { useGeneralStore } from "src/stores/general";
import { useGraphStore } from "src/stores/graph";
import { useKeyPress, keyPressSuggestQueries } from "src/utils/graph";

const SuggestQueries = ({
  setFocusInput,
  setEnterKeyPress,
}: {
  setFocusInput: (focusInput: boolean) => void;
  setEnterKeyPress: (enterKeyPress: boolean) => void;
}) => {
  const { env } = useGeneralStore();
  const {
    setGraphSearchString,
    setGraphSearch,
    setGraphSearching,
    navigationView,
  } = useGraphStore();

  const focusRef = useRef() as RefObject<HTMLElement>;
  const autocompleteRef = useRef([]) as MutableRefObject<any[]>;
  const [selectedQueryType, setSelectedQueryType] = useState<string>("recents");
  const [cursor, setCursor] = useState<number>(-1);

  const { data: suggestQueries } = GetSuggestMainSearchQueries(
    env,
    navigationView,
    selectedQueryType
  );

  const downPress = useKeyPress("ArrowDown", setEnterKeyPress);
  const upPress = useKeyPress("ArrowUp", setEnterKeyPress);
  const enterPress = useKeyPress("Enter", setEnterKeyPress);

  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (!focusRef?.current?.contains(event.target)) setFocusInput(false);
    };
    const handleEscape = (event: {
      key: string;
      preventDefault: () => void;
    }) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setFocusInput(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [focusRef]);

  useEffect(() => {
    keyPressSuggestQueries(
      suggestQueries,
      downPress,
      upPress,
      cursor,
      setCursor,
      autocompleteRef
    );
  }, [downPress, upPress]);

  useEffect(() => {
    if (suggestQueries && suggestQueries[cursor]) {
      setGraphSearchString(suggestQueries[cursor]);
      setGraphSearching(false);
      setGraphSearch(true);
      setFocusInput(false);
      setCursor(-1);
    }
  }, [enterPress]);

  return (
    <section
      ref={focusRef}
      className="grid content-start gap-2 -ml-4 w-full h-full select-none text-xs dark:bg-search focus:outline-none overflow-y-auto scrollbar z-40"
    >
      <nav className="sticky top-0 flex items-center w-full divide-x dark:divide-checkbox dark:bg-search">
        {["recents", "services", "property", "evolution", "addon"].map(
          (queryType) => {
            return (
              <button
                key={queryType}
                className={`py-2 w-full capitalize ${
                  selectedQueryType === queryType
                    ? "dark:bg-signin/20"
                    : "dark:hover:bg-filter/30 duration-100"
                }`}
                onClick={() => {
                  if (selectedQueryType !== queryType)
                    setSelectedQueryType(queryType);
                  else setSelectedQueryType("");
                }}
              >
                {queryType}
              </button>
            );
          }
        )}
      </nav>
      <ul className="grid">
        {suggestQueries ? (
          suggestQueries.length > 0 ? (
            suggestQueries.map((query: string, index: number) => {
              return (
                <li
                  key={query}
                  ref={(el) => (autocompleteRef.current[index] = el)}
                >
                  <button
                    className={`flex items-center gap-2 px-8 py-2 w-full text-left break-all ${
                      cursor === index ? "dark:bg-checkbox/20" : ""
                    } cursor-pointer`}
                    onMouseMove={() => setCursor(index)}
                    onClick={() => {
                      setGraphSearchString(query);
                      setGraphSearch(true);
                      setGraphSearching(false);
                      setFocusInput(false);
                    }}
                  >
                    {query}
                  </button>
                </li>
              );
            })
          ) : (
            <p className="px-4 py-2">No suggested queries available</p>
          )
        ) : null}
      </ul>
    </section>
  );
};

export default SuggestQueries;
