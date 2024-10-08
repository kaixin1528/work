import { faCodeCommit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { utcFormat } from "d3-time-format";
import { useState } from "react";
import { pageSize, userColors } from "src/constants/general";
import PaginatedListLayout from "src/layouts/PaginatedListLayout";
import { GetDevWorkflowWidgets } from "src/services/summaries/dev-workflow";
import { useGeneralStore } from "src/stores/general";
import { KeyStringVal } from "src/types/general";
import { convertToDate, sortNumericData } from "src/utils/general";

const Releases = ({
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

  const filteredReleases =
    query === ""
      ? widgets?.release_info.data
      : widgets?.release_info.data?.filter((release: KeyStringVal) =>
          release.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  const sortedReleases = sortNumericData(
    filteredReleases,
    "created_at_since_epoch",
    "desc"
  );
  const totalCount = sortedReleases?.length || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <section className="grid content-start gap-2 p-4 w-full max-h-[30rem] dark:bg-panel black-shadow rounded-sm">
      <h4>Releases ({sortedReleases?.length || 0})</h4>
      {widgets?.release_info.data ? (
        widgets.release_info.data.length > 0 ? (
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
            <ul className="grid gap-10 px-4 overflow-auto scrollbar">
              {sortedReleases.map((release: KeyStringVal) => {
                return (
                  <li
                    key={release.tag_commit_url}
                    className="flex items-start gap-5"
                  >
                    <article className="grid gap-1 dark:text-gray-300">
                      <p className="dark:text-white">
                        {utcFormat("%b %d %Y")(
                          convertToDate(Number(release.created_at_since_epoch))
                        )}
                      </p>
                      <article className="flex items-center gap-2">
                        <span
                          className={`grid content-center w-5 h-5 capitalize text-center text-[0.65rem] dark:text-white font-medium bg-gradient-to-b ${
                            userColors[release.author_login[0].toLowerCase()]
                          } rounded-full shadow-sm dark:shadow-checkbox`}
                        >
                          {release.author_login[0]}
                        </span>
                        <p className="text-[0.75rem]">{release.author_login}</p>
                      </article>
                      <a
                        href={release.tag_commit_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[0.75rem] hover:text-signin hover:underline"
                      >
                        <FontAwesomeIcon icon={faCodeCommit} />
                        <p>{release.tag_commit_oid.slice(0, 7)}</p>
                      </a>
                    </article>
                    <article className="grid gap-5 p-4 w-full h-full break-all dark:bg-checkbox/10 border-1 dark:border-checkbox rounded-md">
                      <h4 className="text-base font-medium">{release.name}</h4>
                      <p>{release.description}</p>
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

export default Releases;
