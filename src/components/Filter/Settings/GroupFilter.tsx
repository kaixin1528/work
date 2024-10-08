/* eslint-disable no-restricted-globals */
import { motion } from "framer-motion";
import { filterVariants } from "../../../constants/general";
import DropdownLayout from "../../../layouts/DropdownLayout";
import { Group, UserDetails } from "../../../types/settings";

const GroupFilter = ({
  allGroups,
  details,
  label,
  value,
  setValue,
  list,
}: {
  allGroups: Group[];
  details: UserDetails;
  label: string;
  value: string;
  setValue: (value: UserDetails) => void;
  list: string[];
}) => {
  return (
    <DropdownLayout label={label} value={value} showAbove>
      {list?.map((item: string, index: number) => (
        <motion.button
          key={index}
          variants={filterVariants}
          className={`relative py-1 px-7 text-left break-all dark:hover:bg-filter/50 ${
            value === item ? "dark:bg-filter" : ""
          } duration-100`}
          onClick={() => {
            setValue({
              ...details,
              group_ids: [
                ...new Set([
                  ...details.group_ids,
                  allGroups?.find((group: Group) => group.group_name === item)
                    ?.group_id || "",
                ]),
              ],
            });
          }}
        >
          <p>{item}</p>
        </motion.button>
      ))}
    </DropdownLayout>
  );
};

export default GroupFilter;
