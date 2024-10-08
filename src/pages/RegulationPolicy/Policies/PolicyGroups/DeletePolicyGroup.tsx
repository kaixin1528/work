import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import ModalLayout from "src/layouts/ModalLayout";
import { RemovePolicyGroup } from "src/services/regulation-policy/policy";

const DeletePolicyGroup = ({ policyGroupID }: { policyGroupID: string }) => {
  const [show, setShow] = useState<boolean>(false);

  const deletePolicyGroup = RemovePolicyGroup();
  const deleting = deletePolicyGroup.status === "loading";

  const handleOnClose = () => setShow(false);

  return (
    <>
      <button
        disabled={deleting}
        className="flex items-center p-2 dark:disabled:bg-filter dark:bg-reset dark:hover:bg-reset/60 duration-100 rounded-full"
        onClick={() => setShow(true)}
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        <section className="grid gap-5">
          <h4 className="px-4 text-base text-center">
            Are you sure you want to delete this policy group?.
          </h4>
          <section className="flex items-center gap-5 mx-auto text-xs">
            <button
              className="px-4 py-2 bg-gradient-to-b dark:from-filter dark:to-filter/60 dark:hover:from-filter dark:hover:to-filter/30 rounded-sm"
              onClick={handleOnClose}
            >
              Cancel
            </button>
            <button
              disabled={deleting}
              className="px-4 py-2 red-gradient-button rounded-sm"
              onClick={() => {
                deletePolicyGroup.mutate({
                  policyGroupID: policyGroupID,
                });
                handleOnClose();
              }}
            >
              Delete Policy Group
            </button>
          </section>
        </section>
      </ModalLayout>
    </>
  );
};

export default DeletePolicyGroup;
