import React, { useState } from "react";
import ModalLayout from "src/layouts/ModalLayout";
import { CloseInternalAudit } from "src/services/audits-assessments/internal-audit";

const CloseAudit = ({ auditID }: { auditID: string }) => {
  const [show, setShow] = useState<boolean>(false);

  const closeAudit = CloseInternalAudit(auditID);

  const handleOnClose = () => setShow(false);

  return (
    <>
      <button className="px-3 gradient-button" onClick={() => setShow(true)}>
        Close Audit
      </button>
      <ModalLayout showModal={show} onClose={() => setShow(false)}>
        <section className="grid gap-5">
          <h4 className="text-base text-center mb-3">
            Are you sure you want to close this internal audit?
          </h4>
          <section className="flex items-center gap-5 mx-auto text-sm">
            <button
              className="px-4 py-1 bg-gradient-to-b dark:from-filter dark:to-filter/60 dark:hover:from-filter dark:hover:to-filter/30 rounded-sm"
              onClick={handleOnClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-1 bg-gradient-to-b dark:from-signin dark:to-signin/60 dark:hover:from-signin dark:hover:to-signin/30 rounded-sm"
              onClick={() => {
                closeAudit.mutate({
                  auditID: auditID,
                });
                handleOnClose();
              }}
            >
              Close internal audit
            </button>
          </section>
        </section>
      </ModalLayout>
    </>
  );
};

export default CloseAudit;
