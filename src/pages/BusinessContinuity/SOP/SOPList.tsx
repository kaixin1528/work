/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { KeyStringVal } from "src/types/general";
import { useNavigate } from "react-router-dom";
import {
  convertToDate,
  convertToMin,
  convertToUTCShortString,
  getCustomerID,
} from "src/utils/general";
import TablePagination from "src/components/General/TablePagination";
import { attributeColors, pageSize, userColors } from "src/constants/general";
import Loader from "src/components/Loader/Loader";
import { GetSOPList } from "src/services/business-continuity/sop";
import NewSOP from "./NewSOP";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { utcFormat } from "d3-time-format";
import { GetAllUsers } from "src/services/settings/users";
import EditSOP from "./EditSOP";
import ExportAllTables from "./ExportAllTables/ExportAllTables";
import DepartmentFilter from "src/components/Filter/BusinessContinuity/DepartmentFilter";

const SOPList = () => {
  const navigate = useNavigate();
  const customerID = getCustomerID();

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedDepartment, setSelectedDepartment] = useState<string[]>([]);

  const { data: sopList, status: sopStatus } = GetSOPList(
    selectedDepartment,
    pageNumber
  );
  const { data: allUsers } = GetAllUsers(customerID, false);

  const filteredSOPList = sopList?.data;
  const totalCount = filteredSOPList?.length || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <section className="flex flex-col flex-grow gap-5 h-full overflow-auto scrollbar">
      {sopStatus === "loading" ? (
        <Loader />
      ) : sopStatus === "success" ? (
        filteredSOPList?.length > 0 ? (
          <section className="flex flex-col flex-grow gap-5 pb-4 w-full h-full overflow-auto scrollbar">
            <article className="flex items-center mx-auto gap-5">
              <NewSOP />
              <ExportAllTables selectedDepartment={selectedDepartment} />
            </article>
            <DepartmentFilter
              label="Department"
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
            />
            <TablePagination
              totalPages={totalPages}
              beginning={beginning}
              end={end}
              totalCount={totalCount}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
            />
            <ul className="flex flex-col flex-grow gap-3 pb-2 overflow-auto scrollbar">
              {filteredSOPList?.map((sop: any, index: number) => {
                return (
                  <li
                    key={index}
                    className="grid gap-3 p-4 w-full break-words cursor-pointer text-left text-base bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 dark:hover:to-white/30 duration-100 rounded-md"
                    onClick={() => {
                      sessionStorage.GRCCategory =
                        "standard operating procedures";
                      navigate(
                        `/business-continuity/sop/details?sop_id=${sop.sop_id}&sop_version_id=${sop.latest_version_id}`
                      );
                    }}
                  >
                    {sop.status === "READY" ? (
                      <span
                        className={`text-sm ${
                          attributeColors[sop.status.toLowerCase()]
                        }`}
                      >
                        {sop.status.replaceAll("_", " ")}
                      </span>
                    ) : (
                      sop.estimated_time_left > 0 && (
                        <span className="px-3 py-1 w-max text-sm dark:bg-purple-500 rounded-full">
                          <FontAwesomeIcon icon={faClock} /> Check back in{" "}
                          {utcFormat(
                            `${
                              convertToMin(sop.estimated_time_left) > 60
                                ? "%H hr %M min"
                                : convertToMin(sop.estimated_time_left) >= 1
                                ? "%M min"
                                : "%S sec"
                            }`
                          )(convertToDate(sop.estimated_time_left))}
                        </span>
                      )
                    )}
                    <article className="flex items-start justify-between gap-5 w-full">
                      <h4 className="text-xl font-medium">{sop.sop_name}</h4>
                      <article className="flex items-center gap-5">
                        <span>
                          {sop.last_updated_at &&
                            convertToUTCShortString(
                              Number(sop.last_updated_at)
                            )}
                        </span>
                        <EditSOP
                          sopID={sop.sop_id}
                          sopName={sop.sop_name}
                          tag={sop.tag}
                        />
                      </article>
                    </article>
                    <section className="flex items-center gap-5">
                      <section className="flex flex-wrap items-center gap-2">
                        <h4 className="w-max break-all">Approvers</h4>
                        {sop.approvers?.length > 0 ? (
                          <ul className="flex items-center mx-2">
                            {sop.approvers.map((approverID: string) => {
                              const user = allUsers?.find(
                                (curUser: KeyStringVal) =>
                                  curUser.user_id === approverID
                              );
                              if (!user) return null;
                              return (
                                <li
                                  key={approverID}
                                  className="relative -ml-1 group"
                                >
                                  <span
                                    className={`grid content-center capitalize text-center text-[0.65rem] dark:text-white font-medium w-6 h-6 bg-gradient-to-b ${
                                      userColors[
                                        user.user_email[0].toLowerCase()
                                      ]
                                    } rounded-full shadow-sm dark:shadow-checkbox`}
                                  >
                                    {user.user_email[0]}
                                  </span>
                                  <article className="invisible group-hover:visible z-50 absolute left-0 grid gap-1 px-4 pr-10 py-3 mt-2 w-max break-all text-left text-xs dark:bg-account rounded-sm">
                                    <h4>{user.user_name}</h4>
                                    <p>{user.user_email}</p>
                                  </article>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <span>None</span>
                        )}
                      </section>
                      <section className="flex flex-wrap items-center gap-2">
                        <h4 className="w-max break-all">Reviewers</h4>
                        {sop.reviewers?.length > 0 ? (
                          <ul className="flex items-center mx-2">
                            {sop.reviewers.map((reviewerID: string) => {
                              const user = allUsers?.find(
                                (curUser: KeyStringVal) =>
                                  curUser.user_id === reviewerID
                              );
                              if (!user) return null;
                              return (
                                <li
                                  key={reviewerID}
                                  className="relative -ml-1 group"
                                >
                                  <span
                                    className={`grid content-center capitalize text-center text-[0.65rem] dark:text-white font-medium w-6 h-6 bg-gradient-to-b ${
                                      userColors[
                                        user.user_email[0].toLowerCase()
                                      ]
                                    } rounded-full shadow-sm dark:shadow-checkbox`}
                                  >
                                    {user.user_email[0]}
                                  </span>
                                  <article className="invisible group-hover:visible z-50 absolute left-0 grid gap-1 px-4 pr-10 py-3 mt-2 w-max break-all text-left text-xs dark:bg-account rounded-sm">
                                    <h4>{user.user_name}</h4>
                                    <p>{user.user_email}</p>
                                  </article>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <span>None</span>
                        )}
                      </section>
                    </section>
                    {sop.tag && (
                      <article className="flex flex-wrap items-center gap-2">
                        <span>Department</span>
                        <span
                          key={index}
                          className="px-4 dark:bg-card rounded-full"
                        >
                          {sop.tag}
                        </span>
                      </article>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ) : (
          <section className="flex items-center place-content-center gap-10 w-full h-full">
            <img
              src="/grc/policies-placeholder.svg"
              alt="policies placeholder"
              className="w-40 h-40"
            />
            <article className="grid gap-3">
              <h4 className="text-xl font-extrabold">
                Standard Operating Procedures
              </h4>
              <h4>No procedures available</h4>
              <NewSOP />
            </article>
          </section>
        )
      ) : null}
    </section>
  );
};

export default SOPList;
