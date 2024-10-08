import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import React from "react";
import TableLayout from "src/layouts/TableLayout";
import { GetCWEDetail } from "src/services/general/cwe";

const ContentHistory = ({ selectedCWE }: { selectedCWE: string }) => {
  const { data: cweDetail } = GetCWEDetail(selectedCWE);

  const sections = cweDetail?.data.content_history
    ? Object.keys(cweDetail?.data.content_history)
    : [];

  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <section className="grid content-start gap-3">
          <Disclosure.Button className="flex items-center gap-2 w-max">
            <FontAwesomeIcon
              icon={open ? faChevronCircleDown : faChevronCircleRight}
              className="dark:text-checkbox"
            />
            <p>Content History</p>
          </Disclosure.Button>
          <Disclosure.Panel>
            {cweDetail ? (
              sections?.length > 0 ? (
                <section className="grid gap-5 px-6">
                  {sections.map((section: string, sectionIndex: number) => {
                    const data =
                      section === "Submission"
                        ? [cweDetail.data.content_history[section]]
                        : cweDetail.data.content_history[section];
                    const keys = data?.length > 0 ? Object.keys(data[0]) : [];

                    return (
                      <Disclosure key={sectionIndex} defaultOpen>
                        {({ open }) => (
                          <section className="grid content-start gap-3">
                            <Disclosure.Button className="flex items-center gap-2 w-max">
                              <FontAwesomeIcon
                                icon={
                                  open
                                    ? faChevronCircleDown
                                    : faChevronCircleRight
                                }
                                className="dark:text-checkbox"
                              />
                              <p>{section.replace(/([A-Z])/g, " $1").trim()}</p>
                            </Disclosure.Button>
                            <Disclosure.Panel>
                              {cweDetail ? (
                                keys?.length > 0 ? (
                                  <TableLayout>
                                    <thead className="sticky -top-1.5 z-10 bg-gradient-to-b dark:from-expand dark:to-table-header">
                                      <tr>
                                        {keys.map((col: string) => {
                                          return (
                                            <th
                                              scope="col"
                                              key={col}
                                              className="py-3 px-5 text-left font-semibold"
                                            >
                                              <article className="capitalize flex gap-10 justify-between">
                                                <h4>
                                                  {col
                                                    .replace(/([A-Z])/g, " $1")
                                                    .trim()}
                                                </h4>
                                              </article>
                                            </th>
                                          );
                                        })}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {data?.map(
                                        (row: any, rowIndex: number) => {
                                          return (
                                            <tr
                                              key={rowIndex}
                                              className="relative p-5 gap-3 break-words dark:bg-card dark:even:bg-gradient-to-b from-panel to-panel/70"
                                            >
                                              {keys.map(
                                                (
                                                  col: string,
                                                  index: number
                                                ) => {
                                                  return (
                                                    <td
                                                      key={index}
                                                      className="relative py-3 px-5 text-left"
                                                    >
                                                      <p className="text-left">
                                                        {row[col]}
                                                      </p>
                                                    </td>
                                                  );
                                                }
                                              )}
                                            </tr>
                                          );
                                        }
                                      )}
                                    </tbody>
                                  </TableLayout>
                                ) : (
                                  <p>No data available</p>
                                )
                              ) : null}
                            </Disclosure.Panel>
                          </section>
                        )}
                      </Disclosure>
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

export default ContentHistory;
