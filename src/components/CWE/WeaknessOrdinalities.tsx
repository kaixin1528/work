import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import React from "react";
import { GetCWEDetail } from "src/services/general/cwe";

const WeaknessOrdinalities = ({ selectedCWE }: { selectedCWE: string }) => {
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
            <p>Weakness Ordinalities</p>
          </Disclosure.Button>
          <Disclosure.Panel>
            {cweDetail ? (
              cweDetail?.data.weakness_ordinalities?.length > 0 ? (
                <section className="grid gap-3">
                  {cweDetail?.data.weakness_ordinalities.map(
                    (weakness: any, index: number) => {
                      return (
                        <article
                          key={index}
                          className="grid gap-5 p-4 dark:bg-card"
                        >
                          <h3 className="text-lg">{weakness.Ordinality}</h3>
                          <p>{weakness.Description}</p>
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

export default WeaknessOrdinalities;
