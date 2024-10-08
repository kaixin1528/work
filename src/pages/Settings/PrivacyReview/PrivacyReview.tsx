/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { useState } from "react";
import Upload from "./Upload/Upload";
import Settings from "./Settings/Settings";

export const roleHeaders = [
  { display_name: "Customer Name", property_name: "customer_id" },
  { display_name: "Role Name", property_name: "role_name" },
  { display_name: "Role Type", property_name: "role_type" },
];

const PrivacyReview = () => {
  const [selectedTab, setSelectedTab] = useState<string>("Settings");

  return (
    <section className="grid gap-5 p-4 content-start w-full h-full overflow-auto scrollbar">
      <h4>PRIVACY REVIEW </h4>
      <nav className="flex flex-wrap items-center gap-5 text-sm">
        {["Settings", "Upload"].map((tab) => {
          return (
            <button
              key={tab}
              className={`px-8 py-2 text-center capitalize border-b-2 ${
                selectedTab === tab
                  ? "dark:bg-signin/30 dark:border-signin"
                  : "dark:bg-filter/10 dark:hover:bg-filter/30 duration-100 dark:border-checkbox"
              } rounded-full`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          );
        })}
      </nav>
      {selectedTab === "Settings" ? <Settings /> : <Upload />}
    </section>
  );
};

export default PrivacyReview;
