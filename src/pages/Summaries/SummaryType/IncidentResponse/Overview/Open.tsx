import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { GetIRSummary } from "src/services/summaries/incident-response";

const Open = () => {
  const { data: irSummary } = GetIRSummary();

  return (
    <section className="grid gap-1 px-4 py-8 w-full text-center">
      <FontAwesomeIcon
        icon={faCheckCircle}
        className="mx-auto w-10 h-10 text-admin"
      />
      <h4 className="dark:text-checkbox">Open</h4>
      <span className="text-2xl font-extrabold">{irSummary?.open}</span>
    </section>
  );
};

export default Open;
