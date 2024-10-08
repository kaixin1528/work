/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGraphStore } from "../../../../stores/graph";
import ReturnPage from "../../../../components/Button/ReturnPage";
import GraphLayout from "../../../../layouts/GraphLayout";
import { convertToMicrosec, parseURL } from "../../../../utils/general";
import Autocomplete from "src/components/Graph/Autocomplete/Autocomplete";
import { useGeneralStore } from "src/stores/general";
import { enTabs } from "src/constants/dashboard";
import CPMGraph from "./CPM/CPMGraph";
import FirewallGraph from "./Firewall/FirewallGraph";
import AddToInvestigation from "src/components/General/AddToInvestigation";
import {
  GetENSearchResults,
  SaveENSearchQuery,
} from "src/services/dashboard/effective-networking/effective-networking";
import {
  GetSnapshotsAvailable,
  GetSnapshotTimestamps,
} from "src/services/graph/snapshots";

const ENDetail = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const parsed = parseURL();

  const { env } = useGeneralStore();
  const {
    graphInfo,
    setGraphInfo,
    graphSearchString,
    setGraphSearchString,
    graphSearch,
    setGraphSearch,
    graphSearching,
    setGraphSearching,
    snapshotTime,
    setSnapshotTime,
    snapshotIndex,
  } = useGraphStore();

  const [selectedGraphType, setSelectedGraphType] = useState<string>(
    String(parsed.section)
  );

  const { data: snapshotAvailable } = GetSnapshotsAvailable(
    env,
    parsed.integration,
    selectedGraphType
  );
  const { data: snapshotTimestamps } = GetSnapshotTimestamps(
    env,
    parsed.integration,
    snapshotAvailable ? snapshotAvailable.earliest_snapshot !== -1 : false,
    convertToMicrosec(snapshotTime),
    "snapshots",
    selectedGraphType
  );

  const curSnapshotTime =
    snapshotTimestamps && snapshotIndex !== -1
      ? snapshotTimestamps.timestamps[snapshotIndex]
      : 0;

  const { data: enSearchResults, status: enSearchResultsStatus } =
    GetENSearchResults(
      env,
      parsed.integration,
      graphSearchString,
      graphSearch,
      graphSearching,
      curSnapshotTime,
      selectedGraphType
    );
  SaveENSearchQuery(
    env,
    parsed.integration,
    graphSearchString,
    graphSearch,
    graphSearching,
    curSnapshotTime,
    selectedGraphType
  );

  useEffect(() => {
    if ((state as any)?.previousPath !== "/dashboard/table/details") {
      setGraphSearch(false);
      setGraphSearching(false);
      setGraphSearchString("");
    }
    setGraphInfo({ ...graphInfo, showPanel: false });
    setSnapshotTime(new Date());
  }, []);

  return (
    <GraphLayout
      integrationType={String(parsed.integration)}
      graphType={selectedGraphType}
    >
      <header className="flex px-4 mt-4 gap-5 items-center dark:text-checkbox">
        <ReturnPage />
        <article className="flex items-center gap-5 dark:text-white">
          <img
            src={`/general/integrations/${parsed.integration}.svg`}
            alt={String(parsed.integration)}
            className="w-10 h-10"
          />
          <h4 className="w-max text-sm">Effective Networking</h4>
        </article>
        <Autocomplete
          graphType={selectedGraphType}
          startTime={curSnapshotTime}
          endTime={curSnapshotTime}
          graphSearchString={graphSearchString}
          setGraphSearchString={setGraphSearchString}
          graphSearching={graphSearching}
          setGraphSearch={setGraphSearch}
          setGraphSearching={setGraphSearching}
        />
        <AddToInvestigation
          evidenceType={`${selectedGraphType.toUpperCase()}_SEARCH`}
          graphSearch={graphSearch}
          graphSearchString={graphSearchString}
          startTime={curSnapshotTime}
          endTime={curSnapshotTime}
        />
        <button
          className="px-4 py-2 text-xs red-button border dark:border-reset dark:hover:border-reset/70 duration-100"
          onClick={() => {
            setGraphSearchString("");
            setGraphSearch(false);
            setGraphSearching(false);
            setGraphInfo({ ...graphInfo, showPanel: false });
          }}
        >
          <p className="w-max">Reset</p>
        </button>
      </header>
      <section className="flex flex-col flex-grow gap-5 m-4 overflow-auto scrollbar">
        <nav className="flex items-center gap-5 w-full text-sm">
          {enTabs.map((tab) => {
            return (
              <button
                key={tab.section}
                className={`p-2 w-full border-b-2 ${
                  selectedGraphType === tab.section
                    ? "dark:text-white dark:border-signin"
                    : "dark:text-checkbox dark:hover:text-white dark:border-checkbox"
                }`}
                onClick={() => {
                  setSelectedGraphType(tab.section);
                  const newSearchString = graphSearchString
                    .split(" ")
                    .filter((phrase) =>
                      ["port", "protocol", "port_from", "port_to"].some(
                        (word) => phrase.includes(word)
                      )
                    )
                    .join(" ");
                  setGraphSearchString(newSearchString);
                  if (newSearchString === "") setGraphSearch(false);
                  navigate(
                    `/dashboard/en/details?integration=${parsed.integration}&section=${tab.section}`
                  );
                }}
              >
                {tab.name}
              </button>
            );
          })}
        </nav>
        {selectedGraphType === "firewall" && (
          <FirewallGraph
            enSearchResults={enSearchResults}
            enSearchResultsStatus={enSearchResultsStatus}
          />
        )}
        {selectedGraphType === "cpm" && (
          <CPMGraph
            enSearchResults={enSearchResults}
            enSearchResultsStatus={enSearchResultsStatus}
          />
        )}
      </section>
    </GraphLayout>
  );
};

export default ENDetail;
