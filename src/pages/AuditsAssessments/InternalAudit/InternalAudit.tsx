import React, { useState } from "react";
import NewReview from "./NewAudit";
import TablePagination from "src/components/General/TablePagination";
import Loader from "src/components/Loader/Loader";
import { pageSize } from "src/constants/general";
import { useNavigate } from "react-router-dom";
import { GetAuditList } from "src/services/audits-assessments/internal-audit";
import { convertToUTCString } from "src/utils/general";

const InternalAudit = () => {
  const navigate = useNavigate();

  const [pageNumber, setPageNumber] = useState<number>(1);

  const { data: auditList, status: auditStatus } = GetAuditList(pageNumber);

  const totalCount = auditList?.pager.total_results || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <section className="flex flex-col flex-grow gap-5">
      {auditList?.data.length > 0 && <NewReview />}
      {auditStatus === "loading" ? (
        <Loader />
      ) : auditList?.data.length > 0 ? (
        <section className="flex flex-col flex-grow gap-5">
          <TablePagination
            totalPages={totalPages}
            beginning={beginning}
            end={end}
            totalCount={totalCount}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          />
          <ul className="flex flex-col flex-grow gap-5">
            {auditList?.data.map((audit: any, index: number) => {
              return (
                <li
                  key={index}
                  className="flex items-center justify-between gap-20 p-5 cursor-pointer bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 dark:hover:to-white/30 duration-100 rounded-md"
                  onClick={() => {
                    sessionStorage.GRCCategory = "internal audit";
                    navigate(
                      `/audits-assessments/audit/details?audit_id=${audit.audit_id}&framework_id=${audit.framework_id}`
                    );
                  }}
                >
                  <h4 className="text-xl">{audit.name}</h4>
                  <p>
                    <span className="dark:text-checkbox">created at</span>{" "}
                    {convertToUTCString(audit.created_at)}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      ) : (
        <section className="flex items-center place-content-center gap-10 w-full h-full">
          <img
            src="/grc/internal-audit-placeholder.svg"
            alt="internal audit placeholder"
            className="w-40 h-40"
          />
          <article className="grid gap-3">
            <h4 className="text-xl font-extrabold">Internal Audits</h4>
            <h4>No internal audits available</h4>
            <NewReview />
          </article>
        </section>
      )}
    </section>
  );
};

export default InternalAudit;
