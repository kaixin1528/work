/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { severityColors } from "src/constants/summaries";

import {
  GetCVEListByYear,
  GetCVEYearsBySeverity,
  GetCVSummary,
} from "src/services/summaries/common-vulnerabilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import EPSSOverSeverity from "./EPSSOverSeverity";

const CVEByYear = ({
  selectedSource,
  selectedVersion,
}: {
  selectedSource: string;
  selectedVersion: string;
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>("critical");
  const [order, setOrder] = useState<string>("desc");
  const [cveQuery, setCVEQuery] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedQuarter, setSelectedQuarter] = useState<string>("Q1");

  const { data: cvSummary } = GetCVSummary(selectedSource, selectedVersion);
  const { data: years } = GetCVEYearsBySeverity(
    selectedSource,
    selectedVersion,
    selectedSeverity,
    order
  );
  const { data: cveList } = GetCVEListByYear(
    selectedSource,
    selectedVersion,
    selectedSeverity,
    selectedYear
  );

  const filteredCVEs =
    cveQuery !== "" && cveList && cveList[selectedQuarter]
      ? cveList[selectedQuarter].filter((cve: string) =>
          cve
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(cveQuery.toLowerCase().replace(/\s+/g, ""))
        )
      : cveList && cveList[selectedQuarter];

  useEffect(() => {
    if (years?.length > 0 && selectedYear === "") setSelectedYear(years[0]);
  }, [years]);

  useEffect(() => {
    if (selectedYear !== "") setSelectedYear("");
  }, [selectedVersion, selectedSeverity, order]);

  return (
    <section className="flex flex-col flex-grow gap-10 p-4 dark:bg-card black-shadow rounded-sm">
      {cvSummary && (
        <nav className="flex items-center gap-5 w-full">
          {Object.entries(cvSummary).map((keyVal) => {
            return (
              <button
                key={keyVal[0]}
                className={`px-4 py-1 w-full capitalize ${
                  selectedSeverity === keyVal[0] ? "outer-ring" : ""
                } ${severityColors[keyVal[0]]}`}
                onClick={() => setSelectedSeverity(keyVal[0])}
              >
                <h4>{keyVal[0]}</h4>
                <span>{keyVal[1]}</span>
              </button>
            );
          })}
        </nav>
      )}
      {years && (
        <section className="grid gap-10 w-full max-h-[70rem] overflow-auto scrollbar">
          {years.length > 0 ? (
            <section className="grid gap-10 w-full max-h-[70rem] overflow-auto scrollbar">
              <section className="grid md:grid-cols-10 items-center gap-10 w-full h-full overflow-auto scrollbar">
                <button
                  className="flex items-center gap-2 text-sm dark:text-checkbox capitalize"
                  onClick={() => {
                    if (order === "asc") setOrder("desc");
                    else setOrder("asc");
                  }}
                >
                  {order === "desc" ? "Latest" : "Oldest"} first
                  <FontAwesomeIcon icon={faSort} />
                </button>
                <ul className="col-span-7 flex items-center gap-3 p-2 h-full dark:bg-search overflow-auto scrollbar">
                  {years.map((year: string) => {
                    return (
                      <li
                        key={year}
                        className={`grid gap-3 px-4 py-2 text-base cursor-pointer ${
                          selectedYear === year
                            ? "dark:bg-signin/70 border dark:border-signin"
                            : "dark:bg-expand dark:hover:bg-signin/60"
                        } rounded-sm`}
                        onClick={() => setSelectedYear(year)}
                      >
                        <p>{year}</p>
                      </li>
                    );
                  })}
                </ul>
                <nav className="col-span-2 flex items-center gap-5 w-full">
                  {["Q1", "Q2", "Q3", "Q4"].map((quarter) => {
                    return (
                      <button
                        key={quarter}
                        className={`flex items-center justify-center p-3 w-10 h-10 ${
                          selectedQuarter === quarter
                            ? "selected-button"
                            : "not-selected-button"
                        } rounded-full`}
                        onClick={() => setSelectedQuarter(quarter)}
                      >
                        {quarter}
                      </button>
                    );
                  })}
                </nav>
              </section>
              {filteredCVEs?.length > 0 ? (
                <section className="grid content-start gap-5 w-full h-full overflow-auto scrollbar">
                  <h3 className="text-2xl">
                    {selectedYear} CVE ({filteredCVEs?.length})
                  </h3>
                  <EPSSOverSeverity
                    selectedVersion={selectedVersion}
                    selectedSeverity={selectedSeverity}
                    selectedYear={selectedYear}
                  />
                  <input
                    type="filter"
                    autoComplete="off"
                    spellCheck="false"
                    placeholder="Search for CVE"
                    value={cveQuery}
                    onChange={(e) => setCVEQuery(e.target.value)}
                    className="px-5 w-full h-8 text-xs placeholder:text-secondary placeholder:text-xs placeholder:font-medium dark:text-white dark:disabled:cursor-not-allowed border-transparent focus:ring-0 focus:border-transparent bg-transparent focus:outline-none dark:bg-search rounded-sm"
                  />
                  <section className="flex flex-wrap content-start gap-2 w-full overflow-auto scrollbar">
                    {filteredCVEs?.map((cve: string) => (
                      <a
                        key={cve}
                        href={`/cves/details?cve_id=${cve}`}
                        className={`px-2 py-1 h-max ${severityColors[selectedSeverity]}`}
                      >
                        {cve}
                      </a>
                    ))}
                  </section>
                </section>
              ) : (
                <p>No CVEs</p>
              )}
            </section>
          ) : (
            <p>No years available</p>
          )}
        </section>
      )}
    </section>
  );
};

export default CVEByYear;
