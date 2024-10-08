/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronUpIcon } from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import { convertToUTCString } from "src/utils/general";
import Branches from "./Branches";
import DependenciesByActiveBranch from "./DependenciesByActiveBranch";
import DependenciesByPackageManagers from "./DependenciesByPackageManagers";
import DependenciesList from "./DependenciesList";
import PackageManagers from "./PackageManagers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeCommit } from "@fortawesome/free-solid-svg-icons";

const Repos = ({
  dependencySummary,
  selectedOrg,
  keyVal,
  selectedRepo,
  setSelectedRepo,
}: {
  dependencySummary: any;
  selectedOrg: string;
  keyVal: [string, any];
  selectedRepo: string;
  setSelectedRepo: (selectedRepo: string) => void;
}) => {
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedPackageManager, setSelectedPackageManager] =
    useState<string>("");

  useEffect(() => {
    if (
      dependencySummary &&
      Object.keys(dependencySummary).length > 0 &&
      selectedOrg !== "" &&
      selectedRepo !== ""
    ) {
      if (dependencySummary[selectedOrg][selectedRepo]?.branches) {
        const branches = Object.keys(
          dependencySummary[selectedOrg][selectedRepo]?.branches
        );
        if (branches.length > 0 && selectedBranch === "") {
          setSelectedBranch(branches[0]);
          const packageManagers = Object.keys(
            dependencySummary[selectedOrg][selectedRepo].branches[branches[0]]
          );
          if (packageManagers.length > 0 && selectedPackageManager === "")
            setSelectedPackageManager(packageManagers[0]);
        }
      }
    }
  }, [
    dependencySummary,
    selectedOrg,
    selectedRepo,
    selectedBranch,
    selectedPackageManager,
  ]);

  return (
    <>
      <button
        onClick={() => {
          if (selectedRepo === keyVal[0]) {
            setSelectedRepo("");
            setSelectedBranch("");
            setSelectedPackageManager("");
          } else {
            setSelectedRepo(keyVal[0]);
            setSelectedBranch("");
            setSelectedPackageManager("");
          }
        }}
        className="grid gap-3 px-4 py-3 text-left text-sm font-medium dark:bg-filter/30 dark:hover:bg-filter/60 duration-100 border dark:border-filter focus:outline-none"
      >
        <header className="grid md:flex items-center justify-between gap-5 pr-4 w-full">
          <h4 className="text-base">{keyVal[0]}</h4>
          <article className="flex items-center gap-2">
            <article className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCodeCommit} />
              <h4>
                last commited at {convertToUTCString(keyVal[1].last_commit)}
              </h4>
            </article>
            <ChevronUpIcon
              className={`${
                selectedRepo === keyVal[0] ? "rotate-180 transform" : ""
              } h-5 w-5 dark:text-white`}
            />
          </article>
        </header>
        <ul className="flex flex-wrap items-center gap-5 text-sm overflow-auto scrollbar">
          {Object.keys(keyVal[1].package_managers).length > 0 ? (
            Object.entries(keyVal[1].package_managers).map(
              (packageInfo: any) => {
                return (
                  <li
                    key={packageInfo[0]}
                    className="flex items-center gap-2 text-xs"
                  >
                    <img
                      src={`/summaries/dependency/${packageInfo[0].toLowerCase()}.svg`}
                      alt={packageInfo[0]}
                      className="w-6 h-6"
                    />
                    <p>({packageInfo[1]})</p>
                  </li>
                );
              }
            )
          ) : (
            <p>No package managers found</p>
          )}
        </ul>
      </button>
      {selectedRepo === keyVal[0] && (
        <section className="grid grid-cols-1 gap-10 p-6 border-l-1 dark:border-signin">
          <DependenciesByActiveBranch
            selectedOrg={selectedOrg}
            selectedRepo={selectedRepo}
          />
          {dependencySummary[selectedOrg][selectedRepo]?.branches && (
            <Branches
              selectedRepo={selectedRepo}
              branches={Object.keys(
                dependencySummary[selectedOrg][selectedRepo].branches
              )}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
            />
          )}
          {selectedBranch !== "" && (
            <section className="grid gap-10 mx-10 px-6 border-l-1 dark:border-signin">
              <DependenciesByPackageManagers
                selectedOrg={selectedOrg}
                selectedRepo={selectedRepo}
                selectedBranch={selectedBranch}
              />
              {dependencySummary[selectedOrg][selectedRepo]?.branches &&
                dependencySummary[selectedOrg][selectedRepo].branches[
                  selectedBranch
                ] && (
                  <PackageManagers
                    selectedBranch={selectedBranch}
                    packageManagers={Object.keys(
                      dependencySummary[selectedOrg][selectedRepo].branches[
                        selectedBranch
                      ]
                    )}
                    selectedPackageManager={selectedPackageManager}
                    setSelectedPackageManager={setSelectedPackageManager}
                  />
                )}
              {selectedPackageManager !== "" &&
                dependencySummary[selectedOrg][selectedRepo]?.branches[
                  selectedBranch
                ][selectedPackageManager] && (
                  <section className="grid mx-10 px-6 border-l-1 dark:border-signin">
                    <DependenciesList
                      selectedOrg={selectedOrg}
                      selectedRepo={selectedRepo}
                      selectedBranch={selectedBranch}
                      selectedPackageManager={selectedPackageManager}
                      dependencies={
                        dependencySummary[selectedOrg][selectedRepo].branches[
                          selectedBranch
                        ][selectedPackageManager]
                      }
                    />
                  </section>
                )}
            </section>
          )}
        </section>
      )}
    </>
  );
};

export default Repos;
