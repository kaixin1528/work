/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/anchor-is-valid */
import ModalLayout from "src/layouts/ModalLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "react-router-dom";
import { useGraphStore } from "src/stores/graph";
import {
  convertToUTCString,
  extractIDFromQuery,
  sortNumericData,
} from "src/utils/general";
import { GetSpotlightSearchResults } from "src/services/general/general";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { integrationTypes, queryStringColors } from "src/constants/general";
import { useSummaryStore } from "src/stores/summaries";
import { useGeneralStore } from "src/stores/general";
import { initialDiffFilter } from "src/constants/graph";
import { KeyStringVal } from "src/types/general";
import { handleViewSnapshot } from "src/utils/graph";
import { GetQueryLookup } from "src/services/graph/search";

const SpotlightSearch = () => {
  const navigate = useNavigate();

  const { setSpotlightSearchString } = useGeneralStore();
  const {
    setPeriod,
    setSelectedReportAccount,
    setSelectedVRSeverity,
    setSelectedVRCVE,
    setSelectedVRIntegrationType,
    setSelectedVRPage,
    setSelectedDSNav,
    setSelectedDSResourceType,
    setSelectedDSResourceID,
    setSelectedCSAction,
    setSelectedCSNodeType,
    setSelectedCSNodeID,
  } = useSummaryStore();
  const {
    setGraphSearchString,
    setGraphSearch,
    setGraphSearching,
    setNavigationView,
    setSnapshotIndex,
    setSnapshotTime,
    snapshotTime,
    setDiffIntegrationType,
    setDiffView,
    setDiffStartTime,
    setDiffFilter,
  } = useGraphStore();

  const [showSpotlightSearch, setShowSpotlightSearch] =
    useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Graph");

  const getSpotlightSearchResults = GetSpotlightSearchResults();
  const queryLookup = GetQueryLookup();

  useHotkeys(
    "shift+s",
    () => {
      setQuery("");
      setShowSpotlightSearch(!showSpotlightSearch);
    },
    [showSpotlightSearch]
  );
  useEffect(() => {
    const handleEscape = (event: {
      key: string;
      preventDefault: () => void;
    }) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setQuery("");
        setShowSpotlightSearch(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleOnClose = () => {
    setQuery("");
    setShowSpotlightSearch(false);
    setSelectedCategory("");
  };

  const handleSearchResults = (category: string) =>
    getSpotlightSearchResults.mutate({
      searchString: query,
      category: category,
    });

  const filteredSearchResults = sortNumericData(
    getSpotlightSearchResults.data?.hits?.filter(
      (searchResult: any) => searchResult.id.split("+")[0] === selectedCategory
    ),
    "score",
    "desc"
  );

  useEffect(() => {
    if (
      getSpotlightSearchResults.data?.hits.length > 0 &&
      selectedCategory === ""
    ) {
      const sortedScores = sortNumericData(
        getSpotlightSearchResults.data?.hits,
        "score",
        "desc"
      );
      setSelectedCategory(sortedScores[0].id.split("+")[0]);
    }
  }, [getSpotlightSearchResults]);

  return (
    <>
      <article className="group relative">
        <img
          src="/general/raccoon.png"
          alt="raccoon"
          className="w-7 h-7 cursor-pointer dark:text-checkbox dark:hover:text-checkbox/30 duration-100"
          onClick={() => {
            setQuery("");
            setShowSpotlightSearch(!showSpotlightSearch);
          }}
        />
        <span className="hidden group-hover:block absolute top-10 right-0 p-2 w-max text-xs dark:bg-filter black-shadow rounded-sm z-20">
          Global search
        </span>
      </article>
      <ModalLayout showModal={showSpotlightSearch} onClose={handleOnClose}>
        <section className="grid content-start gap-5 py-2 px-4 mt-10 mb-5 dark:bg-search">
          <article className="flex items-center gap-2">
            <img src="/general/raccoon.png" alt="raccoon" className="w-7 h-7" />
            <input
              type="input"
              autoComplete="off"
              spellCheck="false"
              placeholder="Find the needle in your haystack!"
              value={query}
              onKeyUpCapture={(e) => {
                if (e.key === "Enter") handleSearchResults(selectedCategory);
              }}
              onChange={(e) => setQuery(e.target.value)}
              className="p-2 w-full h-full text-lg placeholder:text-secondary placeholder:text-lg placeholder:font-medium dark:text-white border-transparent focus:ring-0 focus:border-transparent bg-transparent focus:outline-none dark:bg-search rounded-sm"
            />
            <button
              disabled={query === ""}
              className="px-4 dark:disabled:text-signin/30 dark:text-signin dark:hover:text-signin/60 duration-100"
              onClick={() => handleSearchResults(selectedCategory)}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </article>
        </section>
        {getSpotlightSearchResults.status === "loading" && (
          <article className="grid gap-1 text-center">
            <img
              src="/general/raccoon.png"
              alt="raccoon"
              className="w-7 h-7 mx-auto animate-bounce"
            />
            <p>searching</p>
          </article>
        )}
        {query !== "" && getSpotlightSearchResults?.data && (
          <>
            <nav className="flex items-center w-full">
              {["Graph", "Summary", "Evolution"].map((category: string) => {
                return (
                  <button
                    key={category}
                    className={`p-2 w-full ${
                      selectedCategory === category
                        ? "dark:bg-signin/10 border dark:border-signin"
                        : "dark:text-checkbox dark:hover:text-white duration-100 dark:bg-filter/10 border dark:border-filter"
                    }`}
                    onClick={() => {
                      setSelectedCategory(category);
                      handleSearchResults(category);
                    }}
                  >
                    {category}
                  </button>
                );
              })}
            </nav>
            {filteredSearchResults?.length > 0 ? (
              <section className="grid gap-5">
                {getSpotlightSearchResults.data?.max_score < 0.1 ? (
                  <p>No relevant results found</p>
                ) : (
                  <ul className="grid gap-1">
                    {filteredSearchResults?.map(
                      (result: any, index: number) => {
                        let title = "";
                        let timestamps = [] as number[];
                        const array = result.id.split("+");
                        const category = array[0];
                        switch (category) {
                          case "Graph":
                            title = array[3];
                            timestamps = [
                              ...new Set(
                                filteredSearchResults.reduce(
                                  (pV: number[]) => [...pV, Number(array[2])],
                                  []
                                )
                              ),
                            ] as number[];
                            break;
                          case "Evolution":
                            title = `${array[1]}: ${array[5]}`;
                            timestamps = [
                              ...new Set(
                                filteredSearchResults.reduce(
                                  (pV: number[]) => [...pV, Number(array[4])],
                                  []
                                )
                              ),
                            ] as number[];
                            break;
                          case "Summary":
                            const reportName = array[1].toLowerCase();
                            title = `${array[1].replaceAll("_", " ")}: `;
                            switch (reportName) {
                              case "network_topology":
                                title += `${array[5]}/${array[6]}`;
                                break;
                              case "vulnerability_risks":
                                title += `${array[4]}/${array[7]}`;
                                break;
                              case "database_and_storage":
                                title += `${array[6]}/${array[7]}`;
                                break;
                              case "compute_and_services_modifications":
                                title += `${array[5]} - ${array[7]}`;
                                break;
                            }
                        }
                        if (
                          result.score < 0.1 ||
                          filteredSearchResults
                            .slice(0, index)
                            .some((curResult: KeyStringVal) => {
                              const array = curResult.id.split("+");
                              return [
                                array[3],
                                `${array[1]}: ${array[5]}`,
                              ].includes(title);
                            })
                        )
                          return null;
                        return (
                          <li key={result.id} className="grid gap-1 py-4">
                            <button
                              className="grid gap-1 p-2 cursor-pointer dark:hover:bg-filter/30 duration-100"
                              onClick={() => {
                                setShowSpotlightSearch(false);
                                switch (category) {
                                  case "Graph":
                                    if (
                                      (snapshotTime as Date).getTime() *
                                        1000 !==
                                      timestamps[0]
                                    )
                                      setSnapshotIndex(-1);
                                    queryLookup.mutate(
                                      {
                                        requestData: {
                                          query_type: "view_in_graph",
                                          id: extractIDFromQuery(title),
                                        },
                                      },
                                      {
                                        onSuccess: (queryString) =>
                                          handleViewSnapshot(
                                            queryString,
                                            setNavigationView,
                                            setGraphSearch,
                                            setGraphSearching,
                                            setGraphSearchString,
                                            navigate,
                                            setSnapshotTime,
                                            timestamps[0]
                                          ),
                                      }
                                    );
                                    break;
                                  case "Evolution":
                                    setNavigationView("evolution");
                                    setDiffIntegrationType(array[1]);
                                    setDiffView("snapshot");
                                    setDiffStartTime({
                                      month: 0,
                                      day: Number(array[2]),
                                      hour: Number(array[3]),
                                      snapshot: Number(array[4]),
                                    });
                                    setDiffFilter(initialDiffFilter);
                                    navigate("/graph/summary");
                                    break;
                                  case "Summary":
                                    const reportName = array[1].toLowerCase();
                                    switch (reportName) {
                                      case "network_topology":
                                        setSpotlightSearchString(array[3]);
                                        break;
                                      case "vulnerability_risks":
                                        setSelectedVRSeverity(array[3]);
                                        setSelectedVRCVE(array[4]);
                                        setSelectedVRIntegrationType(array[5]);
                                        setSelectedVRPage(Number(array[6]));
                                        setSpotlightSearchString(array[7]);
                                        break;
                                      case "database_and_storage":
                                        setSelectedDSNav(
                                          array[5].replaceAll("_", " ")
                                        );
                                        setSelectedDSResourceType(array[6]);
                                        setSelectedDSResourceID(array[7]);
                                        setSpotlightSearchString(array[7]);
                                        break;
                                      case "compute_and_services_modifications":
                                        setSelectedCSAction(
                                          array[5].toLowerCase()
                                        );
                                        setSelectedCSNodeType(array[6]);
                                        setSelectedCSNodeID(array[7]);
                                        setSpotlightSearchString(array[7]);
                                        break;
                                    }
                                    sessionStorage.page = "Summaries";
                                    setPeriod(Number(array[2]));
                                    if (integrationTypes.includes(array[3]))
                                      setSelectedReportAccount({
                                        integration_type: array[3],
                                        customer_cloud_id: array[4],
                                      });
                                    navigate(
                                      `/summaries/details?summary=${reportName}`
                                    );
                                    break;
                                }
                              }}
                            >
                              <h4 className="break-all">{title}</h4>
                              <article className="flex items-center gap-2 px-2 py-1 w-max break-all text-[0.65rem] dark:text-checkbox">
                                <FontAwesomeIcon
                                  icon={faClock}
                                  className="dark:text-admin"
                                />
                                <p>{convertToUTCString(timestamps[0])}</p>
                              </article>
                            </button>
                            <Disclosure defaultOpen={index === 0}>
                              {({ open }) => (
                                <>
                                  <Disclosure.Button className="flex items-center gap-2 px-4 w-full text-left text-xs dark:text-checkbox focus:outline-none">
                                    <p>{open ? "Hide" : "Show"} context</p>
                                    <ChevronDownIcon
                                      className={`${
                                        open ? "rotate-180 transform" : ""
                                      } w-4 h-4`}
                                    />
                                  </Disclosure.Button>
                                  <Disclosure.Panel className="grid gap-5 p-4 mx-4 text-sm bg-gradient-to-b dark:from-expand dark:to-expand/60">
                                    <section className="grid gap-5 break-all">
                                      {Object.entries(result.fragments).map(
                                        (keyVal, index) => {
                                          if (
                                            keyVal[0]
                                              .toLowerCase()
                                              .includes("customer")
                                          )
                                            return null;

                                          return (
                                            <article
                                              key={keyVal[0]}
                                              className="grid gap-1"
                                            >
                                              <h4
                                                className={`capitalize w-max ${
                                                  queryStringColors[
                                                    (index % 10) + 1
                                                  ]
                                                }`}
                                              >
                                                {keyVal[0].replaceAll("_", " ")}
                                              </h4>
                                              <ul className="grid px-6 list-disc">
                                                {(keyVal[1] as string[]).map(
                                                  (fragment) => {
                                                    return (
                                                      <li key={fragment}>
                                                        {fragment
                                                          .replaceAll(
                                                            "<mark>",
                                                            ""
                                                          )
                                                          .replaceAll(
                                                            "</mark>",
                                                            ""
                                                          )}
                                                      </li>
                                                    );
                                                  }
                                                )}
                                              </ul>
                                            </article>
                                          );
                                        }
                                      )}
                                    </section>
                                  </Disclosure.Panel>
                                </>
                              )}
                            </Disclosure>
                          </li>
                        );
                      }
                    )}
                  </ul>
                )}
              </section>
            ) : (
              <p>No results found</p>
            )}
          </>
        )}
      </ModalLayout>
    </>
  );
};

export default SpotlightSearch;
