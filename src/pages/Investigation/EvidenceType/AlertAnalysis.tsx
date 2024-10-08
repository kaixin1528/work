import {
  faArrowUpRightFromSquare,
  faExclamationTriangle,
  faEyeSlash,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import ViewInGraph from "src/components/Button/ViewInGraph";
import { useGeneralStore } from "src/stores/general";
import parse from "html-react-parser";
import { GetAlertAnalysis } from "src/services/graph/alerts";

const AlertAnalysis = ({ evidence }: { evidence: any }) => {
  const { env } = useGeneralStore();

  const [showDetails, setShowDetails] = useState<boolean>(false);

  const { data: alertAnalysis } = GetAlertAnalysis(
    env,
    evidence.graph_artifact_id || "",
    evidence.event_cluster_id || "",
    evidence.snapshot_time || 0,
    showDetails
  );

  return (
    <section className="grid gap-5 pb-4 text-xs">
      <article className="flex items-start gap-3 dark:text-checkbox">
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className="mt-[0.4rem] w-4 h-4"
        />
        <header className="grid gap-2">
          <h4 className="px-4 py-1 w-full hover:whitespace-normal truncate text-ellipsis break-all dark:text-white selected-button">
            {evidence.graph_artifact_id}
          </h4>
          <article className="flex items-center gap-2">
            {evidence.severity && (
              <img
                src={`/graph/alerts/${evidence.severity.toLowerCase()}.svg`}
                alt={evidence.severity}
                className="w-4 h-4"
              />
            )}
            <p>{evidence.description}</p>
          </article>
        </header>
        <button
          className="group flex items-center gap-2 mt-[0.4rem]"
          onClick={() => setShowDetails(!showDetails)}
        >
          <p className="w-max dark:group-hover:text-signin duration-100">
            {showDetails ? "Hide" : "Run"} alert analysis
          </p>

          <FontAwesomeIcon
            icon={showDetails ? faEyeSlash : faPlay}
            className="dark:group-hover:text-signin duration-100"
          />
        </button>
      </article>
      {alertAnalysis && showDetails && (
        <section className="grid gap-5 p-4 dark:bg-card">
          <header className="flex items-center gap-2">
            <h4 className="text-sm">Alert Analysis</h4>
            <a
              href={`/graph/alert-analysis/details?graph_artifact_id=${evidence.graph_artifact_id}&event_cluster_id=${evidence.event_cluster_id}`}
            >
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </a>
          </header>
          <article className="flex items-center gap-2">
            <img
              src={`/graph/alerts/${alertAnalysis.severity?.toLowerCase()}.svg`}
              alt={alertAnalysis.severity}
              className="w-5 h-5"
            />
            <p className="p-2 dark:bg-search">{alertAnalysis.description}</p>
          </article>
          <article className="grid md:grid-cols-2 justify-between content-start gap-10">
            <article className="grid content-start gap-3">
              <header className="flex items-center gap-2 dark:text-checkbox">
                <img
                  src="/graph/alerts/impact.svg"
                  alt="impact"
                  className="w-5 h-5"
                />
                <h4>Impact</h4>
              </header>
              <article className="grid gap-2 indent-5">
                <h4 className="dark:text-checkbox">Security</h4>
                {parse(alertAnalysis.security_impact || "")}
              </article>
            </article>
            <article className="grid content-start gap-3">
              <header className="flex items-center gap-2 dark:text-checkbox">
                <img
                  src="/graph/alerts/exploitability.svg"
                  alt="exploitability"
                  className="w-5 h-5"
                />
                <h4>Exploitability</h4>
              </header>
              {JSON.parse(alertAnalysis.exploitability || "")
                .exploitability_text && (
                <article className="p-2 dark:bg-search">
                  {parse(
                    JSON.parse(alertAnalysis.exploitability || "")
                      .exploitability_text || ""
                  )}
                </article>
              )}
              {alertAnalysis.exploitability_graph_query && (
                <ViewInGraph
                  requestData={{
                    query_type: "view_in_graph",
                    id: alertAnalysis.exploitability_graph_query,
                  }}
                />
              )}
            </article>
          </article>
          <ul className="flex flex-wrap items-center gap-2 text-xs">
            {alertAnalysis.tags?.map((tag: string) => {
              return (
                <li key={tag} className="px-3 py-1 dark:bg-filter rounded-full">
                  {tag}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </section>
  );
};

export default AlertAnalysis;
