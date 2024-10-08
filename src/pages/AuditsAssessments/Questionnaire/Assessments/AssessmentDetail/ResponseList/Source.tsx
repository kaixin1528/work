import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure, Transition } from "@headlessui/react";
import React, { useState } from "react";
import CopyToClipboard from "src/components/General/CopyToClipboard";
import ViewInFile from "src/pages/RegulationPolicy/Document/ViewInFile/ViewInFile";

const Source = ({
  documentType,
  sourceIndex,
  source,
}: {
  documentType: string;
  sourceIndex: number;
  source: any;
}) => {
  const [opened, setOpened] = useState<boolean>(false);

  const content = source.content || source.response;

  return (
    <article
      key={sourceIndex}
      className={`grid gap-2 p-4 w-full bg-gradient-to-r ${
        documentType === "policies"
          ? "dark:from-admin/70 dark:to-white/10"
          : "dark:from-checkbox/70 dark:to-white/10"
      } rounded-md`}
    >
      {source.document_title && (
        <h4 className="text-xl">{source.document_title}</h4>
      )}
      {source.name && <h4 className="text-xl">{source.name}</h4>}
      <header className="flex items-center justify-between gap-10 border-b-1 dark:border-black">
        {source.sub_section_title && (
          <span className="w-3/5">
            {source.sub_section_id} {source.sub_section_title}
          </span>
        )}
        {source.ip_score && (
          <span className="w-max">{source.ip_score}% similarity</span>
        )}
      </header>
      <section className="grid md:grid-cols-2 gap-10">
        <Disclosure>
          {({ open }) => {
            return (
              <section className="text-sm">
                <article
                  className="flex items-center gap-2 w-max"
                  onClick={() => setOpened(!opened)}
                >
                  <Disclosure.Button className="flex items-center gap-2">
                    {source.question && (
                      <h4 className="text-left">Q: {source.question}</h4>
                    )}
                    {opened ? "Hide" : "Show"} content
                    <FontAwesomeIcon
                      icon={opened ? faChevronCircleDown : faChevronCircleRight}
                      className="dark:text-black"
                    />
                  </Disclosure.Button>
                </article>
                <Transition
                  show={opened}
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel className="flex gap-2 p-3 break-words dark:bg-black/60 rounded-md">
                    <article className="w-max">
                      <CopyToClipboard copiedValue={content} />
                    </article>
                    <p className="grid gap-2">
                      {content
                        .split("\n")
                        .map((phrase: string, index: number) => (
                          <span key={index}>{phrase}</span>
                        ))}
                      {source.page_metadata && (
                        <span className="pt-2 w-max text-xs border-t dark:border-yellow-500">
                          Page {source.page_metadata[0]?.position?.pageNumber}
                        </span>
                      )}
                    </p>
                  </Disclosure.Panel>
                </Transition>
              </section>
            );
          }}
        </Disclosure>
        {source.page_metadata?.length > 0 && (
          <ViewInFile
            generatedID={source.generated_id}
            section={source}
            bbox={source.page_metadata}
            opened={opened}
            setOpened={setOpened}
            isNotModal
          />
        )}
      </section>
    </article>
  );
};

export default Source;
