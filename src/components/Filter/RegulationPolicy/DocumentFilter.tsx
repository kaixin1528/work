/* eslint-disable no-restricted-globals */
import { motion } from "framer-motion";
import { filterVariants } from "../../../constants/general";
import DropdownLayout from "../../../layouts/DropdownLayout";
import { KeyStringVal } from "src/types/general";

const DocumentFilter = ({
  selectedDocument,
  setSelectedDocument,
  list,
}: {
  selectedDocument: KeyStringVal;
  setSelectedDocument: (selectedDocument: KeyStringVal) => void;
  list: KeyStringVal[];
}) => {
  return (
    <DropdownLayout
      value={selectedDocument.document_name}
      width="w-[30rem]"
      placeholder="Select mapped document"
    >
      {list?.map((document: KeyStringVal, index: number) => (
        <motion.button
          key={index}
          variants={filterVariants}
          className={`relative px-7 py-1 w-full break-all text-left dark:hover:bg-filter/50 ${
            document.document_name === selectedDocument.document_name
              ? "dark:bg-filter"
              : ""
          } duration-100`}
          onClick={() => setSelectedDocument(document)}
        >
          <p>{document.document_name}</p>
        </motion.button>
      ))}
    </DropdownLayout>
  );
};

export default DocumentFilter;
