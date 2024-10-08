/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { userColors } from "../../constants/general";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { GetUserInfo, UpdateUser } from "../../services/settings/users";
import { UserDetails, UserGroup, UserRole } from "../../types/settings";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { decodeJWT, getCustomerID } from "../../utils/general";
import RegularInput from "src/components/Input/RegularInput";

const EditProfile = () => {
  const jwt = decodeJWT();
  const customerID = getCustomerID();

  const [editUserDetails, setEditUserDetails] = useState<UserDetails>({
    user_name: "",
    user_email: "",
    user_given_name: "",
    user_family_name: "",
    oidc_account_id: "",
    default_env: "",
    group_ids: [],
    role_ids: [],
  });

  const [updated, setUpdated] = useState<boolean>(false);

  const { data: userInfo } = GetUserInfo(customerID, jwt?.sub);
  const updateUser = UpdateUser(customerID);

  useEffect(() => {
    if (userInfo) {
      setEditUserDetails({
        ...editUserDetails,
        user_name: userInfo.user_name || "",
        user_email: userInfo.user_email || "",
        user_given_name: userInfo.user_given_name || "",
        user_family_name: userInfo.user_family_name || "",
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

  const handleEditUser = () => {
    updateUser.mutate(
      {
        userID: jwt?.sub,
        user: editUserDetails,
      },
      {
        onSuccess: () => {
          setUpdated(true);
          setTimeout(() => setUpdated(false), 5000);
        },
      }
    );
  };

  return (
    <section className="flex flex-col flex-grow gap-5 mx-6 my-4 text-sm">
      <h4>Edit Profile</h4>

      <span
        className={`grid content-center w-20 h-20 capitalize text-center text-2xl dark:text-white font-semibold bg-gradient-to-b ${
          userColors[jwt?.name[0].toLowerCase()]
        } rounded-full`}
      >
        {jwt?.fullName[0]}
      </span>

      <section className="grid gap-7 w-3/6">
        <RegularInput
          label="Name"
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
        <article className="grid gap-2 justify-self-start md:justify-self-end">
          <button
            disabled={
              editUserDetails.user_name === "" ||
              editUserDetails.user_email === "" ||
              updateUser.status === "loading"
            }
            className="justify-self-end px-4 py-2 text-xs gradient-button rounded-sm"
            onClick={() => handleEditUser()}
          >
            Update Profile
          </button>
          {updated && (
            <motion.article
              initial={{ y: 3, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: { duration: 0.3 },
              }}
              className="flex items-center gap-2 text-xs"
            >
              <FontAwesomeIcon
                icon={faCheck}
                className="w-3 h-3 dark:text-contact"
              />
              successfully updated
            </motion.article>
          )}
        </article>
      </section>
    </section>
  );
};

export default EditProfile;
