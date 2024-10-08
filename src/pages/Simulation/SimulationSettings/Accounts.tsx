import { GetAllAccounts } from "../../../services/settings/integrations";
import { Account } from "../../../types/settings";
import { decodeJWT } from "../../../utils/general";

const Accounts = ({
  selectedAccount,
  setSelectedAccount,
}: {
  selectedAccount: Account | undefined;
  setSelectedAccount: (selectedAccount: Account) => void;
}) => {
  const jwt = decodeJWT();

  const { data: allAccounts } = GetAllAccounts(jwt?.scope.customer_id);

  const filteredAccounts = allAccounts?.filter((account: Account) =>
    ["aws", "gcp", "azure"].includes(account.integration_type.toLowerCase())
  );

  return (
    <ul className="grid gap-2 px-2 py-1 max-h-28 overflow-auto scrollbar">
      {filteredAccounts?.map((account: Account) => {
        return (
          <li key={account.integration_id} className="flex items-start gap-2">
            <input
              type="radio"
              className="form-radio mr-1 w-4 h-4 self-start dark:bg-transparent dark:ring-0 dark:text-signin dark:focus:border-signin focus:ring dark:focus:ring-offset-0 dark:focus:ring-signin focus:ring-opacity-50 rounded-full"
              checked={
                selectedAccount?.integration_id === account.integration_id
              }
              onChange={() => setSelectedAccount(account)}
            />
            <img
              src={`/general/integrations/${account.integration_type.toLowerCase()}.svg`}
              alt={account.integration_type}
              className="w-4 h-4"
            />
            <h4>{account.customer_cloud_id}</h4>
          </li>
        );
      })}
    </ul>
  );
};

export default Accounts;
