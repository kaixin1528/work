import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { GetIRSummary } from "src/services/summaries/incident-response";

const Closed = () => {
  const { data: irSummary } = GetIRSummary();

  return (
    <section className="grid gap-1 px-4 py-8 w-full text-center">
      <FontAwesomeIcon
        icon={faCheckCircle}
        className="mx-auto w-10 h-10 text-no"
      />
      <h4 className="dark:text-checkbox">Closed</h4>
      <span className="text-2xl font-extrabold">{irSummary?.closed}</span>
    </section>
  );
};

export default Closed;
