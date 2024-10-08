/* eslint-disable react-hooks/exhaustive-deps */
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MutableRefObject, useEffect, useState } from "react";
import PouringTea from "../components/Loader/PouringTea";
import AccountEnvs from "../pages/Settings/Integrations/AccountEnvs";
import AccountTags from "../pages/Settings/Integrations/AccountTags";
import TestErrors from "../pages/Settings/Integrations/TestErrors";
import { GetCustomerEnvs } from "../services/settings/environments";
import { getCustomerID, parseURL } from "../utils/general";
import { handleUploadCredentials } from "../utils/settings";
import { useGeneralStore } from "src/stores/general";
import { UpdateAccount } from "src/services/settings/integrations";

const IntegrationLayout: React.FC<{
  selectedAccountID: string;
  testCredentials: any;
  uploadCredentials: any;
  testRef: MutableRefObject<HTMLElement>;
  disabled: boolean;
  credentials: any;
  createAccount: any;
  customerCloudID?: string;
}> = ({
  selectedAccountID,
  testCredentials,
  uploadCredentials,
  testRef,
  disabled,
  credentials,
  createAccount,
  customerCloudID,
  children,
}) => {
  const parsed = parseURL();
  const customerID = getCustomerID();

  const { env } = useGeneralStore();

  const [envIDs, setEnvIDs] = useState<string[]>([env]);
  const [tags, setTags] = useState<string[]>([]);

  const { data: customerEnvs } = GetCustomerEnvs(customerID);
  const updateAccount = UpdateAccount(customerID);

  useEffect(() => {
    if (customerEnvs && selectedAccountID === "")
      setEnvIDs([customerEnvs[0].env_id]);
  }, []);

  return (
    <section className="grid content-start gap-5 py-4 h-full overflow-auto scrollbar">
      <AccountEnvs
        envIDs={envIDs}
        setEnvIDs={setEnvIDs}
        selectedAccountID={selectedAccountID}
      />
      <AccountTags
        tags={tags}
        setTags={setTags}
        selectedAccountID={selectedAccountID}
      />
      {testCredentials.status === "loading" && <PouringTea />}

      {children}

      {/* list of errors if any */}
      {testCredentials.data &&
        Object.keys(testCredentials.data.errors).length > 0 && (
          <TestErrors testRef={testRef} errors={testCredentials.data.errors} />
        )}

      {/* upload credentials if all tests passed */}
      {testCredentials.data &&
      Object.keys(testCredentials.data.errors).length === 0 ? (
        Object.keys(testCredentials.data.result.failed).length === 0 ? (
          <button
            type="submit"
            disabled={disabled}
            onClick={() =>
              handleUploadCredentials(
                selectedAccountID,
                uploadCredentials,
                createAccount,
                updateAccount,
                credentials,
                envIDs,
                tags,
                parsed.integration,
                customerCloudID
              )
            }
            className="grid py-2 px-16 mt-5 text-sm mx-auto gradient-button rounded-sm"
          >
            {selectedAccountID !== "" ? "Update" : "Add"} Credentials
          </button>
        ) : (
          <article className="flex items-center gap-2 mx-auto">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="dark:text-event"
            />
            <p>Please make sure all tests pass</p>
          </article>
        )
      ) : null}
    </section>
  );
};

export default IntegrationLayout;
