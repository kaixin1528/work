/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { motion } from "framer-motion";
import { filterVariants } from "../../../constants/general";
import DropdownLayout from "../../../layouts/DropdownLayout";
import { convertToUTCString } from "src/utils/general";

const TimestampFilter = ({
  label,
  list,
  value,
  setValue,
}: {
  label?: string;
  list: number[];
  value: number;
  setValue: (value: number) => void;
}) => {
  return (
    <DropdownLayout label={label} value={value} timestamp>
      {list?.map((item: number) => (
        <motion.button
          key={item}
          variants={filterVariants}
          className={`relative py-1 px-7 text-left dark:hover:bg-filter/50 ${
            value === item ? "dark:bg-filter" : ""
          } duration-100`}
          onClick={() => setValue(item)}
        >
          <p>{convertToUTCString(item)}</p>
        </motion.button>
      ))}
    </DropdownLayout>
  );
};

export default TimestampFilter;
