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
import { KeyStringVal } from "src/types/general";
import PasswordInput from "src/components/Input/PasswordInput";

const CIRCLECI = ({
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
    circleci_token: "",
  });
  const [showCredentials, setShowCredentials] = useState({
    circleci_token: false,
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
    >
      <PasswordInput
        label="Personal API Token *"
        keyName="circleci_token"
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
              circleci_token: credentials.circleci_token,
            },
          })
        }
      />

      {/* show oauth scopes */}
      {testCredentials.data &&
        Object.keys(testCredentials.data.errors).length === 0 && (
          <section
            ref={testRef}
            className="grid gap-3 p-4 px-20 w-full max-h-96 text-center dark:bg-tooltip/50 divide-y-1 dark:divide-checkbox/30 overflow-auto scrollbar"
          >
            <h4>
              Logged in as{" "}
              <span className="p-1 dark:bg-admin/30 border dark:border-admin rounded-sm">
                {testCredentials.data.result.passed.login_user.login}
              </span>
            </h4>
            <article className="grid gap-3 pt-2">
              <h4>Collaborations</h4>
              <ul className="grid justify-items-center gap-2">
                {testCredentials.data.result.passed.collaborations.map(
                  (collaboration: KeyStringVal) => {
                    return (
                      <li
                        key={collaboration.slug}
                        className="flex items-center gap-2"
                      >
                        <img
                          src={collaboration.avatar_url}
                          alt={collaboration.slug}
                          className="w-4 h-4"
                        />
                        <h4>{collaboration.name}</h4>
                      </li>
                    );
                  }
                )}
              </ul>
            </article>
          </section>
        )}
    </IntegrationLayout>
  );
};

export default CIRCLECI;
