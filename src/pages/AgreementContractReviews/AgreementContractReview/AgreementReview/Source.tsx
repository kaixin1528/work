import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure, Transition } from "@headlessui/react";
import React from "react";
import CopyToClipboard from "src/components/General/CopyToClipboard";

const Source = ({
  sourceIndex,
  source,
  selectedHighlight,
  setSelectedHighlight,
}: {
  sourceIndex: number;
  source: any;
  selectedHighlight: string;
  setSelectedHighlight: (selectedHighlight: string) => void;
}) => {
  return (
    <article
      key={sourceIndex}
      className={`grid gap-5 p-3 w-full cursor-pointer ${
        selectedHighlight === source.id
          ? ""
          : "dark:hover:bg-filter/60 duration-100"
      } bg-gradient-to-r dark:from-admin/70 dark:to-white/10`}
      onClick={() => setSelectedHighlight(source.id)}
    >
      <Disclosure>
        {({ open }) => {
          return (
            <section className="text-sm">
              <Disclosure.Button className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={open ? faChevronCircleDown : faChevronCircleRight}
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
                <Disclosure.Panel className="flex gap-2 p-3 break-words dark:bg-black/60 rounded-md">
                  <article className="w-max">
                    <CopyToClipboard copiedValue={source.content} />
                  </article>
                  <p className="grid gap-2">
                    {source.content
                      .split("\n")
                      .map((phrase: string, index: number) => (
                        <span key={index}>{phrase}</span>
                      ))}
                    <span className="pt-2 w-max text-xs border-t dark:border-yellow-500">
                      Page {source.position[0]?.pageNumber}
                    </span>
                  </p>
                </Disclosure.Panel>
              </Transition>
            </section>
          );
        }}
      </Disclosure>
    </article>
  );
};

export default Source;
