/* eslint-disable no-restricted-globals */
import { motion } from "framer-motion";
import { filterVariants } from "../../../constants/general";
import DropdownLayout from "../../../layouts/DropdownLayout";
import { KeyStringVal } from "src/types/general";

const DocumentSectionFilter = ({
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
      label="Document Section"
      value={
        newMapping.source_section_id === ""
          ? ""
          : `${newMapping.source_section_id}. ${newMapping.source_section_title}`
      }
      width="w-[30rem]"
      placeholder="Select section"
    >
      {list?.map((section: KeyStringVal, index: number) => (
        <motion.button
          key={index}
          variants={filterVariants}
          className={`relative px-7 py-1 w-full break-all text-left dark:hover:bg-filter/50 ${
            newMapping.source_generated_id === section.generated_id
              ? "dark:bg-filter"
              : ""
          } duration-100`}
          onClick={() =>
            setNewMapping({
              ...newMapping,
              source_section_id: section.sub_section_id,
              source_section_title: section.sub_section_title,
              source_section_generated_id: section.generated_id,
              content: section.content,
            })
          }
        >
          <p>
            {section.sub_section_id}. {section.sub_section_title}
          </p>
        </motion.button>
      ))}
    </DropdownLayout>
  );
};

export default DocumentSectionFilter;
