import React, { useState } from "react";
import TablePagination from "src/components/General/TablePagination";
import Loader from "src/components/Loader/Loader";
import { KeyStringVal } from "src/types/general";
import { pageSize } from "src/constants/general";
import { GetCustomQuestionSets } from "src/services/third-party-risk/vendors-and-partners/custom-question-sets";
import DeleteCustomQuestionSet from "./DeleteCustomQuestionSet";
import CustomQuestionSetDetail from "./CustomQuestionSetDetail";
import AddToVendorGroups from "./AddToVendorGroups";

const CustomQuestionSets = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedQuestionSet, setSelectedQuestionSet] = useState({});

  const { data: questionSets, status: questionSetStatus } =
    GetCustomQuestionSets(pageNumber);

  const totalCount = questionSets?.pager?.total_results || 0;
  const totalPages = questionSets?.pager?.num_pages || 0;
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <>
      {!sessionStorage.custom_question_set_id ? (
        <section className="flex flex-col flex-grow gap-5">
          {questionSetStatus === "loading" ? (
            <Loader />
          ) : questionSets?.data.length > 0 ? (
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
                {questionSets.data.map(
                  (questionSet: KeyStringVal, index: number) => {
                    return (
                      <li
                        key={index}
                        className="grid gap-5 p-5 cursor-pointer bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 dark:hover:to-white/30 duration-100 rounded-md"
                        onClick={() => {
                          setSelectedQuestionSet(questionSet);
                          sessionStorage.custom_question_set_id =
                            questionSet.generated_id;
                          sessionStorage.custom_question_set_name =
                            questionSet.name;
                        }}
                      >
                        <article className="flex flex-wrap items-center justify-between gap-10">
                          <h4 className="text-xl">{questionSet.name}</h4>
                          <DeleteCustomQuestionSet
                            questionSetID={questionSet.generated_id}
                          />
                        </article>
                        <p>{questionSet.description}</p>
                        <AddToVendorGroups
                          questionSetID={questionSet.generated_id}
                        />
                      </li>
                    );
                  }
                )}
              </ul>
            </section>
          ) : (
            <section className="flex items-center place-content-center gap-10 w-full h-full">
              <img
                src="/grc/third-party-risk-placeholder.svg"
                alt="custom question sets placeholder"
                className="w-40 h-40"
              />
              <article className="grid gap-3">
                <h4 className="text-xl font-extrabold">Custom Question Sets</h4>
                <h4>No question sets available</h4>
              </article>
            </section>
          )}
        </section>
      ) : (
        <CustomQuestionSetDetail
          selectedQuestionSet={selectedQuestionSet}
          setSelectedQuestionSet={setSelectedQuestionSet}
        />
      )}
    </>
  );
};

export default CustomQuestionSets;
