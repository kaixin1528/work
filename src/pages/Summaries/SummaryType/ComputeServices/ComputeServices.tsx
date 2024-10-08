/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { useEffect } from "react";
import SummaryLayout from "../../../../layouts/SummaryLayout";
import ResourceChangeDetails from "./ResourceChangeDetails";
import { actionColors } from "src/constants/summaries";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import Accounts from "../../Accounts";
import { GetComputeServicesSummary } from "src/services/summaries/compute-services";
import { useSummaryStore } from "src/stores/summaries";

const ComputeServices = () => {
  const {
    period,
    selectedReportAccount,
    selectedCSAction,
    setSelectedCSAction,
    selectedCSNodeType,
    setSelectedCSNodeType,
    setSelectedCSNodeID,
  } = useSummaryStore();

  const { data: resourceChangeSummary, status: summaryStatus } =
    GetComputeServicesSummary(
      period,
      selectedReportAccount?.integration_type || "",
      selectedReportAccount?.customer_cloud_id || ""
    );

  const filteredActions =
    resourceChangeSummary &&
    resourceChangeSummary.status !== "loading" &&
    selectedCSAction !== "" &&
    Object.values(resourceChangeSummary[selectedCSAction]).filter(
      (node: any) => node.node_count > 0
    );

  useEffect(() => {
    setSelectedCSAction("created");
  }, []);

  useEffect(() => {
    if (
      resourceChangeSummary &&
      Object.keys(resourceChangeSummary).length > 0 &&
      selectedCSAction !== "" &&
      selectedCSNodeType === ""
    ) {
      const filteredActions = Object.values(
        resourceChangeSummary[selectedCSAction]
      ) as any;

      if (filteredActions?.length > 0)
        setSelectedCSNodeType(
          filteredActions.find(
            (nodeType: { node_count: number }) => nodeType.node_count > 0
          )?.summary_id || ""
        );
    }
  }, [resourceChangeSummary, selectedCSAction, selectedCSNodeType, period]);

  useEffect(() => {
    setSelectedCSAction("created");
    setSelectedCSNodeType("");
    setSelectedCSNodeID("");
  }, [selectedReportAccount]);

  return (
    <SummaryLayout name="Compute and Services Modifications">
      <Accounts includeIntegrations={["GITHUB", "CIRCLECI"]} />
      <section className="grid gap-5 p-4 w-full dark:bg-card black-shadow">
        <nav className="flex items-center justify-between gap-5 w-full">
          {["created", "modified", "removed"].map((action) => (
            <button
              key={action}
              className={`w-full font-medium capitalize ${
                selectedCSAction === action
                  ? actionColors[action]
                  : "py-2 dark:hover:bg-signin/60 duration-100"
              }`}
              onClick={() => {
                setSelectedCSAction(action);
                setSelectedCSNodeType("");
                setSelectedCSNodeID("");
              }}
            >
              {action}
            </button>
          ))}
        </nav>
        <section className="grid md:grid-cols-4 lg:grid-cols-6 content-start gap-5 p-6 text-sm">
          {summaryStatus === "success" ? (
            filteredActions?.length > 0 ? (
              filteredActions.map((node: any) => {
                return (
                  <button
                    key={node.node_class}
                    disabled={node.node_count === 0}
                    className={`grid justify-items-start p-2 w-full h-full break-all ${
                      selectedCSNodeType === node.summary_id
                        ? "dark:bg-signin/20 ring-[0.1rem] dark:ring-signin dark:ring-offset-tooltip duration-100"
                        : "dark:hover:bg-signin/60"
                    }`}
                    onClick={() => {
                      setSelectedCSNodeType(node.summary_id);
                      setSelectedCSNodeID("");
                    }}
                  >
                    <article className="flex flex-wrap items-center gap-2 text-left break-all">
                      <img
                        src={`/graph/nodes/${node.integration_type.toLowerCase()}/${node.node_class.toLowerCase()}.svg`}
                        alt={node.node_class}
                        className="w-5 h-5"
                      />
                      <p>{node.node_class.replaceAll("_", " ")}</p>{" "}
                      <FontAwesomeIcon icon={faArrowRightLong} />
                      <p className="w-max text-center">
                        <span
                          className={`${
                            node.node_count > 0
                              ? "font-bold"
                              : "dark:text-gray-500"
                          }`}
                        >
                          {node.node_count}
                        </span>
                      </p>
                    </article>
                    {selectedCSAction === "modified" && (
                      <p
                        className={`ml-7 ${
                          node.node_count > 0
                            ? "font-bold"
                            : "dark:text-gray-500"
                        }`}
                      >
                        ({node.total_count || 0} changes)
                      </p>
                    )}
                  </button>
                );
              })
            ) : (
              <p>No data available</p>
            )
          ) : null}
        </section>
      </section>
      <section>
        {/* resource change details */}
        {resourceChangeSummary && filteredActions?.length > 0 ? (
          <ResourceChangeDetails />
        ) : null}
      </section>
    </SummaryLayout>
  );
};

export default ComputeServices;
