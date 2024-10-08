/* eslint-disable no-restricted-globals */
import { motion } from "framer-motion";
import { filterVariants } from "../../../constants/general";
import DropdownLayout from "../../../layouts/DropdownLayout";

const ActionsFilter = ({
  value,
  setValue,
  list,
}: {
  value: string;
  setValue: (value: string) => void;
  list: string[];
}) => {
  return (
    <DropdownLayout value={value}>
      {list?.map((item: string, index: number) => (
        <motion.button
          key={index}
          variants={filterVariants}
          className={`relative py-1 px-7 text-left break-all dark:hover:bg-filter/50 ${
            value === item ? "dark:bg-filter" : ""
          } duration-100`}
          onClick={() => setValue(item)}
        >
          <p>{item}</p>
        </motion.button>
      ))}
    </DropdownLayout>
  );
};

export default ActionsFilter;
