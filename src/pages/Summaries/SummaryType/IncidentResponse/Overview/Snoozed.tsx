import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { GetIRSummary } from "src/services/summaries/incident-response";

const Snoozed = () => {
  const { data: irSummary } = GetIRSummary();

  return (
    <section className="grid gap-1 px-4 py-8 w-full text-center">
      <FontAwesomeIcon
        icon={faQuestionCircle}
        className="mx-auto w-10 h-10 text-purple-500"
      />
      <h4 className="dark:text-checkbox">Snoozed</h4>
      <span className="text-2xl font-extrabold">{irSummary?.snoozed}</span>
    </section>
  );
};

export default Snoozed;
