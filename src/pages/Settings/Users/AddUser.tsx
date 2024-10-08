import {
  faChevronCircleDown,
  faChevronCircleRight,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { User } from "@sentry/browser";
import React, { useState } from "react";
import Lottie from "react-lottie-player";
import CustomerFilter from "../../../components/Filter/Settings/CustomerFilter";
import GroupFilter from "../../../components/Filter/Settings/GroupFilter";
import RoleFilter from "../../../components/Filter/Settings/RoleFilter";
import { baseURL } from "../../../constants/general";
import {
  GetAllUsers,
  CreateUser,
  SendTempPasswordEmail,
  SendLoginEmail,
} from "../../../services/settings/users";
import {
  Customer,
  CustomerEnv,
  Group,
  Role,
  UserDetails,
} from "../../../types/settings";
import waitingTea from "../../../lottie/coffee.json";
import {
  checkSuperOrSiteAdmin,
  decodeJWT,
  getCustomerID,
} from "../../../utils/general";
import ModalLayout from "../../../layouts/ModalLayout";
import { queryClient } from "src/App";
import { GetCustomerEnvs } from "src/services/settings/environments";
import { GetAllGroups } from "src/services/settings/groups";
import { GetCustomers } from "src/services/settings/organization";
import { GetAllRoles } from "src/services/settings/roles";
import RegularInput from "src/components/Input/RegularInput";
import CopyToClipboard from "src/components/General/CopyToClipboard";
import { Disclosure } from "@headlessui/react";

const AddUser = ({
  customerID,
  setCustomerID,
}: {
  customerID: string;
  setCustomerID: (customerID: string) => void;
}) => {
  const jwt = decodeJWT();
  const jwtCustomerID = getCustomerID();
  const isSuperOrSiteAdmin = checkSuperOrSiteAdmin();

  const [addUser, setAddUser] = useState<boolean>(false);
  const [addUserDetails, setAddUserDetails] = useState<UserDetails>({
    user_name: "",
    user_email: "",
    user_given_name: "",
    user_family_name: "",
    oidc_account_id: "",
    default_env: "",
    group_ids: [],
    role_ids: [],
  });

  const [valid, setValid] = useState<boolean>(true);
  const [tempEmailSent, setTempEmailSent] = useState<boolean>(false);

  const filteredCustomerID = isSuperOrSiteAdmin ? customerID : jwtCustomerID;

  const { data: customerEnvs } = GetCustomerEnvs(filteredCustomerID);
  const { data: allCustomers } = GetCustomers(isSuperOrSiteAdmin);
  const { data: allGroups } = GetAllGroups(jwtCustomerID, isSuperOrSiteAdmin);
  const { data: allUsers } = GetAllUsers(jwtCustomerID, isSuperOrSiteAdmin);
  const { data: allRoles } = GetAllRoles(filteredCustomerID);
  const createUser = CreateUser();
  const sendTempPasswordEmail = SendTempPasswordEmail(filteredCustomerID);
  const sendLoginEmail = SendLoginEmail();

  const handleAddUser = () => {
    setValid(true);
    createUser.mutate(
      {
        customerID: filteredCustomerID,
        user: {
          ...addUserDetails,
          role_ids: addUserDetails.role_ids,
          default_env: isSuperOrSiteAdmin
            ? customerEnvs?.find(
                (customerEnv: CustomerEnv) => customerEnv.env_type === "DEFAULT"
              )?.env_id
            : jwt?.defaultEnvTypeID,
        },
      },
      {
        onSuccess: (data) => {
          if (data.customer.auth_scheme === "OIDC") {
            sendLoginEmail.mutate(
              {
                customerID: filteredCustomerID,
                customerName:
                  allCustomers?.find(
                    (customer: Customer) =>
                      customer.customer_id === filteredCustomerID
                  )?.customer_name || jwt?.scope.customer_name,
                loginEmail: {
                  email: addUserDetails.user_email,
                  user_id: data.user_id,
                  base_url: String(baseURL).includes("localhost")
                    ? "http://localhost:3000"
                    : baseURL,
                  expiration_time_in_mins: 43800,
                },
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries(["get-all-users"]);
                  setTempEmailSent(true);
                },
              }
            );
          } else {
            sendTempPasswordEmail.mutate(
              {
                tempPasswordEmail: {
                  email: addUserDetails.user_email,
                  user_id: data.user_id,
                  base_url: String(baseURL).includes("localhost")
                    ? "http://localhost:3000"
                    : baseURL,
                  expiration_time_in_mins: 2880,
                },
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries(["get-all-users"]);
                  setTempEmailSent(true);
                },
              }
            );
          }
        },
      }
    );
  };

  const disabled =
    createUser.status === "loading" ||
    sendTempPasswordEmail.status === "loading" ||
    sendLoginEmail.status === "loading";

  const handleOnClose = () => {
    setValid(true);
    setAddUser(false);
    setCustomerID("");
    setTempEmailSent(false);
  };

  return (
    <>
      <button
        className="px-4 py-2 green-gradient-button duration-100 rounded-sm"
        onClick={() => {
          setAddUser(true);
          setCustomerID("");
          setAddUserDetails({
            user_name: "",
            user_email: "",
            user_given_name: "",
            user_family_name: "",
            oidc_account_id: "",
            default_env: "",
            group_ids: [],
            role_ids: [],
          });
        }}
      >
        Add User
      </button>
      <ModalLayout showModal={addUser} onClose={handleOnClose}>
        {addUser ? (
          !tempEmailSent ? (
            <>
              <h4 className="mb-3 text-center text-base">Add User</h4>
              <section className="grid gap-7">
                <RegularInput
                  label="User Name"
                  keyName="user_name"
                  inputs={addUserDetails}
                  setInputs={setAddUserDetails}
                  disabled={disabled}
                />
                <RegularInput
                  label="Email"
                  keyName="user_email"
                  inputs={addUserDetails}
                  setInputs={setAddUserDetails}
                  disabled={disabled}
                  valid={valid}
                  setValid={setValid}
                />
                <article className="grid gap-10 mt-3">
                  <article className="grid items-center gap-5">
                    {/* add customer if super admin */}
                    {isSuperOrSiteAdmin && (
                      <CustomerFilter
                        allCustomers={allCustomers}
                        value={
                          allCustomers?.find(
                            (customer: Customer) =>
                              customer.customer_id === customerID
                          )?.customer_name || ""
                        }
                        setValue={setCustomerID}
                        list={allCustomers?.reduce(
                          (pV: string[], cV: Customer) => [
                            ...pV,
                            cV.customer_name,
                          ],
                          []
                        )}
                      />
                    )}

                    {/* add groups if non super admin */}
                    {!isSuperOrSiteAdmin && (
                      <article className="grid items-center gap-5 w-full">
                        <ul className="flex flex-wrap items-center gap-2 text-xs">
                          {addUserDetails.group_ids.map((groupID: string) => {
                            return (
                              <li
                                key={groupID}
                                className="flex items-center gap-2 px-2 py-1 dark:bg-signin/60 border dark:border-signin rounded-sm"
                              >
                                <button
                                  className="dark:hover:text-filter/60 duration-100"
                                  onClick={() =>
                                    setAddUserDetails({
                                      ...addUserDetails,
                                      group_ids:
                                        addUserDetails.group_ids.filter(
                                          (curGroupID: string) =>
                                            curGroupID !== groupID
                                        ),
                                    })
                                  }
                                >
                                  <FontAwesomeIcon icon={faXmark} />
                                </button>
                                {allGroups?.find(
                                  (group: Group) => group.group_id === groupID
                                )?.group_name || ""}
                              </li>
                            );
                          })}
                        </ul>
                        <GroupFilter
                          allGroups={allGroups}
                          details={addUserDetails}
                          label="Group:"
                          value={
                            allGroups?.find(
                              (group: Group) =>
                                group.group_id ===
                                addUserDetails.group_ids[
                                  addUserDetails.group_ids.length - 1
                                ]
                            )?.group_name || ""
                          }
                          setValue={setAddUserDetails}
                          list={allGroups?.reduce(
                            (pV: string[], cV: Group) => [...pV, cV.group_name],
                            []
                          )}
                        />
                      </article>
                    )}

                    {/* add roles if not super admin */}
                    {filteredCustomerID !== "" && (
                      <article className="grid items-center gap-5 w-full">
                        <ul className="flex flex-wrap items-center gap-2 text-xs">
                          {addUserDetails.role_ids.map((roleID: string) => {
                            return (
                              <li
                                key={roleID}
                                className="flex items-center gap-2 px-2 py-1 dark:bg-signin/60 border dark:border-signin rounded-sm"
                              >
                                <button
                                  className="dark:hover:text-filter/60 duration-100"
                                  onClick={() =>
                                    setAddUserDetails({
                                      ...addUserDetails,
                                      role_ids: addUserDetails.role_ids.filter(
                                        (curRoleID: string) =>
                                          curRoleID !== roleID
                                      ),
                                    })
                                  }
                                >
                                  <FontAwesomeIcon icon={faXmark} />
                                </button>
                                {allRoles?.find(
                                  (role: Role) => role.role_id === roleID
                                )?.role_name || ""}
                              </li>
                            );
                          })}
                        </ul>
                        <RoleFilter
                          allRoles={allRoles}
                          details={addUserDetails}
                          value={
                            allRoles?.find(
                              (role: Role) =>
                                role.role_id ===
                                addUserDetails.role_ids[
                                  addUserDetails.role_ids.length - 1
                                ]
                            )?.role_name || ""
                          }
                          setValue={setAddUserDetails}
                          list={
                            [
                              ...new Set(
                                allRoles?.reduce((pV: string[], cV: Role) => {
                                  if (
                                    !isSuperOrSiteAdmin &&
                                    ["Super-Admin", "Admin"].includes(
                                      cV.role_type
                                    )
                                  )
                                    return [...pV];
                                  return [...pV, cV.role_name];
                                }, [])
                              ),
                            ] as string[]
                          }
                          showAbove
                        />
                      </article>
                    )}
                  </article>

                  {disabled && (
                    <article className="absolute top-1/3 left-1/2 -translate-x-1/2 grid mx-auto w-32 h-12">
                      <article className="h-[7rem]">
                        <Lottie
                          loop
                          animationData={waitingTea}
                          play={true}
                          rendererSettings={{
                            preserveAspectRatio: "xMidYMid slice",
                          }}
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      </article>
                    </article>
                  )}

                  {/* create user */}
                  <button
                    disabled={
                      addUserDetails.user_name === "" ||
                      addUserDetails.user_email === "" ||
                      (isSuperOrSiteAdmin && customerID === "") ||
                      disabled
                    }
                    className="px-4 py-2 mx-auto text-sm gradient-button rounded-sm"
                    onClick={() => {
                      const nameExist = allUsers?.some(
                        (user: User) =>
                          user.user_email.toLowerCase() ===
                          addUserDetails.user_email?.toLowerCase()
                      );

                      if (nameExist) setValid(false);
                      else handleAddUser();
                    }}
                  >
                    Add User
                  </button>
                </article>
              </section>
            </>
          ) : (
            <section className="grid content-start gap-2 p-5 text-center dark:bg-info">
              <img src="/general/true.svg" alt="true" className="mx-auto" />
              {sendTempPasswordEmail.data?.link ? (
                <article className="grid gap-2 mx-auto">
                  <article className="flex items-start gap-2">
                    <CopyToClipboard
                      copiedValue={sendTempPasswordEmail.data.link}
                    />
                    <span>Reset Password Link</span>
                  </article>
                  <Disclosure>
                    {({ open }) => (
                      <section className="grid content-start gap-3 mx-auto">
                        <Disclosure.Button className="flex items-center gap-2 mx-auto">
                          <p>Reset Password Link</p>
                          <FontAwesomeIcon
                            icon={
                              open ? faChevronCircleDown : faChevronCircleRight
                            }
                            className="dark:text-checkbox"
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel>
                          <p className="break-all text-center">
                            {sendTempPasswordEmail.data.link}
                          </p>
                        </Disclosure.Panel>
                      </section>
                    )}
                  </Disclosure>
                </article>
              ) : (
                <>
                  <p>
                    {createUser.data?.customer.auth_scheme === "OIDC"
                      ? "An email with a link to login via Google has been sent."
                      : "An email with the temporary password has been sent out. The password reset link will expire in 48 hours, so please make sure to click through and reset the password in time."}
                  </p>
                  <button
                    className="px-4 py-1 mt-3 justify-self-center text-xs gradient-button rounded-sm"
                    onClick={handleOnClose}
                  >
                    Got it!
                  </button>
                </>
              )}
            </section>
          )
        ) : null}
      </ModalLayout>
    </>
  );
};

export default AddUser;
