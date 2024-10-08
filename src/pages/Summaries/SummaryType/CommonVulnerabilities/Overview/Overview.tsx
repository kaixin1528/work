import React, { useState } from "react";
import StackedAreaChart from "src/components/Chart/StackedAreaChart";
import { severityBGColors } from "src/constants/general";
import {
  GetCVEMatrixByYear,
  GetCVSystemTotal,
  GetCVSystemTotalBySeverity,
} from "src/services/summaries/common-vulnerabilities";
import { useGeneralStore } from "src/stores/general";
import { KeyNumVal } from "src/types/general";

const Overview = ({
  selectedSource,
  selectedVersion,
}: {
  selectedSource: string;
  selectedVersion: string;
}) => {
  const { env } = useGeneralStore();

  const [sectionProps, setSectionProps] = useState({});

  const { data: systemTotal } = GetCVSystemTotal(
    env,
    selectedSource,
    selectedVersion
  );
  const { data: cveMatrixByYear } = GetCVEMatrixByYear(
    selectedSource,
    selectedVersion
  );
  const { data: systemTotalBySeverity } = GetCVSystemTotalBySeverity(
    env,
    selectedSource,
    selectedVersion
  );

  return (
    <section className="flex items-start gap-10 p-4 dark:bg-card black-shadow">
      <section className="flex flex-col flex-grow gap-5 w-full h-full">
        {systemTotal && (
          <article className="flex items-start gap-3">
            <img
              src="/summaries/common-vuln/system-cve.svg"
              alt="system cve"
              className="w-40"
            />
            <article className="grid">
              <span className="text-2xl">{systemTotal.count} CVE</span>
              found in your system
            </article>
          </article>
        )}
        {systemTotalBySeverity && (
          <section className="flex flex-col flex-grow gap-5 mb-4 w-full h-full text-center">
            <h4 className="text-left text-base">
              % of Critical/High CVE in Your System
            </h4>
            {Object.keys(systemTotalBySeverity).length > 0 ? (
              <section className="flex flex-col flex-grow gap-5 w-full h-full text-xs">
                <section className="flex flex-col flex-grow w-full h-full text-xs">
                  {Object.values(systemTotalBySeverity).map(
                    (property: any, valueIndex: number) => {
                      const severity = Object.keys(systemTotalBySeverity)[
                        valueIndex
                      ].toLowerCase();
                      return (
                        <article
                          key={valueIndex}
                          className="flex flex-col flex-grow w-full h-full"
                        >
                          <article className="flex items-center w-full h-full">
                            <h4
                              className={`place-self-center p-2 w-28 h-full capitalize ${severityBGColors[severity]}`}
                            >
                              {severity}
                            </h4>
                            <article className="flex items-center w-full h-full">
                              {property.map((bucket: any, index: number) => {
                                return (
                                  <span
                                    key={index}
                                    className="group relative grid p-2 w-full h-full border-1 dark:border-reset"
                                  >
                                    {(
                                      (bucket.count / bucket.total) *
                                      100
                                    ).toFixed(2)}
                                    %
                                  </span>
                                );
                              })}
                            </article>
                          </article>
                          {valueIndex ===
                            Object.keys(systemTotalBySeverity).length - 1 && (
                            <article className="flex items-center pt-1">
                              <span className="p-2 w-28"></span>
                              <ul className="flex items-center w-full h-full">
                                {property.map(
                                  (bucket: KeyNumVal, index: number) => {
                                    return (
                                      <li
                                        key={index}
                                        className="grid gap-1 w-full"
                                      >
                                        {bucket.year}
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            </article>
                          )}
                        </article>
                      );
                    }
                  )}
                </section>
              </section>
            ) : (
              <p className="text-left">No data available</p>
            )}
          </section>
        )}
      </section>
      <section className="grid gap-5 w-full">
        {systemTotal && (
          <article className="flex items-start gap-3">
            <img
              src="/summaries/common-vuln/global-cve.svg"
              alt="global cve"
              className="w-40"
            />
            <article className="grid">
              <span className="text-2xl">{systemTotal.total} CVE</span>
              Total (for all years)
            </article>
          </article>
        )}
        <StackedAreaChart
          data={cveMatrixByYear}
          title="Global CVE"
          xKey="year"
          yLabel="Count"
          sectionProps={sectionProps}
          setSectionProps={setSectionProps}
          hasSeverity
        />
      </section>
    </section>
  );
};

export default Overview;
