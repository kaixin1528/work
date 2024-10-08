import React, { useState } from "react";
import ModalLayout from "../../layouts/ModalLayout";
import { getSessionTimeout } from "src/utils/general";

const SessionTimeout = () => {
  const sessionTimeout = getSessionTimeout();

  const [forcedLogout, setForcedLogout] = useState<boolean>(
    sessionTimeout === "true"
  );

  const handleOnClose = () => {
    sessionStorage.removeItem("sessionTimeout");
    setForcedLogout(false);
  };

  return (
    <ModalLayout showModal={forcedLogout} onClose={handleOnClose}>
      <section className="grid gap-5">
        <h3 className="text-base text-left border-b-1 dark:border-checkbox">
          Session Timeout
        </h3>

        <h4>
          You have been signed out due to inactivity. Please re-authenticate.
        </h4>

        <button
          className="py-1 px-5 mx-auto text-sm gradient-button focus:outline-none rounded-sm"
          onClick={handleOnClose}
        >
          Continue
        </button>
      </section>
    </ModalLayout>
  );
};

export default SessionTimeout;
