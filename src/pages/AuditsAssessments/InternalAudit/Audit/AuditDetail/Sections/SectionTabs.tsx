import React from "react";

const SectionTabs = ({
  filter,
  setFilter,
}: {
  filter: string;
  setFilter: (filter: string) => void;
}) => {
  return (
    <nav className="flex flex-wrap items-center gap-5 text-sm">
      {["All", "Relevant Sections"].map((option) => {
        return (
          <button
            key={option}
            className={`px-8 py-2 text-center border-b-2 ${
              filter === option
                ? "dark:bg-signin/30 dark:border-signin"
                : "dark:bg-filter/10 dark:hover:bg-filter/30 duration-100 dark:border-checkbox"
            } rounded-full`}
            onClick={() => setFilter(option)}
          >
            {option}
          </button>
        );
      })}
    </nav>
  );
};

export default SectionTabs;
