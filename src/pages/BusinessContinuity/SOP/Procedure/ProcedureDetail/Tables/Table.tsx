/* eslint-disable react-hooks/exhaustive-deps */
import {
  faChevronDown,
  faChevronUp,
  faExclamationTriangle,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure, Popover, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import TableLayout from "src/layouts/TableLayout";
import { KeyStringVal } from "src/types/general";
import { ApproveTable, EditTable, MergeColumns } from "src/services/grc";
import ViewInFile from "src/pages/RegulationPolicy/Document/ViewInFile/ViewInFile";
import { attributeColors } from "src/constants/general";
import { checkGRCAdmin, decodeJWT } from "src/utils/general";
import {
  AddTableActivity,
  RemoveTableActivity,
} from "src/services/business-continuity/sop";

const Table = ({
  sopID,
  versionID,
  table,
}: {
  sopID: string;
  versionID: string;
  table: any;
}) => {
  const isGrcAdmin = checkGRCAdmin();
  const jwt = decodeJWT();

  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [editedTable, setEditedTable] = useState<any>(table);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const editTable = EditTable(sopID);
  const approveTable = ApproveTable(table.generated_id);
  const addTableActivity = AddTableActivity(versionID);
  const removeTableActivity = RemoveTableActivity(versionID);

  const tableID = editedTable?.table_id;

  const mergeColumns = MergeColumns(versionID, tableID, editedTable?.version);

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
          <Disclosure.Button className="grid gap-3 p-4 bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 rounded-t-md">
            <article className="flex items-center justify-between gap-10 border-b-1 dark:border-yellow-500">
              <article className="flex items-center gap-5 mb-1">
                {editedTable?.page_metadata?.length > 0 &&
                  editedTable?.page_metadata[0].pageNumber && (
                    <span>Page {editedTable?.page_metadata[0].pageNumber}</span>
                  )}
                <button
                  className={`px-3 py-1 ${
                    table.marked_in_activity
                      ? "dark:bg-reset/30 dark:hover:bg-reset/60 duration-100 border dark:border-reset"
                      : "dark:bg-signin/30 dark:hover:bg-signin/60 duration-100 border dark:border-signin"
                  } rounded-md`}
                  onClick={() => {
                    if (table.marked_in_activity)
                      removeTableActivity.mutate({
                        tableIDs: [tableID],
                      });
                    else
                      addTableActivity.mutate({
                        tableIDs: [tableID],
                      });
                  }}
                >
                  {table.marked_in_activity
                    ? "Remove table from impact analysis"
                    : "Add table for impact analysis"}
                </button>
              </article>
              <article className="flex items-center gap-5">
                <article className="flex items-center gap-2">
                  {table.coverage <= 80 && (
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="text-event"
                    />
                  )}
                  <span>Coverage: {table.coverage} %</span>
                </article>
                <span>Version {table.version}</span>
                <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
              </article>
            </article>
            {!open && (
              <table className="table-auto">
                <thead className="sticky bg-gradient-to-b dark:from-expand dark:to-table-header">
                  <tr>
                    {editedTable?.headers.map(
                      (col: KeyStringVal, colIndex: number) => {
                        return (
                          <th
                            scope="col"
                            key={colIndex}
                            className="py-3 px-5 text-left font-semibold"
                          >
                            {col.display_name}
                          </th>
                        );
                      }
                    )}
                  </tr>
                </thead>
              </table>
            )}
          </Disclosure.Button>
          <Disclosure.Panel className="-mt-5">
            <section className="grid gap-3 p-4 bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 rounded-b-md">
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
              <article className="flex items-center justify-self-end gap-5">
                {!approved && !nonReviewers && (
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
                  {table.status === "PARSED"
                    ? "Auto Extracted By Uno"
                    : table.status}
                </span>
              </article>
              <article className="flex items-center justify-between gap-10">
                <ViewInFile
                  generatedID={tableID}
                  section={editedTable}
                  bbox={editedTable.page_metadata}
                  scrollAtTop
                />
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
              <TableLayout>
                <thead className="sticky bg-gradient-to-b dark:from-expand dark:to-table-header">
                  <tr>
                    {editedTable?.headers.map(
                      (col: KeyStringVal, colIndex: number) => {
                        return (
                          <th
                            scope="col"
                            key={colIndex}
                            className="py-3 px-5 text-left font-semibold"
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
                                    row[e.target.value] = row[col.display_name];
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
                                if (selectedColumns.includes(col.property_name))
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
                            (col: KeyStringVal, index: number) => {
                              return (
                                <td
                                  key={index}
                                  className="relative py-3 px-5 h-max text-left"
                                >
                                  <textarea
                                    value={row[col.property_name]}
                                    disabled={approved || nonReviewers}
                                    className="w-9/12 h-[6rem] px-5 text-sm bg-transparent focus:outline-none border-none focus:ring-1 dark:focus:ring-signin resize-none rounded-md overflow-auto scrollbar"
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
                                  {!(approved || nonReviewers) &&
                                    index ===
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
                                          <FontAwesomeIcon icon={faTrashCan} />
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
        </>
      )}
    </Disclosure>
  );
};

export default Table;
