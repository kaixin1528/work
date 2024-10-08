import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import React from "react";
import { GetCWEDetail } from "src/services/general/cwe";
import parse from "html-react-parser";

const PotentialMitigations = ({ selectedCWE }: { selectedCWE: string }) => {
  const { data: cweDetail } = GetCWEDetail(selectedCWE);

  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <section className="grid content-start gap-3">
          <Disclosure.Button className="flex items-center gap-2 w-max">
            <FontAwesomeIcon
              icon={open ? faChevronCircleDown : faChevronCircleRight}
              className="dark:text-checkbox"
            />
            <p>Potential Mitigations</p>
          </Disclosure.Button>
          <Disclosure.Panel>
            {cweDetail ? (
              cweDetail?.data.potential_mitigations?.length > 0 ? (
                <section className="grid gap-3">
                  {cweDetail?.data.potential_mitigations?.map(
                    (row: any, rowIndex: number) => {
                      return (
                        <article
                          key={rowIndex}
                          className="grid gap-5 p-4 break-words dark:bg-card"
                        >
                          <header className="flex flex-wrap items-center gap-1 text-base underlined-label">
                            <h4>{row.MitigationIDAttr} Phases:</h4>
                            <ul className="flex items-center gap-1">
                              {row.Phase.map((value: string, index: number) => (
                                <li key={value}>
                                  {value}
                                  {index < row.Phase.length - 1 && ", "}
                                </li>
                              ))}
                            </ul>{" "}
                          </header>
                          {parse(row.Description?.XHTMLContent || "")}
                          {row.Strategy && (
                            <article className="grid gap-2">
                              <h4 className="text-base underlined-label">
                                Strategy: {row.Strategy}
                              </h4>
                            </article>
                          )}
                          {row.Effectiveness && (
                            <article className="grid gap-2">
                              <h4>Effectiveness: {row.Effectiveness}</h4>
                              {parse(
                                row.EffectivenessNotes?.XHTMLContent || ""
                              )}
                            </article>
                          )}
                        </article>
                      );
                    }
                  )}
                </section>
              ) : (
                <p>No data available</p>
              )
            ) : null}
          </Disclosure.Panel>
        </section>
      )}
    </Disclosure>
  );
};

export default PotentialMitigations;
