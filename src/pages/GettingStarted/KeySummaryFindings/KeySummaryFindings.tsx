/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { pointerVariants } from "src/constants/general";
import { GetKeySummaryFindings } from "src/services/getting-started";
import { GetAllReports } from "src/services/summaries/summaries";
import { useGeneralStore } from "src/stores/general";
import { KeyStringVal, Publication } from "src/types/general";
import { convertToUTCShortString, sortNumericData } from "src/utils/general";
import SummaryOverview from "./SummaryOverview";

const KeySummaryFindings = () => {
  const { env } = useGeneralStore();

  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  const { data: keySummaryFindings } = GetKeySummaryFindings(env, 3);
  const { data: publications } = GetAllReports(true);

  const summarySections = [
    ...new Set(
      sortNumericData(publications, "section_number", "asc")?.reduce(
        (pV: string[], cV: KeyStringVal) => [...pV, cV.artifact_category],
        []
      )
    ),
  ] as string[];

  useEffect(() => {
    if (keySummaryFindings?.length > 0 && !selectedAccount)
      setSelectedAccount(keySummaryFindings[0]);
  }, [keySummaryFindings]);

  return (
    <motion.section
      variants={pointerVariants}
      className="flex flex-col flex-grow content-start gap-3 p-4 w-full h-full text-center text-sm bg-gradient-to-b dark:bg-main border-1 dark:border-filter overflow-auto scrollbar z-20"
    >
      <article className="grid gap-5">
        <header className="flex items-center justify-between gap-5">
          <p className="text-xs">
            {convertToUTCShortString(Date.now() * 1000)}
          </p>
          <h3 className="text-xl">Key Summary Findings</h3>
          <img
            src="/general/logos/uno-neg.svg"
            alt="uno-black"
            className="w-10 h-10"
          />
        </header>
        <nav className="flex items-center gap-3 py-2 w-full dark:full-underlined-label z-10">
          {summarySections?.map((summaryCategory, index) => {
            const filteredSummaries = sortNumericData(
              publications?.filter(
                (publication: Publication) =>
                  publication.artifact_category === summaryCategory
              ),
              "sub_section_number",
              "asc"
            );
            return (
              <article className="group relative grid content-start w-full h-full">
                <button key={summaryCategory}>{summaryCategory}</button>
                <article
                  className={`absolute top-10 ${
                    index < summarySections?.length / 2 ? "left-0" : "right-0"
                  } hidden group-hover:grid gap-2 p-4 text-left dark:bg-panel black-shadow overflow-auto scrollbar z-10`}
                >
                  {filteredSummaries?.map((summary: KeyStringVal) => {
                    return (
                      <a
                        key={summary.artifact_name}
                        href={`/summaries/details?summary=${summary.artifact_name
                          .toLowerCase()
                          .replaceAll(" ", "_")}`}
                        className="w-max dark:hover:border-b-1 dark:hover:border-signin"
                      >
                        {summary.artifact_name}
                      </a>
                    );
                  })}
                </article>
              </article>
            );
          })}
        </nav>
      </article>

      <SummaryOverview />
    </motion.section>
  );
};

export default KeySummaryFindings;
