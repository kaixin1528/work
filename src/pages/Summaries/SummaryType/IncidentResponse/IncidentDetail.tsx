import {
  faChevronCircleRight,
  faChevronCircleDown,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { severityColors } from "src/constants/summaries";
import { lastUpdatedAt } from "src/utils/general";
import ReactJson from "react-json-view";
import ViewInGraph from "src/components/Button/ViewInGraph";
import Notes from "src/components/AlertAnalysis/Notes";

const IncidentDetail = ({
  incident,
  selectedTickets,
  setSelectedTickets,
}: {
  incident: any;
  selectedTickets: string[];
  setSelectedTickets: (selectedTickets: string[]) => void;
}) => {
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  return (
    <li
      key={incident.id}
      className="grid gap-3 p-5 text-xs dark:bg-expand black-shadow rounded-sm"
    >
      <header className="grid lg:flex items-start justify-between gap-5 lg:gap-20">
        <article className="flex items-start gap-5">
          {/* <input
            type="checkbox"
            className="form-checkbox w-3 h-3 mt-1 self-start dark:ring-0 dark:text-signin dark:focus:border-signin focus:ring dark:focus:ring-offset-0 dark:focus:ring-signin focus:ring-opacity-50 rounded-full"
            checked={selectedTickets.includes(incident.id)}
            onChange={() => {
              if (selectedTickets.includes(incident.id))
                setSelectedTickets(
                  selectedTickets.filter(
                    (evidenceID) => evidenceID !== incident.id
                  )
                );
              else setSelectedTickets([...selectedTickets, incident.id]);
            }}
          /> */}
          <article className="flex items-start gap-2">
            <span
              className={`px-2 py-1 w-max ${
                severityColors[incident.severity.toLowerCase()]
              }`}
            >
              {incident.severity}
            </span>
            <h4 className="text-base">{incident.title}</h4>
          </article>
        </article>
        <article className="flex items-center justify-self-start lg:justify-self-end gap-10 px-0 lg:px-2">
          <Notes alertAnalysisID={incident.id} />
          <article className="flex items-center gap-3 w-max dark:text-checkbox">
            <h4>Last Updated At</h4>
            <p className="dark:text-white">
              {lastUpdatedAt(incident.last_updated)}
            </p>
          </article>
        </article>
      </header>
      <article className="grid gap-3">
        <article className="flex items-center gap-5">
          <article className="flex items-center gap-2">
            <img
              src={`/graph/nodes/${incident.integration_type.toLowerCase()}/${incident.asset_type.toLowerCase()}.svg`}
              alt={incident.asset_type}
              className="w-7 h-7"
            />
            <h4 className="text-sm">{incident.asset_id}</h4>
          </article>
          <article className="dark:text-checkbox">
            <ViewInGraph
              requestData={{
                query_type: "view_in_graph",
                id: incident.asset_id,
              }}
              curSnapshotTime={incident.last_updated}
            />
          </article>
        </article>
        <button
          className="flex items-center gap-2 w-max"
          onClick={() => setShowAnalysis(!showAnalysis)}
        >
          <p>{showAnalysis ? "Hide" : "Show"} Analysis</p>
          <FontAwesomeIcon
            icon={showAnalysis ? faChevronCircleDown : faChevronCircleRight}
            className="dark:text-checkbox"
          />
        </button>
        {showAnalysis && (
          <section className="grid gap-5 p-4 dark:bg-panel">
            <header className="flex items-center gap-2">
              <img
                src={`/graph/alerts/${incident.context.findings_type}.svg`}
                alt={incident.context.findings_type}
              />
              <p className="capitalize">
                {incident.context.findings_type.replaceAll("_", " ")}
              </p>
              <a
                href={`/graph/alert-analysis/details?graph_artifact_id=${incident.asset_id}&event_cluster_id=${incident.event_cluster_id}`}
                className="dark:text-checkbox"
              >
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />{" "}
              </a>
            </header>
            <p>{incident.context.description}</p>
            {incident.context.compliance?.requirements && (
              <article className="grid gap-1">
                <h4 className="dark:text-checkbox">Controls</h4>
                <ul className="grid list-disc gap-2 p-2">
                  {incident.context.compliance.requirements?.map(
                    (framework: any, fIndex: number) => {
                      return (
                        <li
                          key={framework.framework}
                          className="flex flex-wrap items-center gap-1 w-max"
                        >
                          {fIndex + 1}. {framework.framework} -
                          <article className="flex items-center gap-1">
                            {framework.controls.map(
                              (control: string, index: number) => (
                                <span>
                                  {control}{" "}
                                  {index < framework.controls.length - 1 &&
                                    ", "}
                                </span>
                              )
                            )}
                          </article>
                        </li>
                      );
                    }
                  )}
                </ul>
              </article>
            )}
            {incident.context.additional_information && (
              <article className="grid content-start gap-2">
                <h4 className="dark:text-checkbox">Additional Info</h4>
                <article>
                  <ReactJson
                    src={incident.context.additional_information}
                    name={null}
                    quotesOnKeys={false}
                    displayDataTypes={false}
                    theme="harmonic"
                    collapsed={2}
                  />
                </article>
              </article>
            )}
            {incident.context.remediation && (
              <section className="grid content-start gap-3">
                <h3 className="dark:text-checkbox">Remediation</h3>
                <p className="p-2 dark:bg-search">
                  {incident.context.remediation}
                </p>
              </section>
            )}
            <section className="grid content-start">
              <h3 className="dark:text-checkbox">References</h3>
              <ul className="grid list-disc gap-2 py-2 px-6 max-h-60 w-full overflow-auto scrollbar">
                {incident.context.references?.map((reference: string) => {
                  return (
                    <li
                      key={reference}
                      className="break-all hover:text-signin hover:underline"
                    >
                      <a
                        href={reference}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {reference}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
            <article className="flex items-center gap-1">
              <h4>Source:</h4>
              <span>{incident.source}</span>
            </article>
          </section>
        )}
      </article>
      <article className="flex items-center gap-5 justify-self-end">
        <span
        // className={`px-2 py-1 cursor-pointer ${
        //   statusColors[incident.status.toLowerCase()]
        // } rounded-md`}
        >
          {incident.status}
        </span>
        {/* <p>ETA: {convertToUTCShortString(incident.eta)} </p> */}
      </article>
    </li>
  );
};

export default IncidentDetail;
