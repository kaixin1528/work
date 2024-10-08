/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import DonutChart from "src/components/Chart/DonutChart";
import { severityColors } from "src/constants/summaries";
import { GetVSLSummary } from "src/services/summaries/vuln-summary-lineage";
import { useSummaryStore } from "src/stores/summaries";
import { KeyStringVal } from "src/types/general";
import { sortNumericData } from "src/utils/general";

const Severities = ({
  selectedSeverity,
  setSelectedSeverity,
}: {
  selectedSeverity: string;
  setSelectedSeverity: (selectedSeverity: string) => void;
}) => {
  const { period } = useSummaryStore();

  const { data: slaSummary } = GetVSLSummary(period);

  const sortedLayers = sortNumericData(slaSummary?.data, "order", "desc");

  useEffect(() => {
    if (sortedLayers?.length > 0 && selectedSeverity === "")
      setSelectedSeverity(sortedLayers[0].severity);
  }, [sortedLayers]);

  return (
    <>
      {slaSummary ? (
        sortedLayers?.length > 0 ? (
          <section className="flex flex-wrap items-center gap-2">
            <section className="w-full">
              <DonutChart data={sortedLayers} xKey="severity" />
            </section>
            <ul
              className={`grid md:flex items-center gap-5 p-4 w-full ${
                selectedSeverity !== "" &&
                "dark:bg-tooltip border-l dark:border-signin"
              } rounded-2xl`}
            >
              {sortedLayers.map((obj: KeyStringVal) => {
                return (
                  <li
                    key={obj.severity}
                    className={`grid place-content-center p-2 w-full h-full text-center cursor-pointer ${
                      severityColors[obj.severity.toLowerCase()]
                    } ${selectedSeverity === obj.severity ? "outer-ring" : ""}`}
                    onClick={() => setSelectedSeverity(obj.severity)}
                  >
                    <h4>{obj.severity}</h4>
                    <p>{obj.count}</p>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : (
          <p>
            Due to not having any active images with CVEs deployed in your
            infrastrucure, Lineage calculations are not possible
          </p>
        )
      ) : null}
    </>
  );
};

export default Severities;
