/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import { MutableRefObject, useEffect, useRef, useState } from "react";
import {
  CreateAccount,
  TestCredentials,
  UploadCredentials,
} from "../../../../services/settings/integrations";
import { Credentials } from "../../../../types/settings";
import { getCustomerID, parseURL } from "../../../../utils/general";
import { awsRegions } from "../../../../constants/settings";
import ConnectionDetails from "../ConnectionDetails";
import TestButton from "../TestButton";
import RegionFilter from "../../../../components/Filter/Settings/RegionFilter";
import IntegrationLayout from "../../../../layouts/IntegrationLayout";
import RegularInput from "src/components/Input/RegularInput";
import PasswordInput from "src/components/Input/PasswordInput";

const AWS = ({
  setShowIntegrationDetails,
  selectedAccountID,
}: {
  setShowIntegrationDetails: (integrationDetails: boolean) => void;
  selectedAccountID: string;
}) => {
  const parsed = parseURL();
  const customerID = getCustomerID();

  const testRef = useRef() as MutableRefObject<HTMLElement>;
  const [credentials, setCredentials] = useState<Credentials>({
    access_key_id: "",
    secret_access_key: "",
  });
  const [showCredentials, setShowCredentials] = useState({
    secret_access_key: false,
  });
  const [region, setRegion] = useState<string>("");

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
    >
      <article className="flex items-center gap-5">
        <RegionFilter
          label="Primary Region"
          regions={awsRegions}
          selected={region}
          setSelected={setRegion}
        />
        {(credentials.access_key_id !== "" ||
          credentials.secret_access_key !== "") &&
          !awsRegions.includes(region) && (
            <p className="text-reset">Please select a region first</p>
          )}
      </article>
      <RegularInput
        label="Access Key ID *"
        keyName="access_key_id"
        inputs={credentials}
        setInputs={setCredentials}
        disabled={disabled}
      />
      <PasswordInput
        label="Secret Access Key *"
        keyName="secret_access_key"
        inputs={credentials}
        setInputs={setCredentials}
        showInputs={showCredentials}
        setShowInputs={setShowCredentials}
        disabled={disabled}
      />
      <TestButton
        disabled={
          Object.values(credentials).includes("") ||
          region === "" ||
          testCredentials.status === "loading" ||
          (testCredentials.data &&
            Object.keys(testCredentials.data.errors).length === 0 &&
            Object.keys(testCredentials.data.result.failed).length === 0)
        }
        handleOnClick={() =>
          testCredentials.mutate({
            credentials: {
              access_key_id: credentials.access_key_id,
              secret_access_key: credentials.secret_access_key,
              region: region,
            },
          })
        }
      />

      {/* show which connections passed/failed */}
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

export default AWS;
