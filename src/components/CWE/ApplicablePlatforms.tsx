import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import React from "react";
import { GetCWEDetail } from "src/services/general/cwe";

const ApplicablePlatforms = ({ selectedCWE }: { selectedCWE: string }) => {
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
            <p>Applicable Platforms</p>
          </Disclosure.Button>
          <Disclosure.Panel>
            {cweDetail ? (
              <section className="grid gap-5">
                {cweDetail?.data.applicable_platforms_language?.length > 0 && (
                  <section className="grid gap-3">
                    <h4 className="underlined-label">Languages</h4>
                    <ul className="flex items-center gap-3">
                      {cweDetail?.data.applicable_platforms_language.map(
                        (language: any, index: number) => {
                          return (
                            <li
                              key={index}
                              className="grid gap-5 px-4 py-2 border dark:border-signin rounded-full"
                            >
                              {language.NameAttr} {language.ClassAttr} (
                              {language.PrevalenceAttr})
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </section>
                )}
                {cweDetail?.data.applicable_platforms_technology?.length >
                  0 && (
                  <section className="grid gap-3">
                    <h4 className="underlined-label">Technologies</h4>
                    <ul className="flex items-center gap-3">
                      {cweDetail?.data.applicable_platforms_technology.map(
                        (technology: any, index: number) => {
                          return (
                            <li
                              key={index}
                              className="grid gap-5 px-4 py-2 border dark:border-signin rounded-full"
                            >
                              {technology.NameAttr} {technology.ClassAttr} (
                              {technology.PrevalenceAttr})
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </section>
                )}
                {cweDetail?.data.applicable_platforms_architecture?.length >
                  0 && (
                  <section className="grid gap-3">
                    <h4 className="underlined-label">Architecture</h4>
                    <ul className="flex items-center gap-3">
                      {cweDetail?.data.applicable_platforms_architecture.map(
                        (architecture: any, index: number) => {
                          return (
                            <li
                              key={index}
                              className="grid gap-5 px-4 py-2 border dark:border-signin rounded-full"
                            >
                              {architecture.NameAttr} {architecture.ClassAttr} (
                              {architecture.PrevalenceAttr})
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </section>
                )}
                {cweDetail?.data.applicable_platforms_operating_system?.length >
                  0 && (
                  <section className="grid gap-3">
                    <h4 className="underlined-label">Operating Systems</h4>
                    <ul className="flex items-center gap-3">
                      {cweDetail?.data.applicable_platforms_operating_system.map(
                        (os: any, index: number) => {
                          return (
                            <li
                              key={index}
                              className="grid gap-5 px-4 py-2 border dark:border-signin rounded-full"
                            >
                              {os.NameAttr} {os.ClassAttr} ({os.PrevalenceAttr})
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </section>
                )}
              </section>
            ) : null}
          </Disclosure.Panel>
        </section>
      )}
    </Disclosure>
  );
};

export default ApplicablePlatforms;
