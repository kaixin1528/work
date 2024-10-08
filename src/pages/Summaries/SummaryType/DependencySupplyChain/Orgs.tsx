/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import Repos from "./Repos";
import { GetDependencySummary } from "src/services/summaries/dependency-supply-chain";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { useSummaryStore } from "src/stores/summaries";

const Orgs = () => {
  const { period } = useSummaryStore();

  const [selectedOrg, setSelectedOrg] = useState<string>("");
  const [selectedRepo, setSelectedRepo] = useState<string>("");

  const { data: dependencySummary } = GetDependencySummary(period, "GITHUB");

  useEffect(() => {
    if (
      dependencySummary &&
      Object.keys(dependencySummary).length > 0 &&
      selectedOrg === ""
    ) {
      const org = Object.keys(dependencySummary)[0];
      setSelectedOrg(org);
      const repos = Object.keys(dependencySummary[org]);
      if (repos.length > 0 && selectedRepo === "") {
        const repo = repos[0];
        setSelectedRepo(repo);
      }
    }
  }, [dependencySummary, selectedOrg]);

  useEffect(() => {
    if (selectedOrg !== "") setSelectedOrg("");
    setSelectedRepo("");
  }, [period]);

  const orgs = dependencySummary && Object.keys(dependencySummary);

  return (
    <section className="flex flex-col flex-grow content-start gap-5 p-4 w-full text-base dark:bg-card sahdow-md dark:shadow-black rounded-sm">
      {orgs ? (
        orgs.length > 0 ? (
          <ul className="flex items-center gap-2 w-full text-sm overflow-auto scrollbar">
            {orgs.map((org: string) => {
              return (
                <li
                  key={org}
                  className={`px-4 py-2 w-full text-center cursor-pointer ${
                    selectedOrg === org
                      ? "selected-button rounded-sm"
                      : "border-none dark:hover:bg-signin/30 duration-100"
                  }`}
                  onClick={() => setSelectedOrg(org)}
                >
                  <p>{org}</p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No data available</p>
        )
      ) : null}

      {orgs && selectedOrg !== "" && (
        <>
          <header className="flex items-center gap-2">
            <FontAwesomeIcon icon={faBook} className="dark:text-checkbox" />
            <h4 className="w-max">Repositories</h4>
          </header>
          {dependencySummary[selectedOrg] && (
            <section className="grid gap-1">
              {Object.entries(dependencySummary[selectedOrg]).length > 0 ? (
                Object.entries(dependencySummary[selectedOrg]).map(
                  (keyVal: [string, any]) => {
                    return (
                      <Repos
                        key={keyVal[0]}
                        dependencySummary={dependencySummary}
                        selectedOrg={selectedOrg}
                        keyVal={keyVal}
                        selectedRepo={selectedRepo}
                        setSelectedRepo={setSelectedRepo}
                      />
                    );
                  }
                )
              ) : (
                <p>No repositories found</p>
              )}
            </section>
          )}
        </>
      )}
    </section>
  );
};

export default Orgs;
