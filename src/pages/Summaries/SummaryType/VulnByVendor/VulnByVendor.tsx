/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import SummaryLayout from "src/layouts/SummaryLayout";
import VendorList from "./VendorList";
import CVECountsByYear from "./CVECountsByYear";
import SeverityCountsByYear from "./SeverityCountsByYear";
import { decodeJWT } from "src/utils/general";
import {
  GetCPEAnalytics,
  GetCPEFilterOptions,
  GetVendors,
} from "src/services/summaries/vuln-by-vendor";
import { Sort } from "src/types/dashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateBack,
  faChartColumn,
  faSmileWink,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import CVSSCountsByYear from "./CVSSCountsByYear";
import Loader from "src/components/Loader/Loader";
import TextFilter from "src/components/Filter/General/TextFilter";
import CVEListForProduct from "./CVEListForProduct";

const VulnByVendor = () => {
  const jwt = decodeJWT();

  const [sort, setSort] = useState<Sort>({
    order: "desc",
    orderBy: "cve_counts",
  });
  const [selectedType, setSelectedType] = useState<string>("non-global");
  const [cveIDs, setCVEIDs] = useState<string[]>([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedIntegration, setSelectedIntegration] = useState<string>("");
  const [selectedCVEVersion, setSelectedCVEVersion] = useState<string>("");

  const { data: vendors } = GetVendors(
    selectedType,
    sort.order,
    sort.orderBy,
    cveIDs
  );
  const { data: filterOptions } = GetCPEFilterOptions();
  const { data: cpeAnalytics, status: analyticStatus } = GetCPEAnalytics(
    selectedType,
    selectedVendor,
    selectedProduct,
    selectedIntegration,
    selectedCVEVersion
  );

  useEffect(() => {
    if (selectedType === "global") setSelectedIntegration("global");
    else {
      if (filterOptions && filterOptions[selectedType]) {
        const firstIntegration = Object.keys(filterOptions[selectedType])[0];
        setSelectedIntegration(firstIntegration);
      }
    }
    setSelectedCVEVersion("2.0");
  }, [filterOptions, selectedType]);

  return (
    <SummaryLayout name="Vulnerability By Vendor" hidePeriod>
      <section className="flex flex-col flex-grow gap-5 p-4 w-full h-full dark:bg-card black-shadow overflow-auto scrollbar">
        <nav className="flex flex-wrap items-center gap-5 w-full text-xl">
          {["non-global", "global"].map((type) => {
            return (
              <button
                key={type}
                className={`px-2 py-1 text-center capitalize ${
                  selectedType === type
                    ? "underlined-label"
                    : "dark:hover:border-b-1 dark:border-signin"
                }`}
                onClick={() => setSelectedType(type)}
              >
                {type === "non-global" ? jwt?.scope.customer_name : "Global"}
              </button>
            );
          })}
        </nav>
        {vendors?.length === 0 ? (
          <section className="grid gap-2 w-full h-full place-content-center">
            <img
              src="/general/landing/summary-holding.svg"
              alt="summary"
              className="w-full h-70"
            />
            <h4 className="text-center">
              The summary is not calculated for one of the following reasons:
            </h4>
            <ul className="grid content-start gap-2 ml-36 list-decimal">
              {[
                "Your infrastructure has no images with vulnerabilities",
                "Your keys don't have the right permissions",
              ].map((reason, index) => {
                return <li key={index}>{reason}</li>;
              })}
            </ul>
            <article className="flex items-center gap-2 mx-auto">
              <FontAwesomeIcon icon={faSmileWink} className="text-yellow-500" />
              <p>Reach out and we'll help you get started!</p>
            </article>
          </section>
        ) : (
          <>
            {selectedProduct === "" && (
              <article className="flex items-center gap-2 w-full">
                <span>Sort by</span>
                {["alphabetical", "cve_counts"].map((sortingType) => {
                  return (
                    <button
                      key={sortingType}
                      className="flex items-center gap-2 px-2 py-1 justify-self-start text-xs capitalize dark:bg-filter dark:hover:bg-filter/60 duration-100 rounded-sm"
                      onClick={() =>
                        setSort({
                          order: sort.order === "asc" ? "desc" : "asc",
                          orderBy: sortingType,
                        })
                      }
                    >
                      <FontAwesomeIcon icon={faSort} />
                      {sortingType.replace("_", " ")}
                    </button>
                  );
                })}
              </article>
            )}
            {selectedProduct !== "" && (
              <button
                className="flex items-center gap-2 w-max dark:text-checkbox dark:hover:text-checkbox/60 duration-100"
                onClick={() => {
                  setSelectedVendor("");
                  setSelectedProduct("");
                }}
              >
                <FontAwesomeIcon icon={faArrowRotateBack} />
                Vendors
              </button>
            )}
            {/* <CVEFilter cveIDs={cveIDs} setCVEIDs={setCVEIDs} /> */}
            {selectedProduct === "" ? (
              <VendorList
                sort={sort}
                selectedType={selectedType}
                selectedVendor={selectedVendor}
                selectedProduct={selectedProduct}
                setSelectedVendor={setSelectedVendor}
                setSelectedProduct={setSelectedProduct}
                cveIDs={cveIDs}
              />
            ) : (
              <section className="flex flex-col flex-grow gap-10 w-full">
                <section className="grid gap-5 p-4">
                  {filterOptions && (
                    <section className="grid gap-3 text-center">
                      <h4 className="text-xl">Vendor: {selectedVendor}</h4>
                      <h3 className="flex items-center gap-2 mx-auto text-lg">
                        <FontAwesomeIcon icon={faChartColumn} /> Analytics for{" "}
                        <span className="underlined-label">
                          {selectedProduct}
                        </span>
                      </h3>
                      <section className="flex flex-wrap items-center gap-10 mx-auto">
                        {filterOptions[selectedType] && (
                          <>
                            {selectedType !== "global" && (
                              <TextFilter
                                label="Integration"
                                list={Object.keys(filterOptions[selectedType])}
                                value={selectedIntegration}
                                setValue={setSelectedIntegration}
                              />
                            )}
                            {filterOptions[selectedType][
                              selectedIntegration
                            ] && (
                              <TextFilter
                                label="CVE Version"
                                list={Object.keys(
                                  filterOptions[selectedType][
                                    selectedIntegration
                                  ]
                                )}
                                value={selectedCVEVersion}
                                setValue={setSelectedCVEVersion}
                              />
                            )}
                          </>
                        )}
                        <button
                          className="px-4 py-2 text-xs red-button border dark:border-reset dark:hover:border-reset/70 duration-100 rounded-sm"
                          onClick={() => {
                            setSelectedIntegration("");
                            setSelectedCVEVersion("");
                          }}
                        >
                          Reset
                        </button>
                      </section>
                    </section>
                  )}
                  {analyticStatus === "loading" ? (
                    <Loader />
                  ) : (
                    analyticStatus === "success" && (
                      <>
                        <CVECountsByYear
                          cpeAnalytics={cpeAnalytics.CVE_BY_YEAR}
                        />
                        <SeverityCountsByYear
                          cpeAnalytics={cpeAnalytics.SEVERITY_BY_YEAR}
                        />
                        <CVSSCountsByYear
                          cpeAnalytics={cpeAnalytics.CVSS_SCORE_BY_YEAR}
                        />
                      </>
                    )
                  )}
                </section>
                <CVEListForProduct
                  selectedType={selectedType}
                  selectedVendor={selectedVendor}
                  selectedProduct={selectedProduct}
                  selectedCVEVersion={selectedCVEVersion}
                />
              </section>
            )}
          </>
        )}
      </section>
    </SummaryLayout>
  );
};

export default VulnByVendor;
