/* eslint-disable react-hooks/exhaustive-deps */
import { faArrowRightLong, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import TablePagination from "src/components/General/TablePagination";
import { pageSize, userColors } from "src/constants/general";
import { convertToDate, convertToUTCString } from "src/utils/general";
import NewAssessment from "./NewAssessment";
import DeleteAssessment from "./DeleteAssessment";
import EditAssessment from "./EditAssessment";
import { GetAssessmentList } from "src/services/audits-assessments/questionnaire";
import { KeyStringVal } from "src/types/general";
import AllTags from "../../../../../components/GRC/AllTags";
import { useGRCStore } from "src/stores/grc";
import Loader from "src/components/Loader/Loader";

const AssessmentList = () => {
  const { setSelectedGRCAssessment } = useGRCStore();

  const [selectedSourceType, setSelectedDocumentType] =
    useState<string>("policies");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: assessmentList, status: assessmentStatus } = GetAssessmentList(
    pageNumber,
    selectedTags,
    sessionStorage.source_type
  );

  const totalCount = assessmentList?.pager.total_results || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  useEffect(() => {
    if (!sessionStorage.source_type) sessionStorage.source_type = "policies";
    else if (sessionStorage.source_type === "sop")
      setSelectedDocumentType("sop");
  }, []);

  return (
    <section className="flex flex-col flex-grow gap-5">
      {assessmentList?.data.length > 0 && (
        <NewAssessment selectedSourceType={sessionStorage.source_type} />
      )}
      <AllTags
        documentType="frameworks"
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      />
      <nav className="flex flex-wrap items-center gap-5 text-sm">
        {["policies", "SOP"].map((tab) => {
          return (
            <button
              key={tab}
              className={`px-8 py-2 text-center capitalize border-b-2 ${
                sessionStorage.source_type === tab.toLowerCase()
                  ? "dark:bg-signin/30 dark:border-signin"
                  : "dark:bg-filter/10 dark:hover:bg-filter/30 duration-100 dark:border-checkbox"
              } rounded-full`}
              onClick={() => {
                setSelectedDocumentType(tab.toLowerCase());
                sessionStorage.source_type = tab.toLowerCase();
              }}
            >
              {tab}
            </button>
          );
        })}
      </nav>
      {assessmentStatus === "loading" ? (
        <Loader />
      ) : assessmentList?.data.length > 0 ? (
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
            {assessmentList?.data.map((assessment: any, index: number) => {
              const dueToday =
                convertToDate(assessment.due_date).setHours(0, 0, 0, 0) ===
                new Date().setHours(0, 0, 0, 0);
              const pastDue = assessment.due_date < Date.now() * 1000;
              return (
                <li
                  key={index}
                  className="grid gap-5 p-5 bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 rounded-md"
                >
                  <header className="flex items-start justify-between gap-20">
                    <article className="flex flex-wrap items-end gap-5">
                      <h4 className="text-xl">{assessment.name}</h4>
                      <button
                        className="px-4 py-1 w-max text-left dark:bg-card dark:hover:bg-card/30 duration-100 rounded-full"
                        onClick={() => {
                          setSelectedGRCAssessment(assessment);
                          sessionStorage.GRCCategory = "questionnaire";
                          sessionStorage.assessment_id =
                            assessment.assessment_id;
                          sessionStorage.assessment_name = assessment.name;
                        }}
                      >
                        View questions{" "}
                        <FontAwesomeIcon icon={faArrowRightLong} />{" "}
                      </button>
                    </article>
                    <article className="flex items-center gap-5 text-sm">
                      {(pastDue || dueToday) && (
                        <span
                          className={`flex items-center gap-2 px-4 py-1 w-max ${
                            pastDue
                              ? "bg-reset"
                              : dueToday
                              ? "bg-event text-black"
                              : ""
                          } rounded-full`}
                        >
                          <FontAwesomeIcon icon={faWarning} />
                          {pastDue ? "Past Due" : "Due Today"}{" "}
                        </span>
                      )}
                      <article className="flex items-center gap-2 w-max dark:text-checkbox">
                        <h4>Due Date</h4>
                        <p className="dark:text-white">
                          {convertToUTCString(assessment.due_date)}
                        </p>
                      </article>
                      <EditAssessment
                        selectedAssessment={assessment}
                        selectedSourceType={sessionStorage.source_type}
                      />
                      <DeleteAssessment selectedAssessment={assessment} />
                    </article>
                  </header>
                  <article className="flex items-center justify-self-end gap-10 text-sm">
                    <h4 className="flex items-center gap-3">
                      <span className="dark:text-checkbox">
                        Requesting Party
                      </span>{" "}
                      {assessment.requesting_party}
                    </h4>
                    <article className="flex items-center gap-3 w-max">
                      <h4 className="dark:text-checkbox">Owner</h4>
                      <article
                        key={assessment.owner}
                        className="flex items-center gap-1 w-full text-left"
                      >
                        <span
                          className={`grid content-center w-5 h-5 capitalize text-center text-[0.65rem] dark:text-white font-medium bg-gradient-to-b ${
                            userColors[assessment.owner[0].toLowerCase()]
                          } shadow-sm dark:shadow-checkbox rounded-full`}
                        >
                          {assessment.owner[0]}
                        </span>
                        <p>{assessment.owner} </p>
                      </article>
                    </article>
                  </article>
                  {assessment.tags.length > 0 && (
                    <ul className="flex flex-wrap items-center gap-5 text-xs">
                      {assessment.tags.map(
                        (tag: KeyStringVal, index: number) => {
                          return (
                            <li
                              key={index}
                              className="px-4 py-1 dark:bg-checkbox rounded-full"
                            >
                              {tag.title}
                            </li>
                          );
                        }
                      )}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ) : (
        <section className="flex items-center place-content-center gap-10 w-full h-full">
          <img
            src="/grc/frameworks-placeholder.svg"
            alt="frameworks placeholder"
            className="w-40 h-40"
          />
          <article className="grid gap-3">
            <h4 className="text-xl font-extrabold">
              Questionnaire and Assessment
            </h4>
            <h4>No assessments available</h4>
            <NewAssessment selectedSourceType={sessionStorage.source_type} />
          </article>
        </section>
      )}
    </section>
  );
};

export default AssessmentList;
