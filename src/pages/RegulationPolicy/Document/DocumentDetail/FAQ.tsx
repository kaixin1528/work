import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import React from "react";
import { GetGRCDocumentFAQ } from "src/services/grc";
import { KeyStringVal } from "src/types/general";

const FAQ = ({ documentID }: { documentID: string }) => {
  const { data: faq } = GetGRCDocumentFAQ(documentID);

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex items-center gap-2 w-max text-sm">
            <h4>FAQ</h4>
            <FontAwesomeIcon
              icon={open ? faChevronCircleDown : faChevronCircleRight}
              className="dark:text-checkbox"
            />
          </Disclosure.Button>
          <Disclosure.Panel className="grid gap-3 px-4 text-sm border-l-1 dark:border-checkbox">
            {faq ? (
              faq.faqs.length > 0 ? (
                <section className="grid gap-3 overflow-auto scrollbar">
                  <span>{faq.timestamp}</span>
                  <ul className="flex flex-col flex-grow divide-y-1 dark:divide-checkbox/30 overflow-auto scrollbar">
                    {faq.faqs.map((faq: KeyStringVal, index: number) => {
                      return (
                        <Disclosure key={index}>
                          {({ open }) => (
                            <>
                              <Disclosure.Button className="flex items-center gap-2 p-4 w-full dark:bg-expand">
                                <p className="text-left">{faq.question}</p>
                                <FontAwesomeIcon
                                  icon={
                                    open
                                      ? faChevronCircleDown
                                      : faChevronCircleRight
                                  }
                                  className="dark:text-checkbox"
                                />
                              </Disclosure.Button>
                              <Disclosure.Panel className="grid gap-5 p-4 dark:bg-account">
                                <p className="text-left break-words">
                                  {faq.answer}
                                </p>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      );
                    })}
                  </ul>
                </section>
              ) : (
                <p>No FAQs available</p>
              )
            ) : null}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default FAQ;
