import React from "react";
import type { IHighlight } from "react-pdf-highlighter";
import {
  faChevronCircleDown,
  faChevronCircleRight,
  faComment,
  faNoteSticky,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure, Transition } from "@headlessui/react";
import CopyToClipboard from "src/components/General/CopyToClipboard";
import { KeyStringVal } from "src/types/general";
import Source from "./Source";
import { AnimatePresence } from "framer-motion";
import DiscussionNotes from "./DiscussionNotes/DiscussionNotes";
import { useGRCStore } from "src/stores/grc";

const AgreementSidePanel = ({
  agreementID,
  data,
  selectedHighlight,
  setSelectedHighlight,
}: {
  agreementID: string;
  data: Array<IHighlight>;
  selectedHighlight: string;
  setSelectedHighlight: (selectedHighlight: string) => void;
}) => {
  const {
    showGRCPanel,
    setShowGRCPanel,
    selectedAnchorID,
    setSelectedAnchorID,
    setSelectedGRCPanelTab,
  } = useGRCStore();

  return (
    <aside className="flex flex-col flex-grow content-start gap-5 p-3 w-full h-full dark:text-white bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10">
      <ul className="flex flex-col flex-grow divide-y-1 dark:divide-checkbox/60 overflow-auto scrollbar">
        {data?.map((category: any, index: number) => (
          <li key={index} className="grid gap-5 p-3">
            <header className="flex items-center justify-between gap-5 border-b-1 dark:border-black">
              <h4 className="text-lg">{category.sub_category} </h4>
              <p>
                <span className="px-3 dark:bg-signin rounded-md">
                  {category.co_sections}
                </span>{" "}
                item{category.co_sections !== 1 && "s"} to review
              </p>
            </header>
            <section className="grid gap-3">
              {category.sub_categories.map(
                (question: any, questionIndex: number) => (
                  <Disclosure key={questionIndex}>
                    {({ open }) => {
                      return (
                        <section className="grid gap-2 p-3 bg-gradient-to-r dark:from-admin/70 dark:to-white/10 rounded-md">
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
                          <article className="flex items-center gap-5">
                            {["Discussion"].map((tab) => {
                              return (
                                <button
                                  key={tab}
                                  className="flex items-center gap-1 text-xs"
                                  onClick={() => {
                                    setShowGRCPanel(!showGRCPanel);
                                    setSelectedGRCPanelTab(tab);
                                    setSelectedAnchorID(question.anchor_id);
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={
                                      tab === "Notes" ? faNoteSticky : faComment
                                    }
                                    className="p-1 w-3 h-3 dark:text-black dark:bg-white rounded-full"
                                  />
                                  {tab}
                                </button>
                              );
                            })}
                          </article>
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
                                                          key={sourceIndex}
                                                          sourceIndex={
                                                            sourceIndex
                                                          }
                                                          source={source}
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
                          <AnimatePresence exitBeforeEnter>
                            {showGRCPanel &&
                              selectedAnchorID === question.anchor_id && (
                                <DiscussionNotes
                                  agreementID={agreementID}
                                  question={question}
                                />
                              )}
                          </AnimatePresence>
                        </section>
                      );
                    }}
                  </Disclosure>
                )
              )}
            </section>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default AgreementSidePanel;
