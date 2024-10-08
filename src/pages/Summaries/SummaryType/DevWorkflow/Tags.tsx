import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { utcFormat } from "d3-time-format";
import { useState } from "react";
import { pageSize, userColors } from "src/constants/general";
import PaginatedListLayout from "src/layouts/PaginatedListLayout";
import { GetDevWorkflowWidgets } from "src/services/summaries/dev-workflow";
import { useGeneralStore } from "src/stores/general";
import { KeyStringVal } from "src/types/general";
import { convertToDate, sortNumericData } from "src/utils/general";
import { copyToClipboard } from "src/utils/graph";

const Tags = ({
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

  const [hoverCopy, setHoverCopy] = useState<string>("");
  const [copied, setCopied] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [query, setQuery] = useState<string>("");

  const { data: widgets } = GetDevWorkflowWidgets(
    env,
    selectedOrgName,
    selectedRepo,
    startMarker,
    endMarker
  );

  const filteredTags =
    query === ""
      ? widgets?.tag_info.data
      : widgets?.tag_info.data?.filter((tag: KeyStringVal) =>
          tag.check_suite_branch_name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  const sortedTags = sortNumericData(
    filteredTags,
    "check_suite_updated_at_since_epoch",
    "desc"
  );

  const totalCount = sortedTags?.length || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <section className="grid content-start gap-2 p-4 w-full max-h-[30rem] dark:bg-panel black-shadow rounded-sm">
      <h4>Tags ({sortedTags?.length || 0})</h4>
      {widgets?.tag_info.data ? (
        widgets.tag_info.data.length > 0 ? (
          <PaginatedListLayout
            placeholderText="Search tag name"
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
              {sortedTags
                .slice(beginning - 1, end + 1)
                .map((tag: KeyStringVal) => {
                  return (
                    <li
                      key={tag.check_suite_updated_at_since_epoch}
                      className="grid gap-2 p-4 dark:bg-filter/30 rounded-sm"
                    >
                      <header className="flex items-center gap-3">
                        <a
                          href={tag.check_suite_push_permalink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="max-w-20 truncate hover:text-signin hover:underline"
                        >
                          {tag.check_suite_branch_name}
                        </a>
                        <article>
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="relative w-4 h-4 cursor-pointer"
                            onClick={() => {
                              copyToClipboard(tag.check_suite_branch_name);
                              setCopied(tag.check_suite_branch_name);
                              setHoverCopy(tag.check_suite_branch_name);
                            }}
                            onMouseEnter={() =>
                              setHoverCopy(tag.check_suite_branch_name)
                            }
                            onMouseLeave={() => setHoverCopy("")}
                          >
                            <path
                              d="M16.5 17.875V19.9375C16.5 21.0742 15.5742 22 14.4375 22H2.0625C0.925833 22 0 21.0742 0 19.9375V7.5625C0 6.42583 0.925833 5.5 2.0625 5.5H4.125V14.4375C4.125 16.335 5.665 17.875 7.5625 17.875H16.5ZM22 2.0625V14.4375C22 15.5742 21.0742 16.5 19.9375 16.5H7.5625C6.42583 16.5 5.5 15.5742 5.5 14.4375V2.0625C5.5 0.925833 6.42583 0 7.5625 0H19.9375C21.0742 0 22 0.925833 22 2.0625Z"
                              fill={
                                copied === tag.check_suite_branch_name
                                  ? "#29ABE2"
                                  : "#41576D"
                              }
                            />
                          </svg>
                          {hoverCopy === tag.check_suite_branch_name && (
                            <article className="relative z-50">
                              <article className="absolute top-3 -left-5 flex items-center gap-2 px-3 py-1 w-max text-xs dark:text-white dark:bg-filter black-shadow rounded-sm">
                                {copied === tag.check_suite_branch_name
                                  ? "Copied!"
                                  : "Copy"}{" "}
                              </article>
                            </article>
                          )}
                        </article>
                      </header>
                      <article className="flex items-center gap-5 text-[0.75rem]">
                        <article className="flex items-center gap-2">
                          <FontAwesomeIcon
                            icon={faClock}
                            className="dark:text-signin"
                          />
                          <p>
                            {utcFormat("%b %d %Y")(
                              convertToDate(
                                Number(tag.check_suite_updated_at_since_epoch)
                              )
                            )}
                          </p>
                        </article>
                        <article className="flex items-center gap-2">
                          <span
                            className={`grid content-center w-4 h-4 capitalize text-center text-[0.65rem] dark:text-white font-medium bg-gradient-to-b ${
                              userColors[
                                tag.check_suite_creator_name[0].toLowerCase()
                              ]
                            } rounded-full shadow-sm dark:shadow-checkbox`}
                          >
                            {tag.check_suite_creator_name[0]}
                          </span>
                          {tag.check_suite_creator_name}
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

export default Tags;
