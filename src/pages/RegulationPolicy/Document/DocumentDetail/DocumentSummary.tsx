import {
  faChevronCircleDown,
  faChevronCircleRight,
  faArrowRightLong,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import React, { useState } from "react";
import ModalLayout from "src/layouts/ModalLayout";
import { GetDocumentSummary } from "src/services/grc";

const DocumentSummary = ({ documentID }: { documentID: string }) => {
  const [showItemizedSummary, setShowItemizedSummary] =
    useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);

  const { data: documentSummary } = GetDocumentSummary(documentID);

  return (
    <>
      {documentSummary && (
        <article className="grid gap-3">
          <Disclosure defaultOpen>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center gap-2 w-max text-sm">
                  <h4>Summary</h4>
                  <FontAwesomeIcon
                    icon={open ? faChevronCircleDown : faChevronCircleRight}
                    className="dark:text-checkbox"
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="grid gap-3 px-4 text-sm border-l-1 dark:border-checkbox">
                  <button
                    className="px-4 py-1 w-max dark:bg-filter/60 dark:hover:bg-filter/30 duration-100 rounded-md"
                    onClick={() => setShowItemizedSummary(true)}
                  >
                    View itemized summary{" "}
                    <FontAwesomeIcon icon={faArrowRightLong} />{" "}
                  </button>
                  <article className="flex flex-wrap gap-2">
                    {documentSummary.OVERALL_SUMMARY.slice(
                      0,
                      showMore ? documentSummary.OVERALL_SUMMARY.length : 500
                    )
                      .split("\n\n")
                      .map((phrase: string, index: number) => (
                        <span key={index}>
                          {phrase}
                          {showMore && " "}
                          {index ===
                            documentSummary.OVERALL_SUMMARY.slice(
                              0,
                              showMore
                                ? documentSummary.OVERALL_SUMMARY.length
                                : 500
                            ).split("\n\n").length -
                              1 &&
                            documentSummary.OVERALL_SUMMARY.length > 500 && (
                              <button
                                className="dark:text-checkbox"
                                onClick={() => setShowMore(!showMore)}
                              >
                                {!showMore && (
                                  <span className="dark:text-white">...</span>
                                )}{" "}
                                Show {showMore ? "less" : "more"}
                              </button>
                            )}
                        </span>
                      ))}{" "}
                  </article>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <ModalLayout
            showModal={showItemizedSummary}
            onClose={() => setShowItemizedSummary(false)}
          >
            <section className="grid gap-2 py-5 overflow-auto scrollbar">
              <h4 className="text-lg tracking-wide">Itemized Summary</h4>
              {documentSummary.ITEMIZED_SUMMARY ? (
                <p className="grid gap-2">
                  {documentSummary.ITEMIZED_SUMMARY.split("\n").map(
                    (phrase: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 dark:bg-filter rounded-sm"
                      >
                        {phrase}
                      </span>
                    )
                  )}
                </p>
              ) : (
                <span>Not available</span>
              )}
            </section>
          </ModalLayout>
        </article>
      )}
    </>
  );
};

export default DocumentSummary;
