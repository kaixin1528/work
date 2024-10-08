/* eslint-disable react-hooks/exhaustive-deps */
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { filterVariants, userColors } from "src/constants/general";
import { GetAuditTrailUsers } from "src/services/regulation-policy/overview";
import { KeyStringVal } from "src/types/general";
import { getCustomerID } from "src/utils/general";

const AuditTrailUsersFilter = ({
  label,
  inputs,
  setInputs,
}: {
  label?: string;
  inputs: string[];
  setInputs: (inputs: string[]) => void;
}) => {
  const customerID = getCustomerID();

  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const { data: auditTrailUsers } = GetAuditTrailUsers(customerID);

  return (
    <section
      className="grid content-start gap-3"
      onMouseLeave={() => setShowDropdown(false)}
    >
      <article className="flex items-center gap-3 text-left">
        {label && <h4 className="text-sm dark:text-checkbox">{label}</h4>}
        <article
          onMouseMove={() => setShowDropdown(true)}
          className="relative py-2 px-4 w-[20rem] cursor-pointer bg-gradient-to-b dark:from-tooltip dark:to-tooltip/30 focus:outline-none rounded-t-sm"
        >
          <input
            type="input"
            autoComplete="off"
            spellCheck="false"
            placeholder="Select"
            value=""
            onChange={(e) => {
              if (!showDropdown) setShowDropdown(true);
            }}
            className="w-full border-transparent focus:ring-0 focus:border-transparent bg-transparent focus:outline-none"
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDownIcon className="w-3 h-3" aria-hidden="true" />
          </span>
          {showDropdown && (
            <motion.article
              variants={filterVariants}
              initial="hidden"
              animate={showDropdown ? "visible" : "hidden"}
              className={`absolute top-8 right-0 grid content-start py-2 w-full max-h-36 dark:bg-tooltip focus:outline-none shadow-2xl dark:shadow-checkbox/30 overflow-auto scrollbar rounded-b-sm z-50`}
            >
              {auditTrailUsers ? (
                auditTrailUsers?.length > 0 ? (
                  auditTrailUsers.map((user: KeyStringVal) => (
                    <motion.button
                      key={user.user_id}
                      variants={filterVariants}
                      disabled={inputs.includes(user.user_id)}
                      className="relative group flex gap-1 py-1 px-4 text-left break-all dark:hover:bg-filter/50 duration-100"
                      onClick={() => setInputs([...inputs, user.user_id])}
                    >
                      {inputs.includes(user.user_id) && (
                        <FontAwesomeIcon icon={faCheck} className="text-no" />
                      )}
                      <article
                        key={user.user_id}
                        className="flex items-center gap-1 text-left"
                      >
                        <span
                          className={`grid content-center w-5 h-5 capitalize text-center text-[0.65rem] dark:text-white font-medium bg-gradient-to-b ${
                            userColors[user.user_email[0].toLowerCase()]
                          } shadow-sm dark:shadow-checkbox rounded-full`}
                        >
                          {user.user_email[0]}
                        </span>
                        <p>{user.user_email} </p>
                      </article>
                    </motion.button>
                  ))
                ) : (
                  <p className="px-4">No results found</p>
                )
              ) : null}
            </motion.article>
          )}
        </article>
      </article>
      <ul className="flex flex-wrap items-center gap-2">
        {inputs.map((userID: string, index: number) => {
          const userEmail =
            auditTrailUsers?.find(
              (user: KeyStringVal) => user.user_id === userID
            )?.user_email || "";
          return (
            <li
              key={index}
              className="flex items-center gap-2 px-3 py-1 dark:bg-signin/30 border dark:border-signin rounded-sm"
            >
              <article className="flex items-center gap-1 text-left">
                <span
                  className={`grid content-center w-5 h-5 capitalize text-center text-[0.65rem] dark:text-white font-medium bg-gradient-to-b ${
                    userColors[userEmail[0]?.toLowerCase()]
                  } shadow-sm dark:shadow-checkbox rounded-full`}
                >
                  {userEmail[0]}
                </span>
                <p>{userEmail} </p>
              </article>
              <button
                className="dark:hover:text-filter duration-100"
                onClick={() =>
                  setInputs(
                    inputs.filter((curUserID: string) => curUserID !== userID)
                  )
                }
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default AuditTrailUsersFilter;
