import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure, Transition } from "@headlessui/react";
import React, { useState } from "react";
import { GetControlEvidence } from "src/services/audits-assessments/internal-audit";
import EvidenceDetail from "./EvidenceDetail";
import AttachEvidence from "./AttachEvidence";

const EvidenceList = ({
  auditID,
  controlID,
}: {
  auditID: string;
  controlID: string;
}) => {
  const [show, setShow] = useState<string>("");

  const { data: evidenceList } = GetControlEvidence(
    auditID,
    controlID,
    show === controlID
  );

  return (
    <Disclosure>
      {({ open }) => {
        return (
          <section className="text-sm">
            <Disclosure.Button
              className="flex items-center gap-2"
              onClick={() => {
                if (show !== "") setShow("");
                else setShow(controlID);
              }}
            >
              <FontAwesomeIcon
                icon={open ? faChevronCircleDown : faChevronCircleRight}
                className="dark:text-black"
              />
              <h4>Evidence</h4>
            </Disclosure.Button>
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel>
                <section className="flex flex-col flex-grow gap-2 mt-3 mx-6">
                  <AttachEvidence auditID={auditID} controlID={controlID} />

                  {evidenceList?.length > 0 && (
                    <ul className="flex flex-wrap gap-2">
                      {evidenceList.map((evidence: any) => {
                        return (
                          <EvidenceDetail
                            key={evidence.evidence_id}
                            auditID={auditID}
                            controlID={controlID}
                            evidence={evidence}
                          />
                        );
                      })}
                    </ul>
                  )}
                </section>
              </Disclosure.Panel>
            </Transition>
          </section>
        );
      }}
    </Disclosure>
  );
};

export default EvidenceList;
