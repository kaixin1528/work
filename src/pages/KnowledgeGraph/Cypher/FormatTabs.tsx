/* eslint-disable react-hooks/exhaustive-deps */
import {
  faDiagramProject,
  faTable,
  faNoteSticky,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { cypherReturnTypes } from "src/constants/graph";

const FormatTabs = ({
  searchString,
  selectedReturnType,
  setSelectedReturnType,
  curSearchSnapshot,
}: {
  searchString: string;
  selectedReturnType: string;
  setSelectedReturnType: (selectedReturnType: string) => void;
  curSearchSnapshot: any;
}) => {
  return (
    <nav className="flex items-center gap-2 px-10 mx-auto text-sm">
      {cypherReturnTypes.map((option) => {
        if (
          (curSearchSnapshot?.graph === false &&
            ["graph", "metadata"].includes(option)) ||
          (curSearchSnapshot?.graph === true &&
            !searchString.includes("uno/*") &&
            !searchString.includes(`uno/${option}`))
        )
          return null;
        return (
          <button
            key={option}
            className={`flex items-center gap-2 px-2 py-1 capitalize dark:disabled:text-filter/60 dark:disabled:bg-filter/30 disabled:border dark:disabled:border-filter ${
              selectedReturnType === option
                ? "full-underlined-label"
                : "hover:border-b dark:hover:border-signin"
            }`}
            onClick={() => setSelectedReturnType(option)}
          >
            <FontAwesomeIcon
              icon={
                option === "graph"
                  ? faDiagramProject
                  : option === "table"
                  ? faTable
                  : faNoteSticky
              }
              className="dark:text-checkbox"
            />
            <p>{option}</p>
          </button>
        );
      })}
    </nav>
  );
};

export default FormatTabs;
