/* eslint-disable react-hooks/exhaustive-deps */
import AssessmentList from "./Assessments/AssessmentList/AssessmentList";
import AssessmentDetail from "./Assessments/AssessmentDetail/AssessmentDetail";
import { useState } from "react";
import QuestionBankList from "./QuestionBanks/QuestionBankList/QuestionBankList";
import QuestionBankQuestions from "./QuestionBanks/QuestionBankDetail/QuestionBankDetail";

const Questionnaire = () => {
  const [selectedTab, setSelectedTab] = useState<string>("assessments");

  return (
    <section className="flex flex-col flex-grow gap-5 py-4 w-full h-full">
      <nav className="flex flex-wrap items-center text-base">
        {["assessments", "question banks"].map((tab) => {
          return (
            <button
              key={tab}
              className={`px-8 py-2 text-center capitalize border-b-2 ${
                selectedTab === tab
                  ? "dark:text-white dark:border-signin"
                  : "dark:text-checkbox dark:hover:text-white dark:border-checkbox"
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          );
        })}
      </nav>
      {selectedTab === "assessments" ? (
        !sessionStorage.assessment_id ? (
          <AssessmentList />
        ) : (
          <AssessmentDetail />
        )
      ) : selectedTab === "question banks" ? (
        !sessionStorage.question_bank_id ? (
          <QuestionBankList />
        ) : (
          <QuestionBankQuestions />
        )
      ) : null}
      {}
    </section>
  );
};

export default Questionnaire;
