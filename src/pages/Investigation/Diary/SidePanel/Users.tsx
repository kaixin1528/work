/* eslint-disable no-restricted-globals */
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { userColors } from "../../../../constants/general";
import { GetAllUsers } from "../../../../services/settings/users";
import { Collaborator, DiaryType } from "../../../../types/investigation";
import { User } from "../../../../types/settings";
import { getCustomerID, parseURL } from "../../../../utils/general";
import { useGeneralStore } from "src/stores/general";
import { AddTask } from "src/services/getting-started";
import {
  GetCollaborators,
  AddCollaborators,
} from "src/services/investigation/diary/collaborators";

const Users = ({ diary }: { diary: DiaryType }) => {
  const parsed = parseURL();
  const customerID = getCustomerID();

  const { env } = useGeneralStore();

  const { data: collaborators } = GetCollaborators(env, parsed.diary_id);
  const { data: allUsers } = GetAllUsers(customerID, false);
  const addCollaborators = AddCollaborators(env);
  const addTask = AddTask(env);

  const collaboratorEmails = collaborators?.reduce(
    (pV: string[], cV: Collaborator) => [...pV, cV.referenced_user_email],
    []
  );

  const filteredUsers = allUsers
    ? allUsers.filter(
        (user: User) =>
          user.user_email !== diary?.owner &&
          !collaboratorEmails?.includes(user.user_email)
      )
    : [];
  const closedDiary = diary?.status === "CLOSED";

  return (
    <section className="grid grid-cols-1 gap-5">
      <section className="grid content-start gap-2">
        <h4 className="w-max dark:text-checkbox break-all">Owner</h4>
        <article className="flex items-center gap-2 mx-2 w-full">
          <span
            className={`grid content-center capitalize text-center text-[0.65rem] dark:text-white font-medium w-6 h-6 bg-gradient-to-b ${
              userColors[diary.owner[0].toLowerCase()]
            } rounded-full shadow-sm dark:shadow-checkbox`}
          >
            {diary.owner[0]}
          </span>
          <h4>
            {
              allUsers?.find((user: User) => user.user_email === diary.owner)
                ?.user_name
            }
          </h4>
        </article>
      </section>

      <section className="grid gap-2">
        <h4 className="w-max dark:text-checkbox break-all">Collaborators</h4>
        <article className="flex md:grid xl:flex items-center gap-3">
          {collaborators?.length > 0 && (
            <ul className="flex items-center mx-2">
              {collaborators?.slice(0, 5).map((collaborator: Collaborator) => {
                return (
                  <li
                    key={collaborator.referenced_user_email}
                    className="relative -ml-1 group"
                  >
                    <span
                      className={`grid content-center capitalize text-center text-[0.65rem] dark:text-white font-medium w-6 h-6 bg-gradient-to-b ${
                        userColors[
                          collaborator.referenced_user_email[0].toLowerCase()
                        ]
                      } rounded-full shadow-sm dark:shadow-checkbox`}
                    >
                      {collaborator.referenced_user_email[0]}
                    </span>
                    <article className="invisible group-hover:visible z-50 absolute left-0 grid gap-1 px-4 pr-10 py-3 mt-2 w-max break-all text-left text-xs dark:bg-account rounded-sm">
                      <h4>{collaborator.referenced_user_name}</h4>
                      <p className="dark:text-checkbox">
                        {collaborator.referenced_user_email}
                      </p>
                    </article>
                  </li>
                );
              })}
            </ul>
          )}
          <article className="flex items-center gap-5">
            {collaborators?.length > 0 && (
              <article className="group w-max">
                {collaborators?.slice(5).length > 0 && (
                  <h4>+ {collaborators.slice(5).length}</h4>
                )}
                <ul className="invisible group-hover:visible z-50 absolute left-4 grid gap-1 px-4 pr-10 py-3 mt-2 w-max break-all text-left text-xs dark:bg-account rounded-sm">
                  {collaborators?.slice(5).map((collaborator: Collaborator) => {
                    return (
                      <li
                        key={collaborator.referenced_user_email}
                        className="flex items-center gap-2"
                      >
                        <span
                          className={`grid content-center capitalize text-center text-[0.65rem] dark:text-white font-medium w-6 h-6 bg-gradient-to-b ${
                            userColors[
                              collaborator.referenced_user_email[0].toLowerCase()
                            ]
                          } rounded-full shadow-sm dark:shadow-checkbox`}
                        >
                          {collaborator.referenced_user_email[0]}
                        </span>
                        <h4>{collaborator.referenced_user_name}</h4>
                      </li>
                    );
                  })}
                </ul>
              </article>
            )}

            {/* add collaborators */}
            {!closedDiary && (
              <Menu as="article" className="relative inline-block text-left">
                <Menu.Button className="flex items-center gap-2 group">
                  <span className="grid self-center p-1 gradient-button rounded-sm">
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="w-[0.35rem] h-[0.35rem]"
                    />
                  </span>
                  <p className="relative w-max text-[0.8rem] dark:text-checkbox">
                    Add
                  </p>
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute left-2 grid w-max -mr-5 mt-2 gap-2 origin-top-right focus:outline-none text-sm dark:text-white dark:bg-account z-50 rounded-sm">
                    {filteredUsers?.length > 0 ? (
                      <nav className="grid content-start w-full max-h-60 z-50 overflow-auto scrollbar">
                        {filteredUsers?.map((user: User) => {
                          return (
                            <button
                              key={user.user_email}
                              className="flex items-center gap-3 px-4 pr-10 py-2 w-full text-left dark:bg-account dark:hover:bg-mention duration-100"
                              onClick={() => {
                                addCollaborators.mutate({
                                  body: {
                                    diary_id: parsed.diary_id,
                                    emails_of_collaborators: [user.user_email],
                                  },
                                });
                                addTask.mutate({
                                  userEmails: [user.user_email],
                                  taskType: "DIARY_COLLABORATOR",
                                  taskTitle: `You're added as a collaborator`,
                                  taskMetadata: {
                                    url: `/investigation/diary/details?diary_id=${parsed.diary_id}`,
                                    diary_id: parsed.diary_id,
                                    diary_title: diary?.name,
                                    image_url: diary?.image_url,
                                  },
                                });
                              }}
                            >
                              <span
                                className={`grid content-center w-5 h-5 capitalize text-center text-[0.65rem] dark:text-white font-medium bg-gradient-to-b ${
                                  userColors[user.user_email[0].toLowerCase()]
                                } shadow-sm dark:shadow-checkbox rounded-full`}
                              >
                                {user.user_email[0]}
                              </span>
                              <p className="grid text-xs">
                                {user.user_name}
                                {"  "}
                                <span className="dark:text-checkbox">
                                  {user.user_email}
                                </span>
                              </p>
                            </button>
                          );
                        })}
                      </nav>
                    ) : (
                      <section className="grid gap-2 px-5 py-3 w-max origin-top-right focus:outline-none text-xs dark:text-white dark:bg-account z-50 rounded-sm">
                        <h4>No new users</h4>
                      </section>
                    )}
                  </Menu.Items>
                </Transition>
              </Menu>
            )}
          </article>
        </article>
      </section>
    </section>
  );
};

export default Users;
