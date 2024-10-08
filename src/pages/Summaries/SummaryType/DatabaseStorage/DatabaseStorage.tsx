/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import SummaryLayout from "src/layouts/SummaryLayout";
import Accounts from "../../Accounts";
import Database from "./Database/Database";
import Storage from "./Storage/Storage";
import AnalyticalSystem from "./AnalyticalSystem/AnalyticalSystem";
import AnalyticalSystemChildren from "./AnalyticalSystemChildren/AnalyticalSystemChildren";
import { parseURL } from "src/utils/general";
import { useSummaryStore } from "src/stores/summaries";
import { useGeneralStore } from "src/stores/general";

const DatabaseStorage = () => {
  const parsed = parseURL();

  const {
    selectedReportAccount,
    selectedDSNav,
    setSelectedDSNav,
    setSelectedDSResourceType,
    setSelectedDSResourceID,
  } = useSummaryStore();
  const { spotlightSearchString } = useGeneralStore();

  useEffect(() => {
    if (spotlightSearchString === "") {
      setSelectedDSResourceType("");
      setSelectedDSResourceID("");
    }
  }, [selectedReportAccount]);

  return (
    <SummaryLayout name="Database and Storage">
      {!parsed.resource_id ? (
        <>
          <Accounts />
          <nav className="flex items-center gap-2 text-sm w-full">
            {["Database", "Storage", "Analytical System"].map(
              (resourceType: string) => {
                return (
                  <article
                    key={resourceType}
                    className={`p-2 cursor-pointer w-full text-center ${
                      selectedDSNav === resourceType
                        ? "selected-button"
                        : "not-selected-button"
                    }`}
                    onClick={() => {
                      setSelectedDSNav(resourceType);
                      setSelectedDSResourceType("");
                      setSelectedDSResourceID("");
                    }}
                  >
                    {resourceType}
                  </article>
                );
              }
            )}
          </nav>

          {selectedDSNav === "Database" ? (
            <Database />
          ) : selectedDSNav === "Storage" ? (
            <Storage />
          ) : (
            <AnalyticalSystem />
          )}
        </>
      ) : (
        <AnalyticalSystemChildren />
      )}
    </SummaryLayout>
  );
};

export default DatabaseStorage;
