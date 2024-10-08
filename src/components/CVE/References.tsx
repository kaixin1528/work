import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import React from "react";
import { GetCVEDetail, GetCVEURLInfo } from "src/services/general/cve";
import { KeyStringVal } from "src/types/general";

const References = ({ selectedCVE }: { selectedCVE: string }) => {
  const { data: cveDetail } = GetCVEDetail(selectedCVE);
  const { data: urlInfo } = GetCVEURLInfo(
    selectedCVE,
    cveDetail?.data?.cve_references?.reduce(
      (pV: string[], cV: KeyStringVal) => [...pV, cV.url],
      []
    ) || []
  );

  return (
    <section className="grid gap-3">
      <h4 className="py-2 text-base full-underlined-label">
        Related References
      </h4>
      <ul className="grid gap-2 break-words">
        {cveDetail?.data?.cve_references?.map((reference: any) => {
          const info = urlInfo?.find(
            (curReference: KeyStringVal) => curReference.url === reference.url
          );
          if (info?.valid === false) return null;
          return (
            <li
              key={reference.url}
              className="grid gap-3 p-4 dark:bg-expand rounded-md"
            >
              <a
                href={reference.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-signin hover:underline"
              >
                {reference.url}
              </a>
              {info && (
                <Disclosure defaultOpen>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex items-center gap-2 text-xs">
                        <FontAwesomeIcon
                          icon={
                            open ? faChevronCircleDown : faChevronCircleRight
                          }
                          className="dark:text-checkbox"
                        />
                        <p>{open ? "Hide" : "Show"} Detail</p>
                      </Disclosure.Button>
                      <Disclosure.Panel className="grid gap-5 p-4 dark:bg-panel">
                        <section className="grid gap-5">
                          {info.summary ? (
                            <article>
                              {info.summary
                                .split("\\n")
                                .map((paragraph: string, index: number) => (
                                  <p key={index}>{paragraph}</p>
                                ))}
                            </article>
                          ) : (
                            <p>Summary not available</p>
                          )}
                          {info.nist_tags.length > 0 ? (
                            <section className="grid gap-2">
                              <h4>NIST Tags</h4>
                              <article className="flex flex-wrap items-center gap-2">
                                {info.nist_tags.map((tag: string) => (
                                  <span
                                    key={tag}
                                    className="p-2 text-xs w-max selected-button rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </article>
                            </section>
                          ) : (
                            <p>NIST Tags not available</p>
                          )}
                          {info.uno_tags_primary.length > 0 ? (
                            <section className="grid gap-2">
                              <h4>Primary Tags</h4>
                              <article className="flex flex-wrap items-center gap-2">
                                {info.uno_tags_primary.map((tag: string) => (
                                  <span
                                    key={tag}
                                    className="p-2 text-xs w-max selected-button rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </article>
                            </section>
                          ) : (
                            <p>Primary tags not available</p>
                          )}
                          {info.uno_tags_secondary.length > 0 ? (
                            <section className="grid gap-2">
                              <h4>Secondary Tags</h4>
                              <article className="flex flex-wrap items-center gap-2">
                                {info.uno_tags_secondary.map((tag: string) => (
                                  <span
                                    key={tag}
                                    className="p-2 text-xs w-max dark:bg-filter/30 border dark:border-filter rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </article>
                            </section>
                          ) : (
                            <p>Secondary tags not available</p>
                          )}
                        </section>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default References;
