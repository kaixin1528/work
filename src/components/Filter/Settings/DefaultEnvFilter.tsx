/* eslint-disable no-restricted-globals */
import { motion } from "framer-motion";
import { filterVariants } from "../../../constants/general";
import DropdownLayout from "../../../layouts/DropdownLayout";
import { CustomerEnv, UserDetails } from "../../../types/settings";

const DefaultEnvFilter = ({
  envTypes,
  details,
  label,
  value,
  setValue,
  list,
  showAbove,
}: {
  envTypes: CustomerEnv[];
  details: UserDetails;
  label: string;
  value: string;
  setValue: (value: UserDetails) => void;
  list: string[];
  showAbove?: boolean;
}) => {
  return (
    <DropdownLayout label={label} value={value} showAbove={showAbove}>
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
              default_env:
                envTypes?.find(
                  (customerEnv: CustomerEnv) => customerEnv.env_type === item
                )?.env_id || "",
            });
          }}
        >
          <p>{item}</p>
        </motion.button>
      ))}
    </DropdownLayout>
  );
};

export default DefaultEnvFilter;
