import React from "react";

const SectionTabs = ({
  documentType,
  selectedTab,
  filter,
  setFilter,
  setAddSectionsToPolicy,
  setSelectedAddedSections,
}: {
  documentType: string;
  selectedTab: string;
  filter: string;
  setFilter: (filter: string) => void;
  setAddSectionsToPolicy?: any;
  setSelectedAddedSections?: any;
}) => {
  const isPolicy = documentType === "policies";

  return (
    <nav className="flex flex-wrap items-center gap-5 text-sm">
      {[
        "All",
        "Mapped To Policy",
        "Relevant Sections",
        `Overlaps With Framework`,
        "Only Mapping",
        "No Mapping",
        "Suggested Content",
        "Policy Generation",
      ].map((option) => {
        if (
          (selectedTab === "Sections" && option === "Relevant Sections") ||
          (!isPolicy &&
            ["Only Mapping", "Suggested Content", "Policy Generation"].includes(
              option
            )) ||
          (isPolicy &&
            [
              "Mapped To Policy",
              "Relevant Sections",
              "Overlaps With Framework",
            ].includes(option))
        )
          return null;
        return (
          <button
            key={option}
            className={`px-8 py-2 text-center border-b-2 ${
              sessionStorage.section_tab === option ||
              (option === "Suggested Content" &&
                sessionStorage.section_tab === "Suggest New Mapping")
                ? "dark:bg-signin/30 dark:border-signin"
                : "dark:bg-filter/10 dark:hover:bg-filter/30 duration-100 dark:border-checkbox"
            } rounded-full`}
            onClick={() => {
              let filteredOption = "";
              if (option === "Suggested Content") {
                filteredOption = "Suggest New Mapping";
                setFilter("Suggest New Mapping");
              } else {
                filteredOption = option;
                setFilter(option);
              }
              sessionStorage.section_tab = filteredOption;
              if (setAddSectionsToPolicy && setSelectedAddedSections) {
                setAddSectionsToPolicy(false);
                setSelectedAddedSections([]);
              }
            }}
          >
            {option}
          </button>
        );
      })}
    </nav>
  );
};

export default SectionTabs;
