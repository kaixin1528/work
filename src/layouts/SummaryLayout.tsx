import React from "react";
import PeriodFilter from "src/components/Filter/Summaries/PeriodFilter";
import ReturnPage from "../components/Button/ReturnPage";
import SubscribeShare from "src/pages/Summaries/SubscribeShare";

const SummaryLayout: React.FC<{
  name: string;
  hidePeriod?: boolean;
  excludePeriods?: number[];
}> = ({ name, hidePeriod, excludePeriods, children }) => {
  return (
    <section className="flex flex-col flex-grow content-start gap-5 w-full overflow">
      <header className="flex flex-wrap items-center justify-between gap-5 text-xs">
        <article className="flex items-center gap-5">
          <ReturnPage />
          <h2 className="text-xl">{name}</h2>
        </article>
        <section className="flex items-center gap-10">
          {/* subscribe + share */}
          <SubscribeShare />

          {/* time period selection */}
          {!hidePeriod && <PeriodFilter excludePeriods={excludePeriods} />}
        </section>
      </header>

      {children}
    </section>
  );
};

export default SummaryLayout;
