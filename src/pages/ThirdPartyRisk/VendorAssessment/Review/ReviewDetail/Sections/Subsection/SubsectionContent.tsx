import {
  faCheck,
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure, Transition } from "@headlessui/react";
import React from "react";
import CopyToClipboard from "src/components/General/CopyToClipboard";
import Source from "src/pages/AuditsAssessments/Questionnaire/Assessments/AssessmentDetail/ResponseList/Source";
import { KeyStringVal } from "src/types/general";
import AIGeneratedAnswer from "./AIGeneratedAnswer";
import { GetControlToAuditMapping } from "src/services/third-party-risk/vendor-assessment";
import { sortNumericData } from "src/utils/general";

const SubsectionContent = ({
  documentID,
  reviewID,
  auditID,
  subsection,
  selectedTab,
  editSections,
  setEditSections,
  documentModified,
  setDocumentModified,
  opened,
  setOpened,
}: {
  documentID: string;
  reviewID: string;
  auditID: string;
  subsection: any;
  selectedTab: string;
  editSections: any;
  setEditSections: any;
  documentModified: any;
  setDocumentModified: any;
  opened?: boolean;
  setOpened?: (opened: boolean) => void;
}) => {
  const isControls = selectedTab === "Controls Coverage";
  const generatedID = subsection.generated_id;

  const controlToAuditMapping = GetControlToAuditMapping(
    documentID,
    auditID,
    generatedID
  );

  const sortedControlToAuditMapping = sortNumericData(
    controlToAuditMapping?.data?.data,
    "ip_score",
    "desc"
  );

  return (
    <>
      {isControls ? (
        <section className="grid gap-5 p-4 text-sm dark:bg-black/60 rounded-md">
          <article className="flex gap-2 break-words">
            <article className="w-max">
              <CopyToClipboard copiedValue={subsection.content} />
            </article>
            <p className="grid gap-2 w-full">
              {subsection.content
                .split("\n")
                .map((phrase: string, index: number) => (
                  <span
                    key={index}
                    className="flex flex-wrap items-center gap-1 w-full"
                  >
                    {phrase.split(" ").map((word, wordIndex) => (
                      <span
                        key={wordIndex}
                        className={`${
                          subsection.search_highlight?.matched_tokens?.includes(
                            word
                          )
                            ? "text-black bg-yellow-300"
                            : ""
                        }`}
                      >
                        {word}
                      </span>
                    ))}
                  </span>
                ))}
            </p>
          </article>

          {subsection.mapped_sections > 0 && (
            <section className="grid gap-5">
              <AIGeneratedAnswer
                reviewID={reviewID}
                generatedID={generatedID}
              />
              <Disclosure>
                {({ open }) => {
                  return (
                    <section className="grid gap-2 text-sm">
                      <Disclosure.Button
                        className="flex items-center gap-2 w-max"
                        onClick={() => controlToAuditMapping.mutate({})}
                      >
                        <h4 className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faCheck} className="text-no" />
                          {subsection.mapped_sections} Citation
                          {subsection.mapped_sections !== 1 && "s"} in Audit
                          Report
                        </h4>
                        <FontAwesomeIcon
                          icon={
                            open ? faChevronCircleDown : faChevronCircleRight
                          }
                          className="dark:text-checkbox"
                        />
                      </Disclosure.Button>
                      <Transition
                        show={open}
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                      >
                        <Disclosure.Panel>
                          <section className="flex flex-wrap items-center gap-5">
                            {sortedControlToAuditMapping?.map(
                              (source: KeyStringVal, sourceIndex: number) => {
                                return (
                                  <Source
                                    key={sourceIndex}
                                    documentType="frameworks"
                                    sourceIndex={sourceIndex}
                                    source={source}
                                  />
                                );
                              }
                            )}
                          </section>
                        </Disclosure.Panel>
                      </Transition>
                    </section>
                  );
                }}
              </Disclosure>
            </section>
          )}
        </section>
      ) : (
        <Disclosure>
          {({ open }) => {
            const show = opened;

            return (
              <section className="text-sm">
                <Disclosure.Button
                  className="flex items-center gap-2"
                  onClick={() => {
                    if (opened != null && setOpened) setOpened(!opened);
                    if (isControls) controlToAuditMapping.mutate({});
                  }}
                >
                  <FontAwesomeIcon
                    icon={show ? faChevronCircleDown : faChevronCircleRight}
                    className="dark:text-black"
                  />
                  <h4>{show ? "Hide" : "Show"} content</h4>
                </Disclosure.Button>
                <Transition
                  show={show}
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel className="grid content-start gap-2 p-3 w-full max-h-[36rem] break-words dark:bg-black/60 rounded-md overflow-auto scrollbar">
                    {editSections &&
                    Object.keys(editSections).includes(
                      subsection.generated_id
                    ) ? (
                      <>
                        <article className="flex items-center gap-5">
                          <button
                            className="discard-button"
                            onClick={() =>
                              setEditSections(
                                Object.fromEntries(
                                  Object.entries(editSections).filter(
                                    ([key]) => key !== subsection.generated_id
                                  )
                                )
                              )
                            }
                          >
                            Discard
                          </button>
                          {subsection.content !==
                            editSections[subsection.generated_id].content && (
                            <article className="flex items-center gap-1">
                              <FontAwesomeIcon
                                icon={faCheck}
                                className="text-no"
                              />
                              <span>Saved</span>
                            </article>
                          )}
                        </article>

                        <textarea
                          spellCheck="false"
                          autoComplete="off"
                          value={editSections[subsection.generated_id]?.content}
                          onChange={(e) => {
                            if (
                              !documentModified?.includes(
                                subsection.generated_id
                              )
                            )
                              setDocumentModified([
                                ...documentModified,
                                subsection.generated_id,
                              ]);
                            setEditSections({
                              ...editSections,
                              [subsection.generated_id]: {
                                content: e.target.value,
                              },
                            });
                          }}
                          className="py-1 w-full h-[15rem] text-sm focus:outline-none dark:placeholder:text-checkbox dark:text-white dark:bg-transparent dark:bg-account dark:border-transparent dark:focus:ring-0 dark:focus:border-transparent resize-none overflow-auto scrollbar"
                        />
                      </>
                    ) : (
                      <>
                        <article className="flex gap-2 break-words">
                          <article className="w-max">
                            <CopyToClipboard copiedValue={subsection.content} />
                          </article>

                          <p className="grid content-start gap-2 w-full">
                            {subsection.content
                              .split("\n")
                              .map((phrase: string, index: number) => (
                                <span
                                  key={index}
                                  className="flex flex-wrap items-center gap-1 w-full"
                                >
                                  {phrase.split(" ").map((word, wordIndex) => (
                                    <span
                                      key={wordIndex}
                                      className={`${
                                        subsection.search_highlight?.matched_tokens?.includes(
                                          word
                                        )
                                          ? "text-black bg-yellow-300"
                                          : ""
                                      }`}
                                    >
                                      {word}
                                    </span>
                                  ))}
                                </span>
                              ))}
                          </p>
                        </article>
                        {editSections &&
                          !editSections[subsection.generated_id]?.content && (
                            <button
                              className="justify-self-end px-2 py-1 dark:bg-filter dark:hover:bg-filter/60 duration-100 rounded-md"
                              onClick={() =>
                                setEditSections({
                                  ...editSections,
                                  [subsection.generated_id]: {
                                    content: subsection.content,
                                  },
                                })
                              }
                            >
                              Edit
                            </button>
                          )}
                      </>
                    )}
                  </Disclosure.Panel>
                </Transition>
              </section>
            );
          }}
        </Disclosure>
      )}
    </>
  );
};

export default SubsectionContent;
