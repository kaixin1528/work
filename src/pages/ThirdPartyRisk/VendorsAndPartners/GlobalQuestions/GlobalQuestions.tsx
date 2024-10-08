import React, { Fragment, useState } from "react";
import NewQuestionSet from "./NewGlobalQuestionSet";
import TablePagination from "src/components/General/TablePagination";
import Loader from "src/components/Loader/Loader";
import { KeyStringVal } from "src/types/general";
import { pageSize } from "src/constants/general";
import Response from "./Response";
import { Popover, Transition } from "@headlessui/react";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RegularInput from "src/components/Input/RegularInput";
import { AddCustomQuestionSet } from "src/services/third-party-risk/vendors-and-partners/custom-question-sets";
import { GetGlobalQuestions } from "src/services/third-party-risk/vendors-and-partners/global-questions";
import AskGlobalQuestion from "./AskGlobalQuestion";

const GlobalQuestions = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [inputs, setInputs] = useState({
    name: "",
    description: "",
  });

  const { data: globalQuestions, status: globalQuestionsStatus } =
    GetGlobalQuestions(pageNumber);

  const createCustomQuestionSet = AddCustomQuestionSet();

  const totalCount = globalQuestions?.pager?.total_results || 0;
  const totalPages = globalQuestions?.pager?.num_pages || 0;
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <section className="flex flex-col flex-grow gap-5">
      {globalQuestions?.data.length > 0 && (
        <article className="flex items-center gap-5 mx-auto">
          <NewQuestionSet />
          <span>or</span>
          <AskGlobalQuestion />
        </article>
      )}
      {globalQuestionsStatus === "loading" ? (
        <Loader />
      ) : globalQuestions?.data.length > 0 ? (
        <section className="flex flex-col flex-grow gap-5">
          {selectedQuestions.length > 0 && (
            <Popover as="article" className="relative inline-block text-left">
              <Popover.Button className="flex items-center gap-2 dark:hover:text-checkbox/60 duration-100">
                <FontAwesomeIcon icon={faUpload} />
                <h4>Create Global Question Set</h4>
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Popover.Panel className="absolute left-2 grid w-max -mr-5 mt-2 gap-2 origin-top-right focus:outline-none text-sm dark:text-white z-50">
                  {({ close }) => (
                    <section className="grid gap-3 p-4 dark:bg-filter black-shadow rounded-sm">
                      <RegularInput
                        label="Name"
                        keyName="name"
                        inputs={inputs}
                        setInputs={setInputs}
                        required
                      />
                      <RegularInput
                        label="Description"
                        keyName="description"
                        inputs={inputs}
                        setInputs={setInputs}
                      />
                      <button
                        className="py-3 green-gradient-button"
                        onClick={() => {
                          createCustomQuestionSet.mutate({
                            name: inputs.name,
                            description: inputs.description,
                            questionIDs: selectedQuestions,
                          });
                          close();
                        }}
                      >
                        Done
                      </button>
                    </section>
                  )}
                </Popover.Panel>
              </Transition>
            </Popover>
          )}
          <TablePagination
            totalPages={totalPages}
            beginning={beginning}
            end={end}
            totalCount={totalCount}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          />
          <ul className="flex flex-col flex-grow gap-5">
            {globalQuestions.data.map((qa: KeyStringVal, index: number) => {
              return (
                <Response
                  key={index}
                  qa={qa}
                  selectedQuestions={selectedQuestions}
                  setSelectedQuestions={setSelectedQuestions}
                />
              );
            })}
          </ul>
        </section>
      ) : (
        <section className="flex items-center place-content-center gap-10 w-full h-full">
          <img
            src="/grc/third-party-risk-placeholder.svg"
            alt="question sets placeholder"
            className="w-40 h-40"
          />
          <article className="grid gap-3">
            <h4 className="text-xl font-extrabold">Global Questions</h4>
            <h4>No global questions available</h4>
            <NewQuestionSet />
            <span>or</span>
            <AskGlobalQuestion />
          </article>
        </section>
      )}
    </section>
  );
};

export default GlobalQuestions;
