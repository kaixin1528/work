/* eslint-disable no-restricted-globals */
import { Fragment, useState } from "react";
import { integrationTypes } from "src/constants/settings";
import { attributeColors, baseURL } from "../../../constants/general";
import ModalLayout from "../../../layouts/ModalLayout";
import {
  DeleteAccount,
  GetAllAccounts,
  StoreSlackOauth,
  UpdateAccount,
} from "../../../services/settings/integrations";
import { Account } from "../../../types/settings";
import { getCustomerID, parseURL } from "../../../utils/general";

const Configured = ({
  showIntegrationDetails,
  setShowIntegrationDetails,
  selectedAccountID,
  setSelectedAccountID,
}: {
  showIntegrationDetails: boolean;
  setShowIntegrationDetails: (showIntegrationDetails: boolean) => void;
  selectedAccountID: string;
  setSelectedAccountID: (selectedAccountID: string) => void;
}) => {
  const parsed = parseURL();
  const customerID = getCustomerID();

  const [deleteAccountID, setDeleteAccountID] = useState<string>("");

  const { data: allAccounts } = GetAllAccounts(customerID);
  const updateAccount = UpdateAccount(customerID);
  const deleteAccount = DeleteAccount(customerID);
  StoreSlackOauth(
    String(parsed.code || ""),
    String(parsed.state || ""),
    `${baseURL}/settings/details?section=integrations&integration=SLACK`
  );

  const configuredAccounts = allAccounts?.filter(
    (account: Account) => account.integration_type === parsed.integration
  );

  const handleOnClose = () => {
    setShowIntegrationDetails(false);
    setSelectedAccountID("");
    setDeleteAccountID("");
  };

  const Integration = integrationTypes[String(parsed.integration)];

  return (
    <section className="grid content-start gap-5 text-sm dark:text-checkbox overflow-auto scrollbar">
      <h4>Configured Accounts ({configuredAccounts?.length})</h4>
      <ul className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
        {configuredAccounts?.map((account: Account) => {
          return (
            <li
              key={account.customer_cloud_id}
              className="grid content-start gap-3 p-3 w-full h-full dark:bg-panel"
            >
              <Fragment>
                <button
                  className={`flex items-center gap-2 px-2 w-max h-7 text-xs break-all dark:text-black ${
                    account.current_state === 1
                      ? "dark:bg-no dark:hover:bg-no/60"
                      : "dark:bg-checkbox dark:hover:bg-checkbox/60"
                  } cursor-pointer rounded-md`}
                  onClick={() => {
                    setShowIntegrationDetails(true);
                    setSelectedAccountID(String(account.integration_id));
                  }}
                >
                  {account.customer_cloud_id || "N/A"}
                </button>
                <ModalLayout
                  showModal={
                    showIntegrationDetails &&
                    selectedAccountID === account.integration_id
                  }
                  onClose={handleOnClose}
                >
                  <header className="relative flex items-center gap-5">
                    <img
                      src={`/general/integrations/${account.integration_type?.toLowerCase()}.svg`}
                      alt={account.integration_type}
                      className="w-10 h-10"
                    />
                    <article className="grid gap-1">
                      <article className="flex items-center gap-10">
                        <>
                          <article className="flex items-center gap-5">
                            <p className="text-sm dark:text-checkbox">
                              Account ID: {account.customer_cloud_id}
                            </p>
                          </article>
                          <ModalLayout
                            showModal={
                              deleteAccountID === account.integration_id
                            }
                            onClose={handleOnClose}
                          >
                            <section className="grid gap-5">
                              <h4 className="px-4 text-base text-center mb-3">
                                Are you sure you want to remove this account?{" "}
                              </h4>
                              <section className="flex items-center justify-self-end gap-5 mx-5 text-xs">
                                <button
                                  className="px-4 py-1 bg-gradient-to-b dark:from-filter dark:to-filter/60 dark:hover:from-filter dark:hover:to-filter/30 rounded-sm"
                                  onClick={handleOnClose}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="px-4 py-1 bg-gradient-to-b dark:from-reset dark:to-reset/60 dark:hover:from-reset dark:hover:to-reset/30 rounded-sm"
                                  onClick={() => {
                                    handleOnClose();
                                    deleteAccount.mutate({
                                      accountID: deleteAccountID,
                                    });
                                  }}
                                >
                                  Remove account
                                </button>
                              </section>
                            </section>
                          </ModalLayout>
                        </>
                      </article>
                      <button
                        className={`${
                          attributeColors[
                            account.current_state === 1 ? "enabled" : "disabled"
                          ]
                        } capitalize ${
                          account.current_state === 1
                            ? "dark:hover:text-gray-300 dark:hover:bg-filter/30 border dark:hover:border-filter/60 duration-100"
                            : "dark:hover:text-white dark:hover:bg-no/30 border dark:hover:border-contact/60 duration-100"
                        } group`}
                        onClick={() =>
                          updateAccount.mutate({
                            accountID: selectedAccountID,
                            account: {
                              current_state:
                                account.current_state === 1
                                  ? "DISABLED"
                                  : "ENABLED",
                            },
                          })
                        }
                      >
                        <span className="block group-hover:hidden">
                          {account.current_state === 1 ? "Enabled" : "Disabled"}
                        </span>
                        <span className="hidden group-hover:block">
                          {account.current_state === 1 ? "Disable" : "Enable"}
                        </span>
                      </button>
                    </article>
                  </header>
                  {Integration && (
                    <Integration
                      setShowIntegrationDetails={setShowIntegrationDetails}
                      selectedAccountID={selectedAccountID}
                    />
                  )}
                </ModalLayout>
              </Fragment>
              <ul className="flex flex-wrap items-center gap-5 text-xs">
                {account.integration_tags?.map((tag: string) => {
                  return (
                    <li
                      key={tag}
                      className="flex items-center px-4 py-1 w-max dark:text-white dark:bg-filter rounded-full"
                    >
                      {tag}
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Configured;
