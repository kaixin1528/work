/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { GetAllAccounts } from "src/services/settings/integrations";
import { useSummaryStore } from "src/stores/summaries";
import { Account } from "src/types/settings";
import { getCustomerID } from "src/utils/general";

const Accounts = ({
  showAll,
  includeIntegrations = [],
}: {
  showAll?: boolean;
  includeIntegrations?: string[];
}) => {
  const customerID = getCustomerID();

  const { selectedReportAccount, setSelectedReportAccount } = useSummaryStore();

  const { data: allAccounts } = GetAllAccounts(customerID);
  const exclusiveAccounts = allAccounts?.filter((account: Account) =>
    ["ALL", "AWS", "GCP", ...includeIntegrations].includes(
      account.integration_type
    )
  );
  const filteredAccounts =
    allAccounts && showAll
      ? [
          { integration_type: "ALL", customer_cloud_id: "all" },
          ...exclusiveAccounts,
        ]
      : exclusiveAccounts;

  useEffect(() => {
    if (filteredAccounts?.length > 0 && !selectedReportAccount)
      setSelectedReportAccount(filteredAccounts[0]);
  }, [allAccounts]);

  return (
    <ul className="flex items-center gap-5 w-full text-sm overflow-x-auto overflow-y-hidden scrollbar">
      {filteredAccounts?.map((account: Account) => {
        return (
          <li
            key={`${account.integration_type}-${account.customer_cloud_id}`}
            className={`flex flex-wrap items-center gap-2 py-2 px-4 cursor-pointer ${
              selectedReportAccount?.integration_type ===
                account.integration_type &&
              selectedReportAccount?.customer_cloud_id ===
                account.customer_cloud_id
                ? "w-max selected-button rounded-sm"
                : "border-none dark:hover:bg-signin/30 duration-100"
            }`}
            onClick={() => setSelectedReportAccount(account)}
          >
            <img
              src={`/general/integrations/${account.integration_type.toLowerCase()}.svg`}
              alt={account.integration_type}
              className="w-7 h-7"
            />
            <p>
              {account.integration_type === "ALL"
                ? "All Accounts"
                : account.customer_cloud_id}
            </p>
          </li>
        );
      })}
    </ul>
  );
};
export default Accounts;
