/* eslint-disable no-restricted-globals */
import { motion } from "framer-motion";
import { filterVariants } from "../../../constants/general";
import DropdownLayout from "../../../layouts/DropdownLayout";
import { getCustomerID } from "../../../utils/general";
import { DeleteGroup } from "src/services/settings/groups";

const GroupActionFilter = ({
  list,
  multiSelect,
  setMultiSelect,
}: {
  list: string[];
  multiSelect: string[];
  setMultiSelect: (multiSelect: string[]) => void;
}) => {
  const customerID = getCustomerID();

  const deleteGroup = DeleteGroup(customerID);

  return (
    <DropdownLayout value="">
      {list?.map((item: string, index: number) => (
        <motion.button
          key={index}
          variants={filterVariants}
          className="relative py-1 px-7 text-left break-all dark:hover:bg-filter/50 duration-100"
          onClick={() => {
            setMultiSelect([]);
            multiSelect.map((groupID) =>
              deleteGroup.mutate({
                groupID: groupID,
              })
            );
          }}
        >
          <p>{item}</p>
        </motion.button>
      ))}
    </DropdownLayout>
  );
};

export default GroupActionFilter;
