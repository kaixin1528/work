/* eslint-disable react-hooks/exhaustive-deps */
import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import React, { useEffect } from "react";
import { GetFrameworks } from "src/services/regulation-policy/framework";
import { KeyStringVal } from "src/types/general";
import { convertToUTCShortString } from "src/utils/general";

const Frameworks = ({
  selectedFrameworkIDs,
  setSelectedFrameworkIDs,
}: {
  selectedFrameworkIDs: string[];
  setSelectedFrameworkIDs: (selectedFrameworkIDs: string[]) => void;
}) => {
  const { data: selectedFrameworks } = GetFrameworks("All");

  const regulatoryAuthorities = [
    ...new Set(
      selectedFrameworks?.data?.reduce(
        (pV: string[], cV: KeyStringVal) => [...pV, cV.regulatory_authority],
        []
      )
    ),
  ] as string[];

  useEffect(() => {
    if (selectedFrameworks?.data.length > 0) {
      const frameworkIDs = selectedFrameworks?.data?.reduce(
        (pV: string[], cV: KeyStringVal) => [...pV, cV.id],
        []
      );
      setSelectedFrameworkIDs([...selectedFrameworkIDs, ...frameworkIDs]);
    }
  }, [selectedFrameworks]);

  return (
    <section className="flex flex-col flex-grow gap-5">
      <h4 className="text-xl border-b-1 dark:border-checkbox">Frameworks</h4>
      <article className="flex items-center gap-5 divide-x dark:divide-checkbox">
        <button
          className="dark:hover:text-checkbox/60 duration-100"
          onClick={() => {
            const frameworkIDs = selectedFrameworks?.data?.reduce(
              (pV: string[], cV: KeyStringVal) => [...pV, cV.id],
              []
            );
            setSelectedFrameworkIDs([...selectedFrameworkIDs, ...frameworkIDs]);
          }}
        >
          Select All
        </button>
        <button
          className="pl-5 dark:hover:text-checkbox/60 duration-100"
          onClick={() => setSelectedFrameworkIDs([])}
        >
          Deselect All
        </button>
      </article>
      <ul className="flex flex-col flex-grow gap-5 overflow-auto scrollbar">
        {regulatoryAuthorities?.map((auth) => {
          const filteredFrameworks = selectedFrameworks?.data?.filter(
            (framework: KeyStringVal) => framework.regulatory_authority === auth
          );
          const frameworkIDs = filteredFrameworks?.reduce(
            (pV: string[], cV: KeyStringVal) => [...pV, cV.id],
            []
          );
          return (
            <article
              key={auth}
              className="grid gap-3 pl-4 border-l-1 dark:border-checkbox"
            >
              <Disclosure defaultOpen>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex items-center gap-2 text-xs">
                      <h3 className="text-lg">{auth}</h3>
                      <FontAwesomeIcon
                        icon={open ? faChevronCircleDown : faChevronCircleRight}
                        className="dark:text-checkbox"
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="grid gap-5">
                      <article className="flex items-center gap-5 divide-x dark:divide-checkbox">
                        <button
                          className="dark:hover:text-checkbox/60 duration-100"
                          onClick={() =>
                            setSelectedFrameworkIDs([
                              ...selectedFrameworkIDs,
                              ...frameworkIDs,
                            ])
                          }
                        >
                          Select All
                        </button>
                        <button
                          className="pl-5 dark:hover:text-checkbox/60 duration-100"
                          onClick={() =>
                            setSelectedFrameworkIDs(
                              selectedFrameworkIDs.filter(
                                (frameworkID) =>
                                  !frameworkIDs.includes(frameworkID)
                              )
                            )
                          }
                        >
                          Deselect All
                        </button>
                      </article>
                      <ul className="flex flex-col flex-grow gap-3 pb-2 overflow-auto scrollbar">
                        {filteredFrameworks?.map(
                          (framework: KeyStringVal, index: number) => {
                            return (
                              <li
                                key={index}
                                className={`flex items-start justify-between gap-20 py-2 px-4 break-words cursor-pointer font-extralight text-left text-base dark:text-white dark:bg-list ${
                                  selectedFrameworkIDs.includes(framework.id)
                                    ? "gradient-button"
                                    : "grey-gradient-button"
                                } black-shadow`}
                                onClick={() => {
                                  if (
                                    selectedFrameworkIDs.includes(framework.id)
                                  )
                                    setSelectedFrameworkIDs(
                                      selectedFrameworkIDs.filter(
                                        (frameworkID) =>
                                          framework.id !== frameworkID
                                      )
                                    );
                                  else
                                    setSelectedFrameworkIDs([
                                      ...selectedFrameworkIDs,
                                      framework.id,
                                    ]);
                                }}
                              >
                                <article className="flex items-start gap-2 w-3/5">
                                  <img
                                    src={framework.thumbnail_uri}
                                    alt={framework.regulatory_authority}
                                    className="w-6 h-6 rounded-full"
                                  />
                                  <h4 className="font-medium">
                                    {framework.name}
                                  </h4>
                                </article>
                                <span>
                                  {framework.regulatory_date &&
                                    convertToUTCShortString(
                                      Number(framework.regulatory_date)
                                    )}
                                  {framework.regulatory_authority && (
                                    <span>
                                      {" "}
                                      {`| ${framework.regulatory_authority}`}
                                    </span>
                                  )}{" "}
                                </span>
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
      </ul>
    </section>
  );
};

export default Frameworks;
