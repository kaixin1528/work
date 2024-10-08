/* eslint-disable no-restricted-globals */
import { Handle, Position } from "reactflow";
import { motion } from "framer-motion";
import { memo, useState } from "react";
import { MappingNodeData } from "src/types/grc";
import { useGRCStore } from "src/stores/grc";
import ModalLayout from "src/layouts/ModalLayout";
import { DeleteMapping, UpdateMapping } from "src/services/grc";
import {
  faThumbsDown,
  faThumbsUp,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetMappingFeedback, UpdateMappingFeedback } from "src/services/grc";
import { queryClient } from "src/App";
import { documentColors } from "src/constants/grc";

const Mapping = memo(({ data }: { data: MappingNodeData }) => {
  const curSubsectionID = data.sub_section_id || data.sub_section_title || "";

  const [editSubSectionID, setEditSubSectionID] = useState<boolean>(false);
  const [newSubsectionID, setNewSubsectionID] =
    useState<string>(curSubsectionID);
  const [deleteSectionID, setDeleteSectionID] = useState<string>("");

  const { selectedMappingNode, setSelectedMappingNode } = useGRCStore();

  const isCenter = data.center;

  const documentType = data.document_type || "";
  const documentID = isCenter
    ? sessionStorage.document_id
    : data.framework_id || data.policy_id || data.document_id || "";
  const mappingID = data.mapping_id || "";
  const selectedMappingNodeID = selectedMappingNode?.id;
  const showFeedback = selectedMappingNodeID === data.id;
  const thumbnailURI = isCenter
    ? sessionStorage.thumbnail_uri
    : data.thumbnail_uri;
  const nodeColor = isCenter
    ? documentType !== "policies"
      ? "dark:from-checkbox/70 dark:to-white/10"
      : "dark:from-admin/70 dark:to-white/10"
    : `${documentColors[data.documentColor as any]}`;

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

  const handleOnClose = () => setSelectedMappingNode(undefined);
  const handleUpdateMapping = () => {
    setEditSubSectionID(false);
    updateMapping.mutate({
      oldID: curSubsectionID,
      newID: newSubsectionID,
      mappingID: data.mapping_id,
      policyID: data.policy_id ? data.policy_id : data.document_id,
      frameworkID: data.framework_id ? data.framework_id : data.document_id,
    });
  };

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <section className="relative group grid h-max w-[30rem] cursor-pointer text-white rounded-2xl">
        <article
          className={`grid gap-2 px-4 pt-5 w-full bg-gradient-to-r ${nodeColor} rounded-t-2xl`}
        >
          {data.section_type && (
            <span className="text-2xl">{data.section_type}</span>
          )}
          <article className="flex items-start gap-2">
            {!isCenter && (
              <img
                src={thumbnailURI}
                alt={thumbnailURI}
                className="w-10 h-10 rounded-full"
              />
            )}
            <h2 className="text-4xl break-all">{data.document_name}</h2>
          </article>
        </article>
        <article
          className={`grid gap-3 p-4 bg-gradient-to-r ${nodeColor} rounded-b-2xl`}
        >
          {data.section_title && (
            <h4 className="text-xl dark:text-white">{data.section_title}</h4>
          )}
          <span>
            {data.sub_section_id} {data.sub_section_title}
          </span>
          <p className="p-3 dark:bg-black/60 rounded-md">
            {data.content?.slice(0, 100)}......
          </p>
        </article>
        <ModalLayout
          showModal={selectedMappingNodeID === data.id}
          onClose={handleOnClose}
        >
          <section className="relative grid gap-5 p-6 overflow-auto scrollbar">
            <header className="grid gap-2">
              <article className="flex items-center justify-between gap-5">
                {data.ip_score && (
                  <span className="italic font-extralight">
                    {data.ip_score} similar in meaning
                  </span>
                )}
                {!isCenter && data.user_email && (
                  <span>Added by {data.user_email}</span>
                )}
              </article>
              {data.section_type && (
                <span className="text-2xl">{data.section_type}</span>
              )}
              <article className="flex items-center justify-between gap-10">
                <article className="flex items-start gap-2">
                  {!isCenter && (
                    <img
                      src={thumbnailURI}
                      alt={thumbnailURI}
                      className="w-7 h-7 rounded-full"
                    />
                  )}
                  <h2 className="text-2xl break-words">{data.document_name}</h2>
                </article>
                <>
                  <button
                    disabled={deleting}
                    className="px-3 py-2 dark:disabled:bg-filter bg-reset hover:bg-reset/60 duration-100 rounded-full"
                    onClick={() => setDeleteSectionID(selectedMappingNodeID)}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                  {deleteSectionID === selectedMappingNodeID && (
                    <article className="absolute inset-x-0 top-10 left-1/2 -translate-x-1/2 text-center z-10">
                      <article className="grid w-full p-6 dark:text-white align-middle dark:bg-panel black-shadow">
                        <h5 className="font-medium leading-6">
                          Are you sure you want to remove this mapping?
                        </h5>
                        <article className="flex items-center gap-5 mt-4 mx-auto">
                          <button
                            type="button"
                            className="px-4 py-1 text-xs font-medium dark:bg-filter border border-transparent  dark:hover:bg-filter/70 duration-100 focus:outline-none"
                            onClick={() => setDeleteSectionID("")}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={deleting}
                            className="px-4 py-1 text-xs font-medium dark:disabled:bg-filter dark:bg-validation border border-transparent dark:hover:bg-validation/70 duration-100 focus:outline-none"
                            onClick={() => {
                              deleteMapping.mutate({
                                mappingID: mappingID,
                              });
                              setDeleteSectionID("");
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
              {data.section_title && (
                <h3 className="text-base">{data.section_title}</h3>
              )}
              <span className="flex items-start gap-2 text-lg">
                {editSubSectionID ? (
                  <input
                    type="input"
                    value={newSubsectionID}
                    onChange={(e) => setNewSubsectionID(e.target.value)}
                    onBlur={() => handleUpdateMapping()}
                    onKeyUp={(e) => {
                      if (e.key === "Enter") handleUpdateMapping();
                    }}
                    className="p-2 w-max dark:bg-filter/30 focus:outline-none rounded-md"
                  />
                ) : isCenter ? (
                  <p>{curSubsectionID}</p>
                ) : data.document_type === documentType ? (
                  <p> {curSubsectionID}</p>
                ) : (
                  <button
                    className="p-2 w-max dark:hover:bg-filter/30 duration-100 rounded-md"
                    onClick={() => setEditSubSectionID(true)}
                  >
                    {curSubsectionID}
                  </button>
                )}{" "}
                {data.sub_section_title}
              </span>
            </header>
            {mappingID && (
              <article className="flex items-center gap-5">
                <p>Is this mapping accurate?</p>
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
                        className={`${
                          icon === feedback
                            ? "dark:text-no dark:hover:text-no/60"
                            : icon === feedback
                            ? "red-button"
                            : "dark:text-checkbox dark:hover:text-checkbox/60"
                        } duration-100`}
                      />
                    </button>
                  );
                })}
              </article>
            )}
            {data.content ? (
              <p className="grid gap-1 p-3 text-base dark:bg-black/60 rounded-md">
                {data.content
                  .split("\n")
                  .map((phrase: string, index: number) => (
                    <span key={index}>{phrase}</span>
                  ))}
              </p>
            ) : (
              <p>No content available</p>
            )}
            {(data.extracted_tags as string[])?.length > 0 && (
              <ul className="flex flex-wrap items-center gap-2">
                {data.extracted_tags?.map((tag: string) => (
                  <li
                    key={tag}
                    className="px-4 py-1 selected-button rounded-md"
                  >
                    {tag}
                  </li>
                ))}
                {data.secondary_tags?.map((tag: string) => (
                  <li
                    key={tag}
                    className="px-4 py-1 dark:bg-filter/30 border dark:border-filter rounded-md"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </ModalLayout>
      </section>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </motion.section>
  );
});

export default Mapping;
