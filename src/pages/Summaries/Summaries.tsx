/* eslint-disable no-restricted-globals */
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showVariants } from "../../constants/general";
import {
  GetAllReports,
  GetFavoriteReports,
  GetGlobalFavoriteReports,
  RemoveReportFromFavorites,
  // RemoveReportFromFavorites,
} from "../../services/summaries/summaries";
import { Favorite, Publication, Subscription } from "../../types/general";
import SummaryList from "./SummaryList";
import { GetSubscriptions } from "../../services/general/general";
import { summaryLogos, summaryTypes } from "../../constants/summaries";
import PageLayout from "../../layouts/PageLayout";
import { parseURL, sortNumericData, sortTextData } from "../../utils/general";
import { KeyStringVal } from "src/types/general";
import { useSummaryStore } from "src/stores/summaries";
import { useGeneralStore } from "src/stores/general";

const Summaries: React.FC = () => {
  const navigate = useNavigate();
  const parsed = parseURL();

  const { setSpotlightSearchString } = useGeneralStore();
  const { setPeriod, setSelectedReportAccount } = useSummaryStore();

  const [query, setQuery] = useState<string>("");

  const { data: publications } = GetAllReports(!parsed.summary);
  const { data: globalFavorites } = GetGlobalFavoriteReports(!parsed.summary);
  const { data: favorites } = GetFavoriteReports(!parsed.summary);
  const { data: subscriptions } = GetSubscriptions(!parsed.summary);
  const removeFromFav = RemoveReportFromFavorites();

  const filteredFavorites = sortTextData(
    globalFavorites?.filter((favorite: Favorite) =>
      favorite.artifact_name
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(query.toLowerCase().replace(/\s+/g, ""))
    ),
    "artifact_name",
    "asc"
  );
  const filteredSubscriptions = sortTextData(
    subscriptions
      ?.filter(
        (subscription: Subscription) =>
          subscription.artifact_type === "Summaries" &&
          subscription.artifact_name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
      )
      .reduce((pV: Subscription[], cV: KeyStringVal) => {
        if (
          !pV.some(
            (subscription) => subscription.artifact_name === cV.artifact_name
          )
        )
          return [...pV, cV];
        else return [...pV];
      }, []),
    "artifact_name",
    "asc"
  );
  const summarySections = [
    ...new Set(
      sortNumericData(publications, "section_number", "asc")?.reduce(
        (pV: string[], cV: KeyStringVal) => [...pV, cV.artifact_category],
        []
      )
    ),
  ] as string[];

  const Report = summaryTypes[String(parsed.summary)];

  return (
    <PageLayout>
      <motion.main
        variants={showVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col flex-grow gap-5 p-4 w-full h-full dark:text-white font-light z-10 shadow-2xl dark:shadow-expand overflow-auto scrollbar"
      >
        {!parsed.summary && (
          <section className="flex flex-col flex-grow gap-5 w-full h-full overflow-auto scrollbar">
            {/* search report by name */}
            <input
              type="input"
              spellCheck="false"
              autoComplete="off"
              placeholder="Search summary"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="p-4 pr-12 w-[30rem] h-10 text-sm bg-gradient-to-b dark:bg-main border-t border-b dark:border-know/60 know focus:outline-none"
            />

            <section className="grid grid-cols-1 md:grid-cols-2 items-start gap-5 dark:bg-card black-shadow">
              {/* favorites */}
              <section className="grid gap-3 p-4 text-sm">
                <header className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faStar}
                    className="dark:text-favorite"
                  />
                  <h4>Favorites</h4>
                </header>
                {filteredFavorites?.length > 0 ? (
                  <ul className="grid content-start dark:text-checkbox max-h-48 overflow-auto scrollbar">
                    {filteredFavorites?.map((favorite: Favorite) => {
                      return (
                        <li
                          key={favorite.artifact_name}
                          className="flex items-center justify-between gap-10 p-2 cursor-pointer dark:hover:bg-filter/30 duration-100 border-b-1 dark:border-checkbox/30"
                          onClick={() => {
                            setPeriod(3);
                            setSelectedReportAccount(undefined);
                            setSpotlightSearchString("");
                            navigate(
                              `/summaries/details?&summary=${favorite.artifact_name
                                .toLowerCase()
                                .replaceAll(" ", "_")}`
                            );
                          }}
                        >
                          <h4>{favorite.artifact_name}</h4>
                          <article className="flex items-center gap-5 pr-5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromFav.mutate({
                                  artifactType: favorite.artifact_type,
                                  artifactCategory: favorite.artifact_category,
                                  artifactName: favorite.artifact_name,
                                });
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faStar}
                                className="dark:text-favorite"
                              />
                            </button>
                          </article>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="dark:text-checkbox">No reports</p>
                )}
              </section>

              {/* subscriptions */}
              <section className="grid content-start gap-3 p-4 text-sm">
                <header className="flex items-center gap-2">
                  <img
                    src="/summaries/landing/subscriptions.svg"
                    alt="subscriptions"
                    className="w-4 h-4"
                  />
                  <h4>Subscriptions</h4>
                </header>
                {filteredSubscriptions?.length > 0 ? (
                  <SummaryList
                    filteredReports={filteredSubscriptions}
                    favorites={globalFavorites}
                  />
                ) : (
                  <p className="dark:text-checkbox">No reports</p>
                )}
              </section>

              {favorites?.map((category: any) => {
                return (
                  <section
                    key={category.section_name}
                    className="grid gap-3 p-4 text-sm"
                  >
                    <header className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faStar}
                        className="dark:text-favorite"
                      />
                      <h4>{category.section_name}</h4>
                    </header>
                    <ul className="grid content-start dark:text-checkbox max-h-48 overflow-auto scrollbar">
                      {category.summary_name.map((summary: string) => {
                        return (
                          <li
                            key={summary}
                            className="flex items-center justify-between gap-10 p-2 cursor-pointer dark:hover:bg-filter/30 duration-100 border-b-1 dark:border-checkbox/30"
                            onClick={() => {
                              setPeriod(3);
                              setSelectedReportAccount(undefined);
                              setSpotlightSearchString("");
                              navigate(
                                `/summaries/details?&summary=${summary
                                  .toLowerCase()
                                  .replaceAll(" ", "_")}`
                              );
                            }}
                          >
                            {summary}
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                );
              })}
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 items-stretch gap-5 pb-4">
              {summarySections?.map((summaryCategory: string) => {
                const filteredSummaries = sortNumericData(
                  publications?.filter(
                    (publication: Publication) =>
                      publication.artifact_category === summaryCategory &&
                      publication.artifact_name
                        .toLowerCase()
                        .replace(/\s+/g, "")
                        .includes(query.toLowerCase().replace(/\s+/g, ""))
                  ),
                  "sub_section_number",
                  "asc"
                );
                return (
                  <section
                    key={summaryCategory}
                    className="grid content-start gap-3 p-4 text-sm dark:bg-panel black-shadow"
                  >
                    <header className="flex items-center gap-2">
                      <img
                        src={`/summaries/landing/${summaryLogos[summaryCategory]}.svg`}
                        alt={summaryCategory}
                        className="w-4 h-4"
                      />
                      <h4> {summaryCategory}</h4>
                    </header>
                    {filteredSummaries?.length > 0 ? (
                      <SummaryList
                        filteredReports={filteredSummaries}
                        favorites={globalFavorites}
                      />
                    ) : (
                      <p className="dark:text-checkbox">No reports</p>
                    )}
                  </section>
                );
              })}
            </section>
          </section>
        )}

        {Report && <Report />}
      </motion.main>
    </PageLayout>
  );
};

export default Summaries;
