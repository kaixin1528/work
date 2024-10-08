/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import { faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { baseURL, validVariants } from "../constants/general";
import jwt_decode from "jwt-decode";
import { SendTempPasswordEmail } from "../services/settings/users";
import { useNavigate } from "react-router-dom";
import OTPInput from "./Login/TwoFA/OTPInput";
import GenerateSecret from "./Login/TwoFA/GenerateSecret";
import {
  TempPasswordSet,
  UpdateUserPassword,
  TwoFAInitialSetup,
  VerifyOTP,
} from "../services/session";
import SessionLayout from "../layouts/SessionLayout";
import { parseURL } from "../utils/general";

const ResetPassword = () => {
  const navigate = useNavigate();
  const parsed = parseURL();
  const jwt = jwt_decode(String(parsed.token)) as any;
  const customerID = jwt?.customer_id;

  const inputRef = useRef([]) as MutableRefObject<HTMLInputElement[]>;
  const [inputs, setInputs] = useState({
    customer_id: customerID || "",
    user_email: jwt?.email || "",
    temp_password: jwt?.temp_password || "",
    new_password: "",
    confirm_new_password: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    new_password: false,
    confirm_new_password: false,
  });

  const [passwordMismatch, setPasswordMismatch] = useState<boolean>(false);
  const [twoFaNeeded, setTwoFaNeeded] = useState<boolean>(false);
  const [qrCodeValue, setQRCodeValue] = useState<string>("");
  const [setupKey, setSetupKey] = useState<string>("");
  const [otpCode, setOTPCode] = useState<string>("");
  const [twoFaNav, setTwoFaNav] = useState<number>(1);
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const { data: tempPasswordSet } = TempPasswordSet(
    customerID,
    jwt?.email,
    jwt?.temp_password
  );
  const sendTempPasswordEmail = SendTempPasswordEmail(customerID);
  const updateUserPassword = UpdateUserPassword(customerID);
  const twoFAInitialSetup = TwoFAInitialSetup();
  const verifyOTP = VerifyOTP();

  const handleResetPassword = useCallback(
    (e) => {
      e.preventDefault();

      if (inputs.new_password !== inputs.confirm_new_password)
        setPasswordMismatch(true);
      else setPasswordMismatch(false);

      updateUserPassword.mutate(
        {
          newPassword: Object.fromEntries(
            Object.entries(inputs).filter(
              ([key, _]) => !["confirm_new_password"].includes(key)
            )
          ),
        },
        {
          onSuccess: (data) => {
            const decodeJWT = jwt_decode(String(data.access_token)) as any;
            if (decodeJWT.twofa_needed && !decodeJWT.twofa_is_setup) {
              setTwoFaNeeded(true);
              twoFAInitialSetup.mutate(
                {
                  customerID: customerID,
                  email: { user_email: jwt?.email },
                },
                {
                  onSuccess: (data) => {
                    setQRCodeValue(data.uri);
                    setSetupKey(data.setup_key);
                  },
                }
              );
            } else navigate("/signin");
          },
        }
      );
    },
    [inputs]
  );

  useEffect(() => {
    const handleKeyEnter = (e: { key: string }) => {
      if (
        e.key === "Enter" &&
        inputs.new_password &&
        inputs.confirm_new_password
      )
        return handleResetPassword(e);
    };
    document.addEventListener("keydown", handleKeyEnter);
    return function cleanup() {
      document.removeEventListener("keydown", handleKeyEnter);
    };
  }, [handleResetPassword]);

  useEffect(() => {
    if (otpCode.length === 6)
      verifyOTP.mutate(
        {
          customerID: customerID,
          info: {
            user_email: jwt?.email,
            input_otp: otpCode,
          },
        },
        {
          onSuccess: (data) => {
            if (data) setTwoFaNav(3);
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
      {/* if current time passes the expiration time and password is not yet updated  */}
      {tempPasswordSet?.has_expired && (
        <section className="grid py-10 gap-3 dark:bg-info">
          {!emailSent ? (
            <section className="grid py-10 gap-3 dark:bg-info">
              <p>The link has expired......</p>
              <button
                className="py-1 px-10 mx-auto text-sm gradient-button rounded-sm"
                onClick={() =>
                  sendTempPasswordEmail.mutate(
                    {
                      tempPasswordEmail: {
                        email: jwt?.email,
                        base_url: String(baseURL).includes("localhost")
                          ? "http://localhost:3000"
                          : baseURL,
                        expiration_time_in_mins: 2880,
                      },
                    },
                    {
                      onSuccess: () => setEmailSent(true),
                    }
                  )
                }
              >
                Resend reset password email
              </button>
            </section>
          ) : (
            <article className="grid content-start gap-2 p-5 px-10 mx-auto">
              <img src="/general/true.svg" alt="true" className="mx-auto" />
              <p>
                An email with the temporary password has been sent out again.
                The password reset link will expire in 48 hours, so please make
                sure to click through and reset the password in time.
              </p>
            </article>
          )}
        </section>
      )}

      {/* temp password has already been set */}
      {tempPasswordSet?.been_used && (
        <article className="grid gap-2 mb-5">
          <p className="p-2 mx-auto w-max text-xs text-left uppercase dark:bg-inner border dark:border-error rounded-sm">
            {tempPasswordSet?.detail}
          </p>
          <button
            className="py-1 px-10 mx-auto text-sm gradient-button rounded-sm"
            onClick={() => window.location.assign("/signin")}
          >
            Return to login
          </button>
        </article>
      )}

      {/* for regular users */}
      {!tempPasswordSet?.been_used &&
        !tempPasswordSet?.has_expired &&
        !twoFaNeeded && (
          <section className="grid py-10 gap-5 dark:bg-info">
            <article>
              <h3 className="text-lg">Welcome Back</h3>
              <p className="px-5 text-sm dark:text-checkbox">
                Please reset the password to set up your account
              </p>
            </article>

            {/* confirm password doesn't match */}
            {passwordMismatch && (
              <motion.article
                variants={validVariants}
                initial="hidden"
                animate={passwordMismatch ? "visible" : "hidden"}
                data-test="passwords-not-match"
                className="p-2 mx-auto w-max text-xs text-left uppercase dark:bg-inner border dark:border-error rounded-sm"
              >
                <p>Please make sure your passwords match</p>
              </motion.article>
            )}

            <article className="grid gap-5 px-16 text-sm">
              <article
                className={`flex items-center py-2 px-6 ${
                  ["loading", "success"].includes(updateUserPassword.status)
                    ? "dark:text-filter/60 dark:bg-search/80"
                    : "dark:text-white dark:bg-search"
                } dark:ring-search ring-2 dark:focus:ring-signin rounded-sm`}
              >
                <FontAwesomeIcon
                  icon={faLock}
                  className={`${
                    ["loading", "success"].includes(updateUserPassword.status)
                      ? "dark:text-filter/60"
                      : "dark:text-checkbox"
                  } w-4 h-4`}
                />
                <input
                  spellCheck="false"
                  autoComplete="off"
                  name="new password"
                  data-test="new password"
                  disabled={["loading", "success"].includes(
                    updateUserPassword.status
                  )}
                  value={inputs.new_password}
                  onChange={(e) =>
                    setInputs({ ...inputs, new_password: e.target.value })
                  }
                  type={showPasswords.new_password ? "input" : "password"}
                  placeholder="Enter your new password"
                  className={`form-input py-1 ${
                    showPasswords.new_password ? "pl-4 pr-4" : "pl-1 pr-4"
                  }  w-full h-8 text-sm focus:outline-none placeholder:text-sm dark:placeholder:text-checkbox dark:hover:placeholder:text-white dark:bg-search dark:border-transparent dark:focus:ring-0 dark:focus:border-transparent`}
                />
                <button
                  className="dark:text-checkbox"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      new_password: !showPasswords.new_password,
                    })
                  }
                >
                  {showPasswords.new_password ? (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  ) : (
                    <FontAwesomeIcon icon={faEye} />
                  )}
                </button>
              </article>
              <article
                className={`flex items-center py-2 px-6 ${
                  ["loading", "success"].includes(updateUserPassword.status)
                    ? "dark:text-filter/60 dark:bg-search/80"
                    : "dark:text-white dark:bg-search"
                } dark:ring-search ring-2 dark:focus:ring-signin rounded-sm`}
              >
                <FontAwesomeIcon
                  icon={faLock}
                  className={`${
                    ["loading", "success"].includes(updateUserPassword.status)
                      ? "dark:text-filter/60"
                      : "dark:text-checkbox"
                  } w-4 h-4`}
                />
                <input
                  spellCheck="false"
                  autoComplete="off"
                  name="confirm new password"
                  data-test="confirm new password"
                  disabled={["loading", "success"].includes(
                    updateUserPassword.status
                  )}
                  value={inputs.confirm_new_password}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      confirm_new_password: e.target.value,
                    })
                  }
                  type={
                    showPasswords.confirm_new_password ? "input" : "password"
                  }
                  placeholder="Confirm your new password"
                  className={`form-input py-1 ${
                    showPasswords.confirm_new_password
                      ? "pl-4 pr-4"
                      : "pl-1 pr-4"
                  }  w-full h-8 text-sm focus:outline-none placeholder:text-sm dark:placeholder:text-checkbox dark:hover:placeholder:text-white dark:bg-search dark:border-transparent dark:focus:ring-0 dark:focus:border-transparent`}
                />
                <button
                  className="dark:text-checkbox"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      confirm_new_password: !showPasswords.confirm_new_password,
                    })
                  }
                >
                  {showPasswords.confirm_new_password ? (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  ) : (
                    <FontAwesomeIcon icon={faEye} />
                  )}
                </button>
              </article>
            </article>
            <button
              type="submit"
              data-test="submit"
              disabled={
                Object.values(inputs).includes("") ||
                ["loading", "success"].includes(updateUserPassword.status)
              }
              className="py-2 px-10 mx-auto text-sm dark:disabled:text-checkbox gradient-button rounded-sm"
              onClick={handleResetPassword}
            >
              Continue
            </button>
          </section>
        )}

      {/* for admin users */}
      {!tempPasswordSet?.has_expired && twoFaNeeded ? (
        twoFaNav === 1 && qrCodeValue !== "" ? (
          <GenerateSecret
            qrCodeValue={qrCodeValue}
            setupKey={setupKey}
            setTwoFaNav={setTwoFaNav}
          />
        ) : twoFaNav === 2 ? (
          <section className="grid content-start gap-5 p-10 dark:bg-info overflow-auto scrollbar">
            <h2 className="text-xl">One more step...</h2>

            <p className="text-xl tracking wide">Enter OTP:</p>

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
        ) : (
          twoFaNav === 3 && (
            <section className="grid content-start p-5 gap-5 text-center dark:bg-info">
              <h4 className="text-xl">Congratulations!</h4>
              <p>You have successfully set up two-factor authentication!</p>
              <button
                className="py-1 px-10 mx-auto text-sm gradient-button rounded-sm"
                onClick={() => window.location.assign("/signin")}
              >
                Return to login
              </button>
            </section>
          )
        )
      ) : null}
    </SessionLayout>
  );
};

export default ResetPassword;
