import {
  faChevronCircleDown,
  faChevronCircleRight,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import React, { useState } from "react";
import ModalLayout from "src/layouts/ModalLayout";
import { DeleteControlEvidence } from "src/services/audits-assessments/internal-audit";
import { KeyStringVal } from "src/types/general";

const EvidenceDetail = ({
  auditID,
  controlID,
  evidence,
}: {
  auditID: string;
  controlID: string;
  evidence: any;
}) => {
  const [show, setShow] = useState<boolean>(false);

  const deleteEvidence = DeleteControlEvidence(auditID, controlID);

  const handleOnClose = () => setShow(false);

  return (
    <li
      className="flex items-center gap-2 px-4 py-2 w-max cursor-pointer dark:bg-expand dark:hover:bg-expand/60 duration-100 rounded-md"
      onClick={() => setShow(true)}
    >
      <h4>{evidence.name}</h4>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        <section className="grid gap-5">
          <header className="grid gap-2">
            <h4 className="tracking-wide text-xl text-center">
              PREVIEW of {evidence.name}
            </h4>
            {evidence.file_uri && (
              <>
                <button
                  className="text-signin dark:hover:text-signin/60 duration-100"
                  onClick={() => {
                    let a = document.createElement("a");
                    a.href = evidence.file_uri;
                    a.target = "_blank";
                    a.click();
                  }}
                >
                  <FontAwesomeIcon icon={faDownload} /> Download as File
                </button>
                <img
                  src={evidence.file_uri}
                  alt="preview"
                  className="mx-auto"
                />
              </>
            )}
          </header>
          {evidence.description && (
            <p className="grid gap-2 p-4 dark:bg-black/60 rounded-md">
              {evidence.description
                .split("\n")
                .map((phrase: string, index: number) => (
                  <span key={index}>{phrase}</span>
                ))}
            </p>
          )}
          {evidence.content && (
            <p className="grid gap-2 p-4 dark:bg-black/60 rounded-md">
              {evidence.content
                .split("\n")
                .map((phrase: string, index: number) => (
                  <span key={index}>{phrase}</span>
                ))}
            </p>
          )}
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center gap-2 w-max text-sm">
                  <h4>Q&A</h4>
                  <FontAwesomeIcon
                    icon={open ? faChevronCircleDown : faChevronCircleRight}
                    className="dark:text-checkbox"
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="grid gap-3 px-4 text-sm border-l-1 dark:border-checkbox">
                  {evidence.qa ? (
                    evidence.qa.length > 0 ? (
                      <ul className="flex flex-col flex-grow divide-y-1 dark:divide-checkbox/30 overflow-auto scrollbar">
                        {evidence.qa.map((qa: KeyStringVal, index: number) => {
                          return (
                            <Disclosure key={index}>
                              {({ open }) => (
                                <>
                                  <Disclosure.Button className="flex items-center gap-2 p-4 w-full dark:bg-expand">
                                    <p className="text-left">{qa.question}</p>
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
                                      {qa.answer}
                                    </p>
                                  </Disclosure.Panel>
                                </>
                              )}
                            </Disclosure>
                          );
                        })}
                      </ul>
                    ) : (
                      <p>No questions available</p>
                    )
                  ) : null}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          {evidence.tags?.length > 0 && (
            <p className="flex flex-wrap gap-2">
              {evidence.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 dark:bg-filter rounded-full"
                >
                  {tag}
                </span>
              ))}
            </p>
          )}
          <button
            className="px-4 py-1 mx-auto bg-gradient-to-b dark:from-reset dark:to-reset/60 dark:hover:from-reset dark:hover:to-reset/30 rounded-sm"
            onClick={() => {
              deleteEvidence.mutate({
                evidenceID: evidence.evidence_id,
              });
              setShow(false);
            }}
          >
            Delete evidence
          </button>
        </section>
      </ModalLayout>
    </li>
  );
};

export default EvidenceDetail;
