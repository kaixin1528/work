/* eslint-disable react-hooks/exhaustive-deps */
import {
  faChevronDown,
  faChevronUp,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import TableLayout from "src/layouts/TableLayout";
import { KeyStringVal } from "src/types/general";

const Table = ({
  tableName,
  table,
  biaMappings,
  biaMatchedRows,
}: {
  tableName: string;
  table: any;
  biaMappings: any;
  biaMatchedRows: any;
}) => {
  const [selectedRowID, setSelectedRowID] = useState<string>("");
  const [showAllRows, setShowAllRows] = useState<boolean>(false);

  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <>
          <Disclosure.Button className="grid gap-3 p-4 bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 rounded-t-md">
            <h4>
              {tableName}{" "}
              <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />{" "}
            </h4>
          </Disclosure.Button>
          <Disclosure.Panel className="-mt-5">
            <section className="grid gap-3 p-4 bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 rounded-b-md">
              {biaMappings && (
                <button
                  className="px-3 py-1 dark:bg-admin dark:hover:bg-admin/60 duration-100 rounded-full"
                  onClick={() => setShowAllRows(!showAllRows)}
                >
                  {showAllRows ? "Hide rows with no mappings" : "Show all rows"}
                </button>
              )}
              <TableLayout flexibleHeaders>
                <thead className="sticky -top-1.5 z-10 bg-gradient-to-b dark:from-expand dark:to-table-header">
                  <tr>
                    {["Mappings", ...Object.keys(table[0])].map(
                      (col: string, colIndex: number) => {
                        if (col === "--row_id--") return null;
                        return (
                          <th
                            scope="col"
                            key={colIndex}
                            className="py-3 px-5 text-left font-semibold"
                          >
                            <p>{col}</p>
                          </th>
                        );
                      }
                    )}
                  </tr>
                </thead>
                <tbody>
                  {table?.map((row: KeyStringVal, rowIndex: number) => {
                    if (
                      !showAllRows &&
                      biaMappings &&
                      !biaMappings[row["--row_id--"]]
                    )
                      return null;
                    return (
                      <Fragment key={rowIndex}>
                        <tr
                          className={`relative p-5 gap-3 break-words ${
                            biaMatchedRows?.includes(row["--row_id--"])
                              ? "text-black bg-yellow-500"
                              : "dark:bg-card dark:even:bg-gradient-to-b from-panel to-panel/70"
                          }`}
                        >
                          {biaMappings ? (
                            biaMappings[row["--row_id--"]]?.length > 0 ? (
                              <td className="py-3 px-5">
                                <button
                                  className="w-max dark:hover:text-filter/60 duration-100"
                                  onClick={() => {
                                    if (selectedRowID !== "")
                                      setSelectedRowID("");
                                    else setSelectedRowID(row["--row_id--"]);
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={
                                      selectedRowID === row["--row_id--"]
                                        ? faEyeSlash
                                        : faEye
                                    }
                                  />{" "}
                                  {selectedRowID === row["--row_id--"]
                                    ? "Hide"
                                    : "View"}{" "}
                                  {biaMappings[row["--row_id--"]].length}{" "}
                                  mapping
                                  {biaMappings[row["--row_id--"]].length !==
                                    1 && "s"}
                                </button>
                              </td>
                            ) : (
                              <p className="py-3 px-5">No mappings</p>
                            )
                          ) : (
                            <td></td>
                          )}
                          {Object.keys(table[0]).map(
                            (col: string, index: number) => {
                              if (col === "--row_id--") return null;
                              return (
                                <td
                                  key={index}
                                  className="relative py-3 px-5 h-max text-left"
                                >
                                  <p>{row[col]}</p>
                                </td>
                              );
                            }
                          )}
                        </tr>
                        {selectedRowID === row["--row_id--"] && (
                          <tr
                            key={`${row.node_id}-expanded`}
                            className="relative py-5 px-10 gap-10 bg-gradient-to-b dark:from-expand dark:to-expand/60"
                          >
                            <td
                              colSpan={
                                ["Mappings", ...Object.keys(table[0])].length +
                                1
                              }
                              className="p-5 w-5"
                            >
                              <section className="grid gap-3">
                                <h4 className="text-base">
                                  {biaMappings[row["--row_id--"]].length}{" "}
                                  Mapping
                                  {biaMappings[row["--row_id--"]].length !==
                                    1 && "s"}
                                </h4>
                                <TableLayout>
                                  <thead className="sticky -top-1.5 z-10 bg-gradient-to-b dark:from-expand dark:to-table-header">
                                    <tr>
                                      {[
                                        ...Object.keys(
                                          JSON.parse(
                                            biaMappings[row["--row_id--"]][0]
                                              ?.row_content || ""
                                          )
                                        ),
                                        "confidence",
                                        "relevant matches",
                                      ].map((col: string, colIndex: number) => {
                                        return (
                                          <th
                                            scope="col"
                                            key={colIndex}
                                            className="py-3 px-5 text-left capitalize font-semibold"
                                          >
                                            <p>{col.replaceAll("_", " ")}</p>
                                          </th>
                                        );
                                      })}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {biaMappings[row["--row_id--"]].map(
                                      (row: any, rowIndex: number) => {
                                        return (
                                          <tr
                                            key={rowIndex}
                                            className="relative p-5 gap-3 break-words dark:bg-card dark:even:bg-gradient-to-b from-panel to-panel/70"
                                          >
                                            {[
                                              ...Object.keys(
                                                JSON.parse(
                                                  row?.row_content || ""
                                                )
                                              ),
                                              "confidence",
                                              "relevant matches",
                                            ].map(
                                              (col: string, index: number) => {
                                                if (col === "keywords")
                                                  return null;
                                                return (
                                                  <td
                                                    key={index}
                                                    className="relative py-3 px-5 h-max text-left"
                                                  >
                                                    <p className="flex flex-wrap items-center gap-1">
                                                      {col ===
                                                      "relevant matches"
                                                        ? row.keyword_match_count
                                                        : col === "confidence"
                                                        ? `${Math.round(
                                                            Number(
                                                              row.confidence
                                                            ) * 100
                                                          )}%`
                                                        : JSON.parse(
                                                            row?.row_content ||
                                                              ""
                                                          )
                                                            [col].split(" ")
                                                            .map(
                                                              (
                                                                word: string,
                                                                index: number
                                                              ) => (
                                                                <span
                                                                  key={index}
                                                                  className={`${
                                                                    row.keywords.some(
                                                                      (
                                                                        keyword: string
                                                                      ) =>
                                                                        keyword.toLowerCase() ===
                                                                        word.toLowerCase()
                                                                    )
                                                                      ? "text-black bg-yellow-500"
                                                                      : ""
                                                                  }`}
                                                                >
                                                                  {word}
                                                                </span>
                                                              )
                                                            )}
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
                              </section>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </TableLayout>
            </section>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Table;
