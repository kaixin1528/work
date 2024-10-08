/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { showVariants } from "src/constants/general";
import { thirdPartyRiskTabs } from "src/constants/grc";
import { motion } from "framer-motion";
import PageLayout from "src/layouts/PageLayout";
import { useGRCStore } from "src/stores/grc";
import VendorAssessment from "./VendorAssessment/VendorAssessment";
import PrivacyReview from "./PrivacyReview/PrivacyReview";
import { faXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SearchGRC } from "src/services/grc";
import SearchResults from "../RegulationPolicy/SearchResults";
import VendorsAndPartners from "./VendorsAndPartners/VendorsAndPartners";

const ThirdPartyRisk = () => {
  const {
    GRCCategory,
    setGRCCategory,
    GRCQuery,
    setGRCQuery,
    GRCQueryOption,
    setGRCQueryOption,
  } = useGRCStore();

  const search = SearchGRC();

  const handleSearch = () => {
    search.mutate(
      {
        query: GRCQuery,
        type: GRCCategory === "vendor assessment" ? "vendor" : "privacy",
        searchType: GRCQueryOption,
      },
      {
        onSuccess: () => {
          setGRCCategory("vendor assessment");
          sessionStorage.GRCCategory = "Third Party Risk";
        },
      }
    );
  };

  useEffect(() => {
    if (GRCQuery === "") search.reset();
  }, [GRCQuery]);

  useEffect(() => {
    sessionStorage.page = "Third Party Risk";
    if (thirdPartyRiskTabs.includes(sessionStorage.GRCCategory))
      setGRCCategory(sessionStorage.GRCCategory);
    else setGRCCategory("vendors and partners");
  }, []);

  return (
    <PageLayout>
      <motion.main
        variants={showVariants}
        initial="hidden"
        animate="visible"
        className="grid content-start gap-5 p-4 w-full h-full text-base overflow-auto scrollbar"
      >
        <article className="flex items-center gap-2">
          <input
            type="input"
            autoComplete="off"
            spellCheck="false"
            placeholder="Search"
            value={GRCQuery}
            onKeyUpCapture={(e) => {
              if (e.key === "Enter" && GRCQuery !== "") handleSearch();
            }}
            onChange={(e) => setGRCQuery(e.target.value)}
            className="p-4 pr-12 w-[30rem] h-10 bg-gradient-to-b dark:bg-main border-t border-b dark:border-know/60 know focus:outline-none"
          />
          <article className="flex items-center gap-2 divide-x dark:divide-checkbox">
            {GRCQuery !== "" && (
              <button
                data-test="clear-query"
                className="red-button"
                onClick={() => setGRCQuery("")}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            )}
            <button
              disabled={GRCQuery === ""}
              className="px-2 dark:disabled:text-signin/30 dark:text-signin dark:hover:text-signin/60 duration-100"
              onClick={handleSearch}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </article>
          <article className="flex items-center gap-5">
            {["metadata"].map((searchType) => {
              return (
                <article
                  key={searchType}
                  className="flex itmes-center gap-2 capitalize"
                >
                  <input
                    type="radio"
                    checked={GRCQueryOption === searchType}
                    className="form-radio w-4 h-4 self-start mt-1 dark:ring-0 dark:text-signin dark:focus:border-signin focus:ring dark:focus:ring-offset-0 dark:focus:ring-signin focus:ring-opacity-50 rounded-full"
                    onChange={() => setGRCQueryOption(searchType)}
                  />
                  <span>Search by {searchType}</span>
                </article>
              );
            })}
          </article>
        </article>
        <nav className="flex flex-wrap items-center gap-5">
          {thirdPartyRiskTabs.map((tab) => {
            return (
              <button
                key={tab}
                className={`px-8 py-2 text-center capitalize border-b-2 ${
                  GRCCategory === tab
                    ? "dark:bg-signin/30 dark:border-signin"
                    : "dark:bg-filter/10 dark:hover:bg-filter/30 duration-100 dark:border-checkbox"
                } rounded-full`}
                onClick={() => setGRCCategory(tab)}
              >
                {tab}
              </button>
            );
          })}
        </nav>

        {search.data ? (
          <SearchResults searchData={search.data} />
        ) : (
          <>
            {GRCCategory === "vendors and partners" ? (
              <VendorsAndPartners />
            ) : GRCCategory === "vendor assessment" ? (
              <VendorAssessment />
            ) : (
              <PrivacyReview />
            )}
          </>
        )}
      </motion.main>
    </PageLayout>
  );
};

export default ThirdPartyRisk;
