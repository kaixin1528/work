import {
  faThumbsUp,
  faThumbsDown,
  faChevronDown,
  faChevronUp,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment, useState } from "react";
import { queryClient } from "src/App";
import {
  DeleteMapping,
  GetMappingFeedback,
  UpdateMapping,
  UpdateMappingFeedback,
} from "src/services/grc";
import { KeyStringVal, ListHeader } from "src/types/general";
import { convertToUTCString, parseURL } from "src/utils/general";

const MappingRowDetail = ({
  mapping,
  row,
  index,
}: {
  mapping: any;
  row: any;
  index: number;
}) => {
  const parsed = parseURL();

  const [selectedExpand, setSelectedExpand] = useState<number>(-1);
  const [editSubSectionID, setEditSubSectionID] = useState<number>(-1);
  const [newSubsectionID, setNewSubsectionID] = useState<string>("");
  const [deleteSectionID, setDeleteSectionID] = useState<number>(-1);

  const documentType = row.framework_name ? "frameworks" : "policies";
  const documentID = row.framework_id
    ? row.framework_id
    : row.policy_id
    ? row.policy_id
    : "";
  const mappingID = row.mapping_id || "";
  const showFeedback = selectedExpand === index;

  const updateMapping = UpdateMapping();
  const { data: feedback } = GetMappingFeedback(
    documentType,
    documentID,
    mappingID,
    showFeedback
  );
  const updateMappingFeedback = UpdateMappingFeedback(documentType, documentID);
  const deleteMapping = DeleteMapping();
  const deleting = deleteMapping.status === "loading";

  const handleUpdateMapping = (row: KeyStringVal) => {
    setEditSubSectionID(-1);
    updateMapping.mutate({
      oldID: row.sub_section_id,
      newID: newSubsectionID,
      mappingID: row.mapping_id,
      policyID: row.policy_id ? row.policy_id : parsed.document_id,
      frameworkID: row.framework_id ? row.framework_id : parsed.document_id,
    });
  };

  return (
    <Fragment>
      <tr
        className={`px-4 py-2 ${
          selectedExpand === index
            ? "dark:bg-expand border-b dark:border-filter/80"
            : "dark:bg-card dark:even:bg-gradient-to-b from-panel to-panel/70 dark:hover:bg-gradient-to-b dark:hover:from-expand dark:hover:to-filter/60"
        }`}
      >
        {mapping.header.map((col: ListHeader, colIndex: number) => {
          return (
            <td
              key={col.property_name}
              className="relative py-3 px-3 last:pr-16 text-left break-words"
            >
              {col.data_type === "time" ? (
                convertToUTCString(row[col.property_name])
              ) : col.data_type === "list" ? (
                <ul className="grid list-disc px-4">
                  {row[col.property_name].map((value: string) => (
                    <li key={value}>{value}</li>
                  ))}
                </ul>
              ) : col.property_name === "sub_section_id" ? (
                editSubSectionID === index ? (
                  <input
                    type="input"
                    value={newSubsectionID}
                    onChange={(e) => setNewSubsectionID(e.target.value)}
                    onBlur={() => handleUpdateMapping(row)}
                    onKeyUp={(e) => {
                      if (e.key === "Enter") handleUpdateMapping(row);
                    }}
                    className="p-2 w-max dark:bg-filter/30 bg-transparent focus:outline-none"
                  />
                ) : parsed.document_type === documentType ? (
                  <p> {row.sub_section_id}</p>
                ) : (
                  <button
                    className="p-2 w-max dark:hover:bg-filter/30 duration-100 rounded-md"
                    onClick={() => {
                      setEditSubSectionID(index);
                      setNewSubsectionID(row.sub_section_id);
                    }}
                  >
                    {row.sub_section_id}
                  </button>
                )
              ) : (
                <p>{row[col.property_name]}</p>
              )}
              {colIndex === mapping.header.length - 1 && (
                <button
                  className="absolute right-5 top-1/3 w-6 h-6 dark:hover:text-clear dark:text-checkbox duration-100 justify-self-end cursor-pointer"
                  onMouseUp={(e) => {
                    if (selectedExpand === index) setSelectedExpand(-1);
                    else setSelectedExpand(index);
                  }}
                >
                  <FontAwesomeIcon
                    icon={
                      selectedExpand === index ? faChevronUp : faChevronDown
                    }
                  />
                </button>
              )}
            </td>
          );
        })}
      </tr>
      {selectedExpand === index && (
        <tr className="relative py-5 px-10 gap-10 bg-gradient-to-b dark:from-expand dark:to-expand/60">
          <td colSpan={mapping.header.length + 1} className="p-5 w-5">
            <section className="grid content-start gap-5">
              <article className="flex items-center gap-5 w-full">
                {mappingID && (
                  <article className="flex items-cneter gap-5">
                    {[1, -1].map((icon, index) => {
                      return (
                        <button
                          key={index}
                          onClick={() =>
                            updateMappingFeedback.mutate(
                              {
                                mappingID: mappingID,
                                feedback: feedback === icon ? 0 : icon,
                              },
                              {
                                onSuccess: () =>
                                  queryClient.invalidateQueries([
                                    "get-mapping-feedback",
                                    documentType,
                                    documentID,
                                    mappingID,
                                    showFeedback,
                                  ]),
                              }
                            )
                          }
                        >
                          <FontAwesomeIcon
                            icon={icon === 1 ? faThumbsUp : faThumbsDown}
                            className={`w-5 h-5 ${
                              icon === feedback
                                ? "dark:text-no dark:hover:text-no/60"
                                : icon === feedback
                                ? "red-button"
                                : "dark:text-checkbox dark:hover:text-checkbox/60"
                            }  duration-100`}
                          />
                        </button>
                      );
                    })}
                  </article>
                )}
                <article className="flex items-center gap-5">
                  {row.user_email && <span>Added by {row.user_email}</span>}
                  <>
                    <button
                      disabled={deleting}
                      className="px-3 py-2 dark:disabled:bg-filter bg-reset hover:bg-reset/60 duration-100 rounded-full"
                      onClick={() => setDeleteSectionID(index)}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                    {deleteSectionID === index && (
                      <article className="absolute inset-x-0 left-1/2 -translate-x-1/2 text-center z-10">
                        <article className="grid w-full p-6 dark:text-white align-middle dark:bg-panel black-shadow">
                          <h5 className="font-medium leading-6">
                            Are you sure you want to remove this mapping?
                          </h5>
                          <article className="flex items-center gap-5 mt-4 mx-auto">
                            <button
                              type="button"
                              className="px-4 py-1 text-xs font-medium dark:bg-filter border border-transparent  dark:hover:bg-filter/70 duration-100 focus:outline-none"
                              onClick={() => setDeleteSectionID(-1)}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              disabled={deleting}
                              className="px-4 py-1 text-xs font-medium dark:disabled:bg-filter dark:bg-validation border border-transparent  dark:hover:bg-validation/70 duration-100 focus:outline-none"
                              onClick={() => {
                                deleteMapping.mutate({
                                  mappingID: mappingID,
                                });
                                setSelectedExpand(-1);
                                setDeleteSectionID(-1);
                              }}
                            >
                              Confirm Remove
                            </button>
                          </article>
                        </article>
                      </article>
                    )}
                  </>
                </article>
              </article>
              {row.content && (
                <p className="grid gap-2 p-3 dark:bg-black/60 rounded-md">
                  {row.content
                    .split("\n")
                    .map((phrase: string, index: number) => (
                      <span key={index}>{phrase}</span>
                    ))}
                </p>
              )}{" "}
              {row.extracted_tags?.length > 0 && (
                <article className="grid content-start gap-2 mt-5 text-xs">
                  <h4>Tags</h4>
                  <ul className="flex flex-wrap items-center gap-2">
                    {row.extracted_tags.map((tag: string) => (
                      <li
                        key={tag}
                        className="px-4 py-1 selected-button rounded-md"
                      >
                        {tag}
                      </li>
                    ))}
                    {row.secondary_tags?.map((tag: string) => (
                      <li
                        key={tag}
                        className="px-4 py-1 dark:bg-checkbox/30 border dark:border-checkbox rounded-md"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </article>
              )}
            </section>
          </td>
        </tr>
      )}
    </Fragment>
  );
};

export default MappingRowDetail;
