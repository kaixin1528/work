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

const ControlContent = ({ subsection }: { subsection: any }) => {
  return (
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

      {subsection.mapped_policy_section_objects?.length > 0 && (
        <section className="grid gap-2">
          <Disclosure>
            {({ open }) => {
              return (
                <section className="grid gap-2 text-sm">
                  <Disclosure.Button className="flex items-center gap-2 w-max">
                    <h4 className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faCheck} className="text-no" />
                      {subsection.mapped_policy_section_objects.length} Mapped
                      Policies
                    </h4>
                    <FontAwesomeIcon
                      icon={open ? faChevronCircleDown : faChevronCircleRight}
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
                        {subsection.mapped_policy_section_objects?.map(
                          (source: KeyStringVal, sourceIndex: number) => {
                            return (
                              <Source
                                key={sourceIndex}
                                documentType="policies"
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
  );
};

export default ControlContent;
