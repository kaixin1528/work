/* eslint-disable no-restricted-globals */
import { motion } from "framer-motion";
import { filterVariants } from "../../../constants/general";
import DropdownLayout from "../../../layouts/DropdownLayout";
import { KeyStringVal } from "src/types/general";

const SelectFrameworkFilter = ({
  label,
  selectedFramework,
  setSelectedFramework,
  list,
  selectedTextSize,
  width,
}: {
  label?: string;
  selectedFramework: KeyStringVal;
  setSelectedFramework: (selectedFramework: KeyStringVal) => void;
  list: KeyStringVal[];
  selectedTextSize?: string;
  width?: string;
}) => {
  return (
    <DropdownLayout
      label={label}
      value={selectedFramework.name}
      width={`${width ? width : "w-full"}`}
      placeholder="Select framework"
      selectedTextSize={selectedTextSize}
    >
      {list?.map((document: KeyStringVal, index: number) => (
        <motion.button
          key={index}
          variants={filterVariants}
          className={`relative flex items-center gap-2 px-7 py-3 w-full break-all text-left dark:hover:bg-filter/50 ${
            document.name === selectedFramework.name ? "dark:bg-filter" : ""
          } duration-100`}
          onClick={() => setSelectedFramework(document)}
        >
          <img
            src={document.thumbnail_uri}
            alt={document.name}
            className="w-6 h-6 rounded-full"
          />
          <p>{document.name}</p>
        </motion.button>
      ))}
    </DropdownLayout>
  );
};

export default SelectFrameworkFilter;
