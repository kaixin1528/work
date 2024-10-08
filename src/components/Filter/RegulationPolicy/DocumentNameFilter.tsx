/* eslint-disable no-restricted-globals */
import { motion } from "framer-motion";
import { filterVariants } from "../../../constants/general";
import DropdownLayout from "../../../layouts/DropdownLayout";
import { KeyStringVal } from "src/types/general";

const DocumentNameFilter = ({
  newMapping,
  setNewMapping,
  list,
}: {
  newMapping: KeyStringVal;
  setNewMapping: (newMapping: KeyStringVal) => void;
  list: KeyStringVal[];
}) => {
  return (
    <DropdownLayout
      label="Document Name"
      value={newMapping.source_document_name}
      width="w-[30rem]"
      placeholder="Select document"
    >
      {list?.map((document: KeyStringVal, index: number) => {
        const sourceDocID = document.id || document.policy_id;
        return (
          <motion.button
            key={index}
            variants={filterVariants}
            className={`relative px-7 py-1 w-full break-all text-left dark:hover:bg-filter/50 ${
              newMapping.source_document_id === sourceDocID
                ? "dark:bg-filter"
                : ""
            } duration-100`}
            onClick={() =>
              setNewMapping({
                ...newMapping,
                source_document_name: document.name || document.policy_name,
                source_document_id: sourceDocID,
                source_version_id: document.latest_version_id || "",
              })
            }
          >
            <p>{document.name || document.policy_name}</p>
          </motion.button>
        );
      })}
    </DropdownLayout>
  );
};

export default DocumentNameFilter;
