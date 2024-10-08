import { faCodeCommit, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import ViewInGraph from "src/components/Button/ViewInGraph";
import { pageSize, userColors } from "src/constants/general";
import PaginatedListLayout from "src/layouts/PaginatedListLayout";
import { GetDevWorkflowWidgets } from "src/services/summaries/dev-workflow";
import { useGeneralStore } from "src/stores/general";
import { KeyStringVal } from "src/types/general";
import { lastUpdatedAt, sortNumericData } from "src/utils/general";

const Branches = ({
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

  const filteredBranches =
    query === ""
      ? widgets?.branch_info.data
      : widgets?.branch_info.data?.filter((branch: KeyStringVal) =>
          branch.branch_name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  const sortedBranches = sortNumericData(
    filteredBranches,
    "branch_creation_date",
    "desc"
  );
  const totalCount = sortedBranches?.length || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <section className="grid content-start gap-2 p-4 w-full max-h-[30rem] dark:bg-panel black-shadow rounded-sm overflow-auto">
      <h4>Branches ({sortedBranches?.length || 0})</h4>
      {widgets?.branch_info.data ? (
        widgets.branch_info.data.length > 0 ? (
          <PaginatedListLayout
            placeholderText="Search branch name"
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
              {sortedBranches
                .slice(beginning - 1, end + 1)
                .map((branch: KeyStringVal) => {
                  const branchInfo = widgets?.additional_branch.data.find(
                    (d: { branch_name: string }) =>
                      d.branch_name === branch.branch_name
                  );
                  return (
                    <li
                      key={branch.branch_name}
                      className="grid gap-3 p-4 dark:bg-filter/20 rounded-sm"
                    >
                      <header className="flex items-center gap-5">
                        <p className="leading-8">
                          <span className="p-1 dark:bg-admin/20 border dark:border-admin rounded-sm">
                            {branch.branch_name}
                          </span>{" "}
                          created by {branch.author_name}
                        </p>
                        <ViewInGraph
                          requestData={{
                            query_type: "gh_branch_property",
                            type: "GHBRANCH",
                            repo_name: selectedRepo,
                            branch_name: branch.branch_name,
                          }}
                          curSnapshotTime={Number(branch.last_commit_time)}
                        />
                      </header>
                      <article className="flex items-center gap-3 divide-x dark:divide-checkbox">
                        <article className="flex items-center gap-2 text-[0.75rem]">
                          <FontAwesomeIcon icon={faCodeCommit} />
                          <span className="px-2 w-max text-[0.7rem] dark:bg-signin/50 rounded-full">
                            {branchInfo?.num_commits}
                          </span>
                          <h4>Commits</h4>
                        </article>
                        <article className="flex items-center gap-2 pl-3 text-[0.75rem]">
                          <FontAwesomeIcon icon={faUser} />
                          <span className="px-2 w-max text-[0.7rem] dark:bg-signin/50 rounded-full">
                            {branchInfo?.num_committers}
                          </span>
                          <h4>Commiters</h4>
                        </article>
                      </article>
                      <article className="grid gap-2">
                        <h4>
                          Most recent{" "}
                          <FontAwesomeIcon
                            icon={faCodeCommit}
                            className="pl-1 dark:text-checkbox"
                          />
                        </h4>
                        <article className="flex items-center justify-between gap-5 p-2 border-l-1 dark:border-checkbox">
                          <article className="grid gap-1">
                            <a
                              href={branch.last_commit_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="max-w-[15rem] truncate hover:text-signin hover:underline"
                            >
                              {branch.last_commit_message}
                            </a>
                            <article className="flex items-center gap-2">
                              <span
                                className={`grid content-center w-5 h-5 capitalize text-center text-[0.65rem] dark:text-white font-medium bg-gradient-to-b ${
                                  userColors[
                                    branch.author_name[0].toLowerCase()
                                  ]
                                } rounded-full shadow-sm dark:shadow-checkbox`}
                              >
                                {branch.author_name[0]}
                              </span>
                              <p className="text-[0.75rem]">
                                {branch.author_name}{" "}
                                <span className="dark:text-gray-300">
                                  commited{" "}
                                  {lastUpdatedAt(
                                    Number(branch.last_commit_time)
                                  )}
                                </span>{" "}
                              </p>
                            </article>
                          </article>
                          <a
                            href={branch.last_commit_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 dark:bg-filter/30 dark:hover:bg-filter/60 duration-100 border-1 dark:border-checkbox rounded-sm"
                          >
                            {branch.commit_sha_short}
                          </a>
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

export default Branches;
