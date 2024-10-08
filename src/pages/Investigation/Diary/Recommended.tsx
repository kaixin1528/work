/* eslint-disable no-restricted-globals */
import { GeneralEvidenceType } from "../../../types/investigation";
import MainSearch from "../EvidenceType/MainSearch";
import FirewallSearch from "../EvidenceType/FirewallSearch";
import { decodeJWT, parseURL } from "../../../utils/general";
import { queryClient } from "src/App";
import { useGeneralStore } from "src/stores/general";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import AlertAnalysis from "../EvidenceType/AlertAnalysis";
import { ReactFlowProvider } from "reactflow";
import { GetAlertList } from "src/services/investigation/diary/alert";
import {
  AddAsEvidence,
  AutoGenerateTitle,
} from "src/services/investigation/diary/evidence/evidence";
import { GetRecommendedEvidence } from "src/services/investigation/diary/recommended";
import CPMSearch from "../EvidenceType/CPMSearch";

const Recommended = () => {
  const parsed = parseURL();
  const jwt = decodeJWT();

  const { env } = useGeneralStore();

  const [selectedEvidence, setSelectedEvidence] = useState<number[]>([]);

  const { data: recommendedEvidence } = GetRecommendedEvidence(
    env,
    parsed.diary_id
  );
  const { data: alertList } = GetAlertList(env, 10);
  const addAsEvidence = AddAsEvidence(env);
  const autoGenerateTitle = AutoGenerateTitle(env);

  const handleAddAsEvidence = (
    recommended: GeneralEvidenceType,
    title: string,
    evidenceType: string
  ) => {
    addAsEvidence.mutate(
      {
        body: evidenceType.includes("ALERT")
          ? {
              graph_artifact_id: recommended.graph_artifact_id,
              event_cluster_id: recommended.event_cluster_id,
              diary_id: parsed.diary_id,
              author: jwt?.name,
              title: title,
              evidence_type: evidenceType,
            }
          : {
              query_string: recommended.query_string,
              results: recommended.results,
              annotation_set: "{}",
              annotation: "",
              diary_id: parsed.diary_id,
              author: jwt?.name,
              query_start_time: recommended.query_start_time,
              query_end_time: recommended.query_end_time,
              title: title || "",
              evidence_type: evidenceType,
            },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([
            "get-all-diary-evidence",
            env,
            parsed.diary_id,
          ]);
        },
      }
    );
  };

  return (
    <section className="grid gap-5 mb-10">
      <h3 className="text-base">Recommended</h3>
      {recommendedEvidence?.length > 0 && (
        <ul className="grid content-start gap-5">
          {recommendedEvidence?.map(
            (recommended: GeneralEvidenceType, index: number) => {
              return (
                <li key={index} className="flex items-start gap-3">
                  {selectedEvidence.includes(index) ? (
                    <FontAwesomeIcon icon={faCheck} className="px-6 text-no" />
                  ) : (
                    <button
                      className="p-2 px-4 tracking-widest text-xs dark:disabled:text-filter/30 dark:text-checkbox dark:hover:text-checkbox/60 duration-100 border dark:border-checkbox rounded-2xl"
                      onClick={() => {
                        setSelectedEvidence([...selectedEvidence, index]);
                        autoGenerateTitle.mutate(
                          {
                            queryType: recommended.evidence_type.includes(
                              "MAIN"
                            )
                              ? "main"
                              : recommended.evidence_type.includes("FIREWALL")
                              ? "firewall"
                              : "cpm",
                            searchString: recommended.query_string,
                          },
                          {
                            onSuccess: (title) =>
                              handleAddAsEvidence(
                                recommended,
                                title,
                                recommended.evidence_type
                              ),
                          }
                        );
                      }}
                    >
                      ADD
                    </button>
                  )}
                  <ReactFlowProvider>
                    {recommended.evidence_type === "MAIN_GRAPH_SEARCH" ? (
                      <MainSearch evidence={recommended} />
                    ) : recommended.evidence_type === "FIREWALL_SEARCH" ? (
                      <FirewallSearch evidence={recommended} />
                    ) : (
                      <CPMSearch evidence={recommended} />
                    )}
                  </ReactFlowProvider>
                </li>
              );
            }
          )}
        </ul>
      )}
      {alertList?.length > 0 && (
        <ul className="grid content-start gap-5">
          {alertList
            .slice(0, 5)
            .map((recommended: GeneralEvidenceType, index: number) => {
              const curIndex = recommendedEvidence?.length + index;
              return (
                <li key={index} className="flex items-start gap-5">
                  {selectedEvidence.includes(curIndex) ? (
                    <FontAwesomeIcon icon={faCheck} className="px-6 text-no" />
                  ) : (
                    <button
                      className="p-2 px-4 tracking-widest text-xs dark:disabled:text-filter/30 dark:text-checkbox dark:hover:text-checkbox/60 duration-100 border dark:border-checkbox rounded-2xl"
                      onClick={() => {
                        setSelectedEvidence([...selectedEvidence, curIndex]);
                        handleAddAsEvidence(
                          recommended,
                          recommended.description || "",
                          "ALERT_ANALYSIS"
                        );
                      }}
                    >
                      ADD
                    </button>
                  )}
                  <AlertAnalysis evidence={recommended} />
                </li>
              );
            })}
        </ul>
      )}
    </section>
  );
};

export default Recommended;
