/* eslint-disable react-hooks/exhaustive-deps */
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import DefaultEnvFilter from "../../../components/Filter/Settings/DefaultEnvFilter";
import GroupFilter from "../../../components/Filter/Settings/GroupFilter";
import RoleFilter from "../../../components/Filter/Settings/RoleFilter";
import ModalLayout from "../../../layouts/ModalLayout";
import {
  UpdateUser,
  GetUserInfo,
  SendTempPasswordEmail,
} from "../../../services/settings/users";
import {
  UserDetails,
  UserGroup,
  UserRole,
  Role,
  Group,
  User,
  CustomerEnv,
} from "../../../types/settings";
import { checkSuperOrSiteAdmin, getCustomerID } from "../../../utils/general";
import { GetCustomerEnvs } from "src/services/settings/environments";
import { GetAllGroups } from "src/services/settings/groups";
import { GetAllRoles } from "src/services/settings/roles";
import PouringTea from "src/components/Loader/PouringTea";
import RegularInput from "src/components/Input/RegularInput";
import { baseURL } from "src/constants/general";

const EditUser = ({
  editUser,
  setEditUser,
  customerID,
  user,
}: {
  editUser: string;
  setEditUser: (editUser: string) => void;
  customerID: string;
  user: User;
}) => {
  const decodedCustomerID = getCustomerID();
  const isSuperOrSiteAdmin = checkSuperOrSiteAdmin();

  const [editUserDetails, setEditUserDetails] = useState<UserDetails>({
    user_name: "",
    user_email: "",
    default_env: "",
    group_ids: [],
    role_ids: [],
  });
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const { data: customerEnvs } = GetCustomerEnvs(
    isSuperOrSiteAdmin ? customerID : decodedCustomerID
  );
  const { data: allGroups } = GetAllGroups(
    decodedCustomerID,
    isSuperOrSiteAdmin
  );
  const { data: userInfo } = GetUserInfo(decodedCustomerID, editUser);
  const { data: allRoles } = GetAllRoles(
    isSuperOrSiteAdmin ? customerID : decodedCustomerID
  );
  const updateUser = UpdateUser(decodedCustomerID);
  const sendTempPasswordEmail = SendTempPasswordEmail(decodedCustomerID);

  useEffect(() => {
    if (userInfo) {
      setEditUserDetails({
        user_name: userInfo.user_name || "",
        user_email: userInfo.user_email || "",
        default_env: userInfo.default_env || "",
        group_ids:
          userInfo.groups?.reduce(
            (pV: string[], cV: UserGroup) => [...pV, cV.group_id],
            []
          ) || [],
        role_ids:
          userInfo.roles?.reduce(
            (pV: string[], cV: UserRole) => [...pV, cV.role_id],
            []
          ) || [],
      });
    }
  }, [userInfo]);

  const handleOnClose = () => {
    setEditUser("");
  };

  return (
    <ModalLayout showModal={editUser === user.user_id} onClose={handleOnClose}>
      <h4 className="text-base text-center mb-3">Edit User</h4>
      {userInfo?.is_oidc === false && (
        <button
          className="mx-auto border-b dark:border-signin dark:hover:border-signin/60 duration-100"
          onClick={() => {
            sendTempPasswordEmail.mutate(
              {
                tempPasswordEmail: {
                  email: user.user_email,
                  user_id: user.user_id,
                  base_url: String(baseURL).includes("localhost")
                    ? "http://localhost:3000"
                    : baseURL,
                  expiration_time_in_mins: 2880,
                },
              },
              {
                onSuccess: () => setEmailSent(true),
              }
            );
          }}
        >
          Reset Password
        </button>
      )}
      <ModalLayout showModal={emailSent} onClose={() => setEmailSent(false)}>
        <article className="grid content-start gap-2 p-5 px-10 mx-auto text-center">
          <img src="/general/true.svg" alt="true" className="mx-auto" />
          <p>
            An email with the temporary password has been sent out again. The
            password reset link will expire in 48 hours, so please make sure to
            click through and reset the password in time.
          </p>
        </article>
        <button
          className="px-2 py-1 mx-auto gradient-button"
          onClick={() => setEmailSent(false)}
        >
          Close
        </button>
      </ModalLayout>
      <section className="grid gap-7">
        <RegularInput
          label="User Name"
          keyName="user_name"
          inputs={editUserDetails}
          setInputs={setEditUserDetails}
        />
        <RegularInput
          label="Email"
          keyName="user_email"
          inputs={editUserDetails}
          setInputs={setEditUserDetails}
          disabled={true}
        />
        <article className="grid gap-10 mt-3">
          <article className="grid items-center gap-5">
            {/* update default env */}
            <DefaultEnvFilter
              envTypes={customerEnvs}
              details={editUserDetails}
              label="Default environment:"
              value={
                customerEnvs?.find(
                  (customerEnv: CustomerEnv) =>
                    customerEnv.env_id === editUserDetails.default_env
                )?.env_type || ""
              }
              setValue={setEditUserDetails}
              list={customerEnvs?.reduce(
                (pV: string[], cV: CustomerEnv) => [...pV, cV.env_type],
                []
              )}
              showAbove
            />

            {/* update groups */}
            <article className="grid items-center gap-5 w-full">
              <ul className="flex flex-wrap items-center gap-2 text-xs">
                {editUserDetails.group_ids.map((groupID: string) => {
                  const groupName = allGroups?.find(
                    (group: Group) => group.group_id === groupID
                  )?.group_name;
                  if (!groupName) return null;
                  return (
                    <li
                      key={groupID}
                      className="flex items-center gap-2 py-1 px-2 dark:bg-signin/60 border dark:border-signin rounded-sm"
                    >
                      <button
                        onClick={() =>
                          setEditUserDetails({
                            ...editUserDetails,
                            group_ids: editUserDetails.group_ids.filter(
                              (curGroupID: string) => curGroupID !== groupID
                            ),
                          })
                        }
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                      <span>{groupName}</span>
                    </li>
                  );
                })}
              </ul>
              <GroupFilter
                allGroups={allGroups}
                details={editUserDetails}
                label="Group:"
                value={
                  allGroups?.find(
                    (group: Group) =>
                      group.group_id ===
                      editUserDetails.group_ids[
                        editUserDetails.group_ids.length - 1
                      ]
                  )?.group_name || ""
                }
                setValue={setEditUserDetails}
                list={allGroups?.reduce(
                  (pV: string[], cV: Group) => [...pV, cV.group_name],
                  []
                )}
              />
            </article>

            {/* update roles */}
            <article className="grid items-center gap-5 w-full">
              <ul className="flex flex-wrap items-center gap-2 text-xs">
                {editUserDetails.role_ids.map((roleID: string) => {
                  const roleName = allRoles?.find(
                    (role: Role) => role.role_id === roleID
                  )?.role_name;
                  if (!roleName) return null;
                  return (
                    <li
                      key={roleID}
                      className="flex items-center gap-2 py-1 px-2 dark:bg-signin/60 border dark:border-signin rounded-sm"
                    >
                      <button
                        onClick={() =>
                          setEditUserDetails({
                            ...editUserDetails,
                            role_ids: editUserDetails.role_ids.filter(
                              (curRoleID: string) => curRoleID !== roleID
                            ),
                          })
                        }
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                      <span>{roleName}</span>
                    </li>
                  );
                })}
              </ul>

              <RoleFilter
                allRoles={allRoles}
                details={editUserDetails}
                value={
                  allRoles?.find(
                    (role: Role) =>
                      role.role_id ===
                      editUserDetails.role_ids[
                        editUserDetails.role_ids.length - 1
                      ]
                  )?.role_name || ""
                }
                setValue={setEditUserDetails}
                list={
                  [
                    ...new Set(
                      allRoles?.reduce((pV: string[], cV: Role) => {
                        if (cV.role_type === "Admin")
                          if (isSuperOrSiteAdmin) return [...pV, cV.role_name];
                          else return [...pV];
                        else return [...pV, cV.role_name];
                      }, [])
                    ),
                  ] as string[]
                }
                showAbove
              />
            </article>
          </article>
          <button
            disabled={
              editUserDetails.user_name === "" ||
              editUserDetails.user_email === ""
            }
            className="px-4 py-2 mx-auto text-sm gradient-button rounded-sm"
            onClick={() => {
              handleOnClose();
              updateUser.mutate({
                userID: editUser,
                user: editUserDetails,
              });
            }}
          >
            Update User
          </button>
        </article>
        {updateUser.status === "loading" && <PouringTea />}
      </section>
    </ModalLayout>
  );
};

export default EditUser;
