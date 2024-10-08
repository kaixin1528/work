import React from "react";

const DocumentTabs = ({
  documentType,
  selectedTab,
  setSelectedTab,
}: {
  documentType: string;
  selectedTab: string;
  setSelectedTab: (selectedTab: string) => void;
}) => {
  return (
    <nav className="flex flex-wrap items-center gap-5">
      {[
        "Controls",
        "Coverage",
        "Checklist",
        "Sections",
        "Tables",
        "Images",
        "Audit Trail",
        "Side-by-Side View",
      ].map((tab) => {
        if (
          (["Checklist", "Controls", "Coverage"].includes(tab) &&
            documentType === "policies") ||
          (["Side-by-Side View"].includes(tab) &&
            ["frameworks"].includes(documentType)) ||
          (tab === "Audit Trail" &&
            ["frameworks", "circulars"].includes(documentType))
        )
          return null;
        return (
          <button
            key={tab}
            className={`px-8 py-2 text-center border-b-2 ${
              selectedTab === tab
                ? "dark:text-white dark:border-admin"
                : "dark:text-checkbox dark:hover:text-white dark:border-checkbox"
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        );
      })}
    </nav>
  );
};

export default DocumentTabs;
