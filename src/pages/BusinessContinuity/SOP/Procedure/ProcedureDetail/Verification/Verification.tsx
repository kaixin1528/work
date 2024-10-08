import React, { useState } from "react";
import PageCoverage from "./PageCoverage";
import TableCoverage from "./TableCoverage";

const Verification = ({
  sopID,
  versionID,
}: {
  sopID: string;
  versionID: string;
}) => {
  const [selectedTab, setSelectedTab] = useState<string>("Page Coverage");

  return (
    <section className="grid gap-5 p-4">
      <nav className="flex flex-wrap items-center gap-5 text-sm">
        {["Page Coverage", "Table Coverage"].map((tab) => {
          return (
            <button
              key={tab}
              className={`px-8 py-2 text-center border-b-2 ${
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

      {selectedTab === "Page Coverage" ? (
        <PageCoverage sopID={sopID} versionID={versionID} />
      ) : (
        <TableCoverage sopID={sopID} versionID={versionID} />
      )}
    </section>
  );
};

export default Verification;
