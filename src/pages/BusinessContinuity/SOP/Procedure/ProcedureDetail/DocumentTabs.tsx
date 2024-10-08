import React from "react";

const DocumentTabs = ({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: string;
  setSelectedTab: (selectedTab: string) => void;
}) => {
  return (
    <nav className="flex flex-wrap items-center gap-5">
      {["Sections", "Tables", "Images", "Audit Trail", "Verification"].map(
        (tab) => {
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
        }
      )}
    </nav>
  );
};

export default DocumentTabs;
