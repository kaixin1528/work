/* eslint-disable no-restricted-globals */
import { motion } from "framer-motion";
import { filterVariants } from "../../../constants/general";
import DropdownLayout from "../../../layouts/DropdownLayout";
import { Role, UserDetails } from "../../../types/settings";

const RoleFilter = ({
  allRoles,
  details,
  value,
  setValue,
  list,
  showAbove,
}: {
  allRoles: Role[];
  details: UserDetails;
  value: string;
  setValue: (value: UserDetails) => void;
  list: string[];
  showAbove?: boolean;
}) => {
  return (
    <DropdownLayout label="Role" value={value} showAbove={showAbove}>
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
              role_ids: [
                ...new Set([
                  ...details.role_ids,
                  allRoles?.find((role: Role) => role.role_name === item)
                    ?.role_id || "",
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

export default RoleFilter;
