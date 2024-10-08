/* eslint-disable react-hooks/exhaustive-deps */
import { faKey, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { validVariants } from "../../constants/general";
import { UnoLogin } from "../../services/session";
import { useGeneralStore } from "../../stores/general";
import { handle2FA } from "../../utils/general";

const CustomLogin = ({
  showInputs,
  setShowInputs,
  setTwoFaNeeded,
  setTwoFaSetup,
  setQRCodeValue,
  setSetupKey,
  setVerifyEmail,
  setCustomerID,
  twoFAInitialSetup,
  enabledModulesOnLogin,
}: {
  showInputs: boolean;
  setShowInputs: (showInputs: boolean) => void;
  setTwoFaNeeded: (twoFaNeeded: boolean) => void;
  setTwoFaSetup: (twoFaSetup: boolean) => void;
  setQRCodeValue: (qrCodeValue: string) => void;
  setSetupKey: (setupKey: string) => void;
  setVerifyEmail: (verifyEmail: string) => void;
  setCustomerID: (customerID: string) => void;
  twoFAInitialSetup: any;
  enabledModulesOnLogin: any;
}) => {
  const { error, setError } = useGeneralStore();

  const [inputs, setInputs] = useState({
    account: "",
    email: "",
    password: "",
  });
  const credentials = new FormData();

  const unoLogin = UnoLogin();

  const handleLogin = useCallback(
    (e) => {
      e.preventDefault();

      credentials.append("account_alias", inputs.account);
      credentials.append("email", inputs.email);
      credentials.append("password", inputs.password);

      unoLogin.mutate(
        { credentials: credentials },
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
    [credentials, inputs.account, inputs.email, inputs.password]
  );

  useEffect(() => {
    const handleKeyEnter = (e: { key: string }) => {
      if (
        e.key === "Enter" &&
        inputs.account &&
        inputs.email &&
        inputs.password
      )
        return handleLogin(e);
    };
    document.addEventListener("keydown", handleKeyEnter);
    return function cleanup() {
      document.removeEventListener("keydown", handleKeyEnter);
    };
  }, [handleLogin]);

  return (
    <section className="grid gap-5 w-full h-full text-sm">
      {error.url === "/login" && error.message !== "" && (
        <motion.article
          variants={validVariants}
          initial="hidden"
          animate={error.message !== "" ? "visible" : "hidden"}
          data-test="incorrect-credentials"
          className="p-2 mx-auto break-all text-xs text-left dark:bg-inner border dark:border-error rounded-sm"
        >
          <p>{error.message}</p>
        </motion.article>
      )}
      <article className="grid gap-3 text-sm">
        <article className="flex items-center py-2 px-[1.45rem] dark:text-white dark:bg-search ring-0 dark:ring-search focus:ring-2 dark:focus:ring-signin rounded-sm">
          <FontAwesomeIcon
            icon={faKey}
            className="dark:text-checkbox w-4 h-4"
          />
          <input
            spellCheck="false"
            autoComplete="off"
            name="customer alias"
            data-test="customer-alias"
            disabled={unoLogin.status === "loading"}
            value={inputs.account}
            onChange={(e) => {
              setError({ url: "", message: "" });
              setInputs({ ...inputs, account: e.target.value });
            }}
            type="input"
            placeholder="Organization alias"
            className="py-1 px-3 w-full h-8 focus:outline-none dark:placeholder:text-checkbox dark:hover:placeholder:text-white dark:bg-transparent dark:bg-search dark:border-transparent dark:focus:ring-0 dark:focus:border-transparent"
          />
        </article>
        <article className="flex items-center py-2 px-6 dark:text-white dark:bg-search ring-0 dark:ring-search focus:ring-2 dark:focus:ring-signin rounded-sm">
          <FontAwesomeIcon
            icon={faEnvelope}
            className="dark:text-checkbox w-4 h-4"
          />
          <input
            spellCheck="false"
            autoComplete="off"
            name="user-email"
            data-test="email"
            disabled={unoLogin.status === "loading"}
            value={inputs.email}
            onChange={(e) => {
              setError({ url: "", message: "" });
              setInputs({ ...inputs, email: e.target.value });
            }}
            type="input"
            placeholder="Email"
            className="py-1 px-3 w-full h-8 focus:outline-none dark:placeholder:text-checkbox dark:hover:placeholder:text-white dark:bg-transparent dark:bg-search dark:border-transparent dark:focus:ring-0 dark:focus:border-transparent"
          />
        </article>
        <article className="flex items-center py-2 px-6 dark:text-white dark:bg-search dark:ring-search ring-2 dark:focus:ring-signin rounded-sm">
          <FontAwesomeIcon
            icon={faLock}
            className="dark:text-checkbox w-4 h-4"
          />
          <input
            spellCheck="false"
            autoComplete="off"
            name="password"
            data-test="password"
            disabled={unoLogin.status === "loading"}
            value={inputs.password}
            onChange={(e) => {
              setError({ url: "", message: "" });
              setInputs({ ...inputs, password: e.target.value });
            }}
            type="password"
            placeholder="Password"
            className="form-input py-1 px-6 w-full h-8 focus:outline-none placeholder:text-sm dark:placeholder:text-checkbox dark:hover:placeholder:text-white dark:bg-search dark:border-transparent dark:focus:ring-0 dark:focus:border-transparent"
          />
        </article>
      </article>
      <button
        type="submit"
        data-test="submit"
        disabled={
          Object.values(inputs).includes("") || unoLogin.status === "loading"
        }
        className="py-2 px-10 mx-auto text-sm dark:disabled:text-checkbox gradient-button rounded-sm"
        onClick={handleLogin}
      >
        Sign In
      </button>
    </section>
  );
};

export default CustomLogin;
