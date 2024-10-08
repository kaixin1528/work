import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import React from "react";
import TableLayout from "src/layouts/TableLayout";
import { GetCWEDetail } from "src/services/general/cwe";
import { KeyStringVal } from "src/types/general";

const Relationships = ({ selectedCWE }: { selectedCWE: string }) => {
  const { data: cweDetail } = GetCWEDetail(selectedCWE);

  const viewIds = [
    ...new Set(
      cweDetail?.data.related_weaknesses?.reduce(
        (pV: string[], cV: KeyStringVal) => [...pV, cV.ViewIDAttr],
        []
      )
    ),
  ] as string[];

  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <section className="grid content-start gap-3">
          <Disclosure.Button className="flex items-center gap-2 w-max">
            <FontAwesomeIcon
              icon={open ? faChevronCircleDown : faChevronCircleRight}
              className="dark:text-checkbox"
            />
            <p>Relationships</p>
          </Disclosure.Button>
          <Disclosure.Panel>
            {viewIds ? (
              viewIds?.length > 0 ? (
                <section className="grid content-start gap-10">
                  {viewIds.map((viewID: string) => {
                    const filtered = cweDetail?.data.related_weaknesses?.filter(
                      (weakness: KeyStringVal) => weakness.ViewIDAttr === viewID
                    );
                    const keys = Object.keys(filtered[0]);
                    return (
                      <section
                        key={viewID}
                        className="grid content-start gap-3"
                      >
                        <h4 className="underlined-label">
                          Relevant to CWE-{viewID}
                        </h4>

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
                                      <h4>{col}</h4>
                                    </article>
                                  </th>
                                );
                              })}
                            </tr>
                          </thead>
                          <tbody>
                            {filtered?.map((row: any, rowIndex: number) => {
                              return (
                                <tr
                                  key={rowIndex}
                                  className="relative p-5 gap-3 break-words dark:bg-card dark:even:bg-gradient-to-b from-panel to-panel/70"
                                >
                                  {keys.map((col: string, index: number) => {
                                    return (
                                      <td
                                        key={index}
                                        className="relative py-3 px-5 text-left"
                                      >
                                        <p className="text-left">{row[col]}</p>
                                      </td>
                                    );
                                  })}
                                </tr>
                              );
                            })}
                          </tbody>
                        </TableLayout>
                      </section>
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

export default Relationships;
