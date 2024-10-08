/* eslint-disable no-restricted-globals */
import { motion } from "framer-motion";
import { filterVariants } from "../../../constants/general";
import DropdownLayout from "../../../layouts/DropdownLayout";
import { UpdateAccount } from "../../../services/settings/integrations";
import { CustomerEnv } from "../../../types/settings";
import { getCustomerID } from "../../../utils/general";

const AccountEnvFilter = ({
  envIDs,
  setValue,
  list,
  selectedAccountID,
}: {
  envIDs: string[];
  setValue: (value: string[]) => void;
  list: CustomerEnv[];
  selectedAccountID: string;
}) => {
  const customerID = getCustomerID();

  const updateAccount = UpdateAccount(customerID);

  return (
    <DropdownLayout value="Add Environment">
      {list?.map((item: CustomerEnv, index: number) => (
        <motion.button
          key={index}
          variants={filterVariants}
          className="relative py-1 px-7 text-left break-all dark:hover:bg-filter/50 duration-100"
          onClick={() => {
            if (!envIDs.includes(item.env_id)) {
              const newEnvIDs = [...new Set([...envIDs, item.env_id])];
              if (selectedAccountID !== "")
                updateAccount.mutate({
                  accountID: selectedAccountID,
                  account: {
                    customer_envs: newEnvIDs,
                  },
                });
              else setValue(newEnvIDs);
            }
          }}
        >
          <p>{item.env_type}</p>
        </motion.button>
      ))}
    </DropdownLayout>
  );
};

export default AccountEnvFilter;
