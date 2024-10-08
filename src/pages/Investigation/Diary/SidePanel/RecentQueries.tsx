/* eslint-disable no-restricted-globals */
import { faClock, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
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
import {
  GetRecentQueries,
  DeleteRecentQuery,
} from "src/services/investigation/diary/recent-queries";

const RecentQueries = () => {
  const parsed = parseURL();
  const jwt = decodeJWT();

  const { env } = useGeneralStore();

  const { data: recentQueries } = GetRecentQueries(env, 10, "SEARCH");

  const addAsEvidence = AddAsEvidence(env);
  const autoGenerateTitle = AutoGenerateTitle(env);
  const deleteRecentQuery = DeleteRecentQuery(env);

  const handleAddAsEvidence = (query: RecentQuery, title: string) => {
    addAsEvidence.mutate(
      {
        body: {
          query_string: query.query_input,
          results: query.results,
          annotation_set: "{}",
          annotation: "",
          diary_id: parsed.diary_id,
          author: jwt?.name,
          query_start_time: query.query_start_time,
          query_end_time: query.query_end_time,
          title: title || "",
          evidence_type: query.search_type,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([
            "get-all-diary-evidence",
            env,
            parsed.diary_id,
          ]);
        },
      }
    );
  };

  return (
    <section className="flex flex-col flex-grow gap-3 text-xs">
      <h4 className="text-sm dark:text-checkbox">Recent queries</h4>
      <ul className="grid content-start gap-5">
        {recentQueries?.map((query: RecentQuery) => {
          return (
            <li key={query.query_log_id} className="flex items-start gap-3">
              <img
                src={`/investigation/evidence-type/${query.search_type.toLowerCase()}.svg`}
                alt={query.search_type.toLowerCase()}
                className="md:hidden lg:block mt-[0.4rem] w-4 h-4 dark:text-checkbox"
              />
              {/* search string */}
              <article className="grid gap-1">
                <article className="flex items-start gap-2 py-1 px-4 w-full break-all dark:text-white dark:bg-signin/20 border dark:border-signin rounded-sm overflow-auto scrollbar">
                  {/* search by cloud */}
                  {query.results.cloud && (
                    <img
                      src={`/general/integrations/${String(
                        query.results.cloud
                      ).toLowerCase()}.svg`}
                      alt={String(query.results.cloud)}
                      className="w-4 h-4"
                    />
                  )}
                  <p className="w-40 hover:whitespace-normal truncate text-ellipsis">
                    {query.query_input}
                  </p>
                </article>
                <article className="flex items-center gap-2 break-all text-[0.65rem] dark:text-checkbox">
                  <FontAwesomeIcon icon={faClock} className="dark:text-admin" />
                  <p>
                    {convertToUTCString(query.query_start_time)}
                    {query.query_start_time !== query.query_end_time &&
                      ` - ${convertToUTCString(query.query_end_time)}`}
                  </p>
                </article>
              </article>
              {/* options for each query */}
              <Popover as="article" className="relative inline-block text-left">
                <>
                  <Popover.Button className="flex items-center gap-2 mt-1 group">
                    <FontAwesomeIcon
                      icon={faEllipsis}
                      className="w-5 h-5 dark:text-checkbox"
                    />
                  </Popover.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Popover.Panel className="absolute right-0 md:left-2 grid md:-mr-5 mt-2 w-max text-left text-xs origin-top-right focus:outline-none dark:text-white dark:bg-tooltip rounded-sm z-50">
                      {({ close }) => (
                        <article className="grid divide-y-1 dark:divide-checkbox/60">
                          <button
                            className="py-1 px-3 text-left dark:hover:bg-filter duration-100"
                            onClick={() => {
                              close();
                              autoGenerateTitle.mutate(
                                {
                                  queryType: query.search_type.includes("MAIN")
                                    ? "main"
                                    : query.search_type.includes("FIREWALL")
                                    ? "firewall"
                                    : "cpm",
                                  searchString: query.query_input,
                                },
                                {
                                  onSuccess: (title) =>
                                    handleAddAsEvidence(query, title),
                                }
                              );
                            }}
                          >
                            Add as evidence
                          </button>
                          <button
                            className="py-1 px-3 text-left dark:hover:bg-filter duration-100"
                            onClick={() => {
                              close();
                              deleteRecentQuery.mutate({
                                queryLogID: query.query_log_id,
                              });
                            }}
                          >
                            Remove from recent
                          </button>
                        </article>
                      )}
                    </Popover.Panel>
                  </Transition>
                </>
              </Popover>
            </li>
          );
        })}
      </ul>
      {recentQueries?.length >= 10 && (
        <p className="italic">shows last 10 queries only</p>
      )}
    </section>
  );
};

export default RecentQueries;
