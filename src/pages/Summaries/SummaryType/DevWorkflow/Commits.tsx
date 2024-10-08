import { useState } from "react";
import { pageSize, userColors } from "src/constants/general";
import PaginatedListLayout from "src/layouts/PaginatedListLayout";
import { GetDevWorkflowWidgets } from "src/services/summaries/dev-workflow";
import { useGeneralStore } from "src/stores/general";
import { KeyStringVal } from "src/types/general";
import { lastUpdatedAt, sortNumericData } from "src/utils/general";

const Commits = ({
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

  const filteredCommits =
    query === ""
      ? widgets?.commit_info.data
      : widgets?.commit_info.data?.filter((commit: KeyStringVal) =>
          commit.target_message
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  const sortedCommits = sortNumericData(
    filteredCommits,
    "target_committed_date_since_epoch",
    "desc"
  );
  const totalCount = sortedCommits?.length || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <section className="grid content-start gap-2 p-4 w-full max-h-[30rem] dark:bg-panel black-shadow rounded-sm">
      <h4>Commits ({sortedCommits?.length || 0})</h4>
      {widgets?.commit_info.data ? (
        widgets.commit_info.data.length > 0 ? (
          <PaginatedListLayout
            placeholderText="Search commit message"
            query={query}
            totalCount={totalCount}
            totalPages={totalPages}
            beginning={beginning}
            end={end}
            setQuery={setQuery}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          >
            <ul className="grid gap-3 overflow-auto scrollbar">
              {sortedCommits
                .slice(beginning - 1, end + 1)
                .map((commit: KeyStringVal) => {
                  return (
                    <li
                      key={commit.target_commit_url}
                      className="grid gap-2 p-4 dark:bg-filter/30 rounded-sm"
                    >
                      <a
                        href={commit.target_commit_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-[30rem] truncate hover:text-signin hover:underline"
                      >
                        {commit.target_message}
                      </a>
                      <article className="flex items-center gap-2">
                        <span
                          className={`grid content-center w-5 h-5 capitalize text-center text-[0.65rem] dark:text-white font-medium bg-gradient-to-b ${
                            userColors[
                              commit.target_committer_email[0].toLowerCase()
                            ]
                          } rounded-full shadow-sm dark:shadow-checkbox`}
                        >
                          {commit.target_committer_email[0]}
                        </span>
                        <p className="text-[0.75rem]">
                          {" "}
                          {commit.target_committer_name}{" "}
                          <span className="dark:text-gray-300">
                            commited{" "}
                            {lastUpdatedAt(
                              Number(commit.target_committed_date_since_epoch)
                            )}
                          </span>{" "}
                        </p>
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

export default Commits;
