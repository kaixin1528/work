/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { useEffect, useState } from "react";
import { Sort } from "src/types/dashboard";
import { sortRows } from "src/utils/general";
import ListLayout from "../../../../layouts/ListLayout";
import { ListHeader } from "../../../../types/general";
import { DevWorkflowRepo } from "../../../../types/summaries";
import { GetDevWorkflowRepos } from "src/services/summaries/dev-workflow";
import { useSummaryStore } from "src/stores/summaries";
import { useGeneralStore } from "src/stores/general";
import { initialSort, pageSize } from "src/constants/general";
import PaginatedListLayout from "src/layouts/PaginatedListLayout";

const TopRepos = ({
  setSelectedOrgName,
  selectedRepo,
  setSelectedRepo,
}: {
  setSelectedOrgName: (selectedOrgName: string) => void;
  selectedRepo: string;
  setSelectedRepo: (selectedRepo: string) => void;
}) => {
  const { env } = useGeneralStore();
  const { period } = useSummaryStore();

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [sort, setSort] = useState<Sort>(initialSort);

  const { data: repos } = GetDevWorkflowRepos(env, period);

  const filteredRepos =
    query === ""
      ? repos?.data
      : repos?.data?.filter((repo: DevWorkflowRepo) =>
          repo.repo_name
            ?.toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  const sortedRepos = sortRows(filteredRepos, sort);
  const totalCount = sortedRepos?.length || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  useEffect(() => {
    if (sortedRepos?.length > 0 && selectedRepo === "") {
      setSelectedOrgName(sortedRepos[0].org_name);
      setSelectedRepo(sortedRepos[0].repo_name);
    }
  }, [sortedRepos]);

  return (
    <section className="flex flex-col flex-grow gap-5 p-4 w-full h-full dark:bg-panel black-shadow rounded-sm">
      <h4 className="text-base">Repositories ({repos?.data.length || 0})</h4>
      {repos ? (
        repos.data.length > 0 ? (
          <PaginatedListLayout
            placeholderText="Search repo name"
            query={query}
            totalCount={totalCount}
            totalPages={totalPages}
            beginning={beginning}
            end={end}
            setQuery={setQuery}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          >
            <ListLayout listHeader={repos.headers} setSort={setSort}>
              {sortedRepos
                ?.slice(beginning - 1, end + 1)
                .map((repo: DevWorkflowRepo) => {
                  return (
                    <tr
                      key={repo.repo_name}
                      className={`px-4 py-2 cursor-pointer dark:even:bg-card ${
                        repo.repo_name === selectedRepo
                          ? "dark:bg-filter dark:even:bg-filter"
                          : "dark:hover:bg-filter/30 duration-100"
                      }`}
                      onClick={() => {
                        setSelectedOrgName(repo.org_name);
                        setSelectedRepo(repo.repo_name);
                      }}
                    >
                      {repos.headers.map((col: ListHeader) => {
                        return (
                          <td key={col.property_name} className="py-2 px-3">
                            {repo[col.property_name]}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
            </ListLayout>
          </PaginatedListLayout>
        ) : (
          <p>No data available</p>
        )
      ) : null}
    </section>
  );
};

export default TopRepos;
