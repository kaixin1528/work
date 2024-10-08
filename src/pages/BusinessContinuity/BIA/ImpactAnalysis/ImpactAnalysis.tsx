/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import ReturnPage from "src/components/Button/ReturnPage";
import PageLayout from "src/layouts/PageLayout";
import { parseURL } from "src/utils/general";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ImpactAnalysisMetadata from "./ImpactAnalysisMetadata";
import ImpactAnalysisDetail from "./ImpactAnalysisDetail/ImpactAnalysisDetail";

const ImpactAnalysis = () => {
  const parsed = parseURL();

  const biaID = String(parsed.bia_id) || "";

  return (
    <PageLayout>
      <main className="relative flex flex-col flex-grow gap-5 px-5 pt-5 h-full w-full overflow-auto scrollbar">
        <article className="flex items-center gap-5">
          <ReturnPage />
          <h4 className="capitalize">
            Business Continuity <FontAwesomeIcon icon={faArrowRightLong} />{" "}
            Business Impact Analysis
          </h4>
        </article>
        <ImpactAnalysisMetadata biaID={biaID} />
        <ImpactAnalysisDetail biaID={biaID} />
      </main>
    </PageLayout>
  );
};

export default ImpactAnalysis;
