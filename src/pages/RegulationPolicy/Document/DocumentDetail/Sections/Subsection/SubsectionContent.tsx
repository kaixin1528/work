import {
  faChevronCircleDown,
  faChevronCircleRight,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure, Transition } from "@headlessui/react";
import React from "react";

const SubsectionContent = ({
  documentType,
  subsection,
  duplicateSections,
  filter,
  search,
  searchedRowIndex,
  sectionIndex,
  subSectionIndex,
  editSections,
  setEditSections,
  documentModified,
  setDocumentModified,
  opened,
  setOpened,
}: {
  documentType: string;
  subsection: any;
  duplicateSections?: any;
  filter?: string;
  search?: boolean;
  searchedRowIndex?: number;
  sectionIndex?: number;
  subSectionIndex?: number;
  editSections?: any;
  setEditSections?: any;
  documentModified?: any;
  setDocumentModified?: any;
  opened?: boolean;
  setOpened?: (opened: boolean) => void;
}) => {
  const isPolicy = documentType === "policies";
  const otherDocumentTypes = !["policies", "frameworks", "circulars"].includes(
    documentType
  );

  return (
    <>
      {subsection.content && (
        <Disclosure
          defaultOpen={
            search === true ||
            searchedRowIndex ===
              (Number(sectionIndex) + 1) * Number(subSectionIndex)
          }
        >
          {({ open }) => {
            const show =
              opened ||
              (otherDocumentTypes && open) ||
              duplicateSections?.data !== undefined;

            return (
              <section className="text-sm">
                <Disclosure.Button
                  className="flex items-center gap-2"
                  onClick={() => {
                    if (opened != null && setOpened) setOpened(!opened);
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
                        {isPolicy &&
                          editSections &&
                          !editSections[subsection.generated_id]?.content &&
                          filter !== "Suggest New Mapping" && (
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
