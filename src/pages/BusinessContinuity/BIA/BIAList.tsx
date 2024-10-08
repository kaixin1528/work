/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "src/components/Loader/Loader";
import NewBIA from "./NewBIA/NewBIA";
import { GetBIAList } from "src/services/business-continuity/bia";
import { GetAllUsers } from "src/services/settings/users";
import {
  convertToDate,
  convertToMin,
  convertToUTCString,
  getCustomerID,
} from "src/utils/general";
import { KeyStringVal } from "src/types/general";
import { attributeColors, pageSize, userColors } from "src/constants/general";
import TablePagination from "src/components/General/TablePagination";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { utcFormat } from "d3-time-format";

const BIAList = () => {
  const navigate = useNavigate();
  const customerID = getCustomerID();

  const [pageNumber, setPageNumber] = useState<number>(1);

  const { data: biaList, status: biaStatus } = GetBIAList(pageNumber);
  const { data: allUsers } = GetAllUsers(customerID, false);

  const totalCount = biaList?.pager.total_results || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <section className="flex flex-col flex-grow gap-5 h-full overflow-auto scrollbar">
      {biaStatus === "loading" ? (
        <Loader />
      ) : biaStatus === "success" ? (
        biaList?.data.length > 0 ? (
          <section className="flex flex-col flex-grow gap-3 pb-4 w-full h-full overflow-auto scrollbar">
            <article className="flex items-center place-content-end gap-5">
              <NewBIA />
            </article>
            <TablePagination
              totalPages={totalPages}
              beginning={beginning}
              end={end}
              totalCount={totalCount}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
            />
            <ul className="flex flex-col flex-grow gap-3 pb-2 overflow-auto scrollbar">
              {biaList?.data.map((bia: any, index: number) => {
                const userEmail = allUsers?.find(
                  (user: KeyStringVal) => user.user_id === bia.uploaded_by
                )?.user_email;
                return (
                  <li
                    key={index}
                    className="grid gap-3 p-4 w-full break-words cursor-pointer text-left text-base bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 dark:hover:to-white/30 duration-100 rounded-md"
                    onClick={() => {
                      sessionStorage.GRCCategory = "business impact analysis";
                      navigate(
                        `/business-continuity/bia/details?bia_id=${bia.bia_id}`
                      );
                    }}
                  >
                    {bia.status === "READY" ? (
                      <span
                        className={`text-sm ${
                          attributeColors[bia.status.toLowerCase()]
                        }`}
                      >
                        {bia.status.replaceAll("_", " ")}
                      </span>
                    ) : (
                      bia.estimated_time_left > 0 && (
                        <span className="px-3 py-1 w-max text-sm dark:bg-purple-500 rounded-full">
                          <FontAwesomeIcon icon={faClock} /> Check back in{" "}
                          {utcFormat(
                            `${
                              convertToMin(bia.estimated_time_left) > 60
                                ? "%H hr %M min"
                                : "%M min"
                            }`
                          )(convertToDate(bia.estimated_time_left))}
                        </span>
                      )
                    )}
                    <article className="flex items-start justify-between gap-5 w-full">
                      <h4 className="text-xl font-medium">{bia.bia_name}</h4>
                      {userEmail && (
                        <p className="flex items-center gap-1">
                          <span className="dark:text-checkbox">
                            uploaded by
                          </span>
                          <span
                            className={`grid content-center w-5 h-5 capitalize text-center text-[0.65rem] dark:text-white font-medium bg-gradient-to-b ${
                              userColors[userEmail[0]?.toLowerCase()]
                            } shadow-sm dark:shadow-checkbox rounded-full`}
                          >
                            {userEmail[0]}
                          </span>{" "}
                          {userEmail}{" "}
                          <span className="dark:text-checkbox"> at</span>{" "}
                          {convertToUTCString(bia.upload_time)}
                        </p>
                      )}
                    </article>
                    <h4>{bia.file_name}</h4>
                    {bia.tag && (
                      <article className="flex flex-wrap items-center gap-2">
                        <span>Department</span>
                        <span
                          key={index}
                          className="px-4 dark:bg-card rounded-full"
                        >
                          {bia.tag}
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
                Business Impact Analysis
              </h4>
              <h4>No impact analysis available</h4>
              <NewBIA />
            </article>
          </section>
        )
      ) : null}
    </section>
  );
};

export default BIAList;
