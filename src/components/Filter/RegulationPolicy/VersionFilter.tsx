/* eslint-disable no-restricted-globals */
import { motion } from "framer-motion";
import { filterVariants } from "../../../constants/general";
import DropdownLayout from "../../../layouts/DropdownLayout";
import { KeyStringVal } from "src/types/general";

const VersionFilter = ({
  selectedChange,
  setSelectedChange,
  list,
  type,
}: {
  selectedChange: KeyStringVal;
  setSelectedChange: (selectedDocument: KeyStringVal) => void;
  list: KeyStringVal[];
  type: string;
}) => {
  const key = `${type}_version`;
  return (
    <DropdownLayout value={selectedChange[key]} placeholder="Select version">
      {list?.map((version: KeyStringVal, index: number) => (
        <motion.button
          key={index}
          variants={filterVariants}
          className={`relative px-7 py-1 w-full break-all text-left dark:hover:bg-filter/50 ${
            version[key] === selectedChange[key] ? "dark:bg-filter" : ""
          } duration-100`}
          onClick={() =>
            setSelectedChange({
              ...selectedChange,
              [key]: version[key],
              [`${type}_version_id`]: version[`${type}_version_id`],
            })
          }
        >
          <p>{version[key]}</p>
        </motion.button>
      ))}
    </DropdownLayout>
  );
};

export default VersionFilter;
