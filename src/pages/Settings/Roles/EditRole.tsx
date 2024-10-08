/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import ModalLayout from "../../../layouts/ModalLayout";
import {
  UpdateRole,
  GetRoleInfo,
  GetAllRoles,
} from "../../../services/settings/roles";
import { Role } from "../../../types/settings";
import { getCustomerID } from "../../../utils/general";
import { initialRoleDetails } from "src/constants/settings";
import RegularInput from "src/components/Input/RegularInput";

const EditRole = ({
  editRole,
  setEditRole,
  role,
  setCustomerID,
}: {
  editRole: string;
  setEditRole: (editRole: string) => void;
  role: Role;
  setCustomerID: (customerID: string) => void;
}) => {
  const customerID = getCustomerID();

  const [editRoleDetails, setEditRoleDetails] = useState(initialRoleDetails);
  const [valid, setValid] = useState<boolean>(true);

  const { data: allRoles } = GetAllRoles(customerID);
  const { data: roleInfo } = GetRoleInfo(customerID, editRole);
  const updateRole = UpdateRole(customerID);

  useEffect(() => {
    if (roleInfo) {
      setEditRoleDetails({
        role_name: roleInfo.role_name || "",
        role_type: roleInfo.role_type || "",
      });
    }
  }, [roleInfo]);

  const handleOnClose = () => {
    setValid(true);
    setEditRole("");
    setCustomerID("");
    setEditRoleDetails(initialRoleDetails);
  };

  return (
    <ModalLayout showModal={editRole === role.role_id} onClose={handleOnClose}>
      <h4 className="text-base text-center mb-3">Edit Role</h4>
      <section className="grid gap-3">
        <RegularInput
          label="Role Name"
          keyName="role_name"
          inputs={editRoleDetails}
          setInputs={setEditRoleDetails}
          valid={valid}
          setValid={setValid}
        />
        <RegularInput
          label="Role Type"
          keyName="role_type"
          inputs={editRoleDetails}
          setInputs={setEditRoleDetails}
          disabled={true}
        />
        <button
          disabled={editRoleDetails.role_name === ""}
          className="mt-5 px-4 py-2 mx-auto text-sm gradient-button rounded-sm"
          onClick={() => {
            if (
              allRoles?.some(
                (role: Role) =>
                  role.role_id !== editRole &&
                  role.role_name.toLowerCase().trim() ===
                    editRoleDetails.role_name.toLowerCase().trim()
              )
            )
              setValid(false);
            else {
              handleOnClose();
              updateRole.mutate({
                roleID: editRole,
                role: editRoleDetails,
              });
            }
          }}
        >
          Update Role
        </button>
      </section>
    </ModalLayout>
  );
};

export default EditRole;
