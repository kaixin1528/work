import { useState } from "react";
import { pageSize, userColors } from "src/constants/general";
import PaginatedListLayout from "src/layouts/PaginatedListLayout";
import { GetDevWorkflowWidgets } from "src/services/summaries/dev-workflow";
import { useGeneralStore } from "src/stores/general";
import { KeyStringVal } from "src/types/general";

const Commiters = ({
  selectedOrgName,
  selectedRepo,
  startMarker,
  endMarker,
}: {
  selectedOrgName: string;
  selectedRepo: string;
  startMarker: number;
  endMarker: number;
}) => {
  const { env } = useGeneralStore();

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [query, setQuery] = useState<string>("");

  const { data: widgets } = GetDevWorkflowWidgets(
    env,
    selectedOrgName,
    selectedRepo,
    startMarker,
    endMarker
  );

  const filteredCommiters =
    query === ""
      ? widgets?.commiter_info.data
      : widgets?.commiter_info.data?.filter((commiter: KeyStringVal) =>
          commiter.target_committer_email
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  const totalCount = filteredCommiters?.length || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <section className="grid content-start gap-2 p-4 w-full max-h-[30rem] dark:bg-panel black-shadow rounded-sm">
      <h4>Commiters ({widgets?.commiter_info.data.length || 0})</h4>
      {widgets?.commiter_info.data ? (
        widgets.commiter_info.data.length > 0 ? (
          <PaginatedListLayout
            placeholderText="Search commiter email"
            query={query}
            totalCount={totalCount}
            totalPages={totalPages}
            beginning={beginning}
            end={end}
            setQuery={setQuery}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          >
            <ul className="grid gap-3 px-4 overflow-auto scrollbar">
              {filteredCommiters
                ?.slice(beginning - 1, end + 1)
                .map((commiter: { [key: string]: string | number }) => {
                  const additions = Number(commiter.total_additions);
                  const deletions = Number(commiter.total_deletions);

                  return (
                    <li
                      key={commiter.target_committer_email}
                      className="flex items-center justify-between gap-5"
                    >
                      <article className="flex items-center gap-2">
                        <span
                          className={`grid content-center w-5 h-5 capitalize text-center text-[0.65rem] dark:text-white font-medium bg-gradient-to-b ${
                            userColors[
                              commiter.target_committer_email[0].toLowerCase()
                            ]
                          } rounded-full shadow-sm dark:shadow-checkbox`}
                        >
                          {commiter.target_committer_email[0]}
                        </span>
                        <article className="grid">
                          {commiter.target_committer_email}
                          <span className="text-xs dark:text-checkbox">
                            {commiter.target_committer_name}
                          </span>
                        </article>
                      </article>
                      <article className="relative group flex items-center gap-2">
                        <article className="grid pr-2 border-r-1 dark:border-checkbox">
                          <p>{additions}</p>
                          <span
                            className={`w-[${
                              additions / (additions + deletions)
                            }rem] h-2 bg-no rounded-l-sm`}
                          ></span>
                        </article>
                        <article className="grid">
                          <p>{deletions}</p>
                          <span
                            className={`w-[${
                              deletions / (additions + deletions)
                            }rem] h-2 bg-reset rounded-r-sm`}
                          ></span>
                        </article>
                      </article>
                    </li>
                  );
                })}
            </ul>
          </PaginatedListLayout>
        ) : (
          <p>No data available</p>
        )
      ) : null}
    </section>
  );
};

export default Commiters;
