/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import IntegrationDetails from "./IntegrationDetails";
import { getCustomerID, parseURL } from "../../../utils/general";
import { GetAvailableIntegrations } from "../../../services/settings/integrations";
import { AvailableIntegration } from "../../../types/settings";
import { attributeColors } from "src/constants/general";

const Integrations = () => {
  const navigate = useNavigate();
  const parsed = parseURL();
  const customerID = getCustomerID();

  const { data: availableIntegrations } = GetAvailableIntegrations(customerID);

  const categories = [
    ...new Set(
      availableIntegrations?.reduce(
        (pV: string[], cV: AvailableIntegration) => [...pV, cV.category],
        []
      )
    ),
  ] as string[];

  return (
    <>
      {!parsed.integration ? (
        <section className="flex flex-col flex-grow content-start gap-5 p-6 w-full h-full text-sm overflow-auto scrollbar">
          <h4 className="text-base">INTEGRATIONS</h4>
          <ul className="grid justify-items-start gap-20 w-full overflow-auto scrollbar">
            {categories?.map((category: string) => {
              const filteredIntegrations = availableIntegrations?.filter(
                (integration: AvailableIntegration) =>
                  integration.category === category
              );
              return (
                <li key={category} className="grid gap-2 w-full">
                  <h4>{category}</h4>
                  <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 content-start gap-2">
                    {filteredIntegrations?.map(
                      (integration: AvailableIntegration) => {
                        return (
                          <button
                            key={integration.integration_type}
                            disabled={integration.current_state === 0}
                            className="grid gap-3 py-3 px-6 dark:disabled:hover:bg-transparent dark:hover:bg-tooltip rounded-md duration-100"
                            onClick={() =>
                              navigate(
                                `/settings/details?${queryString.stringify(
                                  parsed
                                )}&integration=${integration.integration_type.toUpperCase()}`
                              )
                            }
                          >
                            <img
                              src={`/general/integrations/${integration.integration_type.toLowerCase()}.svg`}
                              alt={integration.integration_type}
                              className="w-20 h-20 mx-auto"
                            />
                            <p>{integration.description}</p>
                            {integration.current_state === 0 && (
                              <span
                                className={`mx-auto ${attributeColors["disabled"]}`}
                              >
                                DEACTIVATED
                              </span>
                            )}
                          </button>
                        );
                      }
                    )}
                  </section>
                </li>
              );
            })}
          </ul>
        </section>
      ) : (
        <IntegrationDetails />
      )}
    </>
  );
};

export default Integrations;
