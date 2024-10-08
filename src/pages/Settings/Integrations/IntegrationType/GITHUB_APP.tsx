/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  GetAllAccounts,
  GetAvailableIntegrations,
} from "../../../../services/settings/integrations";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { KeyStringVal } from "src/types/general";
import { getCustomerID } from "src/utils/general";

const GITHUB_APP = ({ selectedAccountID }: { selectedAccountID: string }) => {
  const customerID = getCustomerID();

  const { data: availableIntegrations, status: availableStatus } =
    GetAvailableIntegrations(customerID);
  const { data: allAccounts, status: accountStatus } =
    GetAllAccounts(customerID);

  const integration = availableIntegrations?.find(
    (curIntegration: KeyStringVal) =>
      curIntegration.integration_type === "GITHUB_APP"
  );
  const existAccount = allAccounts?.find(
    (account: KeyStringVal) => account.integration_id === selectedAccountID
  );

  return (
    <section className="grid content-start gap-5 py-6 h-full overflow-auto scrollbar">
      {availableStatus === "success" && accountStatus === "success" ? (
        integration && !existAccount ? (
          <a
            href={integration.integration_url}
            className="flex items-center gap-2 px-4 py-2 w-max dark:bg-signin/10 dark:hover:bg-signin/20 duration-100 border dark:border-signin rounded-sm"
          >
            <img
              src="/general/integrations/github.svg"
              alt="slack"
              className="w-5 h-5"
            />
            Install GitHub App
          </a>
        ) : (
          <article className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCheck} className="text-no" />
            <p>Installed GitHub App</p>
          </article>
        )
      ) : null}
    </section>
  );
};

export default GITHUB_APP;
