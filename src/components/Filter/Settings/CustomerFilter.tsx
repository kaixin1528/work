/* eslint-disable no-restricted-globals */
import { motion } from "framer-motion";
import { filterVariants } from "../../../constants/general";
import DropdownLayout from "../../../layouts/DropdownLayout";
import { Customer } from "../../../types/settings";

const CustomerFilter = ({
  allCustomers,
  value,
  setValue,
  list,
}: {
  allCustomers: Customer[];
  value: string;
  setValue: (value: string) => void;
  list: string[];
}) => {
  return (
    <DropdownLayout label="Customer" value={value} showAbove>
      {list?.map((item: string, index: number) => (
        <motion.button
          key={index}
          variants={filterVariants}
          className={`relative py-1 px-7 text-left break-all dark:hover:bg-filter/50 ${
            value === item ? "dark:bg-filter" : ""
          } duration-100`}
          onClick={() => {
            setValue(
              allCustomers?.find(
                (customer: Customer) => customer.customer_name === item
              )?.customer_id || ""
            );
          }}
        >
          <p>{item}</p>
        </motion.button>
      ))}
    </DropdownLayout>
  );
};

export default CustomerFilter;
