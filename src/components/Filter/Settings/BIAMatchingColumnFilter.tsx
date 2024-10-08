/* eslint-disable react-hooks/exhaustive-deps */
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const BIAMatchingColumnFilter = ({
  label,
  list,
  columns,
  setColumns,
  setIsEdited,
}: {
  label?: string;
  list: string[];
  columns: string[];
  setColumns: (columns: string[]) => void;
  setIsEdited: (isEdited: boolean) => void;
}) => {
  const [addColumn, setAddColumn] = useState<boolean>(false);
  const [newColumn, setNewColumn] = useState<string>("");

  return (
    <section className="flex flex-col flex-grow gap-3 pt-5">
      <h4>BIA Matching Columns</h4>
      <ul className="flex flex-wrap items-center gap-3">
        {columns.map((col: string) => {
          return (
            <li
              key={col}
              className="flex items-center gap-3 pl-4 pr-2 py-1 dark:text-white dark:bg-org rounded-full"
              onClick={() => {
                if (columns.includes(col))
                  setColumns(columns.filter((curCol) => curCol !== col));
                else setColumns([...columns, col]);
              }}
            >
              <p>{col}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setColumns(columns.filter((curCol) => curCol !== col));
                }}
              >
                <FontAwesomeIcon
                  icon={faXmark}
                  className="w-4 h-4 dark:text-org dark:hover:bg-checkbox/60 dark:bg-checkbox duration-100 rounded-full"
                />
              </button>
            </li>
          );
        })}
        {!addColumn ? (
          <button
            className="flex items-center gap-2 dark:text-checkbox dark:hover:text-checkbox/60 duration-100"
            onClick={() => {
              setAddColumn(true);
              setNewColumn("");
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
            <h4>Add Column</h4>
          </button>
        ) : (
          <article className="flex items-stretch w-max divide-x dark:divide-account border-1 dark:border-org rounded-sm">
            <article className="relative flex items-center gap-2 py-2 px-4 ring-0 dark:ring-search focus:ring-2 dark:focus:ring-signin dark:bg-account rounded-sm">
              <FontAwesomeIcon
                icon={faPlus}
                className="w-4 h-4 dark:text-checkbox"
              />
              <input
                spellCheck="false"
                autoComplete="off"
                name="new tag"
                value={newColumn}
                onChange={(e) => setNewColumn(e.target.value)}
                type="input"
                className="py-1 w-20 h-3 focus:outline-none dark:placeholder:text-checkbox dark:text-white dark:bg-transparent dark:bg-account dark:border-transparent dark:focus:ring-0 dark:focus:border-transparent"
              />
            </article>
            <button
              disabled={newColumn === ""}
              className="px-2 dark:disabled:text-filter dark:hover:bg-checkbox dark:disabled:bg-org/20 dark:bg-org duration-100"
              onClick={() => {
                setAddColumn(false);
                setNewColumn("");
                setColumns([...columns, newColumn]);
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button
              className="px-2 dark:text-account dark:hover:bg-checkbox dark:bg-org duration-100"
              onClick={() => setAddColumn(false)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </article>
        )}
      </ul>
    </section>
  );
};

export default BIAMatchingColumnFilter;
