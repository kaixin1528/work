import React, { useState } from "react";
import Sort from "src/components/GRC/Sort";
import TablePagination from "src/components/General/TablePagination";
import Loader from "src/components/Loader/Loader";
import { attributeColors, pageSize, userColors } from "src/constants/general";
import { thirdPartySortingTypes } from "src/constants/grc";
import {
  convertToDate,
  convertToMin,
  convertToUTCString,
} from "src/utils/general";
import NewReview from "./NewReview";
import { KeyStringVal } from "src/types/general";
import { useNavigate } from "react-router-dom";
import { GetReviewList } from "src/services/third-party-risk/vendor-assessment";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { utcFormat } from "d3-time-format";

const VendorAssessment = () => {
  const navigate = useNavigate();

  const [sort, setSort] = useState<KeyStringVal>({
    direction: "desc",
    order_by: "created_at",
  });
  const [pageNumber, setPageNumber] = useState<number>(1);

  const { data: reviewList, status: reviewStatus } = GetReviewList(
    sort,
    pageNumber,
    "VENDOR"
  );

  const totalCount = reviewList?.pager.total_results || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <section className="flex flex-col flex-grow gap-5">
      {reviewList?.data.length > 0 && <NewReview />}
      {reviewStatus === "loading" ? (
        <Loader />
      ) : reviewList?.data.length > 0 ? (
        <section className="flex flex-col flex-grow gap-5">
          <article className="flex item-center justify-between gap-10">
            <Sort
              sortingTypes={thirdPartySortingTypes}
              sort={sort}
              setSort={setSort}
            />
            <TablePagination
              totalPages={totalPages}
              beginning={beginning}
              end={end}
              totalCount={totalCount}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
            />
          </article>
          <ul className="flex flex-col flex-grow gap-5">
            {reviewList?.data.map((review: any, index: number) => {
              return (
                <li
                  key={index}
                  className="grid gap-5 p-5 cursor-pointer bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 dark:hover:to-white/30 duration-100 rounded-md"
                  onClick={() => {
                    sessionStorage.GRCCategory = "vendor assessment";
                    navigate(
                      `/third-party-risk/vendors-assessments/details?review_id=${review.review_id}&framework_id=${review.framework_ids[0]}&audit_id=${review.audit_id}`
                    );
                  }}
                >
                  {review.status === "READY" ? (
                    <span
                      className={`text-sm ${
                        attributeColors[review.status.toLowerCase()]
                      }`}
                    >
                      {review.status.replaceAll("_", " ")}
                    </span>
                  ) : (
                    review.estimated_time_left > 0 && (
                      <span className="px-3 py-1 w-max text-sm dark:bg-purple-500 rounded-full">
                        <FontAwesomeIcon icon={faClock} /> Check back in{" "}
                        {utcFormat(
                          `${
                            convertToMin(review.estimated_time_left) > 60
                              ? "%H hr %M min"
                              : convertToMin(review.estimated_time_left) >= 1
                              ? "%M min"
                              : "%S sec"
                          }`
                        )(convertToDate(review.estimated_time_left))}
                      </span>
                    )
                  )}
                  <article className="flex flex-wrap items-center justify-between gap-10">
                    <h4 className="text-xl">
                      {review.name} | {review.audit_name}
                    </h4>
                    <article className="flex flex-wrap items-center gap-3">
                      <article className="flex items-center gap-3">
                        <h4 className="w-full dark:text-checkbox">
                          created by
                        </h4>
                        <article
                          key={review.user_id}
                          className="flex items-center gap-1 w-full text-left"
                        >
                          <span
                            className={`grid content-center w-5 h-5 capitalize text-center text-[0.65rem] dark:text-white font-medium bg-gradient-to-b ${
                              userColors[review.user_id[0].toLowerCase()]
                            } shadow-sm dark:shadow-checkbox rounded-full`}
                          >
                            {review.user_id[0]}
                          </span>
                          <p>{review.user_id} </p>
                        </article>
                      </article>
                      <article className="flex items-center gap-3">
                        <h4 className="dark:text-checkbox">at</h4>
                        <span>{convertToUTCString(review.created_at)}</span>
                      </article>
                    </article>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>
      ) : (
        <section className="flex items-center place-content-center gap-10 w-full h-full">
          <img
            src="/grc/third-party-risk-placeholder.svg"
            alt="reviews placeholder"
            className="w-40 h-40"
          />
          <article className="grid gap-3">
            <h4 className="text-xl font-extrabold">Reviews</h4>
            <h4>No reviews available</h4>
            <NewReview />
          </article>
        </section>
      )}
    </section>
  );
};

export default VendorAssessment;
