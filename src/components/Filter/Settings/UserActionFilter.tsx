/* eslint-disable no-restricted-globals */
import { motion } from "framer-motion";
import { filterVariants } from "../../../constants/general";
import DropdownLayout from "../../../layouts/DropdownLayout";
import { UpdateUser } from "../../../services/settings/users";
import { getCustomerID } from "../../../utils/general";

const UserActionFilter = ({
  list,
  multiSelect,
  setMultiSelect,
}: {
  list: string[];
  multiSelect: string[];
  setMultiSelect: (multiSelect: string[]) => void;
}) => {
  const customerID = getCustomerID();

  const updateUser = UpdateUser(customerID);

  return (
    <DropdownLayout value="">
      {list?.map((item: string, index: number) => (
        <motion.button
          key={index}
          variants={filterVariants}
          className="relative py-1 px-7 text-left dark:hover:bg-filter/50 duration-100"
          onClick={() => {
            setMultiSelect([]);
            if (item === "Activate") {
              multiSelect.map((userID) =>
                updateUser.mutate({
                  userID: userID,
                  user: { action: "activate" },
                })
              );
            } else if (item === "Deactivate") {
              multiSelect.map((userID) =>
                updateUser.mutate({
                  userID: userID,
                  user: { action: "delete" },
                })
              );
            }
          }}
        >
          <p>{item}</p>
        </motion.button>
      ))}
    </DropdownLayout>
  );
};

export default UserActionFilter;
