/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid*/
import { MutableRefObject, useEffect, useRef, useState } from "react";
import OTPInput from "./TwoFA/OTPInput";
import GenerateSecret from "./TwoFA/GenerateSecret";
import {
  getAccessToken,
  getSessionTimeout,
  onLogin,
} from "../../utils/general";
import CustomLogin from "./CustomLogin";
import ExternalLogin from "./ExternalLogin/ExternalLogin";
import SessionLayout from "../../layouts/SessionLayout";
import { TwoFAInitialSetup, VerifyOTP } from "src/services/session";
import { GetEnabledModulesOnLogin } from "src/services/general/general";

const Login = () => {
  const accessToken = getAccessToken();
  const sessionTimeout = getSessionTimeout();

  const isSignedIn =
    sessionTimeout !== null ? false : navigator.onLine && accessToken !== "";

  const [showInputs, setShowInputs] = useState<boolean>(false);
  const [twoFaNeeded, setTwoFaNeeded] = useState<boolean>(false);
  const [twoFaSetup, setTwoFaSetup] = useState<boolean>(true);
  const [twoFaNav, setTwoFaNav] = useState<number>(1);
  const [qrCodeValue, setQRCodeValue] = useState<string>("");
  const [setupKey, setSetupKey] = useState<string>("");
  const [otpCode, setOTPCode] = useState<string>("");
  const [verifyEmail, setVerifyEmail] = useState<string>("");
  const [customerID, setCustomerID] = useState<string>("");

  const inputRef = useRef([]) as MutableRefObject<HTMLInputElement[]>;

  const twoFAInitialSetup = TwoFAInitialSetup();
  const verifyOTP = VerifyOTP();
  const enabledModulesOnLogin = GetEnabledModulesOnLogin();

  useEffect(() => {
    if (sessionStorage.accessToken && enabledModulesOnLogin.data) {
      const previousPath = sessionStorage.previousPath;
      if (previousPath) {
        sessionStorage.removeItem("previousPath");
        window.location.assign(previousPath);
      } else if (!enabledModulesOnLogin.data?.includes("EXTRA"))
        window.location.assign("/regulation-policy/summary");
      else window.location.assign("/getting-started");
    }
  }, [enabledModulesOnLogin.data]);

  useEffect(() => {
    if (isSignedIn) onLogin(accessToken, enabledModulesOnLogin);
  }, [isSignedIn]);

  useEffect(() => {
    if (otpCode.length === 6)
      verifyOTP.mutate(
        {
          customerID: customerID,
          info: {
            user_email: verifyEmail,
            input_otp: otpCode,
          },
        },
        {
          onSuccess: (data) => {
            if (data?.access_token)
              onLogin(data.access_token, enabledModulesOnLogin);
            else {
              setOTPCode("");
              if (inputRef?.current) inputRef?.current[0]?.focus();
            }
          },
        }
      );
  }, [otpCode]);

  return (
    <SessionLayout>
      {/* for regular users */}
      {!twoFaNeeded ? (
        <section className="grid grid-cols-1 gap-5 p-10 dark:text-white dark:bg-info">
          {/* external providers login */}
          {!showInputs && (
            <ExternalLogin
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

          <article className="flex items-center gap-1">
            <span className="w-full border-b-1 dark:border-checkbox/60"></span>
            <h5 className="w-full text-sm font-light">or sign in with</h5>
            <span className="w-full border-b-1 dark:border-checkbox/60"></span>
          </article>

          {/* uno login */}
          <CustomLogin
            showInputs={showInputs}
            setShowInputs={setShowInputs}
            setTwoFaNeeded={setTwoFaNeeded}
            setTwoFaSetup={setTwoFaSetup}
            setQRCodeValue={setQRCodeValue}
            setSetupKey={setSetupKey}
            setVerifyEmail={setVerifyEmail}
            setCustomerID={setCustomerID}
            twoFAInitialSetup={twoFAInitialSetup}
            enabledModulesOnLogin={enabledModulesOnLogin}
          />
        </section>
      ) : // for admin users, show qr code if secret is not populated or secret is populated but 2fa is not setup
      !twoFaSetup && twoFaNav === 1 && qrCodeValue !== "" && setupKey !== "" ? (
        <GenerateSecret
          qrCodeValue={qrCodeValue}
          setupKey={setupKey}
          setTwoFaNav={setTwoFaNav}
        />
      ) : (
        // for admin users, if 2fa is not setup or qr coded is not needed
        ((!twoFaSetup && twoFaNav === 2) || twoFaSetup) && (
          <section className="grid content-start gap-5 p-10 dark:bg-info">
            {!twoFaSetup && <h2 className="text-xl">One more step...</h2>}
            <p className="text-xl tracking-wide">Enter OTP:</p>
            {verifyOTP.status === "success" && !verifyOTP.data && (
              <p className="p-2 mx-auto w-max text-xs text-left uppercase dark:bg-inner border dark:border-error rounded-sm">
                OTP code is not correct. Please try again.
              </p>
            )}

            <OTPInput
              otpCode={otpCode}
              setOTPCode={setOTPCode}
              codeLength={6}
              inputRef={inputRef}
            />
          </section>
        )
      )}
    </SessionLayout>
  );
};

export default Login;
