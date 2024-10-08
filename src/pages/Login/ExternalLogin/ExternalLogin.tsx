/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from "framer-motion";
import React from "react";
import { googleClientID, validVariants } from "../../../constants/general";
import { useGeneralStore } from "../../../stores/general";
import Google from "./Google";
import Auth0 from "./Auth0";

const ExternalLogin = ({
  setTwoFaNeeded,
  setTwoFaSetup,
  setQRCodeValue,
  setSetupKey,
  setVerifyEmail,
  setCustomerID,
  twoFAInitialSetup,
  enabledModulesOnLogin,
}: {
  setTwoFaNeeded: (twoFaNeeded: boolean) => void;
  setTwoFaSetup: (twoFaSetup: boolean) => void;
  setQRCodeValue: (qrCodeValue: string) => void;
  setSetupKey: (setupKey: string) => void;
  setVerifyEmail: (verifyEmail: string) => void;
  setCustomerID: (customerID: string) => void;
  twoFAInitialSetup: any;
  enabledModulesOnLogin: any;
}) => {
  const { error } = useGeneralStore();

  return (
    <section className="grid gap-5 w-full h-full">
      <article className="grid gap-2">
        <article className="flex item-center gap-5 mx-auto">
          {googleClientID && (
            <Google
              setTwoFaNeeded={setTwoFaNeeded}
              setTwoFaSetup={setTwoFaSetup}
              setQRCodeValue={setQRCodeValue}
              setSetupKey={setSetupKey}
              setVerifyEmail={setVerifyEmail}
              setCustomerID={setCustomerID}
              twoFAInitialSetup={twoFAInitialSetup}
              enabledModulesOnLogin={enabledModulesOnLogin}
            />
          )}
          {/* <Auth0
            setTwoFaNeeded={setTwoFaNeeded}
            setTwoFaSetup={setTwoFaSetup}
            setQRCodeValue={setQRCodeValue}
            setSetupKey={setSetupKey}
            setVerifyEmail={setVerifyEmail}
            setCustomerID={setCustomerID}
            twoFAInitialSetup={twoFAInitialSetup}
          /> */}
        </article>
      </article>
      {error.url === "/oidc-login" && error.message !== "" && (
        <motion.article
          variants={validVariants}
          initial="hidden"
          animate={error.message !== "" ? "visible" : "hidden"}
          className="p-2 mx-auto break-all text-xs text-left dark:bg-inner border dark:border-error rounded-sm"
        >
          <p>{error.message}</p>
        </motion.article>
      )}
    </section>
  );
};

export default ExternalLogin;
