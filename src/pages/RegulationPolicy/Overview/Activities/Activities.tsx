import React, { useState } from "react";
import ActivityDetail from "./ActivityDetail";
import TablePagination from "src/components/General/TablePagination";
import { pageSize } from "src/constants/general";
import AuditTrailTypesFilter from "src/components/Filter/BusinessContinuity/AuditTrailTypesFilter";
import AuditTrailUsersFilter from "src/components/Filter/BusinessContinuity/AuditTrailUsersFilter";
import { getCustomerID } from "src/utils/general";
import { KeyStringVal } from "src/types/general";
import {
  GetAuditTrailTypes,
  GetAuditTrailUsers,
  GetGRCActivity,
} from "src/services/regulation-policy/overview";

const Activities = () => {
  const customerID = getCustomerID();

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [auditTrailTypes, setAuditTrailTypes] = useState<string[]>([]);
  const [auditTrailUsers, setAuditTrailUsers] = useState<string[]>([]);

  const { data: actvities } = GetGRCActivity(
    pageNumber,
    auditTrailTypes,
    auditTrailUsers
  );
  const { data: auditTrailTypeList } = GetAuditTrailTypes();
  const { data: auditTrailUserList } = GetAuditTrailUsers(customerID);

  const totalCount = actvities?.pager.total_results || 0;
  const totalPages = actvities?.pager.num_pages || 0;
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <>
      <section className="flex flex-col flex-grow gap-5 mr-5">
        <section className="grid gap-3">
          <article className="flex items-center gap-5 divide-x dark:divide-checkbox">
            <button
              className="dark:hover:text-checkbox/60 duration-100"
              onClick={() => {
                if (auditTrailTypeList?.length > 0)
                  setAuditTrailTypes(auditTrailTypeList);
                if (auditTrailUserList?.length > 0) {
                  const userIDs = auditTrailUserList?.reduce(
                    (pV: string[], cV: KeyStringVal) => [...pV, cV.user_id],
                    []
                  );
                  setAuditTrailUsers(userIDs);
                }
              }}
            >
              Select All
            </button>
            <button
              className="pl-5 dark:hover:text-checkbox/60 duration-100"
              onClick={() => {
                setAuditTrailTypes([]);
                setAuditTrailUsers([]);
              }}
            >
              Deselect All
            </button>
          </article>
          <article className="grid md:grid-cols-2 content-start gap-x-20 gap-y-10">
            <AuditTrailTypesFilter
              label="Activity Types"
              inputs={auditTrailTypes}
              setInputs={setAuditTrailTypes}
            />
            <AuditTrailUsersFilter
              label="Users"
              inputs={auditTrailUsers}
              setInputs={setAuditTrailUsers}
            />
          </article>
        </section>
        <TablePagination
          totalPages={totalPages}
          beginning={beginning}
          end={end}
          totalCount={totalCount}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
        />
        {actvities ? (
          actvities.data.length > 0 ? (
            <section className="flex flex-col flex-grow content-start gap-7 text-sm">
              {actvities.data.map((activity: any, index: number) => {
                return <ActivityDetail key={index} activity={activity} />;
              })}
            </section>
          ) : (
            <span>No activities available</span>
          )
        ) : null}
      </section>
    </>
  );
};

export default Activities;
