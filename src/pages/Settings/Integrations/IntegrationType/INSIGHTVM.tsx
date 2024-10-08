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
import ConnectionDetails from "../ConnectionDetails";
import TestButton from "../TestButton";
import IntegrationLayout from "../../../../layouts/IntegrationLayout";
import RegularInput from "src/components/Input/RegularInput";
import PasswordInput from "src/components/Input/PasswordInput";

const INSIGHTVM = ({
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
    insightvm_url: "",
    insightvm_user: "",
    insightvm_password: "",
  });
  const [showCredentials, setShowCredentials] = useState({});

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
      customerCloudID={credentials.insightvm_url}
    >
      <RegularInput
        label="InsightVM Console API URL *"
        keyName="insightvm_url"
        inputs={credentials}
        setInputs={setCredentials}
        disabled={disabled}
      />
      <RegularInput
        label="InsightVM User *"
        keyName="insightvm_user"
        inputs={credentials}
        setInputs={setCredentials}
        disabled={disabled}
      />
      <PasswordInput
        label="InsightVM Password *"
        keyName="insightvm_password"
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

      {testCredentials.data &&
        Object.keys(testCredentials.data.errors).length === 0 && (
          <ConnectionDetails
            testRef={testRef}
            failed={testCredentials.data.result.failed}
            passed={testCredentials.data.result.passed}
          />
        )}
    </IntegrationLayout>
  );
};

export default INSIGHTVM;
