/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Credentials } from "../../../../types/settings";
import {
  CreateAccount,
  TestCredentials,
  UploadCredentials,
} from "../../../../services/settings/integrations";
import { getCustomerID, parseURL } from "../../../../utils/general";
import TestButton from "../TestButton";
import IntegrationLayout from "../../../../layouts/IntegrationLayout";
import RegularInput from "src/components/Input/RegularInput";
import PasswordInput from "src/components/Input/PasswordInput";

const GITHUB = ({
  setShowIntegrationDetails,
  selectedAccountID,
}: {
  setShowIntegrationDetails: (showIntegrationDetails: boolean) => void;
  selectedAccountID: string;
}) => {
  const parsed = parseURL();
  const customerID = getCustomerID();

  const testRef = useRef() as MutableRefObject<HTMLElement>;
  const [credentials, setCredentials] = useState<Credentials>({
    github_org: "",
    github_token: "",
  });
  const [showCredentials, setShowCredentials] = useState({
    github_token: false,
  });

  const createAccount = CreateAccount(customerID);
  const testCredentials = TestCredentials(customerID, parsed.integration);
  const uploadCredentials = UploadCredentials(
    customerID,
    setShowIntegrationDetails
  );

  const disabled =
    testCredentials.status === "loading" ||
    createAccount.status === "loading" ||
    uploadCredentials.status === "loading";

  useEffect(() => {
    if (testCredentials.status === "success")
      testRef?.current?.scrollIntoView();
  }, [testCredentials.status]);

  return (
    <IntegrationLayout
      selectedAccountID={selectedAccountID}
      testCredentials={testCredentials}
      uploadCredentials={uploadCredentials}
      testRef={testRef}
      disabled={disabled}
      credentials={credentials}
      createAccount={createAccount}
      customerCloudID={credentials.github_org}
    >
      <RegularInput
        label="GitHub Organization *"
        keyName="github_org"
        inputs={credentials}
        setInputs={setCredentials}
        disabled={disabled}
      />
      <PasswordInput
        label="GitHub Token *"
        keyName="github_token"
        inputs={credentials}
        setInputs={setCredentials}
        showInputs={showCredentials}
        setShowInputs={setShowCredentials}
        disabled={disabled}
      />
      <TestButton
        disabled={
          Object.values(credentials).includes("") ||
          testCredentials.status === "loading" ||
          (testCredentials.data &&
            Object.keys(testCredentials.data.errors).length === 0 &&
            Object.keys(testCredentials.data.result.failed).length === 0)
        }
        handleOnClick={() =>
          testCredentials.mutate({
            credentials: credentials,
          })
        }
      />

      {/* show oauth scopes */}
      {testCredentials.data &&
        Object.keys(testCredentials.data.errors).length === 0 &&
        "x-oauth-scopes" in testCredentials.data.result.passed && (
          <section
            ref={testRef}
            className="p-4 px-20 w-full max-h-96 dark:bg-tooltip/50 overflow-auto scrollbar"
          >
            <article className="mx-auto">
              <h4>X-OAuth-Scopes:</h4>
              <p className="dark:text-checkbox">
                {testCredentials.data.result.passed["x-oauth-scopes"]}
              </p>
            </article>
          </section>
        )}
    </IntegrationLayout>
  );
};

export default GITHUB;
