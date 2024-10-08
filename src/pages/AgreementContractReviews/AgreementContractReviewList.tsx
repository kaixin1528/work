import React, { useEffect, useState } from "react";
import TablePagination from "src/components/General/TablePagination";
import Loader from "src/components/Loader/Loader";
import { attributeColors, pageSize, showVariants } from "src/constants/general";
import { useNavigate } from "react-router-dom";
import {
  convertToDate,
  convertToMin,
  convertToUTCShortString,
} from "src/utils/general";
import { motion } from "framer-motion";
import PageLayout from "src/layouts/PageLayout";
import NewAgreement from "./NewAgreement";
import AllTags from "src/components/GRC/AllTags";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { utcFormat } from "d3-time-format";
import Sort from "src/components/GRC/Sort";
import { KeyStringVal } from "src/types/general";
import { GetAgreementContractReviews } from "src/services/agreement-contract-review";
import { agreementContractReviewSortingTypes } from "src/constants/grc";

const AgreementContractReviews = () => {
  const navigate = useNavigate();

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sort, setSort] = useState<KeyStringVal>({
    direction: "desc",
    order_by: "agreement_date",
  });

  const { data: agreementList, status: agreementStatus } =
    GetAgreementContractReviews(sort, pageNumber);

  const totalCount = agreementList?.pager.total_results || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  useEffect(() => {
    sessionStorage.page = "Agreement & Contract Review";
  }, []);

  return (
    <PageLayout>
      <motion.main
        variants={showVariants}
        initial="hidden"
        animate="visible"
        className="grid content-start gap-5 p-4 w-full h-full text-sm overflow-auto scrollbar"
      >
        {agreementList?.data.length > 0 && <NewAgreement />}
        <AllTags
          documentType="contractual_agreements"
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
        <section className="flex flex-col flex-grow gap-5">
          {agreementStatus === "loading" ? (
            <Loader />
          ) : agreementList?.data.length > 0 ? (
            <section className="flex flex-col flex-grow gap-5">
              <article className="flex item-center justify-between gap-10">
                <Sort
                  sortingTypes={agreementContractReviewSortingTypes}
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
                {agreementList?.data.map((agreement: any, index: number) => {
                  return (
                    <li
                      key={index}
                      className={`grid gap-5 p-5 bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 ${
                        agreement.status === "READY"
                          ? "cursor-pointer dark:hover:to-white/30 duration-100"
                          : ""
                      } rounded-md`}
                      onClick={() => {
                        if (agreement.status === "READY")
                          navigate(
                            `/agreement-contract-review/agreement/details?agreement_id=${agreement.id}`
                          );
                      }}
                    >
                      {agreement.status === "READY" ? (
                        <span
                          className={`text-sm ${
                            attributeColors[agreement.status.toLowerCase()]
                          }`}
                        >
                          {agreement.status.replaceAll("_", " ")}
                        </span>
                      ) : (
                        agreement.estimated_time_left > 0 && (
                          <span className="px-3 py-1 w-max text-sm dark:bg-purple-500 rounded-full">
                            <FontAwesomeIcon icon={faClock} /> Check back in{" "}
                            {utcFormat(
                              `${
                                convertToMin(agreement.estimated_time_left) > 60
                                  ? "%H hr %M min"
                                  : convertToMin(
                                      agreement.estimated_time_left
                                    ) >= 1
                                  ? "%M min"
                                  : "%S sec"
                              }`
                            )(convertToDate(agreement.estimated_time_left))}
                          </span>
                        )
                      )}
                      <header className="flex flex-wrap items-start justify-between gap-x-20 gap-y-5 break-words cursor-pointer text-left text-base dark:text-white">
                        <h4 className="w-3/5 text-xl font-medium">
                          {agreement.agreement_name}
                        </h4>
                        <p className="flex items-center gap-2">
                          {agreement.counts && (
                            <>
                              <span className="px-3 py-1 bg-signin rounded-md">
                                {agreement.counts}
                              </span>{" "}
                              items to review |{" "}
                            </>
                          )}
                          {convertToUTCShortString(
                            Number(agreement.agreement_date)
                          )}
                        </p>
                      </header>
                      {agreement.tags?.length > 0 && (
                        <article className="flex flex-wrap items-center gap-2">
                          <span>Tags</span>
                          {agreement.tags.map((tag: string, index: number) => {
                            return (
                              <span
                                key={index}
                                className="px-4 dark:bg-org rounded-full"
                              >
                                {tag}
                              </span>
                            );
                          })}
                        </article>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : (
            <section className="flex items-center place-content-center gap-10 w-full h-full">
              <article className="grid gap-3">
                <h4 className="text-xl font-extrabold">
                  Agreement & Contract Review
                </h4>
                <h4>No agreement & contract review available</h4>
                <NewAgreement />
              </article>
            </section>
          )}
        </section>
      </motion.main>
    </PageLayout>
  );
};

export default AgreementContractReviews;
