import React from "react";
import Reset from "src/pages/KnowledgeGraph/Reset";

const NoResults = ({
  noResults,
  isCVE,
}: {
  noResults?: boolean;
  isCVE?: boolean;
}) => {
  return (
    <article className="grid gap-2 my-2 w-full h-full place-content-center">
      <img
        src={`/general/${isCVE ? "empty-cve" : "no-results"}.svg`}
        alt="no results"
        className="w-full h-[10rem]"
      />
      <p className="text-base text-center dark:text-white">
        {isCVE ? "CVE not found in your system" : " No relevant data found!"}
      </p>
      {noResults && (
        <ul className="grid content-start gap-2 list-decimal">
          <li className="pl-2">Pick another date and time</li>
          <li className="pl-2">
            <Reset />
          </li>
        </ul>
      )}
    </article>
  );
};

export default NoResults;
