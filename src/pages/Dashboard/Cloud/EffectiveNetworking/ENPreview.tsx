/* eslint-disable no-restricted-globals */
import { useState } from "react";
import CPMPreview from "./CPM/CPMPreview";
import FirewallPreview from "./Firewall/FirewallPreview";
import { enTabs } from "src/constants/dashboard";

const ENPreview = ({ integration }: { integration: string }) => {
  const [selectedTab, setSelectedTab] = useState<string>("firewall");

  return (
    <section className="flex flex-col flex-grow p-4 gap-2 content-start w-full h-full cursor-pointer dark:text-white font-light dark:bg-card black-shadow">
      <h4>Effective Networking</h4>
      <nav className="grid lg:flex items-center gap-5 w-full text-sm">
        {enTabs.map((tab) => {
          return (
            <button
              key={tab.section}
              className={`p-2 w-full ${
                selectedTab === tab.section
                  ? "full-underlined-label"
                  : "hover:border-b dark:hover:border-signin"
              }`}
              onClick={() => setSelectedTab(tab.section)}
            >
              {tab.name}
            </button>
          );
        })}
      </nav>
      {selectedTab === "firewall" && (
        <FirewallPreview integration={integration} selectedTab={selectedTab} />
      )}
      {selectedTab === "cpm" && (
        <CPMPreview integration={integration} selectedTab={selectedTab} />
      )}
    </section>
  );
};

export default ENPreview;
