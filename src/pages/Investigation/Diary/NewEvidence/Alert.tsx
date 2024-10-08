import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { GetAlertList } from "src/services/investigation/diary/alert";
import { AddAsEvidence } from "src/services/investigation/diary/evidence/evidence";
import { useGeneralStore } from "src/stores/general";
import { KeyStringVal } from "src/types/general";
import { decodeJWT, parseURL } from "src/utils/general";

const Alert = ({
  setShowNewEvidence,
  newEvidenceType,
}: {
  setShowNewEvidence: (showNewEvidence: boolean) => void;
  newEvidenceType: string;
}) => {
  const parsed = parseURL();
  const jwt = decodeJWT();
  const queryClient = useQueryClient();

  const { env } = useGeneralStore();

  const [selectedAlert, setSelectedAlert] = useState<any>({});
  const [text, setText] = useState<string>("");

  const { data: alertList } = GetAlertList(env, 100);
  const addAsEvidence = AddAsEvidence(env);

  const filteredAlerts = alertList
    ? alertList.filter((alert: KeyStringVal) =>
        alert.graph_artifact_id
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(text.toLowerCase().replace(/\s+/g, ""))
      )
    : [];

  return (
    <section className="grid gap-5">
      <article className="relative flex items-center py-2 px-4 ring-0 dark:ring-search focus:ring-2 dark:focus:ring-signin dark:bg-account rounded-sm">
        <input
          name="filter search query"
          spellCheck="false"
          autoComplete="off"
          placeholder="Search any alert from the list below..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          type="input"
          className="py-1 w-full h-6 focus:outline-none dark:placeholder:text-checkbox dark:bg-transparent dark:bg-account dark:border-transparent dark:focus:ring-0 dark:focus:border-transparent"
        />
      </article>

      <ul className="grid gap-2 max-h-60 text-xs overflow-auto scrollbar">
        {filteredAlerts?.map((alert: KeyStringVal) => {
          return (
            <li
              className={`flex items-start gap-3 p-2 cursor-pointer dark:text-checkbox ${
                selectedAlert.graph_artifact_id === alert.graph_artifact_id &&
                selectedAlert.event_cluster_id === alert.event_cluster_id
                  ? "dark:bg-tooltip"
                  : "dark:hover:bg-tooltip duration-100"
              }`}
              onClick={() => setSelectedAlert(alert)}
            >
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="mt-[0.4rem] w-4 h-4"
              />
              <header className="grid gap-3">
                <h4 className="px-4 py-1 break-all dark:text-white selected-button">
                  {alert.graph_artifact_id}
                </h4>
                <article className="flex items-center gap-2">
                  <img
                    src={`/graph/alerts/${alert.severity?.toLowerCase()}.svg`}
                    alt={alert.severity}
                    className="w-5 h-5"
                  />
                  <p>{alert.description}</p>
                </article>
              </header>
            </li>
          );
        })}
      </ul>
      <button
        disabled={
          Object.keys(selectedAlert).length === 0 ||
          addAsEvidence.status === "loading"
        }
        className="justify-self-end px-4 py-1 text-xs gradient-button rounded-sm"
        onClick={() =>
          addAsEvidence.mutate(
            {
              body: {
                graph_artifact_id: selectedAlert.graph_artifact_id,
                event_cluster_id: selectedAlert.event_cluster_id,
                diary_id: parsed.diary_id,
                author: jwt?.name,
                title: "No title",
                evidence_type: newEvidenceType,
              },
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries([
                  "get-all-diary-evidence",
                  env,
                  parsed.diary_id,
                ]);
                setShowNewEvidence(false);
              },
            }
          )
        }
      >
        Add evidence
      </button>
    </section>
  );
};

export default Alert;
