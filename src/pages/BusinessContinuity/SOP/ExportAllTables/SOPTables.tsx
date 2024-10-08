import {
  faChevronCircleUp,
  faChevronCircleDown,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import React, { useState } from "react";
import { GetSOPTableHeaders } from "src/services/business-continuity/sop";

const SOPTables = ({
  sop,
  tableIDs,
  setTableIDs,
  headers,
  setHeaders,
  selectedHeader,
  setSelectedHeader,
}: {
  sop: any;
  tableIDs: any;
  setTableIDs: any;
  headers: any;
  setHeaders: any;
  selectedHeader: any;
  setSelectedHeader: any;
}) => {
  const [show, setShow] = useState<boolean>(false);

  const { data: tableHeaders } = GetSOPTableHeaders(
    [sop.latest_version_id],
    show
  );

  const tables = tableHeaders ? tableHeaders[sop.latest_version_id] : [];

  return (
    <Disclosure key={sop.latest_version_id}>
      {({ open }) => (
        <>
          <Disclosure.Button
            className="flex items-center gap-2 px-4 py-1 w-full break-words cursor-pointer text-left text-base bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 dark:hover:to-white/30 duration-100 border-b-1 dark:border-black rounded-t-md"
            onClick={() => setShow(!show)}
          >
            <h4>{sop.sop_name}</h4>
            <FontAwesomeIcon
              icon={show ? faChevronCircleUp : faChevronCircleDown}
              className="w-3 h-3 dark:text-black"
            />
          </Disclosure.Button>
          <Disclosure.Panel>
            <section className="grid gap-3 px-4 py-2 -mt-5 w-full break-words text-left text-base bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 overflow-auto scrollbar rounded-b-md">
              {tables?.length} tables
              {tables?.map((table: any) => {
                const added = tableIDs[sop.latest_version_id]?.includes(
                  table.generated_id
                );

                return (
                  <section
                    key={table.generated_id}
                    className="flex items-stretch gap-2"
                  >
                    <button
                      className={`px-4 py-1 ${
                        added
                          ? "dark:bg-no dark:hover:bg-no/60 duration-100"
                          : "dark:bg-signin dark:hover:bg-signin/60 duration-100"
                      } rounded-md`}
                      onClick={() => {
                        if (added) {
                          const newTableIDs = tableIDs[
                            sop.latest_version_id
                          ].filter(
                            (tableID: string) => tableID !== table.generated_id
                          );
                          if (newTableIDs.length > 0)
                            setTableIDs({
                              ...tableIDs,
                              [sop.latest_version_id]: newTableIDs,
                            });
                          else {
                            const newTableIDs = tableIDs[sop.latest_version_id];
                            delete tableIDs[sop.latest_version_id];
                            setTableIDs(newTableIDs);
                          }
                        } else
                          setTableIDs({
                            ...tableIDs,
                            [sop.latest_version_id]: [
                              ...(tableIDs[sop.latest_version_id] || []),
                              table.generated_id,
                            ],
                          });
                      }}
                    >
                      <FontAwesomeIcon icon={added ? faMinus : faPlus} />
                    </button>
                    <table className="w-full table-auto overflow-auto scrollbar">
                      <thead
                        className={`sticky -top-1.5 w-full bg-gradient-to-b dark:from-expand dark:to-table-header ${
                          table.headers.every((curCol: string) =>
                            selectedHeader.includes(curCol)
                          )
                            ? "border dark:border-yellow-500"
                            : ""
                        } overflow-auto scrollbar`}
                      >
                        <tr>
                          {table.headers.map(
                            (col: string, colIndex: number) => {
                              return (
                                <th
                                  scope="col"
                                  key={colIndex}
                                  className="py-3 px-5 text-left font-semibold"
                                >
                                  <article className="flex items-center gap-2">
                                    {added && (
                                      <input
                                        type="checkbox"
                                        checked={headers.includes(col)}
                                        onChange={() => {
                                          if (headers.includes(col))
                                            setHeaders(
                                              headers.filter(
                                                (column: string) =>
                                                  column !== col
                                              )
                                            );
                                          else {
                                            setHeaders([
                                              ...new Set([...headers, col]),
                                            ]);
                                            setSelectedHeader(table.headers);
                                          }
                                        }}
                                        className="form-checkbox mt-1 w-4 h-4 border-0 dark:focus:ring-0 dark:text-checkbox dark:focus:border-checkbox focus:ring dark:focus:ring-offset-0 dark:focus:ring-checkbox focus:ring-opacity-50"
                                      />
                                    )}
                                    <h4 className="w-max">{col}</h4>
                                  </article>
                                </th>
                              );
                            }
                          )}
                        </tr>
                      </thead>
                    </table>
                  </section>
                );
              })}
            </section>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default SOPTables;
