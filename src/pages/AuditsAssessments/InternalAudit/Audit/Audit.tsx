import React from "react";
import AuditDetail from "./AuditDetail/AuditDetail";
import AuditMetadata from "./AuditMetadata";
import ReturnPage from "src/components/Button/ReturnPage";
import PageLayout from "src/layouts/PageLayout";
import { parseURL } from "src/utils/general";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Audit = () => {
  const parsed = parseURL();

  const documentType = "frameworks";
  const documentID = String(parsed.framework_id) || "";
  const auditID = String(parsed.audit_id) || "";

  return (
    <PageLayout>
      <main className="relative flex flex-col flex-grow gap-5 px-5 pt-5 h-full w-full overflow-auto scrollbar">
        <article className="flex items-center gap-5">
          <ReturnPage />
          <h4 className="capitalize">
            Third Party Risk <FontAwesomeIcon icon={faArrowRightLong} />{" "}
            Internal Audit
          </h4>
        </article>
        <AuditMetadata
          documentType={documentType}
          documentID={documentID}
          auditID={auditID}
        />
        <AuditDetail
          documentType={documentType}
          documentID={documentID}
          auditID={auditID}
        />
      </main>
    </PageLayout>
  );
};

export default Audit;
