/* eslint-disable no-restricted-globals */
import { useState } from "react";
import ReturnPage from "../../../components/Button/ReturnPage";
import { GetAvailableIntegrations } from "../../../services/settings/integrations";
import { AvailableIntegration } from "../../../types/settings";
import { getCustomerID, parseURL } from "../../../utils/general";
import Configured from "./Configured";
import NewConfiguration from "./NewConfiguration";

const IntegrationDetails = () => {
  const parsed = parseURL();
  const customerID = getCustomerID();

  const [showIntegrationDetails, setShowIntegrationDetails] =
    useState<boolean>(false);
  const [selectedAccountID, setSelectedAccountID] = useState<string>("");

  const { data: availableIntegrations } = GetAvailableIntegrations(customerID);

  const integrationName = availableIntegrations?.find(
    (integration: AvailableIntegration) =>
      integration.integration_type === parsed.integration
  )?.description;

  return (
    <section className="grid content-start gap-5 m-6 overflow-auto">
      <ReturnPage />
      <header className="relative flex items-center gap-6 py-5 border-b-1 dark:border-checkbox">
        <img
          src={`/general/integrations/${String(
            parsed.integration
          ).toLowerCase()}.svg`}
          alt={String(parsed.integration)}
          className="w-20 h-20"
        />
        <article className="grid justify-items-start gap-2">
          <h3 className="text-lg">{integrationName}</h3>
          <NewConfiguration
            showIntegrationDetails={showIntegrationDetails}
            setShowIntegrationDetails={setShowIntegrationDetails}
            selectedAccountID={selectedAccountID}
          />
        </article>
      </header>
      <Configured
        showIntegrationDetails={showIntegrationDetails}
        setShowIntegrationDetails={setShowIntegrationDetails}
        selectedAccountID={selectedAccountID}
        setSelectedAccountID={setSelectedAccountID}
      />
    </section>
  );
};

export default IntegrationDetails;
