/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import ReturnPage from "src/components/Button/ReturnPage";
import PageLayout from "src/layouts/PageLayout";
import ProcedureMetadata from "./ProcedureMetadata";
import { parseURL } from "src/utils/general";
import ProcedureDetail from "./ProcedureDetail/ProcedureDetail";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Procedure = () => {
  const parsed = parseURL();

  const [selectedSOPVersion, setSelectedSOPVersion] = useState<string>("");

  const sopID = String(parsed.sop_id) || "";

  return (
    <PageLayout>
      <main className="relative flex flex-col flex-grow gap-5 px-5 pt-5 h-full w-full overflow-auto scrollbar">
        <article className="flex items-center gap-5">
          <ReturnPage />
          <h4 className="capitalize">
            Business Continuity <FontAwesomeIcon icon={faArrowRightLong} />{" "}
            Standard Operating Procedures
          </h4>
        </article>
        <ProcedureMetadata
          sopID={sopID}
          selectedSOPVersion={selectedSOPVersion}
          setSelectedSOPVersion={setSelectedSOPVersion}
        />
        <ProcedureDetail sopID={sopID} />
      </main>
    </PageLayout>
  );
};

export default Procedure;
