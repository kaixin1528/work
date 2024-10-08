import React from "react";

const SecondaryTabs = ({
  selectedSecondaryTab,
  setSelectedSecondaryTab,
}: {
  selectedSecondaryTab: string;
  setSelectedSecondaryTab: (selectedSecondaryTab: string) => void;
}) => {
  return (
    <nav className="flex flex-wrap items-center gap-5">
      {["Sections", "Tables", "Images"].map((tab) => {
        return (
          <button
            key={tab}
            className={`px-8 py-2 text-center border-b-2 ${
              selectedSecondaryTab === tab
                ? "dark:text-white dark:border-admin"
                : "dark:text-checkbox dark:hover:text-white dark:border-checkbox"
            }`}
            onClick={() => setSelectedSecondaryTab(tab)}
          >
            {tab}
          </button>
        );
      })}
    </nav>
  );
};

export default SecondaryTabs;
