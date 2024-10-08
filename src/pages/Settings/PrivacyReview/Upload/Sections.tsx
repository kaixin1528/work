import {
  faChevronCircleDown,
  faChevronCircleRight,
  faRotateBackward,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure, Transition } from "@headlessui/react";
import React, { useState } from "react";
import TablePagination from "src/components/General/TablePagination";
import { pageSize } from "src/constants/general";
import ViewInFile from "src/pages/RegulationPolicy/Document/ViewInFile/ViewInFile";
import { GetDPASections } from "src/services/settings/privacy-review/upload";
import { KeyStringVal } from "src/types/general";

const Sections = ({
  selectedDPA,
  setSelectedDPA,
}: {
  selectedDPA: KeyStringVal;
  setSelectedDPA: (setSelectedDPA: KeyStringVal) => void;
}) => {
  const [pageNumber, setPageNumber] = useState<number>(1);

  const { data: sections } = GetDPASections(selectedDPA.id, pageNumber);

  const totalCount = sections?.pager.total_results || 0;
  const totalPages = sections?.pager.num_pages || 0;
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <section className="grid content-start gap-5">
      <header className="flex items-center justify-between gap-10">
        <article className="flex items-center gap-5">
          <button
            className="flex items-center gap-1 dark:text-checkbox dark:hover:text-checkbox/30 duration-100"
            onClick={() => setSelectedDPA({ id: "", title: "" })}
          >
            <FontAwesomeIcon icon={faRotateBackward} />
            Return
          </button>
          <h4 className="text-lg">{selectedDPA.title}</h4>
        </article>
        <TablePagination
          totalPages={totalPages}
          beginning={beginning}
          end={end}
          totalCount={totalCount}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
        />
      </header>
      {sections ? (
        sections.data.length > 0 ? (
          <ul className="flex flex-col flex-grow gap-3 pb-2 overflow-auto scrollbar">
            {sections?.data.map((section: any, index: number) => {
              return (
                <li
                  key={index}
                  className="grid content-start gap-3 p-4 break-words bg-gradient-to-r dark:from-admin/70 dark:to-white/10 rounded-md"
                >
                  <header className="flex items-center gap-2 text-base border-b dark:border-black">
                    {section.section_id && <span>{section.section_id}.</span>}
                    {!["-", "", null].includes(section.section_title) && (
                      <span>{section.section_title}</span>
                    )}
                  </header>
                  {section.sub_sections?.map((subsection: any) => {
                    return (
                      <article
                        key={subsection.generated_id}
                        className="grid content-start gap-3 p-4 bg-gradient-to-r dark:from-admin/70 dark:to-white/10 border-l-1 dark:border-black/60 rounded-2xl"
                      >
                        <header className="flex items-center gap-2 text-base border-b dark:border-black">
                          {subsection.sub_section_id && (
                            <span>{subsection.sub_section_id}.</span>
                          )}
                          {!["-", "", null].includes(
                            subsection.sub_section_title
                          ) && <span>{subsection.sub_section_title}</span>}
                        </header>
                        <article className="grid grid-cols-2 gap-10">
                          {subsection.content && (
                            <Disclosure>
                              {({ open }) => {
                                return (
                                  <section className="text-sm">
                                    <Disclosure.Button className="flex items-center gap-2">
                                      <FontAwesomeIcon
                                        icon={
                                          open
                                            ? faChevronCircleDown
                                            : faChevronCircleRight
                                        }
                                        className="dark:text-black"
                                      />
                                      <h4>{open ? "Hide" : "Show"} content</h4>
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
                                      <Disclosure.Panel className="grid content-start gap-2 p-3 w-full max-h-[36rem] break-words dark:bg-black/60 rounded-md overflow-auto scrollbar">
                                        <p className="grid content-start gap-2 w-full">
                                          {subsection.content
                                            .split("\n")
                                            .map(
                                              (
                                                phrase: string,
                                                index: number
                                              ) => (
                                                <span
                                                  key={index}
                                                  className="flex flex-wrap items-center gap-1 w-full"
                                                >
                                                  {phrase
                                                    .split(" ")
                                                    .map((word, wordIndex) => (
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
                                              )
                                            )}
                                        </p>
                                      </Disclosure.Panel>
                                    </Transition>
                                  </section>
                                );
                              }}
                            </Disclosure>
                          )}
                          {subsection.page_metadata?.length > 0 && (
                            <ViewInFile
                              generatedID={subsection.generated_id}
                              section={subsection}
                              bbox={subsection.page_metadata}
                              documentType="dpa"
                              isNotModal
                            />
                          )}
                        </article>
                      </article>
                    );
                  })}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No sections available</p>
        )
      ) : null}
    </section>
  );
};

export default Sections;
