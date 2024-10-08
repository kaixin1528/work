/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import { MutableRefObject, useEffect, useRef, useState } from "react";
import {
  CreateAccount,
  TestCredentials,
  UploadCredentials,
} from "../../../../services/settings/integrations";
import { getCustomerID, parseURL } from "../../../../utils/general";
import ConnectionDetails from "../ConnectionDetails";
import TestButton from "../TestButton";
import RegionFilter from "../../../../components/Filter/Settings/RegionFilter";
import { zones } from "../../../../constants/settings";
import IntegrationLayout from "../../../../layouts/IntegrationLayout";
import RegularInput from "src/components/Input/RegularInput";
import FileInput from "src/components/Input/FileInput";

const GCP = ({
  setShowIntegrationDetails,
  selectedAccountID,
}: {
  setShowIntegrationDetails: (showIntegrationDetails: boolean) => void;
  selectedAccountID: string;
}) => {
  const parsed = parseURL();
  const customerID = getCustomerID();

  const testRef = useRef() as MutableRefObject<HTMLElement>;
  const [credentials, setCredentials] = useState({
    domain: "",
    gcp_credentials_file: "",
  });
  const [zone, setZone] = useState<string>("");

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
      credentials={{
        ...Object.fromEntries(
          Object.entries(credentials).filter(
            ([key, _]) => !["name", "size"].includes(key)
          )
        ),
      }}
      createAccount={createAccount}
    >
      <article className="flex items-center gap-5">
        <RegionFilter
          label="Primary Zone"
          regions={zones}
          selected={zone}
          setSelected={setZone}
        />
        {credentials.gcp_credentials_file !== "" && !zones.includes(zone) && (
          <p className="text-reset">Please select a zone first</p>
        )}
      </article>
      <RegularInput
        label="LDAP Domain (optional)"
        keyName="domain"
        inputs={credentials}
        setInputs={setCredentials}
        disabled={disabled}
      />
      <FileInput
        label="GCP Credentials"
        keyName="gcp_credentials_file"
        types={["JSON"]}
        inputs={credentials}
        setInputs={setCredentials}
      />
      <TestButton
        disabled={
          credentials.gcp_credentials_file === "" ||
          zone === "" ||
          testCredentials.status === "loading" ||
          (testCredentials.data &&
            Object.keys(testCredentials.data.errors).length === 0 &&
            Object.keys(testCredentials.data.result.failed).length === 0)
        }
        handleOnClick={() =>
          testCredentials.mutate({
            credentials: {
              domain: credentials.domain,
              gcp_credentials_file: credentials.gcp_credentials_file,
              zone: zone,
            },
          })
        }
      />

      {/* show which connections failed and passed */}
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

export default GCP;
