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

const MappingNotes = ({ selectedCWE }: { selectedCWE: string }) => {
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
            <p>Mapping Notes</p>
          </Disclosure.Button>
          <Disclosure.Panel>
            {cweDetail ? (
              cweDetail?.data.mapping_notes ? (
                <section className="grid gap-5 p-4 dark:bg-card">
                  <h3 className="text-lg">
                    Usage: {cweDetail.data.mapping_notes.Usage}
                  </h3>
                  <article className="grid gap-1">
                    <h4 className="underlined-label">Reasons</h4>
                    <ul className="grid gap-1">
                      {cweDetail.data.mapping_notes.Reasons.Reason.map(
                        (reason: KeyStringVal) => (
                          <li key={reason.TypeAttr}>{reason.TypeAttr}</li>
                        )
                      )}
                    </ul>
                  </article>
                  <article className="grid gap-1">
                    <h4 className="underlined-label">Rationale</h4>
                    {parse(
                      cweDetail.data.mapping_notes.Rationale?.XHTMLContent || ""
                    )}
                  </article>
                  <article className="grid gap-1">
                    <h4 className="underlined-label">Comments</h4>
                    {parse(
                      cweDetail.data.mapping_notes.Comments?.XHTMLContent || ""
                    )}
                  </article>
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

export default MappingNotes;
