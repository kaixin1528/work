import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure, Transition } from "@headlessui/react";
import React from "react";

const SubsectionContent = ({
  subsection,
  opened,
  setOpened,
}: {
  subsection: any;
  opened?: boolean;
  setOpened?: (opened: boolean) => void;
}) => {
  return (
    <>
      {subsection.content && (
        <Disclosure>
          {({ open }) => {
            const show = opened;

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
