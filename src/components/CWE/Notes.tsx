import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import React from "react";
import { GetCWEDetail } from "src/services/general/cwe";
import parse from "html-react-parser";

const Notes = ({ selectedCWE }: { selectedCWE: string }) => {
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
            <p>Notes</p>
          </Disclosure.Button>
          <Disclosure.Panel>
            {cweDetail ? (
              cweDetail?.data.notes?.length > 0 ? (
                <section className="grid gap-3">
                  {cweDetail?.data.notes.map((note: any, index: number) => {
                    return (
                      <article
                        key={index}
                        className="grid gap-5 p-4 dark:bg-card"
                      >
                        <h3 className="text-lg">{note.TypeAttr}</h3>
                        {parse(note.XHTMLContent || "")}
                      </article>
                    );
                  })}
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

export default Notes;
