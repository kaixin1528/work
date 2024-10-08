/* eslint-disable react-hooks/exhaustive-deps */
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure, Popover, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import TableLayout from "src/layouts/TableLayout";
import { KeyStringVal } from "src/types/general";
import ViewInFile from "../../ViewInFile/ViewInFile";
import { ApproveTable, EditTable, MergeColumns } from "src/services/grc";
import { attributeColors } from "src/constants/general";
import { checkGRCAdmin, decodeJWT } from "src/utils/general";

const Table = ({ documentID, table }: { documentID: string; table: any }) => {
  const isGrcAdmin = checkGRCAdmin();
  const jwt = decodeJWT();

  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [selectedRowValue, setSelectedRowValue] = useState<string>("");
  const [editedTable, setEditedTable] = useState<any>(table);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const editTable = EditTable(documentID);
  const approveTable = ApproveTable(table.generated_id);

  const tableID = editedTable?.table_id;
  const versionID = editedTable?.version;

  const mergeColumns = MergeColumns(documentID, tableID, versionID);

  const approved = editedTable?.status === "APPROVED";
  const nonReviewers = !(isGrcAdmin || table.reviewers?.includes(jwt?.sub));

  const handlePopulateTable = () => {
    if (table?.headers?.length === 0) {
      const newHeaders =
        Object.keys(table.data[0])?.length > 0
          ? Object.keys(table.data[0])
          : ["0"];
      setEditedTable({
        ...table,
        data: table.data?.map((row: KeyStringVal) => {
          return Object.fromEntries(
            newHeaders.map((key) => [key, row[key] || ""])
          );
        }),
        headers: newHeaders?.map((key, colIndex) => {
          return {
            display_name: key,
            property_name: colIndex,
            data_type: "string",
          };
        }),
      });
    } else
      setEditedTable({
        ...table,
        headers: table.headers?.map((col: KeyStringVal, colIndex: number) => {
          return {
            ...col,
            property_name: colIndex,
          };
        }),
      });
  };

  const handleEdit = () => {
    if (!isEdited) setIsEdited(true);
  };

  const handleDiscard = () => {
    setSelectedRowValue("");
    setIsEdited(false);
    handlePopulateTable();
  };

  useEffect(() => {
    handlePopulateTable();
  }, [table]);

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex items-center justify-between gap-10 w-full p-4 bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 dark:hover:to-white/30 rounded-t-md">
            <article className="flex items-center gap-5">
              {editedTable?.page_metadata?.length > 0 &&
                editedTable?.page_metadata[0].pageNumber && (
                  <span className="w-max border-t-1 dark:border-yellow-500">
                    Page {editedTable?.page_metadata[0].pageNumber}
                  </span>
                )}
              <ViewInFile
                generatedID={tableID}
                section={editedTable}
                bbox={editedTable.page_metadata}
                scrollAtTop
              />
              {isEdited && (
                <article className="flex items-center justify-self-end gap-2">
                  <button className="discard-button" onClick={handleDiscard}>
                    Discard
                  </button>
                  <button
                    className="save-button"
                    onClick={() => {
                      editTable.mutate({
                        table: editedTable,
                        version: Number(table.version) + 1,
                        approvers: table.approvers,
                        reviewers: table.reviewers,
                      });
                      handleDiscard();
                    }}
                  >
                    Save
                  </button>
                </article>
              )}
              {selectedColumns.length > 0 && (
                <article className="flex items-center gap-5">
                  <button
                    className="discard-button"
                    onClick={() => setSelectedColumns([])}
                  >
                    Discard
                  </button>
                  <button
                    className="save-button"
                    onClick={() =>
                      mergeColumns.mutate({
                        columns: selectedColumns,
                      })
                    }
                  >
                    Merge Columns
                  </button>
                </article>
              )}
            </article>
            <article className="flex items-center gap-5">
              <span>Version {table.version}</span>
              {!approved && table.reviewers?.includes(jwt?.sub) && (
                <button
                  className="px-3 py-1 dark:bg-event/30 dark:hover:bg-event/60 duration-100 border dark:border-event rounded-md"
                  onClick={() =>
                    approveTable.mutate({
                      approvers: [jwt?.sub],
                    })
                  }
                >
                  Approve
                </button>
              )}
              <span
                className={`${attributeColors[table.status?.toLowerCase()]}`}
              >
                {table.status}
              </span>
            </article>
          </Disclosure.Button>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel>
              <section className="grid gap-3 p-4 -mt-5 bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 rounded-b-md">
                <TableLayout>
                  <thead className="sticky -top-1.5 z-10 bg-gradient-to-b dark:from-expand dark:to-table-header">
                    <tr>
                      {editedTable?.headers.map(
                        (col: KeyStringVal, colIndex: number) => {
                          return (
                            <th
                              scope="col"
                              key={colIndex}
                              className="p-3 text-left font-semibold"
                            >
                              <input
                                type="input"
                                value={col.display_name}
                                autoFocus={isClicked}
                                disabled={approved || nonReviewers}
                                className={`w-full py-2 px-5 text-sm bg-transparent focus:outline-none border-none ${
                                  selectedColumns.includes(col.property_name)
                                    ? "ring-1 dark:ring-signin"
                                    : "focus:ring-1 dark:focus:ring-signin"
                                } rounded-md`}
                                onChange={(e) => {
                                  handleEdit();
                                  setEditedTable({
                                    ...editedTable,
                                    data: editedTable.data.map((row: any) => {
                                      row[e.target.value] =
                                        row[col.display_name];
                                      delete row[col.display_name];
                                      return row;
                                    }),
                                    headers: editedTable.headers.map(
                                      (
                                        column: KeyStringVal,
                                        curColIndex: number
                                      ) => {
                                        if (curColIndex === colIndex)
                                          return {
                                            ...column,
                                            display_name: e.target.value,
                                          };
                                        return column;
                                      }
                                    ),
                                  });
                                }}
                                onClick={() => {
                                  if (!isClicked) setIsClicked(true);
                                  if (
                                    selectedColumns.includes(col.property_name)
                                  )
                                    setSelectedColumns(
                                      selectedColumns.filter(
                                        (curCol) => curCol !== col.property_name
                                      )
                                    );
                                  else {
                                    const newColumns = selectedColumns.splice(
                                      colIndex,
                                      0,
                                      col.property_name
                                    );
                                    setSelectedColumns(newColumns);
                                  }
                                }}
                              />
                            </th>
                          );
                        }
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {editedTable?.data?.map(
                      (row: KeyStringVal, rowIndex: number) => {
                        return (
                          <tr
                            key={rowIndex}
                            className="relative p-5 gap-3 break-words dark:bg-card dark:even:bg-gradient-to-b from-panel to-panel/70"
                          >
                            {editedTable.headers.map(
                              (col: KeyStringVal, colIndex: number) => {
                                const textWidth =
                                  colIndex === editedTable.headers.length - 1
                                    ? "w-10/12"
                                    : "w-11/12";
                                return (
                                  <td
                                    key={colIndex}
                                    className="relative p-3 h-max text-left text-sm"
                                  >
                                    {selectedRowValue ===
                                    `${rowIndex}-${colIndex}` ? (
                                      <textarea
                                        value={row[col.property_name]}
                                        autoFocus
                                        className={`${textWidth} ${
                                          row[col.property_name]?.length >= 500
                                            ? "h-[20rem]"
                                            : "h-[10rem]"
                                        }  px-5 bg-transparent focus:outline-none border-none focus:ring-1 dark:focus:ring-signin resize-none rounded-md overflow-auto scrollbar`}
                                        onChange={(e) => {
                                          handleEdit();
                                          setEditedTable({
                                            ...editedTable,
                                            data: editedTable.data.map(
                                              (row: any, index: number) => {
                                                if (rowIndex === index)
                                                  return {
                                                    ...row,
                                                    [col.property_name]:
                                                      e.target.value,
                                                  };
                                                else return row;
                                              }
                                            ),
                                          });
                                        }}
                                      />
                                    ) : (
                                      <button
                                        disabled={approved || nonReviewers}
                                        className={`p-3 ${textWidth} text-left dark:disabled:hover:bg-transparent dark:hover:bg-filter/30 duration-100 rounded-md`}
                                        onClick={() =>
                                          setSelectedRowValue(
                                            `${rowIndex}-${colIndex}`
                                          )
                                        }
                                      >
                                        {row[col.property_name]}
                                      </button>
                                    )}
                                    {!(approved || nonReviewers) &&
                                      colIndex ===
                                        editedTable.headers.length - 1 && (
                                        <article className="absolute right-5 top-1/3 flex items-center">
                                          <Popover className="relative">
                                            <Popover.Button className="w-6 h-6 dark:text-signin dark:hover:text-signin/60 duration-100 rounded-md">
                                              <FontAwesomeIcon icon={faPlus} />
                                            </Popover.Button>
                                            <Transition
                                              as={Fragment}
                                              enter="transition ease-out duration-100"
                                              enterFrom="opacity-0 translate-y-1"
                                              enterTo="opacity-100 translate-y-0"
                                              leave="transition ease-in duration-150"
                                              leaveFrom="opacity-100 translate-y-0"
                                              leaveTo="opacity-0 translate-y-1"
                                            >
                                              <Popover.Panel className="absolute px-4 -right-2 w-max z-10">
                                                <article className="grid gap-1 px-4 py-2 text-xs divide-y dark:divide-checkbox bg-gradient-to-b dark:from-[#577399] dark:to-[#495867]">
                                                  <button
                                                    className="text-left dark:hover:text-gray-300/50 dark:disabled:text-gray-300/30 duration-100"
                                                    onClick={() => {
                                                      handleEdit();
                                                      const newRow =
                                                        editedTable.headers.reduce(
                                                          (
                                                            pV: KeyStringVal,
                                                            cV: KeyStringVal
                                                          ) => ({
                                                            ...pV,
                                                            [cV.property_name]:
                                                              "",
                                                          }),
                                                          {}
                                                        );
                                                      setEditedTable({
                                                        ...editedTable,
                                                        data: [
                                                          ...editedTable.data.slice(
                                                            0,
                                                            rowIndex
                                                          ),
                                                          newRow,
                                                          ...editedTable.data.slice(
                                                            rowIndex
                                                          ),
                                                        ],
                                                      });
                                                    }}
                                                  >
                                                    Add row above
                                                  </button>
                                                  <button
                                                    className="pt-1 text-left dark:hover:text-gray-300/50 dark:disabled:text-gray-300/30 duration-100"
                                                    onClick={() => {
                                                      handleEdit();
                                                      const newRow =
                                                        editedTable.headers.reduce(
                                                          (
                                                            pV: KeyStringVal,
                                                            cV: KeyStringVal
                                                          ) => ({
                                                            ...pV,
                                                            [cV.property_name]:
                                                              "",
                                                          }),
                                                          {}
                                                        );
                                                      setEditedTable({
                                                        ...editedTable,
                                                        data: [
                                                          ...editedTable.data.slice(
                                                            0,
                                                            rowIndex + 1
                                                          ),
                                                          newRow,
                                                          ...editedTable.data.slice(
                                                            rowIndex + 1
                                                          ),
                                                        ],
                                                      });
                                                    }}
                                                  >
                                                    Add row below
                                                  </button>
                                                </article>
                                              </Popover.Panel>
                                            </Transition>
                                          </Popover>
                                          <button
                                            className="w-6 h-6 dark:hover:text-reset/60 duration-100 dark:text-reset justify-self-end cursor-pointer"
                                            onClick={() => {
                                              handleEdit();
                                              setEditedTable({
                                                ...editedTable,
                                                data: editedTable.data.filter(
                                                  (
                                                    _: KeyStringVal,
                                                    curRowIndex: number
                                                  ) => curRowIndex !== rowIndex
                                                ),
                                              });
                                            }}
                                          >
                                            <FontAwesomeIcon
                                              icon={faTrashCan}
                                            />
                                          </button>
                                        </article>
                                      )}
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
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

export default Table;
