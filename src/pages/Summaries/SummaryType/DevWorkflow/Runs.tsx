import { useState } from "react";
import { attributeColors, pageSize } from "src/constants/general";
import ListLayout from "src/layouts/ListLayout";
import PaginatedListLayout from "src/layouts/PaginatedListLayout";
import { GetDevWorkflowWidgets } from "src/services/summaries/dev-workflow";
import { useGeneralStore } from "src/stores/general";
import { Sort } from "src/types/dashboard";
import { ListHeader } from "src/types/general";
import { KeyStringVal } from "src/types/general";
import { convertToUTCString, sortRows } from "src/utils/general";

const Runs = ({
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
  const [sort, setSort] = useState<Sort>({
    order: "desc",
    orderBy: "check_suite_updated_at_since_epoch",
  });

  const { data: widgets } = GetDevWorkflowWidgets(
    env,
    selectedOrgName,
    selectedRepo,
    startMarker,
    endMarker
  );

  const filteredRuns =
    query === ""
      ? widgets?.workflow_runs.data
      : widgets?.workflow_runs.data?.filter((run: KeyStringVal) =>
          run.check_suite_branch_name
            ?.toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  const sortedRuns = sortRows(filteredRuns, sort);
  const totalCount = filteredRuns?.length || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <section className="grid content-start gap-2 p-4 w-full max-h-[30rem] dark:bg-panel black-shadow rounded-sm">
      <h4>Runs ({widgets?.workflow_runs.data.length || 0})</h4>
      {widgets?.workflow_runs.data ? (
        widgets.workflow_runs.data.length > 0 ? (
          <PaginatedListLayout
            placeholderText="Search release name"
            query={query}
            totalCount={totalCount}
            totalPages={totalPages}
            beginning={beginning}
            end={end}
            setQuery={setQuery}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          >
            <ListLayout
              listHeader={widgets.workflow_runs.headers}
              setSort={setSort}
            >
              {sortedRuns
                ?.slice(beginning - 1, end + 1)
                .map((run: KeyStringVal) => {
                  return (
                    <tr
                      key={run.check_suite_updated_at_since_epoch}
                      className="px-4 py-2 text-xs dark:even:bg-card"
                    >
                      {widgets.workflow_runs.headers.map((col: ListHeader) => {
                        return (
                          <td key={col.property_name} className="py-2 px-3">
                            {col.property_name === "check_suite_branch_name" ? (
                              <a
                                href={run.check_suite_push_permalink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="break-all dark:hover:text-signin hover:underline"
                              >
                                {run.check_suite_branch_name}
                              </a>
                            ) : (
                              <p
                                className={`${
                                  [
                                    "check_suite_conclusion",
                                    "check_suite_status",
                                  ].includes(col.property_name) &&
                                  `${
                                    attributeColors[
                                      run[col.property_name]?.toLowerCase()
                                    ]
                                  }`
                                } break-all`}
                              >
                                {col.property_name ===
                                "check_suite_updated_at_since_epoch"
                                  ? convertToUTCString(
                                      Number(run[col.property_name])
                                    )
                                  : run[col.property_name]}
                              </p>
                            )}
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

export default Runs;
