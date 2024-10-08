/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { severityColors } from "src/constants/summaries";
import { GetSLAViolationTimes } from "src/services/summaries/sla-remediation";
import Violations from "./Violations";
import Remediations from "./Remediations";

const Detail = ({
  selectedSource,
  selectedVersion,
  selectedIntegrationType,
  selectedSourceAccountID,
  selectedService,
  earliestTime,
  latestTime,
  selectedSeverity,
  setSelectedSeverity,
  selectedType,
  setSelectedType,
}: {
  selectedSource: string;
  selectedVersion: string;
  selectedIntegrationType: string;
  selectedSourceAccountID: string;
  selectedService: string;
  earliestTime: number;
  latestTime: number;
  selectedSeverity: string;
  setSelectedSeverity: (selectedSeverity: string) => void;
  selectedType: string;
  setSelectedType: (selectedType: string) => void;
}) => {
  const { data: violationTimes } = GetSLAViolationTimes();

  useEffect(() => {
    if (
      violationTimes &&
      Object.keys(violationTimes).length > 0 &&
      selectedSeverity === ""
    )
      setSelectedSeverity(Object.keys(violationTimes)[0]);
  }, [violationTimes]);

  return (
    <section className="grid gap-5 text-sm">
      {violationTimes && selectedService !== "" && (
        <section className="grid gap-8">
          <article className="grid gap-5">
            <h4>SLA Remediation Periods by Severity</h4>
            <ul className="grid md:grid-cols-6 gap-5">
              {Object.entries(violationTimes).map((keyVal) => {
                return (
                  <li
                    key={keyVal[0]}
                    className={`grid place-content-center p-2 w-full cursor-pointer capitalize text-center break-all ${
                      severityColors[keyVal[0].toLowerCase()]
                    } ${selectedSeverity === keyVal[0] ? "outer-ring" : ""}`}
                    onClick={() => setSelectedSeverity(keyVal[0])}
                  >
                    <h4 className="break-all">{keyVal[0]}</h4>
                    <p>{keyVal[1]} days</p>
                  </li>
                );
              })}
            </ul>
          </article>

          <nav className="flex items-center gap-2 mx-auto">
            {["violations", "remediations"].map((type) => {
              return (
                <button
                  key={type}
                  className={`px-4 py-1 capitalize ${
                    selectedType === type
                      ? "full-underlined-label"
                      : "hover:border-b dark:hover:border-signin"
                  }`}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </button>
              );
            })}
          </nav>

          {selectedType === "violations" ? (
            <Violations
              selectedIntegrationType={selectedIntegrationType}
              selectedSourceAccountID={selectedSourceAccountID}
              selectedService={selectedService}
              selectedSeverity={selectedSeverity}
              earliestTime={earliestTime}
              latestTime={latestTime}
            />
          ) : (
            <Remediations
              selectedSource={selectedSource}
              selectedVersion={selectedVersion}
              selectedIntegrationType={selectedIntegrationType}
              selectedSourceAccountID={selectedSourceAccountID}
              selectedService={selectedService}
              selectedSeverity={selectedSeverity}
              earliestTime={earliestTime}
              latestTime={latestTime}
            />
          )}
        </section>
      )}
    </section>
  );
};

export default Detail;
