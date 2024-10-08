import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import React from "react";

const Table = ({ highlights }: { highlights: any }) => {
  return (
    <ul className="grid content-start gap-5 w-full h-full overflow-auto scrollbar">
      {highlights?.map((highlight: any) => {
        return (
          <li
            key={highlight.id}
            className="grid gap-3 p-5 bg-gradient-to-r dark:from-admin/70 dark:to-white/10 rounded-2xl"
          >
            <h4 className="border-b-1 dark:border-black">
              {highlight.sub_section_id} {highlight.section_name}
            </h4>
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex items-center gap-2 text-sm">
                    <FontAwesomeIcon
                      icon={open ? faChevronCircleDown : faChevronCircleRight}
                      className="dark:text-black"
                    />
                    <h4>{open ? "Hide" : "Show"} content</h4>
                  </Disclosure.Button>
                  <Disclosure.Panel className="grid gap-5 p-4 text-sm dark:bg-black/60 rounded-md">
                    <p>{highlight.content}</p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </li>
        );
      })}
    </ul>
  );
};

export default Table;
