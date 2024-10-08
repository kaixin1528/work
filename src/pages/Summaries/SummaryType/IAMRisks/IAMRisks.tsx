import React, { useState } from "react";
import SummaryLayout from "src/layouts/SummaryLayout";
import Accounts from "../../Accounts";
import Policies from "./Policies";
import Principals from "./Principals";

const IAMRisks = () => {
  const [selectedNav, setSelectedNav] = useState<string>("Policies");

  return (
    <SummaryLayout name="IAM Risks" hidePeriod>
      <Accounts />
      <nav className="flex items-center gap-2 text-sm w-full">
        {["Policies", "Principals"].map((type: string) => {
          return (
            <article
              key={type}
              className={`p-2 cursor-pointer w-full text-base text-center ${
                selectedNav === type ? "selected-button" : "not-selected-button"
              }`}
              onClick={() => setSelectedNav(type)}
            >
              {type}
            </article>
          );
        })}
      </nav>

      {selectedNav === "Policies" ? <Policies /> : <Principals />}
    </SummaryLayout>
  );
};

export default IAMRisks;
