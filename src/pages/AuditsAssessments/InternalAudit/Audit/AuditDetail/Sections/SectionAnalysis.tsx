import {
  faChevronCircleDown,
  faChevronCircleRight,
  faSkullCrossbones,
  faWarning,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import React from "react";

const SectionAnalysis = ({ section }: { section: any }) => {
  return (
    <section className="grid gap-3 text-sm">
      {["policy", "system", "evidence"].map((type) => {
        const analysis =
          section.follow_up_items &&
          section.follow_up_items[`${type}_analysis`];
        if (!analysis || analysis?.length === 0) return null;

        return (
          <Disclosure key={type}>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center gap-2 w-max">
                  <span className="capitalize">
                    {analysis.length} {type} Analysis
                  </span>
                  <FontAwesomeIcon
                    icon={open ? faChevronCircleDown : faChevronCircleRight}
                    className="dark:text-black"
                  />
                </Disclosure.Button>
                <Disclosure.Panel>
                  <ul className="flex flex-col flex-grow gap-3 p-2 max-h-[20rem] overflow-auto scrollbar">
                    {analysis.map(
                      (
                        { sev, msg }: { sev: string; msg: string },
                        index: number
                      ) => (
                        <li
                          key={index}
                          className={`flex items-center gap-2 px-4 py-1 break-words ${
                            sev === "URGENT"
                              ? "bg-reset"
                              : sev === "WARNING"
                              ? "text-black bg-event"
                              : "bg-black/60"
                          } rounded-md`}
                        >
                          <FontAwesomeIcon
                            icon={
                              sev === "URGENT"
                                ? faSkullCrossbones
                                : sev === "WARNING"
                                ? faWarning
                                : faInfo
                            }
                          />
                          {msg}
                        </li>
                      )
                    )}
                  </ul>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        );
      })}
    </section>
  );
};

export default SectionAnalysis;
