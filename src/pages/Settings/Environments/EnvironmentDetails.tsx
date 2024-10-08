/* eslint-disable no-restricted-globals */
import ReturnPage from "../../../components/Button/ReturnPage";
import {
  GetCustomerEnvAccounts,
  GetCustomerEnvs,
} from "../../../services/settings/environments";
import { getCustomerID, parseURL } from "../../../utils/general";
import { Account, CustomerEnv } from "../../../types/settings";

const EnvironmentDetails = () => {
  const parsed = parseURL();
  const customerID = getCustomerID();

  const { data: customerEnvs } = GetCustomerEnvs(customerID);
  const { data: customerEnvAccounts } = GetCustomerEnvAccounts(
    customerID,
    customerEnvs?.find(
      (customerEnv: CustomerEnv) => customerEnv.env_type === parsed.selected_env
    )?.env_id
  );

  const integrationTypes = [
    ...new Set(
      customerEnvAccounts?.reduce(
        (pV: string[], cV: Account) => [...pV, cV.integration_type],
        []
      )
    ),
  ] as string[];

  return (
    <section className="flex flex-grow flex-col content-start gap-5 p-6">
      <header className="flex items-center gap-10">
        <ReturnPage />
        <h4 className="px-4 py-1 text-sm selected-button rounded-sm">
          {parsed.selected_env}
        </h4>
      </header>
      <section className="grid gap-5">
        <h4>Integrations</h4>
        {customerEnvAccounts ? (
          integrationTypes?.length > 0 ? (
            <article className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {integrationTypes?.map(
                (integrationType: string, index: number) => {
                  const filteredAccounts = customerEnvAccounts?.filter(
                    (account: Account) =>
                      account.integration_type === integrationType
                  );

                  return (
                    <article
                      key={index}
                      className="grid content-start gap-3 p-3 dark:bg-panel"
                    >
                      <header className="flex items-center gap-3">
                        <img
                          src={`/general/integrations/${integrationType?.toLowerCase()}.svg`}
                          alt={integrationType}
                          className="w-6 h-6"
                        />
                        <h4 className="text-sm">
                          {integrationType} accounts ({filteredAccounts?.length}
                          )
                        </h4>
                      </header>
                      <ul
                        key={integrationType}
                        className="flex flex-wrap items-center gap-5 text-xs"
                      >
                        {filteredAccounts?.map((account: Account) => {
                          return (
                            <li
                              key={account.integration_id}
                              className={`p-2 w-max dark:text-black ${
                                account.current_state === 1
                                  ? "dark:bg-no"
                                  : "dark:bg-checkbox"
                              } rounded-md`}
                            >
                              {account.customer_cloud_id}
                            </li>
                          );
                        })}
                      </ul>
                    </article>
                  );
                }
              )}
            </article>
          ) : (
            <p className="grid content-start gap-3 p-3 w-max text-sm dark:bg-panel">
              No integrations in this environment
            </p>
          )
        ) : null}
      </section>
    </section>
  );
};

export default EnvironmentDetails;
