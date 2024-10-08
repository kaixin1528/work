import { faXmark, faPlus, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const CVEFilter = ({
  cveIDs,
  setCVEIDs,
}: {
  cveIDs: string[];
  setCVEIDs: (cveIDs: string[]) => void;
}) => {
  const [addFilter, setAddFilter] = useState<boolean>(false);
  const [newFilter, setNewFilter] = useState<string>("");

  const handleAddFilter = () => {
    setCVEIDs([...cveIDs, newFilter]);
    setNewFilter("");
  };

  return (
    <section className="flex flex-wrap items-center gap-5 text-xs">
      {cveIDs.length > 0 && (
        <ul className="flex flex-wrap items-center gap-3">
          {cveIDs.map((cveID: string, index: number) => {
            return (
              <li
                key={index}
                className="flex items-center gap-3 pl-4 pr-1 py-1 dark:text-white dark:bg-org rounded-full"
              >
                <p>{cveID}</p>
                <button
                  onClick={() =>
                    setCVEIDs(cveIDs.filter((curCVEID) => curCVEID !== cveID))
                  }
                >
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="w-4 h-4 dark:text-org dark:hover:bg-checkbox/60 dark:bg-checkbox duration-100 rounded-full"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {!addFilter ? (
        <button
          className="flex items-center gap-2 dark:text-checkbox dark:hover:text-checkbox/60 duration-100"
          onClick={() => {
            setAddFilter(true);
            setNewFilter("");
          }}
        >
          <FontAwesomeIcon icon={faFilter} />
          <h4>Add CVE Id Filter</h4>
        </button>
      ) : (
        <article className="flex items-stretch w-max divide-x dark:divide-account border-1 dark:border-org rounded-sm">
          <article className="relative flex items-center gap-2 py-2 px-4 ring-0 dark:ring-search focus:ring-2 dark:focus:ring-signin dark:bg-account rounded-sm">
            <FontAwesomeIcon
              icon={faFilter}
              className="w-4 h-4 dark:text-checkbox"
            />
            <input
              spellCheck="false"
              autoComplete="off"
              name="new cve id filter"
              value={newFilter}
              onChange={(e) => setNewFilter(e.target.value)}
              onKeyUpCapture={(e) => {
                if (e.key === "Enter") handleAddFilter();
              }}
              type="input"
              className="py-1 w-20 h-3 focus:outline-none dark:placeholder:text-checkbox dark:text-white dark:bg-transparent dark:bg-account dark:border-transparent dark:focus:ring-0 dark:focus:border-transparent"
            />
          </article>
          <button
            disabled={newFilter === ""}
            className="px-2 dark:disabled:text-filter dark:hover:bg-checkbox dark:disabled:bg-org/20 dark:bg-org duration-100"
            onClick={handleAddFilter}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <button
            className="px-2 dark:text-account dark:hover:bg-checkbox dark:bg-org duration-100"
            onClick={() => setAddFilter(false)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </article>
      )}
    </section>
  );
};

export default CVEFilter;
