import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import React from "react";
import { GetCWEDetail } from "src/services/general/cwe";
import parse from "html-react-parser";
import { severityColors } from "src/constants/summaries";

const DetectionMethods = ({ selectedCWE }: { selectedCWE: string }) => {
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
            <p>Detection Methods</p>
          </Disclosure.Button>
          <Disclosure.Panel>
            {cweDetail ? (
              cweDetail?.data.detection_methods?.length > 0 ? (
                <section className="grid gap-3">
                  {cweDetail?.data.detection_methods.map(
                    (method: any, index: number) => {
                      return (
                        <article
                          key={index}
                          className="grid gap-5 p-4 dark:bg-card"
                        >
                          <h3 className="text-lg">{method.Method}</h3>
                          <p>
                            Effectiveness:{" "}
                            <span
                              className={`px-2 py-1 ${
                                severityColors[
                                  method.Effectiveness.toLowerCase()
                                ]
                              }`}
                            >
                              {method.Effectiveness}
                            </span>{" "}
                          </p>
                          {parse(method.Description?.XHTMLContent || "")}
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

export default DetectionMethods;
