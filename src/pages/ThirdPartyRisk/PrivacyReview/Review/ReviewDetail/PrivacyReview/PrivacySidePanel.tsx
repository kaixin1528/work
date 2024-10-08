import React from "react";
import type { IHighlight } from "react-pdf-highlighter";
import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure, Transition } from "@headlessui/react";
import CopyToClipboard from "src/components/General/CopyToClipboard";
import { KeyStringVal } from "src/types/general";
import Source from "./Source";

const AgreementSidePanel = ({
  data,
  selectedHighlight,
  setSelectedHighlight,
}: {
  data: Array<IHighlight>;
  selectedHighlight: string;
  setSelectedHighlight: (selectedHighlight: string) => void;
}) => {
  return (
    <aside className="flex flex-col flex-grow content-start gap-5 p-3 w-full h-full dark:text-white bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 overflow-auto scrollbar">
      <ul className="flex flex-col flex-grow divide-y-1 dark:divide-checkbox/60 overflow-auto scrollbar">
        {data?.map((category: any, index: number) => (
          <li key={index} className="grid gap-5 p-3">
            <header className="flex items-center justify-between gap-5 border-b-1 dark:border-black">
              <h4 className="text-lg">{category.category} </h4>
            </header>
            <section className="grid gap-3">
              {category.sub_categories.map(
                (subCategory: any, subCatIndex: number) => {
                  return (
                    <article
                      key={subCatIndex}
                      className="grid gap-5 p-3 bg-gradient-to-r dark:from-admin/70 dark:to-white/10 rounded-md"
                    >
                      <h4 className="border-b-1 dark:border-black">
                        {subCategory.category}
                      </h4>
                      <article className="grid gap-2">
                        {subCategory.questions.map(
                          (question: any, questionIndex: number) => (
                            <Disclosure key={questionIndex}>
                              {({ open }) => {
                                return (
                                  <section className="grid gap-2">
                                    <header className="flex items-start gap-2 text-base">
                                      <h4 className="text-left">
                                        Q: {question.question}
                                      </h4>
                                      <Disclosure.Button>
                                        <FontAwesomeIcon
                                          icon={
                                            open
                                              ? faChevronCircleDown
                                              : faChevronCircleRight
                                          }
                                          className="dark:text-black"
                                        />
                                      </Disclosure.Button>
                                    </header>
                                    <Transition
                                      enter="transition duration-100 ease-out"
                                      enterFrom="transform scale-95 opacity-0"
                                      enterTo="transform scale-100 opacity-100"
                                      leave="transition duration-75 ease-out"
                                      leaveFrom="transform scale-100 opacity-100"
                                      leaveTo="transform scale-95 opacity-0"
                                    >
                                      <Disclosure.Panel>
                                        <section className="grid gap-5 p-4 bg-gradient-to-br dark:from-checkbox/30 dark:to-white/10 rounded-md">
                                          <article className="flex gap-2 text-base p-3 break-words dark:bg-black/60 rounded-md">
                                            <article className="w-max">
                                              <CopyToClipboard
                                                copiedValue={question.answer}
                                              />
                                            </article>
                                            {question.answer !== ""
                                              ? `A: ${question.answer}`
                                              : "Question is currently being processed"}
                                          </article>
                                          {question.sources?.length > 0 && (
                                            <section className="grid gap-2">
                                              <Disclosure defaultOpen>
                                                {({ open }) => {
                                                  return (
                                                    <section className="grid gap-2 text-sm">
                                                      <Disclosure.Button className="flex items-center gap-2 w-max">
                                                        <h4>Sources</h4>
                                                        <FontAwesomeIcon
                                                          icon={
                                                            open
                                                              ? faChevronCircleDown
                                                              : faChevronCircleRight
                                                          }
                                                          className="dark:text-black"
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
                                                            {question.sources.map(
                                                              (
                                                                source: KeyStringVal,
                                                                sourceIndex: number
                                                              ) => {
                                                                return (
                                                                  <Source
                                                                    key={
                                                                      sourceIndex
                                                                    }
                                                                    sourceIndex={
                                                                      sourceIndex
                                                                    }
                                                                    source={
                                                                      source
                                                                    }
                                                                    selectedHighlight={
                                                                      selectedHighlight
                                                                    }
                                                                    setSelectedHighlight={
                                                                      setSelectedHighlight
                                                                    }
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
                                      </Disclosure.Panel>
                                    </Transition>
                                  </section>
                                );
                              }}
                            </Disclosure>
                          )
                        )}
                      </article>
                    </article>
                  );
                }
              )}
            </section>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default AgreementSidePanel;
