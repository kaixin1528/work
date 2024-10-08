import React from "react";
import { useNavigate } from "react-router-dom";
import { KeyStringVal } from "src/types/general";
import { convertToUTCShortString } from "src/utils/general";
import parse from "html-react-parser";
import { useGRCStore } from "src/stores/grc";
import { attributeColors } from "src/constants/general";

const SearchResults = ({ searchData }: { searchData: any }) => {
  const navigate = useNavigate();

  const { GRCCategory } = useGRCStore();

  const type =
    GRCCategory === "vendor assessment"
      ? "vendor"
      : GRCCategory === "privacy review"
      ? "privacy"
      : GRCCategory;

  const results = searchData[type];
  const resultCount = results?.length;

  return (
    <section className="flex flex-col flex-grow gap-5 overflow-auto scrollbar">
      <span>
        {resultCount} result{resultCount !== 1 && "s"} found
      </span>
      <section className="flex flex-col flex-grow gap-3 w-full h-full overflow-auto scrollbar">
        {results?.map((result: any, index: number) => {
          return (
            <article
              key={index}
              className={`flex flex-col flex-grow gap-5 px-6 py-3 bg-gradient-to-r ${
                GRCCategory === "policies"
                  ? "dark:from-admin/70 dark:to-white/10"
                  : "dark:from-checkbox/70 dark:to-white/10"
              } cursor-pointer dark:hover:to-white/30 duration-100 rounded-md`}
              onClick={() => {
                if (["vendor", "privacy"].includes(type))
                  navigate(
                    `/third-party-risk/${type}/details?review_id=${result.review_id}&framework_id=${result.framework_ids[0]}&audit_id=${result.audit_id}`
                  );
                else
                  navigate(
                    `/regulation-policy/document/details?document_type=${GRCCategory}&document_id=${result.id}`
                  );
              }}
            >
              {result.status && (
                <span
                  className={`text-sm ${
                    attributeColors[result.status.toLowerCase()]
                  }`}
                >
                  {result.status.replaceAll("_", " ")}
                </span>
              )}
              <header className="flex items-start justify-between gap-20 break-words font-extralight text-left text-base dark:text-white">
                <article className="flex items-start gap-2 w-3/5">
                  <img
                    src={result.thumbnail_uri}
                    alt={result.name}
                    className="w-7 h-7 rounded-full"
                  />
                  <h4 className="font-medium">{result.name}</h4>
                </article>
                <span>
                  {result.customer_name && <span>{result.customer_name}</span>}{" "}
                  {result.last_updated_at &&
                    `| ${convertToUTCShortString(
                      Number(result.last_updated_at)
                    )}`}
                </span>
                {result.regulatory_authority && (
                  <span>
                    {result.regulatory_authority && (
                      <span>{result.regulatory_authority}</span>
                    )}{" "}
                    {result.regulatory_date &&
                      `| ${convertToUTCShortString(
                        Number(result.regulatory_date)
                      )}`}
                  </span>
                )}
              </header>
              {result.children?.length > 0 && (
                <ul className="flex flex-col flex-grow gap-3 mx-8 my-5">
                  {result.children.map((children: KeyStringVal) => {
                    return (
                      <li
                        key={children.generated_id}
                        className={`flex flex-wrap items-center gap-2 p-4 w-full cursor-pointer bg-gradient-to-r ${
                          GRCCategory === "policies"
                            ? "dark:from-admin/70 dark:to-white/10"
                            : "dark:from-checkbox/70 dark:to-white/10"
                        } dark:hover:to-white/30 duration-100 rounded-md`}
                        onClick={() => {
                          sessionStorage.search_id = children.generated_id;
                          navigate(
                            `/regulation-policy/document/details?document_type=${GRCCategory}&document_id=${result.id}`
                          );
                        }}
                      >
                        ......
                        {parse(children.search_highlight)}
                        ......
                      </li>
                    );
                  })}
                </ul>
              )}
            </article>
          );
        })}
      </section>
    </section>
  );
};

export default SearchResults;
