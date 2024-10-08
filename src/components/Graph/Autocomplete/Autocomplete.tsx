/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import { faXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  MutableRefObject,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  deconstructSearchString,
  getLastQueryParam,
  handleAutocompleteParamsToggle,
  handleAutocompleValuesToggle,
  keyPressAutocomplete,
  useKeyPress,
} from "../../../utils/graph";
import { useGraphStore } from "../../../stores/graph";
import { getCustomerCloud, parseURL } from "../../../utils/general";
import { useGeneralStore } from "../../../stores/general";
import { autcompleteQueryParams } from "../../../constants/general";
import AutocompleteSearchInput from "./AutocompleteSearchInput";
import AutocompleteParams from "./AutocompleteParams";
import AutocompleteValues from "./AutocompleteValues";
import React from "react";
import SuggestQueries from "./SuggestQueries";
import { orgCloud } from "src/constants/graph";
import {
  GetAutocompleteParams,
  GetAutocompleteValues,
} from "src/services/graph/autocomplete";
import Cypher from "src/pages/KnowledgeGraph/Cypher/Cypher";
import Chat from "src/pages/KnowledgeGraph/Chat/Chat";

const Autocomplete = ({
  graphType,
  startTime,
  endTime,
  graphSearchString,
  setGraphSearchString,
  graphSearching,
  setGraphSearch,
  setGraphSearching,
  setSelectedReturnType,
}: {
  graphType: string;
  startTime: number;
  endTime: number;
  graphSearchString: string;
  setGraphSearchString: (graphSearchString: string) => void;
  graphSearching: boolean;
  setGraphSearch: (graphSearch: boolean) => void;
  setGraphSearching: (graphSearching: boolean) => void;
  setSelectedReturnType?: (selectedRetunType: string) => void;
}) => {
  const parsed = parseURL();
  const customerCloud = getCustomerCloud();

  const { error, setError, env } = useGeneralStore();
  const {
    graphInfo,
    setGraphInfo,
    setGraphNav,
    setSelectedTemporalDay,
    setSelectedTemporalTimestamp,
    setTemporalSearchTimestamps,
  } = useGraphStore();

  const focusRef = useRef() as RefObject<HTMLElement>;
  const autocompleteRef = useRef([]) as MutableRefObject<HTMLElement[]>;
  const [focusInput, setFocusInput] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [cursor, setCursor] = useState<number>(-1);
  const [enterKeyPress, setEnterKeyPress] = useState<boolean>(false);
  const [autocompleteClick, setAutocompleteClick] = useState<string>("");

  const params = Object.keys(deconstructSearchString(graphSearchString));
  const lastQueryParam = getLastQueryParam(
    graphSearchString,
    autocompleteClick
  );
  const curQueryParam = graphSearchString.slice(
    graphSearchString.lastIndexOf(" ") !== -1
      ? graphSearchString.lastIndexOf(" ") + 1
      : 0,
    graphSearchString.lastIndexOf(":") > graphSearchString.lastIndexOf(" ")
      ? graphSearchString.lastIndexOf(":")
      : graphSearchString.length
  );

  const { data: autocompleteParams } = GetAutocompleteParams(
    env,
    graphType,
    String(parsed.integration || "")
  );
  const { data: autocompleteValues } = GetAutocompleteValues(
    env,
    graphType,
    String(parsed.integration || ""),
    graphSearchString,
    graphSearching,
    lastQueryParam,
    startTime,
    endTime
  );

  const filteredAutocompleteParams = autocompleteParams
    ? autocompleteParams.query_params.filter(
        (value: string) =>
          !params.includes(value) &&
          value.toLowerCase().includes(curQueryParam.toLowerCase())
      )
    : [];
  const filteredAutocompleteValues = autocompleteValues
    ? autocompleteValues.query_params.filter((value: string) =>
        value
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(query.replace('"', "").toLowerCase().replace(/\s+/g, ""))
      )
    : [];
  const nodeTypeMetadata = autocompleteParams?.metadata;
  const propertyMetadata = autocompleteValues?.metadata;
  const showAutocompleteParams =
    focusInput &&
    graphSearchString.lastIndexOf(":") <
      graphSearchString.lastIndexOf(curQueryParam);
  const showAutocompleteValues =
    focusInput && autcompleteQueryParams.includes(lastQueryParam);

  const downPress = useKeyPress("ArrowDown", setEnterKeyPress);
  const upPress = useKeyPress("ArrowUp", setEnterKeyPress);
  const enterPress = useKeyPress("Enter", setEnterKeyPress);

  const handleGraphSearch = () => {
    setError({ url: "", message: "" });
    setGraphInfo({ ...graphInfo, showPanel: false });
    setGraphSearching(false);
    setGraphSearch(true);
    setFocusInput(false);
    setGraphNav([
      {
        nodeID: customerCloud,
        nodeType: orgCloud,
      },
    ]);
    setSelectedTemporalDay("");
    setSelectedTemporalTimestamp(-1);
    setTemporalSearchTimestamps({});
  };

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
    keyPressAutocomplete(
      showAutocompleteParams,
      showAutocompleteValues,
      filteredAutocompleteParams,
      filteredAutocompleteValues,
      downPress,
      upPress,
      cursor,
      setCursor,
      autocompleteRef
    );
  }, [downPress, upPress]);

  useEffect(() => {
    const handleClick = (value: string) => {
      setQuery("");
      setGraphSearching(true);
      setAutocompleteClick(value);
      setEnterKeyPress(true);
      setCursor(-1);
    };
    if (showAutocompleteParams && filteredAutocompleteParams[cursor]) {
      handleAutocompleteParamsToggle(
        graphSearchString,
        setGraphSearchString,
        filteredAutocompleteParams[cursor]
      );
      handleClick(filteredAutocompleteParams[cursor]);
    } else if (showAutocompleteValues && filteredAutocompleteValues[cursor]) {
      handleAutocompleValuesToggle(
        graphSearchString,
        setGraphSearchString,
        filteredAutocompleteValues[cursor],
        autocompleteClick
      );
      handleClick(filteredAutocompleteValues[cursor]);
    }
  }, [enterPress]);

  return (
    <section
      ref={focusRef}
      className={`relative flex items-center gap-3 px-4 h-9 w-full ${
        error.url.includes("/graph/search") ? "border border-reset" : ""
      } dark:bg-search rounded-sm`}
    >
      {error.url.includes("/graph/search") && (
        <p className="absolute -top-4 text-xs dark:text-reset">
          {error.message}
        </p>
      )}
      {setSelectedReturnType && (
        <Cypher
          startTime={startTime}
          endTime={endTime}
          setSelectedReturnType={setSelectedReturnType}
        />
      )}
      <Chat />
      <AutocompleteSearchInput
        enterKeyPress={enterKeyPress}
        setFocusInput={setFocusInput}
        setQuery={setQuery}
        setAutocompleteClick={setAutocompleteClick}
        setCursor={setCursor}
        autocompleteClick={autocompleteClick}
        graphSearchString={graphSearchString}
        setGraphSearchString={setGraphSearchString}
        handleGraphSearch={handleGraphSearch}
        setGraphSearching={setGraphSearching}
      />
      {focusInput && (
        <section className="absolute top-8 grid w-full">
          {graphType === "main" && (
            <SuggestQueries
              setFocusInput={setFocusInput}
              setEnterKeyPress={setEnterKeyPress}
            />
          )}
          {graphType !== "main" ? (
            showAutocompleteParams ? (
              <AutocompleteParams
                filteredAutocompleteParams={filteredAutocompleteParams}
                autocompleteRef={autocompleteRef}
                cursor={cursor}
                setCursor={setCursor}
                setAutocompleteClick={setAutocompleteClick}
                setQuery={setQuery}
                graphSearchString={graphSearchString}
                setGraphSearchString={setGraphSearchString}
                setGraphSearching={setGraphSearching}
              />
            ) : (
              showAutocompleteValues && (
                <AutocompleteValues
                  filteredAutocompleteValues={filteredAutocompleteValues}
                  autocompleteRef={autocompleteRef}
                  cursor={cursor}
                  setCursor={setCursor}
                  nodeTypeMetadata={nodeTypeMetadata}
                  propertyMetadata={propertyMetadata}
                  setAutocompleteClick={setAutocompleteClick}
                  setQuery={setQuery}
                  autocompleteClick={autocompleteClick}
                  graphSearchString={graphSearchString}
                  setGraphSearchString={setGraphSearchString}
                  setGraphSearching={setGraphSearching}
                />
              )
            )
          ) : null}
        </section>
      )}
      <article className="flex items-center gap-2 divide-x dark:divide-checkbox">
        {graphSearchString !== "" && (
          <button
            data-test="clear-query"
            className="underline text-sm red-button"
            onClick={() => {
              setGraphInfo({ ...graphInfo, showPanel: false });
              setGraphSearchString("");
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        )}
        <button
          data-test="search"
          disabled={graphSearchString === ""}
          className="pl-2 underline text-sm dark:text-signin dark:hover:text-signin/60 dark:disabled:text-secondary"
          onClick={handleGraphSearch}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </article>
    </section>
  );
};

export default Autocomplete;
