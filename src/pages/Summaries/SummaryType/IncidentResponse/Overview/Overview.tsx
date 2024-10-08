import React from "react";
import Severities from "./Severities";
import Total from "./Total";
import Statuses from "./Statuses";
import Open from "./Open";
import Snoozed from "./Snoozed";
import Closed from "./Closed";

const Overview = () => {
  return (
    <section className="flex items-center gap-5 w-full h-full divide-x-1 dark:divide-filter/30 dark:bg-card black-shadow overflow-auto scrollbar">
      <Severities />
      <Total />
      <Statuses />
      <Open />
      <Snoozed />
      <Closed />
    </section>
  );
};

export default Overview;
