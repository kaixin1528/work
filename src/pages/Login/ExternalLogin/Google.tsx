import { useGoogleLogin } from "@react-oauth/google";
import React from "react";
import { OIDCLogin } from "src/services/session";
import { handle2FA } from "src/utils/general";

const Google = ({
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
  const oidcLogin = OIDCLogin();

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: (res) => {
      oidcLogin.mutate(
        {
          authCode: { code: res.code },
        },
        {
          onSuccess: (data) => {
            if (data)
              handle2FA(
                data,
                setCustomerID,
                setTwoFaNeeded,
                setTwoFaSetup,
                setQRCodeValue,
                setSetupKey,
                setVerifyEmail,
                twoFAInitialSetup,
                enabledModulesOnLogin
              );
          },
        }
      );
    },
  });

  return (
    <button
      onClick={() => googleLogin()}
      className="p-3 mx-auto font-light dark:text-gray-500 dark:bg-gray-200 dark:hover:bg-gray-300 duration-100 rounded-full"
    >
      <img src="/general/login/google.svg" alt="google" className="w-10 h-10" />
    </button>
  );
};

export default Google;
