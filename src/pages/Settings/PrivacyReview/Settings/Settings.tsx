/* eslint-disable react-hooks/exhaustive-deps */
import {
  faCheck,
  faChevronCircleDown,
  faChevronCircleRight,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import {
  EditPrivacyReviewQuestion,
  GetPrivacyAgreements,
  UpdatePrivacyAgreements,
} from "src/services/settings/privacy-review/settings";
import { KeyStringVal } from "src/types/general";
import { getCustomerID } from "src/utils/general";
import DeleteQuestion from "./DeleteQuestion";

const Settings = () => {
  const customerID = getCustomerID();

  const [initial, setInitial] = useState<boolean>(true);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [editedQuestion, setEditedQuestion] = useState<KeyStringVal>({
    id: "",
    question: "",
  });

  const { data: privacyAgreements } = GetPrivacyAgreements(customerID);
  const updateAgreements = UpdatePrivacyAgreements(customerID);
  const editQuestion = EditPrivacyReviewQuestion(customerID);

  const frameworkTypes = [
    ...new Set(
      privacyAgreements?.reduce(
        (pV: string[], cV: KeyStringVal) => [...pV, cV.framework_type],
        []
      ) as string[]
    ),
  ].sort();

  useEffect(() => {
    if (privacyAgreements?.length > 0 && initial) {
      const filteredQuestions = privacyAgreements.reduce(
        (pV: string[], cV: KeyStringVal) => {
          if (cV.status) return [...pV, cV.id];
          else return [...pV];
        },
        []
      );
      setSelectedQuestions(filteredQuestions);
      setInitial(false);
    }
  }, [privacyAgreements]);

  return (
    <section className="grid gap-5 text-sm w-full h-full overflow-auto scrollbar">
      <article className="grid gap-3 py-3 border-t-1 dark:border-checkbox">
        <p>
          A data processing agreement, data protection agreement, or data
          processing addendum is a contractual agreement between a data
          controller (a company) and a data processor (a third-party service
          provider.) It defines each party's rights and obligations regarding
          data protection. Uno could help assess a DPA. As Uno assesses a DPA
          from a standpoint of coverage, clarity, comprehensiveness, and
          enforceability, please choose which topics out of the following would
          you like Uno to include as a part of the analysis:
        </p>
        <article className="flex items-center gap-5">
          <button
            className="px-3 py-1 dark:bg-reset dark:hover:bg-reset/60 duration-100 rounded-md"
            onClick={() => {
              setSelectedQuestions([]);
              setInitial(true);
            }}
          >
            Reset
          </button>
          <button
            className="px-3 py-1 dark:bg-no dark:hover:bg-no/60 duration-100 rounded-md"
            onClick={() => {
              const filteredQuestions = [
                ...new Set(
                  privacyAgreements
                    ?.filter(
                      (question: KeyStringVal) =>
                        (question.status &&
                          !selectedQuestions.includes(question.id)) ||
                        (!question.status &&
                          selectedQuestions.includes(question.id))
                    )
                    ?.reduce(
                      (pV: string[], cV: KeyStringVal) => [...pV, cV.id],
                      []
                    )
                ),
              ];
              updateAgreements.mutate({
                questions: filteredQuestions,
              });
              setInitial(true);
            }}
          >
            Save
          </button>
        </article>

        <article className="flex items-center gap-5 divide-x dark:divide-checkbox">
          <button
            className="dark:hover:text-checkbox/60 duration-100"
            onClick={() => {
              setSelectedQuestions(
                privacyAgreements?.reduce(
                  (pV: string[], cV: KeyStringVal) => [...pV, cV.id],
                  []
                )
              );
            }}
          >
            Select All
          </button>
          <button
            className="pl-5 dark:hover:text-checkbox/60 duration-100"
            onClick={() => setSelectedQuestions([])}
          >
            Deselect All
          </button>
        </article>

        {frameworkTypes?.map((frameworkType) => {
          const questions = privacyAgreements?.filter(
            (agreement: KeyStringVal) =>
              frameworkType === agreement.framework_type
          );
          return (
            <Disclosure key={frameworkType} defaultOpen>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={open ? faChevronCircleDown : faChevronCircleRight}
                      className="dark:text-checkbox"
                    />
                    <h4>{frameworkType}</h4>
                  </Disclosure.Button>
                  <Disclosure.Panel className="grid p-2 dark:bg-panel">
                    {questions?.map((question: any, index: number) => {
                      const checked = selectedQuestions.includes(question.id);
                      const isCustomer = question.is_customer;
                      return (
                        <article
                          key={index}
                          className="flex items-center justify-between gap-10 p-3 dark:bg-panel rounded-md"
                        >
                          <article className="flex items-center gap-2 w-full">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                if (checked)
                                  setSelectedQuestions(
                                    selectedQuestions.filter(
                                      (curQuestionID) =>
                                        curQuestionID !== question.id
                                    )
                                  );
                                else
                                  setSelectedQuestions([
                                    ...selectedQuestions,
                                    question.id,
                                  ]);
                              }}
                              className="form-checkbox w-4 h-4 border-0 dark:focus:ring-0 dark:text-checkbox dark:focus:border-checkbox focus:ring dark:focus:ring-offset-0 dark:focus:ring-checkbox focus:ring-opacity-50"
                            />
                            {isCustomer ? (
                              <article className="flex items-center justify-between gap-10 pr-5 w-full text-sm bg-transparent focus:outline-none border-none focus:ring-1 dark:focus:ring-signin dark:bg-task black-shadow rounded-md">
                                <input
                                  type="input"
                                  value={
                                    question.id === editedQuestion.id
                                      ? editedQuestion.question
                                      : question.sub_category_question
                                  }
                                  className="px-5 w-full h-12 break-words bg-transparent focus:outline-none border-none focus:ring-1 dark:focus:ring-signin dark:bg-task rounded-md"
                                  onClick={() =>
                                    setEditedQuestion({
                                      id: question.id,
                                      ...(editedQuestion.id === "" && {
                                        question:
                                          question.sub_category_question,
                                      }),
                                    })
                                  }
                                  onChange={(e) =>
                                    setEditedQuestion({
                                      ...editedQuestion,
                                      question: e.target.value,
                                    })
                                  }
                                />
                                {editedQuestion.id === question.id && (
                                  <article className="flex items-center gap-5">
                                    <button
                                      className="text-reset hover:text-reset/60 duration-100"
                                      onClick={() =>
                                        setEditedQuestion({
                                          id: "",
                                          question: "",
                                        })
                                      }
                                    >
                                      <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                    <button
                                      className="text-no hover:text-no/60 duration-100"
                                      onClick={() => {
                                        editQuestion.mutate({
                                          questionID: question.id,
                                          newQuestion: editedQuestion.question,
                                        });
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faCheck} />
                                    </button>
                                  </article>
                                )}
                              </article>
                            ) : (
                              <p>{question.sub_category_question}</p>
                            )}
                          </article>
                          {isCustomer && (
                            <DeleteQuestion questionID={question.id} />
                          )}
                        </article>
                      );
                    })}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          );
        })}
      </article>
    </section>
  );
};

export default Settings;
