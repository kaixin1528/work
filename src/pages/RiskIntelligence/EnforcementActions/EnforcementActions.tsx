import React, { useState } from "react";
import TablePagination from "src/components/General/TablePagination";
import Loader from "src/components/Loader/Loader";
import { pageSize } from "src/constants/general";
import { useNavigate } from "react-router-dom";
import { GetEnforcementActionsList } from "src/services/risk-intelligence/enforcement-actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { convertToUTCShortString } from "src/utils/general";

const EnforcementActions = () => {
  const navigate = useNavigate();

  const [pageNumber, setPageNumber] = useState<number>(1);

  const { data: actionList, status: actionStatus } =
    GetEnforcementActionsList(pageNumber);

  const totalCount = actionList?.pager.total_results || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <section className="flex flex-col flex-grow gap-5">
      {actionStatus === "loading" ? (
        <Loader />
      ) : actionList?.data.length > 0 ? (
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
            {actionList?.data.map((action: any, index: number) => {
              return (
                <li
                  key={index}
                  className="grid gap-5 p-5 cursor-pointer bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 dark:hover:to-white/30 duration-100 rounded-md"
                  onClick={() =>
                    navigate(
                      `/risk-intelligence/action/details?action_id=${action.enforcement_action_id}`
                    )
                  }
                >
                  <header className="grid content-start text-xl border-b-1 border-white">
                    <article className="flex items-center justify-between gap-20">
                      <h4>{action.bank_name}</h4>
                      <p>{action.enforcement_type_description}</p>
                    </article>
                    <article className="flex items-center justify-between gap-20">
                      <span>
                        <FontAwesomeIcon icon={faUser} /> {action.first_name}{" "}
                        {action.last_name}
                      </span>
                    </article>
                  </header>
                  <article className="flex flex-wrap items-center justify-between gap-20">
                    <article className="grid content-start">
                      <h4 className="font-extrabold">Amount</h4>
                      <span>${action.amount}</span>
                    </article>
                    {action.offense_date && (
                      <article className="grid content-start">
                        <h4 className="font-extrabold">Start Date</h4>
                        <span>
                          {action.offense_date !== -1
                            ? convertToUTCShortString(action.offense_date)
                            : "N/A"}
                        </span>
                      </article>
                    )}
                    {action.complete_date && (
                      <article className="grid content-start">
                        <h4 className="font-extrabold">Complete Date</h4>
                        <span>
                          {action.complete_date !== -1
                            ? convertToUTCShortString(action.complete_date)
                            : "N/A"}
                        </span>
                      </article>
                    )}
                    {action.expiration_date && (
                      <article className="grid content-start">
                        <h4 className="font-extrabold">Expiration Date</h4>
                        <span>
                          {action.expiration_date !== -1
                            ? convertToUTCShortString(action.expiration_date)
                            : "N/A"}
                        </span>
                      </article>
                    )}
                    <article className="grid content-start">
                      <h4 className="font-extrabold">City, State</h4>
                      <span>
                        {action.city_name}, {action.state_name}
                      </span>
                    </article>
                    <article className="grid content-start">
                      <span className="font-extrabold">Charter</span>
                      {action.charter_number}
                    </article>
                    <article className="grid content-start">
                      <span className="font-extrabold">Docket #</span>
                      {action.docket_number}
                    </article>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>
      ) : (
        <section className="flex items-center place-content-center gap-10 w-full h-full">
          <article className="grid gap-3">
            <h4 className="text-xl font-extrabold">Enforcement Actions</h4>
            <h4>No enforcement actions available</h4>
          </article>
        </section>
      )}
    </section>
  );
};

export default EnforcementActions;
