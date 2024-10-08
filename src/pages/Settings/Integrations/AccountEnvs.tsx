/* eslint-disable react-hooks/exhaustive-deps */
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import AccountEnvFilter from "../../../components/Filter/Settings/AccountEnvFilter";
import {
  GetAccountInfo,
  UpdateAccount,
} from "../../../services/settings/integrations";
import { CustomerEnv } from "../../../types/settings";
import { getCustomerID } from "../../../utils/general";
import { GetCustomerEnvs } from "src/services/settings/environments";

const AccountEnvs = ({
  envIDs,
  setEnvIDs,
  selectedAccountID,
}: {
  envIDs: string[];
  setEnvIDs: (envIDs: string[]) => void;
  selectedAccountID: string;
}) => {
  const customerID = getCustomerID();

  const { data: customerEnvs } = GetCustomerEnvs(customerID);
  const { data: accountInfo } = GetAccountInfo(customerID, selectedAccountID);
  const updateAccount = UpdateAccount(customerID);

  useEffect(() => {
    if (accountInfo) {
      const accountEnvIDs = accountInfo.customer_env_associations.reduce(
        (pV: string[], cV: CustomerEnv) => [...pV, cV.env_id],
        []
      );
      setEnvIDs(accountEnvIDs);
    }
  }, [accountInfo]);

  return (
    <ul className="flex flex-wrap items-center gap-5 text-xs">
      <li className="text-sm dark:text-checkbox">Environments:</li>
      <AccountEnvFilter
        envIDs={envIDs}
        setValue={setEnvIDs}
        list={customerEnvs}
        selectedAccountID={selectedAccountID}
      />
      {envIDs.map((envID: string) => {
        const envType = customerEnvs?.find(
          (customerEnv: CustomerEnv) => customerEnv.env_id === envID
        )?.env_type;

        return (
          <li
            key={envID}
            className="flex items-center gap-3 py-1 px-4 dark:text-white selected-button rounded-sm"
          >
            <button
              onClick={() => {
                const newEnvIDs = envIDs.filter(
                  (curEnv: string) => curEnv !== envID
                );
                if (selectedAccountID !== "")
                  updateAccount.mutate({
                    accountID: selectedAccountID,
                    account: {
                      customer_envs: newEnvIDs,
                    },
                  });
                else setEnvIDs(newEnvIDs);
              }}
            >
              <FontAwesomeIcon
                icon={faXmark}
                className="dark:text-white red-button"
              />
            </button>
            <p>{envType}</p>
          </li>
        );
      })}
      {envIDs.length === 0 && (
        <p className="text-reset">Please select an environment</p>
      )}
    </ul>
  );
};

export default AccountEnvs;
