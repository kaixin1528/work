/* eslint-disable react-hooks/exhaustive-deps */
import { faClock, faLocationPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ViewInGraph from "src/components/Button/ViewInGraph";
import Timeline from "src/components/Graph/DetailPanel/Timeline";
import { useGeneralStore } from "src/stores/general";
import {
  convertToMicrosec,
  convertToUTCString,
  extractIDFromQuery,
  parseURL,
} from "src/utils/general";
import parse from "html-react-parser";
import PageLayout from "src/layouts/PageLayout";
import { showVariants } from "src/constants/general";
import { motion } from "framer-motion";
import ReturnPage from "src/components/Button/ReturnPage";
import AddToInvestigation from "../General/AddToInvestigation";
import { useGraphStore } from "src/stores/graph";
import Share from "./Share";
import Notes from "./Notes";
import ReactJson from "react-json-view";
import { GetAlertAnalysis } from "src/services/graph/alerts";
import Subgraph from "./Subgraph";

const AlertAnalysis = () => {
  const parsed = parseURL();

  const { env } = useGeneralStore();
  const { graphSearch, graphSearchString, snapshotTime } = useGraphStore();

  const { data: alertAnalysis } = GetAlertAnalysis(
    env,
    String(parsed.graph_artifact_id) || "",
    String(parsed.event_cluster_id) || "",
    convertToMicrosec(snapshotTime),
    true
  );

  const alertAnalysisID = alertAnalysis?.id || "";

  return (
    <PageLayout>
      {alertAnalysis && (
        <motion.main
          variants={showVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col flex-grow content-start gap-5 p-4 w-full h-full shadow-2xl dark:shadow-card overflow-auto scrollbar"
        >
          <header className="flex items-center justify-between gap-10">
            <article className="flex items-center gap-5">
              <ReturnPage />
              <h3 className="text-xl">Alert Analysis</h3>
            </article>
            <h3 className="text-xl">{parsed.graph_artifact_id}</h3>
            <article className="flex items-center gap-3">
              <Share alertAnalysisID={alertAnalysisID} />
              <Notes alertAnalysisID={alertAnalysisID} />
              <AddToInvestigation
                evidenceType="ALERT_ANALYSIS"
                graphSearch={graphSearch}
                graphSearchString={graphSearchString}
                title={alertAnalysis.description}
              />
            </article>
          </header>
          <section className="grid content-start gap-10 p-6 text-sm dark:bg-card">
            <header className="grid xl:grid-cols-7 items-start justify-between gap-16">
              <article className="col-span-4 flex items-start gap-2">
                <h4 className="mt-2 dark:text-checkbox">Description</h4>
                <p className="p-2">{alertAnalysis.description}</p>
              </article>
              <article className="grid gap-3">
                <article className="flex items-center gap-2">
                  <h4 className="dark:text-checkbox">Severity</h4>
                  <img
                    src={`/graph/alerts/${alertAnalysis.severity?.toLowerCase()}.svg`}
                    alt={alertAnalysis.severity}
                    className="w-5 h-5"
                  />
                </article>
                <article className="flex items-center gap-2 w-max">
                  <h4 className="dark:text-checkbox">Category</h4>
                  <p className="p-2">{alertAnalysis.category}</p>
                </article>
              </article>
              <article className="col-span-2 grid content-start justify-self-end gap-3">
                <article className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="dark:text-admin" />
                  <p>{convertToUTCString(alertAnalysis.event_time)}</p>
                </article>
                <article className="flex items-center gap-2 text-xs">
                  <h4 className="dark:text-checkbox">First observed: </h4>
                  <p>{convertToUTCString(alertAnalysis.first_recorded)}</p>
                </article>
              </article>
            </header>
            <section className="grid content-start gap-5">
              <h3 className="text-xl">What</h3>
              <article className="grid content-start gap-3">
                <header className="flex items-center gap-2 dark:text-checkbox">
                  <img
                    src="/graph/alerts/impact.svg"
                    alt="impact"
                    className="w-5 h-5"
                  />
                  <h4>Impact</h4>
                </header>
                <article className="grid lg:grid-cols-2 content-start gap-10">
                  {alertAnalysis.security_impact && (
                    <section className="grid content-start gap-5 ml-5">
                      <article className="grid content-start gap-2">
                        <h4 className="dark:text-checkbox">Security</h4>
                        <article className="p-2">
                          {parse(alertAnalysis.security_impact)}
                        </article>
                      </article>
                      {alertAnalysis.additional_info && (
                        <article className="grid content-start gap-2">
                          <h4 className="dark:text-checkbox">
                            Additional Info
                          </h4>
                          <article>
                            <ReactJson
                              src={JSON.parse(alertAnalysis.additional_info)}
                              name={null}
                              quotesOnKeys={false}
                              displayDataTypes={false}
                              theme="codeschool"
                              collapsed={2}
                            />
                          </article>
                        </article>
                      )}
                    </section>
                  )}
                  {alertAnalysis?.compliance_impact && (
                    <article className="grid content-start gap-3 w-full">
                      <h4 className="indent-5 dark:text-checkbox">
                        GRC Copilot
                      </h4>
                      {alertAnalysis?.compliance_impact.summary && (
                        <article className="grid content-start gap-1 ml-5">
                          <h4 className="dark:text-checkbox">Summary</h4>
                          <p className="p-2">
                            {alertAnalysis?.compliance_impact.summary}
                          </p>
                        </article>
                      )}
                      <article className="grid gap-1 ml-5">
                        <h4 className="dark:text-checkbox">Controls</h4>
                        <ul className="grid list-disc gap-2 py-2 px-4 max-h-60 overflow-auto scrollbar">
                          {alertAnalysis?.compliance_impact.framework_and_controls?.map(
                            (framework: any, fIndex: number) => {
                              return (
                                <li
                                  key={framework.framework}
                                  className="flex items-center gap-1 w-max"
                                >
                                  {fIndex + 1}. {framework.framework} -
                                  <article className="flex items-center gap-1">
                                    {framework.controls.map(
                                      (control: string, index: number) => (
                                        <span>
                                          {" "}
                                          {control}{" "}
                                          {index <
                                            framework.controls.length - 1 &&
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
                    </article>
                  )}
                </article>
              </article>
              <article className="grid content-start gap-5">
                <header className="flex items-center gap-2 dark:text-checkbox">
                  <img
                    src="/graph/alerts/exploitability.svg"
                    alt="exploitability"
                    className="w-5 h-5"
                  />
                  <h4>Exploitability</h4>
                </header>
                {alertAnalysis.exploitability_graph_query && (
                  <ViewInGraph
                    requestData={{
                      query_type: "view_in_graph",
                      id: extractIDFromQuery(
                        alertAnalysis.exploitability_graph_query
                      ),
                    }}
                    curSnapshotTime={alertAnalysis.first_recorded}
                  />
                )}
                {JSON.parse(alertAnalysis.exploitability || "")
                  .exploitability_text && (
                  <article className="p-2">
                    {parse(
                      JSON.parse(alertAnalysis.exploitability || "")
                        .exploitability_text || ""
                    )}
                  </article>
                )}
              </article>
            </section>
            <section className="grid md:grid-cols-2 gap-20">
              <section className="grid content-start gap-5">
                <h3 className="text-xl">Who</h3>
                <Timeline
                  elementID={alertAnalysis.graph_artifact_id}
                  nodeType={alertAnalysis.resource_type}
                  uniqueID={alertAnalysis.graph_artifact_unique_id}
                  showLimited
                />
                {alertAnalysis.who && (
                  <p className="p-2">{alertAnalysis.who}</p>
                )}
              </section>
              <section className="grid content-start gap-3">
                <h3 className="text-xl">Where</h3>
                <article className="flex flex-wrap items-center gap-5">
                  {alertAnalysis.resource_graph_query && (
                    <ViewInGraph
                      requestData={{
                        query_type: "view_in_graph",
                        id: extractIDFromQuery(
                          alertAnalysis.resource_graph_query
                        ),
                      }}
                      curSnapshotTime={alertAnalysis.first_recorded}
                    />
                  )}
                  <Subgraph />
                </article>
                <article className="flex times-center gap-2">
                  <FontAwesomeIcon
                    icon={faLocationPin}
                    className="dark:text-checkbox"
                  />
                  <p>{alertAnalysis.resource_location || "N/A"}</p>
                </article>
              </section>
            </section>
            <section className="grid md:grid-cols-2 gap-20">
              {alertAnalysis.how && (
                <section className="grid content-start gap-3">
                  <h3 className="text-xl">How</h3>
                  <p className="p-2">{alertAnalysis.how}</p>
                </section>
              )}
              {alertAnalysis.why && (
                <section className="grid content-start gap-3">
                  <h3 className="text-xl">Why</h3>
                  <p className="p-2">{alertAnalysis.why}</p>
                </section>
              )}
            </section>
            <section className="grid md:grid-cols-2 gap-20">
              {alertAnalysis.remediation && (
                <section className="grid content-start gap-3">
                  <h3 className="text-xl">Remediation</h3>
                  <p className="p-2">{alertAnalysis.remediation}</p>
                </section>
              )}
              <section className="grid content-start gap-3">
                <h3 className="text-xl">References</h3>
                <ul className="grid list-disc gap-2 py-2 px-6 max-h-60 w-full overflow-auto scrollbar">
                  {alertAnalysis.references_info?.map((reference: string) => {
                    return (
                      <li
                        key={reference}
                        className="break-all hover:text-signin hover:underline"
                      >
                        <a href={reference}> {reference}</a>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </section>
            <section className="grid content-start gap-5">
              {alertAnalysis.tags?.length > 0 && (
                <article className="flex items-start gap-3">
                  <h4 className="mt-[0.15rem] dark:text-checkbox">Tags</h4>
                  <ul className="flex flex-wrap items-center gap-2 text-xs">
                    {alertAnalysis.tags?.map((tag: string) => {
                      return (
                        <li
                          key={tag}
                          className="px-3 py-1 dark:bg-filter rounded-full"
                        >
                          {tag}
                        </li>
                      );
                    })}
                  </ul>
                </article>
              )}
            </section>
          </section>
        </motion.main>
      )}
    </PageLayout>
  );
};

export default AlertAnalysis;
