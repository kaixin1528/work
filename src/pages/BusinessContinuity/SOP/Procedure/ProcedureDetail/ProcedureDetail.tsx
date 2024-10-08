/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { parseURL } from "src/utils/general";
import DocumentTabs from "./DocumentTabs";
import Sections from "./Sections/Sections";
import Tables from "./Tables/Tables";
import Images from "./Images";
import {
  GetProcedureMetadata,
  GetProcedureStatus,
  GetSOPSections,
} from "src/services/business-continuity/sop";
import AuditTrail from "src/pages/RegulationPolicy/Document/DocumentDetail/AuditTrail/AuditTrail";
import Verification from "./Verification/Verification";

const ProcedureDetail = ({ sopID }: { sopID: string }) => {
  const parsed = parseURL();

  const [selectedTab, setSelectedTab] = useState<string>("Sections");
  const [pageNumber, setPageNumber] = useState<number>(1);

  const versionID = String(parsed.sop_version_id) || "";

  const { data: sopStatus } = GetProcedureStatus(sopID, versionID);
  const { data: sopMetadata } = GetProcedureMetadata(sopID);

  const { data: table, status: tableStatus } = GetSOPSections(
    sopStatus?.status,
    sopID,
    versionID,
    pageNumber,
    selectedTab,
    "all"
  );

  const sopName = sopMetadata?.sop_name;

  return (
    <section className="flex flex-col flex-grow mb-4">
      {sopStatus?.status === "failed" ? (
        <section className="grid place-content-center gap-10 w-full h-full text-center">
          <img src="/errors/503.svg" alt="error" className="mx-auto h-72" />
          <h4>
            Oops! something went wrong! We will reach out to you shortly to help
            resolve the issue. Thanks for your patience.
          </h4>
        </section>
      ) : sopStatus?.status === "parsing" ? (
        <article className="flex items-center place-content-center gap-5">
          <img
            src={`/grc/policies-placeholder.svg`}
            alt="placeholder"
            className="w-40 h-40"
          />
          <article className="grid gap-3">
            <h4>
              Your document has been received and is currently being processed
            </h4>
            <img
              src="/grc/data-parsing.svg"
              alt="data parsing"
              className="w-10 h-10"
            />
          </article>
        </article>
      ) : (
        <section className="flex flex-col flex-grow content-start gap-3 h-full">
          <DocumentTabs
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
          {selectedTab === "Tables" ? (
            <Tables sopID={versionID} versionID={versionID} />
          ) : selectedTab === "Images" ? (
            <Images versionID={versionID} />
          ) : selectedTab === "Audit Trail" ? (
            <AuditTrail documentID={sopID} />
          ) : selectedTab === "Verification" ? (
            <Verification sopID={sopID} versionID={versionID} />
          ) : (
            <Sections
              table={table}
              tableStatus={tableStatus}
              sopName={sopName}
              versionID={versionID}
              selectedTab={selectedTab}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
            />
          )}
        </section>
      )}
    </section>
  );
};

export default ProcedureDetail;
