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

const DATADOG = ({
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
    org_name: "",
    dd_api_key: "",
    dd_app_key: "",
  });
  const [showCredentials, setShowCredentials] = useState({
    dd_api_key: false,
    dd_app_key: false,
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
      customerCloudID={credentials.org_name}
    >
      <RegularInput
        label="Organization Name *"
        keyName="org_name"
        inputs={credentials}
        setInputs={setCredentials}
        disabled={disabled}
      />
      <PasswordInput
        label="API Key *"
        keyName="dd_api_key"
        inputs={credentials}
        setInputs={setCredentials}
        showInputs={showCredentials}
        setShowInputs={setShowCredentials}
        disabled={disabled}
      />
      <PasswordInput
        label="Application Key *"
        keyName="dd_app_key"
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
            credentials: {
              dd_api_key: credentials.dd_api_key,
            },
          })
        }
      />

      {/* test passed */}
      {testCredentials.data &&
        Object.keys(testCredentials.data.errors).length === 0 &&
        "valid" in testCredentials.data.result.passed && (
          <section
            ref={testRef}
            className="flex items-center gap-5 mx-auto dark:text-checkbox"
          >
            <img src="/general/checkmark.svg" alt="checkmark" />
            <p>Test passed</p>
          </section>
        )}
    </IntegrationLayout>
  );
};

export default DATADOG;
