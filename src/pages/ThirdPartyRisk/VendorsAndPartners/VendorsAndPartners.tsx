import React, { useState } from "react";
import VendorList from "./Vendors/VendorList";
import VendorGroups from "./VendorGroups/VendorGroups";
import GlobalQuestions from "./GlobalQuestions/GlobalQuestions";
import CustomQuestionSets from "./CustomQuestionSets/CustomQuestionSets";

const VendorsAndPartners = () => {
  const [selectedTab, setSelectedTab] = useState<string>("vendors");

  return (
    <section className="flex flex-col flex-grow gap-5">
      <nav className="flex flex-wrap items-center gap-5">
        {[
          "vendors",
          "vendor groups",
          "global questions",
          "custom question sets",
        ].map((tab) => {
          return (
            <button
              key={tab}
              className={`px-8 py-2 text-center capitalize border-b-2 ${
                selectedTab === tab
                  ? "dark:text-white dark:border-signin"
                  : "dark:text-checkbox dark:hover:text-white dark:border-checkbox"
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          );
        })}
      </nav>
      {selectedTab === "vendors" ? (
        <VendorList />
      ) : selectedTab === "vendor groups" ? (
        <VendorGroups />
      ) : selectedTab === "global questions" ? (
        <GlobalQuestions />
      ) : (
        <CustomQuestionSets />
      )}
    </section>
  );
};

export default VendorsAndPartners;
