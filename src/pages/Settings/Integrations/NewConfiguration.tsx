/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment } from "react";
import { getCustomerID, parseURL } from "../../../utils/general";
import { AvailableIntegration } from "../../../types/settings";
import { GetAvailableIntegrations } from "../../../services/settings/integrations";
import ModalLayout from "../../../layouts/ModalLayout";
import { integrationTypes } from "src/constants/settings";

const NewConfiguration = ({
  showIntegrationDetails,
  setShowIntegrationDetails,
  selectedAccountID,
}: {
  showIntegrationDetails: boolean;
  setShowIntegrationDetails: (showIntegrationDetails: boolean) => void;
  selectedAccountID: string;
}) => {
  const parsed = parseURL();
  const customerID = getCustomerID();

  const { data: availableIntegrations } = GetAvailableIntegrations(customerID);

  const integrationName = availableIntegrations?.find(
    (integration: AvailableIntegration) =>
      integration.integration_type === parsed.integration
  )?.description;

  const handleOnClose = () => {
    setShowIntegrationDetails(false);
  };

  const Integration = integrationTypes[String(parsed.integration)];

  return (
    <Fragment>
      <button
        className="px-4 py-1 text-xs dark:bg-signin dark:hover:bg-signin/60 duration-100 rounded-md"
        onClick={() => setShowIntegrationDetails(true)}
      >
        <p>Add a new account</p>
      </button>
      <ModalLayout
        showModal={showIntegrationDetails && selectedAccountID === ""}
        onClose={handleOnClose}
      >
        <header className="relative flex items-center gap-5">
          <img
            src={`/general/integrations/${String(
              parsed.integration
            ).toLowerCase()}.svg`}
            alt={String(parsed.integration)}
            className="w-10 h-10"
          />
          <h3 className="text-lg">{integrationName}</h3>
        </header>
        {Integration && (
          <Integration
            setShowIntegrationDetails={setShowIntegrationDetails}
            selectedAccountID={selectedAccountID}
          />
        )}
      </ModalLayout>
    </Fragment>
  );
};

export default NewConfiguration;
