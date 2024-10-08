import {
  faCheck,
  faPlus,
  faTrashCan,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { userColors } from "../../../constants/general";
import ModalLayout from "../../../layouts/ModalLayout";
import { GetGroupUsers, UpdateGroup } from "../../../services/settings/groups";
import { User } from "../../../types/settings";
import { checkSuperOrSiteAdmin, getCustomerID } from "../../../utils/general";
import { GetAllUsers } from "src/services/settings/users";

const Users = ({ selectedGroup }: { selectedGroup: string }) => {
  const customerID = getCustomerID();
  const isSuperOrSiteAdmin = checkSuperOrSiteAdmin();

  const [addGroupUser, setAddGroupUser] = useState<boolean>(false);
  const [removeUserID, setRemoveUserID] = useState<string>("");

  const { data: allUsers } = GetAllUsers(customerID, isSuperOrSiteAdmin);
  const { data: groupUsers } = GetGroupUsers(customerID, selectedGroup);
  const updateGroup = UpdateGroup(customerID);

  const groupUserIDs = groupUsers?.reduce(
    (pV: string[], cV: User) => [...pV, cV.user_id],
    []
  );
  const filteredUsers = allUsers?.filter(
    (user: User) => !groupUserIDs?.includes(user)
  );

  const handleOnClose = () => setRemoveUserID("");

  return (
    <section className="grid items-start gap-5 py-6 mx-10">
      {groupUserIDs && (
        <header className="flex items-center gap-10">
          <h4 className="text-sm dark:text-checkbox">
            Users ({groupUserIDs.length})
          </h4>
          <>
            <button
              className="flex items-center gap-2 px-2 py-1 text-xs gradient-button rounded-sm"
              onClick={() => setAddGroupUser(true)}
            >
              <FontAwesomeIcon icon={faPlus} />
              <FontAwesomeIcon icon={faUser} />
            </button>
            <ModalLayout
              showModal={addGroupUser}
              onClose={() => setAddGroupUser(false)}
            >
              {addGroupUser && (
                <section className="grid content-start gap-5">
                  <header className="flex items-center gap-10">
                    <h4 className="text-base">Add Users</h4>
                    <article className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="dark:text-green-500"
                      />
                      <p>user is activated</p>
                    </article>
                  </header>
                  <ul className="grid content-start gap-3 py-5 h-[15rem] overflow-auto scrollbar">
                    {filteredUsers?.map((user: User) => {
                      return (
                        <li
                          key={user.user_id}
                          className="flex items-center justify-between gap-3 md:gap-10 mx-5 mr-10"
                        >
                          <article className="grid grid-cols-6 gap-3">
                            <span
                              className={`grid content-center w-8 h-8 capitalize text-center text-sm dark:text-white font-medium bg-gradient-to-b ${
                                userColors[user.user_name[0].toLowerCase()]
                              } shadow-sm dark:shadow-checkbox rounded-full`}
                            >
                              {user.user_name[0]}
                            </span>
                            <article className="col-span-5 grid">
                              <article className="flex items-center gap-2">
                                <p className="w-max break-all">
                                  {user.user_name}
                                </p>
                                {user.activated && (
                                  <FontAwesomeIcon
                                    icon={faCheck}
                                    className="dark:text-green-500"
                                  />
                                )}
                              </article>
                              <p className="w-max break-all dark:text-checkbox">
                                {user.user_email}
                              </p>
                            </article>
                          </article>
                          <button
                            disabled={groupUserIDs.some(
                              (userID: string) => userID === user.user_id
                            )}
                            className="justify-self-start md:justify-self-end text-xs dark:text-signin dark:hover:text-signin/60 dark:disabled:text-filter duration-100"
                            onClick={() => {
                              updateGroup.mutate({
                                groupID: selectedGroup,
                                group: {
                                  user_ids: [...groupUserIDs, user.user_id],
                                },
                              });
                            }}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}
            </ModalLayout>
          </>
          <article className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCheck} className="dark:text-green-500" />
            <p>user is activated</p>
          </article>
        </header>
      )}
      {groupUserIDs && (
        <ul className="grid grid-cols-1 xl:grid-cols-2 content-start gap-x-10 w-11/12 max-h-[19rem] overflow-auto scrollbar">
          {groupUserIDs.map((userID: string) => {
            const user = allUsers?.find(
              (user: User) => user.user_id === userID
            );

            return (
              user && (
                <li key={userID} className="grid grid-cols-5 gap-3 py-4 group">
                  <article className="col-span-4 flex items-center gap-3">
                    <span
                      className={`grid content-center w-8 h-8 capitalize text-center text-sm dark:text-white font-medium bg-gradient-to-b ${
                        userColors[user.user_name[0].toLowerCase()]
                      } shadow-sm dark:shadow-checkbox rounded-full`}
                    >
                      {user.user_name[0]}
                    </span>
                    <article className="grid">
                      <article className="flex items-center gap-2">
                        <p className="break-all">{user.user_name}</p>
                        {user.activated && (
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="dark:text-green-500"
                          />
                        )}
                      </article>
                      <p className="dark:text-checkbox break-all">
                        {user.user_email}
                      </p>
                    </article>
                  </article>
                  <>
                    <button
                      onClick={() => setRemoveUserID(user.user_id)}
                      className="hidden group-hover:block red-button"
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                    <ModalLayout
                      showModal={removeUserID === user.user_id}
                      onClose={handleOnClose}
                    >
                      <section className="grid gap-5">
                        <h4 className="text-base text-center mb-3">
                          Are you sure you want to remove this user from the
                          group?
                        </h4>
                        <section className="flex items-center justify-self-end gap-5 mx-5 text-xs">
                          <button
                            className="px-4 py-1 bg-gradient-to-b dark:from-filter dark:to-filter/60 dark:hover:from-filter dark:hover:to-filter/30 rounded-sm"
                            onClick={handleOnClose}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-4 py-1 bg-gradient-to-b dark:from-reset dark:to-reset/60 dark:hover:from-reset dark:hover:to-reset/30 rounded-sm"
                            onClick={() => {
                              handleOnClose();
                              updateGroup.mutate({
                                groupID: selectedGroup,
                                group: {
                                  user_ids: groupUserIDs.filter(
                                    (userID: string) => userID !== removeUserID
                                  ),
                                },
                              });
                            }}
                          >
                            Remove user
                          </button>
                        </section>
                      </section>
                    </ModalLayout>
                  </>
                </li>
              )
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default Users;
