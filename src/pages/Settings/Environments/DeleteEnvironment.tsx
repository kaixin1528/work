import { faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { User } from "@sentry/browser";
import React from "react";
import ModalLayout from "../../../layouts/ModalLayout";
import {
  DeleteCustomerEnv,
  GetCustomerEnvs,
} from "../../../services/settings/environments";
import { CustomerEnv } from "../../../types/settings";
import { getCustomerID } from "../../../utils/general";
import { GetAllUsers } from "src/services/settings/users";

const DeleteEnvironment = ({
  envType,
  deleteEnvType,
  setDeleteEnvType,
}: {
  envType: string;
  deleteEnvType: string;
  setDeleteEnvType: (deleteEnvType: string) => void;
}) => {
  const customerID = getCustomerID();

  const { data: allUsers } = GetAllUsers(customerID, false);
  const { data: customerEnvs } = GetCustomerEnvs(customerID);
  const deleteEnv = DeleteCustomerEnv(customerID);

  const deleteEnvTypeID = customerEnvs?.find(
    (curEnvType: CustomerEnv) => curEnvType.env_type === deleteEnvType
  )?.env_id;

  const canDelete = allUsers?.every(
    (user: User) => user.default_env !== deleteEnvTypeID
  );

  const handleOnClose = () => setDeleteEnvType("");

  return (
    <ModalLayout showModal={deleteEnvType === envType} onClose={handleOnClose}>
      {deleteEnvType !== "" ? (
        canDelete ? (
          <section className="grid gap-5">
            <h4 className="px-4 text-base text-center">
              Are you sure you want to delete this environment? All associated
              accounts will also be deleted.
            </h4>
            <section className="flex items-center gap-5 mx-auto text-xs">
              <button
                className="px-4 py-1 bg-gradient-to-b dark:from-filter dark:to-filter/60 dark:hover:from-filter dark:hover:to-filter/30 rounded-sm"
                onClick={handleOnClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 bg-gradient-to-b dark:from-reset dark:to-reset/60 dark:hover:from-reset dark:hover:to-reset/30 rounded-sm"
                onClick={() => {
                  deleteEnv.mutate({
                    customerEnvID: deleteEnvTypeID,
                  });
                  handleOnClose();
                }}
              >
                Delete environment
              </button>
            </section>
          </section>
        ) : (
          <section className="grid content-start gap-5 p-5 text-center">
            <FontAwesomeIcon
              icon={faBan}
              className="w-10 h-10 mx-auto dark:text-reset"
            />
            <p>
              Please make sure no user's default environment is pointing to this
              environment before you try to delete.
            </p>
          </section>
        )
      ) : null}
    </ModalLayout>
  );
};

export default DeleteEnvironment;
