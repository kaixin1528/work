/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import CustomerFilter from "../../../components/Filter/Settings/CustomerFilter";
import ModalLayout from "../../../layouts/ModalLayout";
import {
  GetAllRoles,
  GetAdminRoles,
  CreateRole,
} from "../../../services/settings/roles";
import { Role, Customer } from "../../../types/settings";
import { checkSuperOrSiteAdmin, getCustomerID } from "../../../utils/general";
import { GetCustomers } from "src/services/settings/organization";
import RegularInput from "src/components/Input/RegularInput";

const AddRole = ({
  customerID,
  setCustomerID,
}: {
  customerID: string;
  setCustomerID: (customerID: string) => void;
}) => {
  const isSuperOrSiteAdmin = checkSuperOrSiteAdmin();

  const [addRole, setAddRole] = useState<boolean>(false);
  const [addRoleDetails, setAddRoleDetails] = useState({
    role_name: "",
    role_type: isSuperOrSiteAdmin ? "Admin" : "Regular",
  });
  const [valid, setValid] = useState<boolean>(true);

  const { data: allCustomers } = GetCustomers(isSuperOrSiteAdmin);
  const { data: allRoles } = GetAllRoles(getCustomerID());
  const { data: adminRoles } = GetAdminRoles(isSuperOrSiteAdmin);
  const createRole = CreateRole();

  const roles = isSuperOrSiteAdmin
    ? adminRoles
    : allRoles?.filter((role: Role) => role.role_type !== "Admin");

  const handleOnClose = () => {
    setValid(true);
    setAddRole(false);
    setCustomerID("");
  };

  return (
    <>
      <button
        className="px-4 py-2 green-gradient-button duration-100 rounded-sm"
        onClick={() => {
          setAddRole(true);
          setAddRoleDetails({
            role_name: "",
            role_type: isSuperOrSiteAdmin ? "Admin" : "Regular",
          });
        }}
      >
        Add Role
      </button>
      <ModalLayout showModal={addRole} onClose={handleOnClose}>
        <header className="text-center mb-3">
          <h4 className="text-base">Add Role</h4>
          <p className="dark:text-checkbox">Enter details to create a role</p>
        </header>
        <section className="grid gap-5">
          <RegularInput
            label="Role Name"
            keyName="role_name"
            inputs={addRoleDetails}
            setInputs={setAddRoleDetails}
            valid={valid}
            setValid={setValid}
          />

          {/* add customer if super admin */}
          {isSuperOrSiteAdmin && (
            <CustomerFilter
              allCustomers={allCustomers}
              value={
                allCustomers?.find(
                  (customer: Customer) => customer.customer_id === customerID
                )?.customer_name || ""
              }
              setValue={setCustomerID}
              list={allCustomers?.reduce(
                (pV: string[], cV: Customer) => [...pV, cV.customer_name],
                []
              )}
            />
          )}
          <button
            disabled={
              Object.values(addRoleDetails).includes("") ||
              (isSuperOrSiteAdmin && customerID === "")
            }
            className="mt-5 px-4 py-2 mx-auto text-sm green-gradient-button rounded-sm"
            onClick={() => {
              if (
                roles?.some(
                  (role: Role) =>
                    role.role_name.toLowerCase() ===
                    addRoleDetails.role_name.toLowerCase()
                )
              )
                setValid(false);
              else {
                handleOnClose();
                createRole.mutate({
                  customerID: isSuperOrSiteAdmin ? customerID : getCustomerID(),
                  role: addRoleDetails,
                });
              }
            }}
          >
            Add Role
          </button>
        </section>
      </ModalLayout>
    </>
  );
};

export default AddRole;
