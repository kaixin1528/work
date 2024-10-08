import { faShare, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover, Transition } from "@headlessui/react";
import { User } from "@sentry/browser";
import React, { Fragment, useState } from "react";
import { userColors } from "src/constants/general";
import { ShareAlertAnalysis } from "src/services/graph/alerts";
import { GetAllUsers } from "src/services/settings/users";
import { useGeneralStore } from "src/stores/general";
import { KeyStringVal } from "src/types/general";
import { decodeJWT, getCustomerID } from "src/utils/general";

const Share = ({ alertAnalysisID }: { alertAnalysisID: string }) => {
  const jwt = decodeJWT();
  const customerID = getCustomerID();

  const { env } = useGeneralStore();

  const [shareWith, setShareWith] = useState<string[]>([]);

  const { data: allUsers } = GetAllUsers(customerID, false);
  const share = ShareAlertAnalysis(env, alertAnalysisID);

  const filteredUsers = allUsers?.filter(
    (user: KeyStringVal) => user.user_email !== jwt?.name
  );

  return (
    <Popover className="relative">
      <Popover.Button className="px-2 py-1 dark:text-black dark:bg-checkbox dark:hover:bg-checkbox/60 duration-100 focus:outline-none rounded-full">
        <FontAwesomeIcon icon={faShare} />
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
        afterLeave={() => setShareWith([])}
      >
        <Popover.Panel className="pointer-events-auto absolute top-10 right-0 w-max break-words text-xs z-10">
          <nav className="w-full h-[10rem] dark:bg-main border dark:border-filter/20 overflow-auto scrollbar">
            {filteredUsers?.map((user: User) => {
              return (
                <button
                  key={user.user_email}
                  className="flex items-center gap-3 py-2 px-5 w-full text-left dark:hover:bg-mention duration-100"
                  onClick={() => {
                    setShareWith([...shareWith, user.user_email]);
                    share.mutate({
                      recipientUserID: user.user_id,
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
                  <p className="grid">
                    {user.user_email}
                    <span className="text-[0.65rem] dark:text-checkbox">
                      {user.user_name}
                    </span>
                  </p>
                  {shareWith.includes(user.user_email) && (
                    <FontAwesomeIcon icon={faCheck} className="text-no" />
                  )}
                </button>
              );
            })}
          </nav>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default Share;
