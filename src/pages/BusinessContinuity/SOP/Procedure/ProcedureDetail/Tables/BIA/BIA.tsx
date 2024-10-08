/* eslint-disable react-hooks/exhaustive-deps */
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import TableLayout from "src/layouts/TableLayout";
import { ViewBIA } from "src/services/business-continuity/bia";
import { KeyStringVal } from "src/types/general";
import ExportFile from "./ExportFile";

const BIA = ({ versionID }: { versionID: string }) => {
  const viewBIA = ViewBIA(versionID);

  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  useEffect(() => {
    if (viewBIA.data?.header && selectedColumns.length === 0) {
      const columnNames = viewBIA.data?.header.reduce(
        (pV: string[], cV: KeyStringVal) => [...pV, cV.property_name],
        []
      );
      setSelectedColumns(columnNames);
    }
  }, [viewBIA]);

  return (
    <Disclosure>
      {({ open }) => (
        <section className="grid">
          <Disclosure.Button
            className="w-max"
            onClick={() => viewBIA.mutate({})}
          >
            <FontAwesomeIcon icon={faEye} className="dark:text-checkbox" /> View
            Data (for impact analysis)
          </Disclosure.Button>
          <Disclosure.Panel className="grid gap-5">
            {viewBIA.status === "success" ? (
              viewBIA.data.bia_rows?.length > 0 ? (
                <section className="grid gap-3 w-full">
                  <ExportFile
                    versionID={versionID}
                    selectedColumns={selectedColumns}
                  />
                  <TableLayout>
                    <thead className="sticky -top-1.5 z-10 bg-gradient-to-b dark:from-expand dark:to-table-header">
                      <tr>
                        {viewBIA.data?.header?.map(
                          (col: KeyStringVal, colIndex: number) => {
                            return (
                              <th
                                scope="col"
                                key={colIndex}
                                className="py-3 px-5 text-left font-semibold"
                              >
                                <article className="flex items-center gap-1">
                                  <input
                                    type="checkbox"
                                    className="form-checkbox w-3 h-3 self-start dark:ring-0 dark:text-signin dark:focus:border-signin focus:ring dark:focus:ring-offset-0 dark:focus:ring-signin focus:ring-opacity-50 rounded-full"
                                    checked={selectedColumns.includes(
                                      col.property_name
                                    )}
                                    onChange={() => {
                                      if (
                                        selectedColumns.includes(
                                          col.property_name
                                        )
                                      )
                                        setSelectedColumns(
                                          selectedColumns.filter(
                                            (column) =>
                                              column !== col.property_name
                                          )
                                        );
                                      else
                                        setSelectedColumns([
                                          ...selectedColumns,
                                          col.property_name,
                                        ]);
                                    }}
                                  />
                                  <p>{col.display_name}</p>
                                </article>
                              </th>
                            );
                          }
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {viewBIA.data?.bia_rows?.map(
                        (row: KeyStringVal, rowIndex: number) => {
                          return (
                            <tr
                              key={rowIndex}
                              className="relative p-5 gap-3 break-words dark:bg-card dark:even:bg-gradient-to-b from-panel to-panel/70"
                            >
                              {viewBIA.data.header?.map(
                                (col: KeyStringVal, index: number) => {
                                  return (
                                    <td
                                      key={index}
                                      className="relative py-3 px-5 h-max text-left"
                                    >
                                      <p>{row[col.property_name]}</p>
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
                </section>
              ) : (
                <p>{viewBIA.data}</p>
              )
            ) : null}
          </Disclosure.Panel>
        </section>
      )}
    </Disclosure>
  );
};

export default BIA;
