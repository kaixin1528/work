import React from "react";

const SectionTabs = ({
  selectedTab,
  filter,
  setFilter,
}: {
  selectedTab: string;
  filter: string;
  setFilter: (filter: string) => void;
}) => {
  return (
    <nav className="flex flex-wrap items-center gap-5 text-sm">
      {[
        "All",
        "Overlaps with Audit",
        `Overlaps With Framework`,
        "No Mapping",
        "No Overlaps with Audit",
      ].map((option) => {
        if (
          (selectedTab === "Audit Report" &&
            ["Overlaps with Audit", "No Overlaps with Audit"].includes(
              option
            )) ||
          (selectedTab === "Controls Coverage" &&
            ["Overlaps With Framework", "No Mapping"].includes(option))
        )
          return null;
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
