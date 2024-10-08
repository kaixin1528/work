/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  GetCustomerEnvs,
  UpdateCustomerEnv,
} from "../../../services/settings/environments";
import { getCustomerID } from "../../../utils/general";
import ModalLayout from "../../../layouts/ModalLayout";
import { queryClient } from "src/App";
import { CustomerEnv } from "src/types/settings";

const RenameEnvironment = ({
  envType,
  selectedRenameEnv,
  setSelectedRenameEnv,
  renameEnvType,
  setRenameEnvType,
}: {
  envType: string;
  selectedRenameEnv: string;
  setSelectedRenameEnv: (selectedRenameEnv: string) => void;
  renameEnvType: string;
  setRenameEnvType: (renameEnvType: string) => void;
}) => {
  const customerID = getCustomerID();

  const { data: customerEnvs } = GetCustomerEnvs(customerID);
  const updateCustomerEnv = UpdateCustomerEnv(customerID);

  const handleOnClose = () => setSelectedRenameEnv("");

  return (
    <ModalLayout
      showModal={selectedRenameEnv === envType}
      onClose={handleOnClose}
    >
      <section className="grid gap-5">
        <h4>Rename Environment</h4>
        <input
          type="input"
          value={renameEnvType}
          onChange={(e) => setRenameEnvType(e.target.value)}
          className="p-2 w-full dark:bg-search focus:outline-none"
        />
        <button
          disabled={renameEnvType === ""}
          className="justify-self-end px-4 py-1 text-xs gradient-button"
          onClick={() => {
            handleOnClose();
            setRenameEnvType("");
            updateCustomerEnv.mutate(
              {
                customerEnvID: customerEnvs?.find(
                  (customerEnv: CustomerEnv) =>
                    customerEnv.env_type === selectedRenameEnv
                )?.env_id,
                envType: { env_type: renameEnvType },
              },
              {
                onSuccess: () =>
                  queryClient.invalidateQueries(["get-customer-envs"]),
              }
            );
          }}
        >
          Rename
        </button>
      </section>
    </ModalLayout>
  );
};

export default RenameEnvironment;
