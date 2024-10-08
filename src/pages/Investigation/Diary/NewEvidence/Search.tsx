/* eslint-disable no-restricted-globals */
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { RecentQuery } from "../../../../types/investigation";
import {
  convertToUTCString,
  decodeJWT,
  parseURL,
} from "../../../../utils/general";
import { queryClient } from "src/App";
import { useGeneralStore } from "src/stores/general";
import {
  AddAsEvidence,
  AutoGenerateTitle,
} from "src/services/investigation/diary/evidence/evidence";
import { GetRecentQueries } from "src/services/investigation/diary/recent-queries";

const Search = ({
  setShowNewEvidence,
  newEvidenceType,
}: {
  setShowNewEvidence: (showNewEvidence: boolean) => void;
  newEvidenceType: string;
}) => {
  const parsed = parseURL();
  const jwt = decodeJWT();

  const { env } = useGeneralStore();

  const [selectedQuery, setSelectedQuery] = useState<any>({});
  const [text, setText] = useState<string>("");

  const { data: recentQueries } = GetRecentQueries(env, 10000, newEvidenceType);
  const addAsEvidence = AddAsEvidence(env);
  const autoGenerateTitle = AutoGenerateTitle(env);

  const filteredRecentQueries = recentQueries
    ? recentQueries.filter(
        (recentQuery: RecentQuery) =>
          recentQuery.search_type === newEvidenceType &&
          recentQuery.query_input
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(text.toLowerCase().replace(/\s+/g, ""))
      )
    : [];

  return (
    <section className="grid gap-5">
      <article className="relative flex items-center py-2 px-4 ring-0 dark:ring-search focus:ring-2 dark:focus:ring-signin dark:bg-account rounded-sm">
        <input
          name="filter search query"
          spellCheck="false"
          autoComplete="off"
          placeholder="Search any query from the history list below..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          type="input"
          className="py-1 w-full h-6 focus:outline-none dark:placeholder:text-checkbox dark:bg-transparent dark:bg-account dark:border-transparent dark:focus:ring-0 dark:focus:border-transparent"
        />
      </article>

      {/* list of recent queries */}
      {recentQueries ? (
        filteredRecentQueries?.length > 0 ? (
          <ul className="grid content-start gap-1 max-h-60 text-xs overflow-auto scrollbar">
            {filteredRecentQueries?.map((query: RecentQuery) => {
              return (
                <li
                  key={query.query_log_id}
                  className={`flex items-start gap-3 p-2 ${
                    selectedQuery.query_log_id === query.query_log_id
                      ? "dark:bg-tooltip"
                      : "dark:hover:bg-tooltip duration-200"
                  } cursor-pointer`}
                  onClick={() => setSelectedQuery(query)}
                >
                  <img
                    src={`/investigation/evidence-type/${query.search_type.toLowerCase()}.svg`}
                    alt={query.search_type.toLowerCase()}
                    className="mt-2 w-4 h-4 dark:text-checkbox"
                  />
                  <article className="grid gap-1">
                    <article className="flex items-start gap-2 py-1 px-4 w-full break-all dark:text-white dark:bg-signin/20 border dark:border-signin rounded-sm overflow-auto scrollbar">
                      {!query.search_type.includes("MAIN") && (
                        <img
                          src={`/general/integrations/${String(
                            query.results.cloud
                          ).toLowerCase()}.svg`}
                          alt={String(query.results.cloud)}
                          className="w-4 h-4"
                        />
                      )}
                      <p>{query.query_input}</p>
                    </article>
                    <p className="break-all text-[0.65rem] dark:text-checkbox">
                      <FontAwesomeIcon
                        icon={faClock}
                        className="dark:text-admin"
                      />{" "}
                      {convertToUTCString(query.query_start_time)}
                      {query.query_start_time !== query.query_end_time &&
                        ` - ${convertToUTCString(query.query_end_time)}`}
                    </p>
                  </article>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>
            No {newEvidenceType.includes("ALERT") ? "alerts" : "queries"}{" "}
            available
          </p>
        )
      ) : null}

      <button
        disabled={
          Object.keys(selectedQuery).length === 0 ||
          autoGenerateTitle.status === "loading" ||
          addAsEvidence.status === "loading"
        }
        className="justify-self-end px-4 py-1 text-xs gradient-button rounded-sm"
        onClick={() =>
          autoGenerateTitle.mutate(
            {
              queryType: newEvidenceType.includes("MAIN")
                ? "main"
                : newEvidenceType.includes("FIREWALL")
                ? "firewall"
                : "cpm",
              searchString: selectedQuery.query_input,
            },
            {
              onSuccess: (title) =>
                addAsEvidence.mutate(
                  {
                    body: {
                      query_string: selectedQuery.query_input,
                      results: selectedQuery.results,
                      annotation_set: "{}",
                      annotation: "",
                      diary_id: parsed.diary_id,
                      author: jwt?.name,
                      query_start_time: selectedQuery.query_start_time,
                      query_end_time: selectedQuery.query_end_time,
                      title: title,
                      evidence_type: newEvidenceType,
                    },
                  },
                  {
                    onSuccess: () => {
                      queryClient.invalidateQueries([
                        "get-all-diary-evidence",
                        env,
                        parsed.diary_id,
                      ]);
                      setShowNewEvidence(false);
                    },
                  }
                ),
            }
          )
        }
      >
        Add evidence
      </button>
    </section>
  );
};

export default Search;
