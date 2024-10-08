import React from "react";
import { GetIRSummary } from "src/services/summaries/incident-response";

const Total = () => {
  const { data: irSummary } = GetIRSummary();

  return (
    <section className="grid place-self-center gap-1 p-8 text-center">
      <h4 className="dark:text-checkbox">Total</h4>
      <span className="text-2xl font-extrabold">{irSummary?.total}</span>
    </section>
  );
};

export default Total;
