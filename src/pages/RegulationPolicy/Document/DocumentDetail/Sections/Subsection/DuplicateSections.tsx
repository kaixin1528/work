import {
  faChevronCircleDown,
  faChevronCircleLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure, Transition } from "@headlessui/react";
import React from "react";
import SubsectionContent from "./SubsectionContent";
import ViewInFile from "../../../ViewInFile/ViewInFile";

const DuplicateSections = ({
  documentType,
  generatedID,
  duplicateSections,
}: {
  documentType: string;
  generatedID: string;
  duplicateSections: any;
}) => {
  return (
    <Disclosure>
      {({ open }) => (
        <section className="w-full text-sm">
          <Disclosure.Button
            className="flex items-center place-content-end gap-2 w-full"
            onClick={() => {
              if (duplicateSections.data) duplicateSections.reset();
              else duplicateSections.mutate({ generatedID: generatedID });
            }}
          >
            <FontAwesomeIcon
              icon={open ? faChevronCircleDown : faChevronCircleLeft}
              className="dark:text-black"
            />
            <p>{open ? "Hide" : "Show"} similar sections</p>
          </Disclosure.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className="grid gap-5 p-4 dark:bg-black/60 rounded-md">
              {duplicateSections.data ? (
                duplicateSections.data.length > 0 ? (
                  <ul className="flex flex-col flex-grow gap-3">
                    {duplicateSections.data.map((subsection: any) => {
                      return (
                        <li
                          key={subsection.generated_id}
                          className="grid content-start gap-3 p-4 bg-gradient-to-r dark:from-admin/70 dark:to-white/10 border-l-1 dark:border-black/60 rounded-2xl"
                        >
                          <article className="flex flex-col flex-grow gap-5 text-sm">
                            <header className="flex flex-wrap items-center justify-between gap-5 text-sm">
                              <h4 className="text-base break-all">
                                {subsection.sub_section_id}{" "}
                                {subsection.sub_section_title !== "-" &&
                                  subsection.sub_section_title}
                              </h4>
                              {subsection.page_metadata?.length > 0 && (
                                <ViewInFile
                                  generatedID={generatedID}
                                  section={subsection}
                                  bbox={subsection.page_metadata}
                                  documentType={documentType}
                                />
                              )}
                            </header>
                          </article>
                          {subsection.content && (
                            <SubsectionContent
                              documentType={documentType}
                              subsection={subsection}
                              duplicateSections={duplicateSections}
                            />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <span>No similar sections</span>
                )
              ) : null}
            </Disclosure.Panel>
          </Transition>
        </section>
      )}
    </Disclosure>
  );
};

export default DuplicateSections;
