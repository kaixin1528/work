import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import ModalLayout from "src/layouts/ModalLayout";
import { RemoveAudit } from "src/services/audits-assessments/internal-audit";

const DeleteAudit = ({ auditID }: { auditID: string }) => {
  const [show, setShow] = useState<boolean>(false);

  const removeAudit = RemoveAudit();

  const handleOnClose = () => setShow(false);

  const deleting = removeAudit.status === "loading";

  return (
    <>
      <button
        disabled={deleting}
        className="flex items-center p-2 dark:disabled:bg-filter dark:bg-reset dark:hover:bg-reset/60 duration-100 rounded-full"
        onClick={() => setShow(true)}
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
      <ModalLayout showModal={show} onClose={() => setShow(false)}>
        <section className="grid gap-5">
          <h4 className="text-base text-center mb-3">
            Are you sure you want to delete this internal audit?
          </h4>
          <section className="flex items-center gap-5 mx-auto text-sm">
            <button
              className="px-4 py-1 bg-gradient-to-b dark:from-filter dark:to-filter/60 dark:hover:from-filter dark:hover:to-filter/30 rounded-sm"
              onClick={handleOnClose}
            >
              Cancel
            </button>
            <button
              disabled={deleting}
              className="px-4 py-1 red-gradient-button rounded-sm"
              onClick={() => {
                removeAudit.mutate({
                  auditID: auditID,
                });
                handleOnClose();
              }}
            >
              Delete internal audit
            </button>
          </section>
        </section>
      </ModalLayout>
    </>
  );
};

export default DeleteAudit;
