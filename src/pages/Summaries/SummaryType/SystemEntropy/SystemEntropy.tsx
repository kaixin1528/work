import React, { useEffect, useState } from "react";
import SummaryLayout from "src/layouts/SummaryLayout";
import PropertyGroups from "./PropertyGroups/PropertyGroups";
import PropertyGroupDetail from "./PropertyGroupDetail";
import PropertyDetail from "./PropertyDetail";
import { utcFormat } from "d3-time-format";
import { convertToDate } from "src/utils/general";
import { useSummaryStore } from "src/stores/summaries";
import ResourceTypes from "./ResourceTypes";

const SystemEntropy = () => {
  const { period } = useSummaryStore();

  const [selectedTab, setSelectedTab] = useState<string>("property groups");
  const [nav, setNav] = useState<string[]>([]);

  useEffect(() => {
    document.getElementById("system-entropy")?.scrollIntoView();
  }, [nav]);

  useEffect(() => {
    setNav([]);
  }, [period]);

  return (
    <SummaryLayout name="Overall System Entropy" excludePeriods={[1, 5]}>
      <section
        id="system-entropy"
        className="flex flex-col flex-grow p-4 gap-5 dark:bg-card black-shadow"
      >
        <nav className="flex items-center gap-1">
          {nav.map((name, index) => (
            <button
              key={name}
              className={`${index === 2 ? "" : "capitalize"} hover:underline`}
              onClick={() => {
                if (index === 0) setNav([]);
                else setNav(nav.slice(0, index + 1));
              }}
            >
              {index === 1
                ? `${name.split("+")[1]} - ${utcFormat(
                    [2, 3].includes(period) ? "%b %d" : "%H:%M"
                  )(convertToDate(Number(name.split("+")[0])))}`
                : index === 2
                ? `${name.split("+")[0]} - ${name.split("+")[1]}`
                : name}{" "}
              {index < nav.length - 1 && ">"}
            </button>
          ))}
        </nav>
        {nav.length === 0 ? (
          <section className="grid content-start gap-5">
            <nav className="flex items-center gap-5 mx-auto">
              {["property groups", "resource types"].map((tab) => (
                <button
                  key={tab}
                  className={`px-2 py-1 capitalize ${
                    selectedTab === tab
                      ? "selected-button"
                      : "dark:hover:bg-signin/60 duration-100"
                  }`}
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </nav>
            {selectedTab.includes("resource") ? (
              <ResourceTypes setNav={setNav} />
            ) : (
              <PropertyGroups setNav={setNav} />
            )}
          </section>
        ) : nav.length === 2 ? (
          <PropertyGroupDetail nav={nav} setNav={setNav} />
        ) : (
          nav.length === 3 && <PropertyDetail nav={nav} />
        )}
      </section>
    </SummaryLayout>
  );
};

export default SystemEntropy;
