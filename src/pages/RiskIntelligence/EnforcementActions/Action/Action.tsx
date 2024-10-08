import React from "react";
import ActionMetadata from "./ActionMetadata";
import ReturnPage from "src/components/Button/ReturnPage";
import PageLayout from "src/layouts/PageLayout";
import { parseURL } from "src/utils/general";
import ActionDetail from "./ActionDetail";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Action = () => {
  const parsed = parseURL();

  const actionID = String(parsed.action_id) || "";

  return (
    <PageLayout>
      <main className="relative flex flex-col flex-grow gap-5 px-5 pt-5 h-full w-full overflow-auto scrollbar">
        <article className="flex items-center gap-5">
          <ReturnPage />
          <h4 className="capitalize">
            Risk Intelligence <FontAwesomeIcon icon={faArrowRightLong} />{" "}
            Enforcement Actions
          </h4>
        </article>
        <ActionMetadata actionID={actionID} />
        <ActionDetail actionID={actionID} />
      </main>
    </PageLayout>
  );
};

export default Action;
