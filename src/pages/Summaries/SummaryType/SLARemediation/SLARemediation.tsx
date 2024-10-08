import React, { useState } from "react";
import SummaryLayout from "src/layouts/SummaryLayout";
import SeverityCountsOvertime from "./SeverityCountsOvertime";
import ServiceCountsOvertime from "./ServiceCountsOvertime";
import { faSmileWink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetSLAOverallCountsBySeverity } from "src/services/summaries/sla-remediation";
import SelectionOptions from "../../SelectionOptions";

const SLARemediation = () => {
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [selectedIntegrationType, setSelectedIntegrationType] =
    useState<string>("");
  const [selectedSourceAccountID, setSelectedSourceAccountID] =
    useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");

  const { data: severityCountsOvertime } = GetSLAOverallCountsBySeverity(
    selectedSource,
    selectedVersion,
    selectedIntegrationType,
    selectedSourceAccountID,
    100
  );

  return (
    <SummaryLayout name="SLA and Remediation" hidePeriod>
      <SelectionOptions
        short="sla"
        long="sla-remediation"
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
        selectedVersion={selectedVersion}
        setSelectedVersion={setSelectedVersion}
        selectedIntegrationType={selectedIntegrationType}
        setSelectedIntegrationType={setSelectedIntegrationType}
        selectedSourceAccountID={selectedSourceAccountID}
        setSelectedSourceAccountID={setSelectedSourceAccountID}
      />
      {severityCountsOvertime?.counts?.length === 0 ? (
        <section className="grid gap-2 w-full h-full place-content-center">
          <img
            src="/general/landing/summary-holding.svg"
            alt="summary"
            className="w-full h-70"
          />
          <h4 className="text-center">
            The summary is not calculated for one of the following reasons:
          </h4>
          <ul className="grid content-start gap-2 ml-36 list-decimal">
            {[
              "Your infrastructure has no images with vulnerabilities",
              "Your keys don't have the right permissions",
            ].map((reason, index) => {
              return <li key={index}>{reason}</li>;
            })}
          </ul>
          <article className="flex items-center gap-2 mx-auto">
            <FontAwesomeIcon icon={faSmileWink} className="text-yellow-500" />
            <p>Reach out and we'll help you get started!</p>
          </article>
        </section>
      ) : (
        <>
          <SeverityCountsOvertime
            selectedSource={selectedSource}
            selectedVersion={selectedVersion}
            selectedIntegrationType={selectedIntegrationType}
            selectedSourceAccountID={selectedSourceAccountID}
            setSelectedService={setSelectedService}
          />
          <section className="grid gap-5 p-4 dark:bg-card black-shadow">
            <ServiceCountsOvertime
              selectedSource={selectedSource}
              selectedVersion={selectedVersion}
              selectedIntegrationType={selectedIntegrationType}
              selectedSourceAccountID={selectedSourceAccountID}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
            />
          </section>
        </>
      )}
    </SummaryLayout>
  );
};

export default SLARemediation;
