/* eslint-disable react-hooks/exhaustive-deps */
import {
  faChevronCircleDown,
  faChevronCircleRight,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure, Popover, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { useReactFlow } from "reactflow";
import { documentColors } from "src/constants/grc";
import { KeyStringVal } from "src/types/general";

const MappingFilter = ({
  mapping,
  nodes,
  filters,
  setFilters,
}: {
  mapping: any;
  nodes?: any[];
  filters: any;
  setFilters: any;
}) => {
  const { setCenter } = useReactFlow();

  const handleTransform = (id: string) => {
    const zoomedInNode = nodes?.find((node) => node.id === id);

    if (zoomedInNode) {
      setCenter(zoomedInNode.position.x, zoomedInNode.position.y + 150, {
        duration: 800,
        zoom: 0.7,
      });
    }
  };

  const documents = [
    ...new Set(
      mapping?.reduce(
        (pV: string[], cV: KeyStringVal) => [
          ...pV,
          cV.policy_name || cV.framework_name,
        ],
        []
      )
    ),
  ] as string[];
  const documentIDs = [
    ...new Set(
      mapping?.reduce(
        (pV: string[], cV: KeyStringVal) => [
          ...pV,
          cV.framework_id || cV.policy_id,
        ],
        []
      )
    ),
  ] as string[];

  return (
    <Popover className="z-20">
      <Popover.Button className="flex items-center gap-2 focus:outline-none">
        <FontAwesomeIcon
          icon={faFilter}
          className="w-6 h-6 ml-4 dark:text-signin z-0"
        />
        <span>Filter</span>
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="pointer-events-auto absolute z-10">
          {mapping ? (
            <section className="absolute top-3 left-0 w-[40rem] max-h-[30rem] p-8 dark:bg-card black-shadow overflow-auto scrollbar">
              {documents?.length > 0 ? (
                <section className="flex flex-col flex-grow gap-5 mr-6">
                  {documents.map((document: string) => {
                    const filteredMapping = mapping?.filter(
                      (section: KeyStringVal) =>
                        section.policy_name ||
                        section.framework_name === document
                    );
                    return (
                      <article key={document} className="grid gap-5">
                        <Disclosure defaultOpen>
                          {({ open }) => (
                            <>
                              <article className="flex items-center gap-2">
                                <button
                                  className={`px-2 ${
                                    !filters.includes(document)
                                      ? "dark:bg-signin"
                                      : ""
                                  } dark:hover:bg-filter/30 duration-100 rounded-md`}
                                  onClick={() => {
                                    if (filters.includes(document))
                                      setFilters(
                                        filters.filter(
                                          (curDoc: string) =>
                                            curDoc !== document
                                        )
                                      );
                                    else setFilters([...filters, document]);
                                  }}
                                >
                                  {!filters.includes(document) ? "-" : "+"}
                                </button>
                                <Disclosure.Button className="flex items-center gap-2 w-full">
                                  <h4 className="text-left">{document}</h4>
                                  <FontAwesomeIcon
                                    icon={
                                      open
                                        ? faChevronCircleDown
                                        : faChevronCircleRight
                                    }
                                    className="dark:text-checkbox"
                                  />
                                </Disclosure.Button>
                              </article>
                              <Disclosure.Panel>
                                <ul
                                  key={document}
                                  className="grid content-start gap-5 mx-6 w-full h-full overflow-auto scrollbar"
                                >
                                  {filteredMapping?.map(
                                    (section: KeyStringVal, i: number) => {
                                      const targetID = section.generated_id;
                                      const documentColorIndex =
                                        documentIDs?.findIndex(
                                          (documentID) =>
                                            documentID === section.policy_id ||
                                            documentID === section.framework_id
                                        ) % 10;
                                      return (
                                        <li
                                          key={targetID}
                                          className="flex items-stretch gap-2 w-full"
                                        >
                                          <article
                                            className={`grid gap-2 px-4 py-2 w-full cursor-pointer break-words dark:hover:bg-checkbox/30 duration-100 bg-gradient-to-r ${documentColors[documentColorIndex]} rounded-2xl`}
                                            onClick={() =>
                                              handleTransform(targetID)
                                            }
                                          >
                                            {section.section_title && (
                                              <h4 className="border-b dark:border-black">
                                                {section.section_title}
                                              </h4>
                                            )}
                                            <p>
                                              {section.sub_section_id}{" "}
                                              {section.sub_section_title}
                                            </p>
                                          </article>
                                        </li>
                                      );
                                    }
                                  )}
                                </ul>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      </article>
                    );
                  })}
                </section>
              ) : (
                <p>No mapping available</p>
              )}
            </section>
          ) : null}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default MappingFilter;
