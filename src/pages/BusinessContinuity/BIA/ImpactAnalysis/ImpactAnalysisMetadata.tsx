/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import DeleteBIA from "../DeleteBIA";
import { GetBIAExcelSheets } from "src/services/business-continuity/bia";

const ImpactAnalysisMetadata = ({ biaID }: { biaID: string }) => {
  const { data: documentMetadata } = GetBIAExcelSheets(biaID);

  return (
    <>
      {documentMetadata && (
        <header className="flex items-center justify-between gap-5">
          <h4 className="py-1 break-words text-left text-2xl dark:text-checkbox">
            {documentMetadata.bia_name}
          </h4>
          <DeleteBIA biaID={biaID} />
        </header>
      )}
    </>
  );
};

export default ImpactAnalysisMetadata;
