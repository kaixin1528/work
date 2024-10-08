/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from "react";
import ViewInGraph from "src/components/Button/ViewInGraph";
import ModalLayout from "src/layouts/ModalLayout";
import { GetNetworkTopologySummary } from "src/services/summaries/network-topology";
import { useGeneralStore } from "src/stores/general";
import { useSummaryStore } from "src/stores/summaries";
import RoutingTable from "./RoutingTable";
import CloudResource from "./CloudResource";

const SummaryHiearchy = () => {
  const { period, selectedReportAccount } = useSummaryStore();
  const { spotlightSearchString } = useGeneralStore();

  const [selectedFirstLevel, setSelectedFirstLevel] = useState<string>("");
  const [selectedSecondLevel, setSelectedSecondLevel] = useState<string>("");
  const [selectedThirdLevel, setSelectedThirdLevel] = useState<string>("");
  const [selectedFourthLevel, setSelectedFourthLevel] = useState<string>("");
  const [selectedRoutingTableID, setSelectedRoutingTableID] =
    useState<string>("");
  const [selectedCloudResourceID, setSelectedCloudResourceID] =
    useState<string>("");
  const [selectedNav, setSelectedNav] = useState<string>("");

  const { data: summary, status: summaryStatus } = GetNetworkTopologySummary(
    period,
    selectedReportAccount?.integration_type || "",
    selectedReportAccount?.customer_cloud_id || ""
  );

  const curIntegrationType =
    selectedReportAccount?.integration_type?.toLowerCase();

  useEffect(() => {
    if (summary && spotlightSearchString !== "") {
      document.getElementById(`${spotlightSearchString}`)?.scrollIntoView();
    }
  }, [summary]);

  const handleOnClose = () => {
    setSelectedNav("");
    setSelectedRoutingTableID("");
    setSelectedCloudResourceID("");
  };

  return (
    <section className="grid content-start gap-5 text-sm">
      {summaryStatus === "success" ? (
        Object.keys(summary).length > 0 ? (
          Object.keys(summary).map((firstLevel: string) => {
            const firstNodeType = curIntegrationType === "aws" ? "rgn" : "vpc";
            const noSecondLevel = Object.keys(summary[firstLevel])[0] === "";
            return (
              <article
                key={firstLevel}
                className="grid content-start dark:bg-admin/10 border dark:border-admin"
              >
                <header
                  className="flex items-center justify-between gap-5 p-4 cursor-pointer"
                  onClick={() => {
                    if (selectedFirstLevel !== firstLevel)
                      setSelectedFirstLevel(firstLevel);
                    else setSelectedFirstLevel("");
                  }}
                >
                  <h4 className="flex items-center gap-2">
                    <img
                      src={`/graph/nodes/${curIntegrationType}/${firstNodeType}.svg`}
                      alt={firstNodeType}
                      className="w-5 h-5"
                    />
                    <p>
                      {firstLevel} (
                      {noSecondLevel
                        ? "0"
                        : Object.values(summary[firstLevel]).length}{" "}
                      {curIntegrationType === "aws" ? "VPC" : "REGION"})
                    </p>
                  </h4>
                  <article className="flex items-center gap-5">
                    {curIntegrationType === "gcp" && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRoutingTableID(firstLevel);
                          }}
                        >
                          View Routing Table
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCloudResourceID(firstLevel);
                          }}
                        >
                          View Cloud Resources
                        </button>
                        <ModalLayout
                          showModal={firstLevel === selectedRoutingTableID}
                          onClose={handleOnClose}
                        >
                          <section className="grid gap-3">
                            <h4 className="text-base">{firstLevel}</h4>
                            <p className="underlined-label">Routing Table</p>
                            <RoutingTable
                              selectedRoutingTableID={selectedRoutingTableID}
                            />
                          </section>
                        </ModalLayout>
                        <ModalLayout
                          showModal={firstLevel === selectedCloudResourceID}
                          onClose={handleOnClose}
                        >
                          <section className="grid gap-3">
                            <h4 className="text-base">{firstLevel}</h4>
                            <p className="underlined-label">Cloud Resource</p>
                            <CloudResource
                              selectedCloudResourceID={selectedCloudResourceID}
                              type="routing"
                            />
                          </section>
                        </ModalLayout>
                      </>
                    )}
                    <ViewInGraph
                      requestData={
                        curIntegrationType === "gcp"
                          ? {
                              query_type: "nt_report_type_name",
                              type: "VPC",
                              name: firstLevel,
                            }
                          : {
                              query_type: "view_in_graph",
                              id: firstLevel,
                            }
                      }
                    />
                  </article>
                </header>
                {selectedFirstLevel === firstLevel && (
                  <article className="grid md:grid-cols-2 content-start gap-3 px-4 pb-4">
                    {Object.keys(summary[firstLevel]).map(
                      (secondLevel: string) => {
                        const secondNodeType =
                          curIntegrationType === "aws" ? "vpc" : "rgn";
                        const noThirdLevel =
                          Object.keys(summary[firstLevel][secondLevel])[0] ===
                          "";
                        return (
                          <Fragment key={secondLevel}>
                            {!noThirdLevel && (
                              <section
                                id={secondLevel}
                                className="grid content-start dark:bg-event/10 border dark:border-event"
                              >
                                <header
                                  className="flex items-center justify-between gap-5 p-4 cursor-pointer"
                                  onClick={() => {
                                    if (selectedSecondLevel !== secondLevel)
                                      setSelectedSecondLevel(secondLevel);
                                    else setSelectedSecondLevel("");
                                  }}
                                >
                                  <h4 className="flex items-center gap-2">
                                    <img
                                      src={`/graph/nodes/${curIntegrationType}/${secondNodeType}.svg`}
                                      alt={secondNodeType}
                                      className="w-5 h-5"
                                    />
                                    <p>
                                      {secondLevel} (
                                      {noThirdLevel
                                        ? "0"
                                        : Object.values(
                                            summary[firstLevel][secondLevel]
                                          ).length}{" "}
                                      {curIntegrationType === "aws"
                                        ? "AZONE"
                                        : "ZONE"}
                                      )
                                    </p>
                                  </h4>
                                  <ViewInGraph
                                    requestData={
                                      curIntegrationType === "gcp"
                                        ? {
                                            query_type:
                                              "connected_with_id_generic",
                                            id: secondLevel,
                                            connected: "ZONE",
                                          }
                                        : {
                                            query_type: "view_in_graph",
                                            id: secondLevel,
                                          }
                                    }
                                  />
                                </header>
                                {selectedSecondLevel === secondLevel && (
                                  <article className="grid content-start gap-3 px-4 pb-4">
                                    {Object.keys(
                                      summary[firstLevel][secondLevel]
                                    ).map((thirdLevel: string) => {
                                      const thirdNodeType =
                                        curIntegrationType === "aws"
                                          ? "azone"
                                          : "zone";
                                      const noFourthLevel =
                                        Object.keys(
                                          summary[firstLevel][secondLevel][
                                            thirdLevel
                                          ]
                                        )[0] === "";
                                      return (
                                        <Fragment key={thirdLevel}>
                                          {!noFourthLevel && (
                                            <section
                                              key={thirdLevel}
                                              className="grid content-start dark:bg-note/10 border dark:border-note"
                                            >
                                              <header
                                                className="grid md:flex items-center justify-between gap-5 p-4 cursor-pointer"
                                                onClick={() => {
                                                  if (
                                                    selectedThirdLevel !==
                                                    thirdLevel
                                                  )
                                                    setSelectedThirdLevel(
                                                      thirdLevel
                                                    );
                                                  else
                                                    setSelectedThirdLevel("");
                                                }}
                                              >
                                                <h4 className="flex items-center gap-2">
                                                  <img
                                                    src={`/graph/nodes/${curIntegrationType}/${thirdNodeType}.svg`}
                                                    alt={thirdNodeType}
                                                    className="w-5 h-5"
                                                  />
                                                  <p>
                                                    {thirdLevel} (
                                                    {noFourthLevel
                                                      ? "0"
                                                      : Object.values(
                                                          summary[firstLevel][
                                                            secondLevel
                                                          ][thirdLevel]
                                                        ).length}{" "}
                                                    SUBNET)
                                                  </p>
                                                </h4>
                                                {}
                                                <ViewInGraph
                                                  requestData={
                                                    curIntegrationType === "gcp"
                                                      ? {
                                                          query_type:
                                                            "nt_report_type_name",
                                                          type: "ZONE",
                                                          name: thirdLevel,
                                                        }
                                                      : {
                                                          query_type:
                                                            "view_in_graph",
                                                          id: thirdLevel,
                                                        }
                                                  }
                                                />
                                              </header>
                                              {selectedThirdLevel ===
                                                thirdLevel && (
                                                <article className="flex flex-wrap gap-3 px-4 pb-4">
                                                  {Object.keys(
                                                    summary[firstLevel][
                                                      secondLevel
                                                    ][thirdLevel]
                                                  ).map(
                                                    (fourthLevel: string) => {
                                                      const subnet =
                                                        summary[firstLevel][
                                                          secondLevel
                                                        ][thirdLevel][
                                                          fourthLevel
                                                        ];
                                                      const noInfo =
                                                        !subnet.routing_table &&
                                                        !subnet.resource_id_lookup;
                                                      return (
                                                        <Fragment
                                                          key={fourthLevel}
                                                        >
                                                          <button
                                                            disabled={noInfo}
                                                            className="p-2 break-all dark:disabled:bg-filter/30 dark:disabled:border-filter dark:bg-signin/10 dark:hover:bg-signin/60 duration-100 border dark:border-signin"
                                                            onClick={() => {
                                                              setSelectedFourthLevel(
                                                                fourthLevel
                                                              );
                                                              setSelectedRoutingTableID(
                                                                subnet.routing_table ||
                                                                  ""
                                                              );
                                                              setSelectedCloudResourceID(
                                                                subnet.resource_id_lookup ||
                                                                  ""
                                                              );
                                                              if (
                                                                curIntegrationType ===
                                                                "gcp"
                                                              )
                                                                setSelectedNav(
                                                                  "Cloud Resource"
                                                                );
                                                              else
                                                                setSelectedNav(
                                                                  "Routing Table"
                                                                );
                                                            }}
                                                          >
                                                            <h4 className="flex items-center gap-2">
                                                              <img
                                                                src="/graph/nodes/aws/subn.svg"
                                                                alt="subn"
                                                                className="w-5 h-5"
                                                              />
                                                              <p>
                                                                {fourthLevel}
                                                              </p>
                                                            </h4>
                                                          </button>
                                                          <ModalLayout
                                                            showModal={
                                                              fourthLevel ===
                                                                selectedFourthLevel &&
                                                              (subnet.routing_table ===
                                                                selectedRoutingTableID ||
                                                                subnet.resource_id_lookup ===
                                                                  selectedCloudResourceID)
                                                            }
                                                            onClose={
                                                              handleOnClose
                                                            }
                                                          >
                                                            <section className="grid gap-3">
                                                              <header className="flex items-center gap-5 text-base">
                                                                <h4>
                                                                  {fourthLevel}
                                                                </h4>
                                                                <ViewInGraph
                                                                  requestData={{
                                                                    query_type:
                                                                      "view_in_graph",
                                                                    id: fourthLevel,
                                                                  }}
                                                                  curSnapshotTime={
                                                                    subnet.latest_timestamp
                                                                  }
                                                                />
                                                              </header>
                                                              <nav className="flex items-center gap-2">
                                                                {[
                                                                  "Routing Table",
                                                                  "Cloud Resource",
                                                                ].map(
                                                                  (
                                                                    nav: string
                                                                  ) => {
                                                                    if (
                                                                      (curIntegrationType ===
                                                                        "gcp" &&
                                                                        nav ===
                                                                          "Routing Table") ||
                                                                      (nav ===
                                                                        "Cloud Resource" &&
                                                                        !subnet.resource_id_lookup)
                                                                    )
                                                                      return null;
                                                                    return (
                                                                      <article
                                                                        key={
                                                                          nav
                                                                        }
                                                                        className={`p-2 cursor-pointer ${
                                                                          selectedNav ===
                                                                          nav
                                                                            ? "selected-button"
                                                                            : "not-selected-button"
                                                                        }`}
                                                                        onClick={() =>
                                                                          setSelectedNav(
                                                                            nav
                                                                          )
                                                                        }
                                                                      >
                                                                        {nav}
                                                                      </article>
                                                                    );
                                                                  }
                                                                )}
                                                              </nav>
                                                              {selectedNav ===
                                                                "Cloud Resource" &&
                                                              !subnet.resource_id_lookup ? (
                                                                <p>
                                                                  No resources
                                                                </p>
                                                              ) : selectedNav ===
                                                                "Routing Table" ? (
                                                                <RoutingTable
                                                                  selectedRoutingTableID={
                                                                    selectedRoutingTableID
                                                                  }
                                                                />
                                                              ) : (
                                                                <CloudResource
                                                                  selectedCloudResourceID={
                                                                    subnet.resource_id_lookup
                                                                  }
                                                                  type="external"
                                                                />
                                                              )}
                                                            </section>
                                                          </ModalLayout>
                                                        </Fragment>
                                                      );
                                                    }
                                                  )}
                                                </article>
                                              )}
                                            </section>
                                          )}
                                        </Fragment>
                                      );
                                    })}
                                  </article>
                                )}
                              </section>
                            )}
                          </Fragment>
                        );
                      }
                    )}
                  </article>
                )}
              </article>
            );
          })
        ) : (
          <p>No data available</p>
        )
      ) : null}
    </section>
  );
};

export default SummaryHiearchy;
