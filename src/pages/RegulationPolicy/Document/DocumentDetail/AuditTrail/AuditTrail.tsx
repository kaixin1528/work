import React, { useState } from "react";
import ActivityDetail from "./AuditDetail";
import TablePagination from "src/components/General/TablePagination";
import { pageSize } from "src/constants/general";
import { GetDocumentAuditTrail } from "src/services/regulation-policy/policy";

const AuditTrail = ({ documentID }: { documentID: string }) => {
  const [pageNumber, setPageNumber] = useState<number>(1);

  const { data: auditTrail } = GetDocumentAuditTrail(documentID, pageNumber);

  const totalCount = auditTrail?.pager.total_results || 0;
  const totalPages = auditTrail?.pager.num_pages || 0;
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <>
      {auditTrail ? (
        auditTrail.data.length > 0 ? (
          <section className="flex flex-col flex-grow gap-5">
            <TablePagination
              totalPages={totalPages}
              beginning={beginning}
              end={end}
              totalCount={totalCount}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
            />
            <section className="flex flex-col flex-grow content-start gap-7 text-sm">
              {auditTrail.data.map((activity: any, index: number) => {
                return <ActivityDetail key={index} activity={activity} />;
              })}
            </section>
          </section>
        ) : (
          <span>No audit trail available</span>
        )
      ) : null}
    </>
  );
};

export default AuditTrail;
