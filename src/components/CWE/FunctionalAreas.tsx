import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import React from "react";
import { GetCWEDetail } from "src/services/general/cwe";

const FunctionalAreas = ({ selectedCWE }: { selectedCWE: string }) => {
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
            <p>Functional Areas</p>
          </Disclosure.Button>
          <Disclosure.Panel>
            {cweDetail ? (
              cweDetail?.data.functional_areas?.length > 0 ? (
                <ul className="flex items-center gap-3">
                  {cweDetail?.data.functional_areas.map(
                    (area: string, index: number) => {
                      return (
                        <li
                          key={index}
                          className="grid gap-5 px-4 py-2 border dark:border-signin rounded-full"
                        >
                          {area}
                        </li>
                      );
                    }
                  )}
                </ul>
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

export default FunctionalAreas;
