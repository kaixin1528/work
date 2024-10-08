/* eslint-disable react/jsx-no-comment-textnodes */
import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import React from "react";
import { GetCWEDetail } from "src/services/general/cwe";
import parse from "html-react-parser";
import { KeyStringVal } from "src/types/general";

const DemonstrativeExamples = ({ selectedCWE }: { selectedCWE: string }) => {
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
            <p>Demonstrative Examples</p>
          </Disclosure.Button>
          <Disclosure.Panel>
            {cweDetail ? (
              cweDetail?.data.demonstrative_examples?.length > 0 ? (
                <section className="grid gap-5">
                  {cweDetail?.data.demonstrative_examples?.map(
                    (example: any, index: number) => {
                      return (
                        <article
                          key={index}
                          className="grid gap-2 p-4 dark:bg-card"
                        >
                          <h4 className="underlined-label">
                            Example {index + 1}
                          </h4>
                          {parse(example.IntroText?.XHTMLContent || "")}
                          <article className="grid gap-2">
                            {example.ExampleCode?.map(
                              (code: KeyStringVal, codeIndex: number) => {
                                return (
                                  <article
                                    key={codeIndex}
                                    className="grid gap-1 p-4 dark:bg-main"
                                  >
                                    <h4 className="dark:text-filter">
                                      // {code.LanguageAttr}
                                    </h4>
                                    {parse(code?.XHTMLContent || "")}
                                  </article>
                                );
                              }
                            )}
                          </article>
                          <article className="grid gap-2">
                            {example.BodyText?.map((text: KeyStringVal) => {
                              return parse(text?.XHTMLContent || "");
                            })}
                          </article>
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

export default DemonstrativeExamples;
