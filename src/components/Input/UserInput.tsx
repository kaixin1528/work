import { ChevronDownIcon } from "@heroicons/react/solid";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { filterVariants, userColors } from "src/constants/general";
import { GetAllUsers } from "src/services/settings/users";
import { KeyStringVal } from "src/types/general";
import { User } from "src/types/settings";
import { getCustomerID } from "src/utils/general";

const UserInput = ({
  label,
  keyName,
  inputs,
  setInputs,
}: {
  label: string;
  keyName: string;
  inputs: any;
  setInputs: (inputs: any) => void;
}) => {
  const customerID = getCustomerID();

  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  const { data: allUsers } = GetAllUsers(customerID, false);

  const filteredUsers = allUsers?.filter((user: KeyStringVal) =>
    user.user_email
      .toLowerCase()
      .replace(/\s+/g, "")
      .includes(query.toLowerCase().replace(/\s+/g, ""))
  );
  const userEmail =
    inputs[keyName] !== ""
      ? allUsers?.find((user: KeyStringVal) => user.user_id === inputs[keyName])
          ?.user_email
      : "";

  return (
    <article className="flex items-center gap-2">
      <h4 className="justify-self-start">{label}</h4>
      <article
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
        className="relative py-2 px-7 text-left cursor-pointer bg-gradient-to-b dark:from-tooltip dark:to-tooltip/30 focus:outline-none rounded-t-sm"
      >
        <input
          type="input"
          autoComplete="off"
          spellCheck="false"
          placeholder="Select User"
          value={query ? query : userEmail}
          onChange={(e) => {
            if (!showDropdown) setShowDropdown(true);
            setQuery(e.target.value);
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
            className="absolute top-8 left-0 grid content-start py-2 w-full max-h-36 dark:bg-tooltip focus:outline-none shadow-2xl dark:shadow-checkbox/30 overflow-auto scrollbar rounded-b-sm z-50"
          >
            {filteredUsers?.map((user: User) => (
              <button
                key={user.user_email}
                className={`relative flex items-start gap-2 py-1 px-4 break-all dark:hover:bg-filter/50 ${
                  userEmail === user.user_email ? "dark:bg-filter" : ""
                } duration-200`}
                onClick={() => {
                  setQuery(user.user_email);
                  setInputs({ ...inputs, [keyName]: user.user_id });
                }}
              >
                <span
                  className={`grid content-center w-5 h-5 capitalize text-center text-[0.65rem] dark:text-white font-medium bg-gradient-to-b ${
                    userColors[user.user_email[0].toLowerCase()]
                  } shadow-sm dark:shadow-checkbox rounded-full`}
                >
                  {user.user_email[0]}
                </span>
                <p className="grid text-left">
                  {user.user_email}{" "}
                  <span className="text-xs dark:text-checkbox">
                    {user.user_name}
                  </span>
                </p>
              </button>
            ))}
          </motion.article>
        )}
      </article>
    </article>
  );
};

export default UserInput;
