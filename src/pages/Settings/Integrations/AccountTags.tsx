/* eslint-disable react-hooks/exhaustive-deps */
import { faPlus, faTag, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import {
  GetAccountInfo,
  UpdateAccount,
} from "../../../services/settings/integrations";
import { getCustomerID } from "../../../utils/general";

const AccountTags = ({
  tags,
  setTags,
  selectedAccountID,
}: {
  tags: string[];
  setTags: (tags: string[]) => void;
  selectedAccountID: string;
}) => {
  const customerID = getCustomerID();

  const [addTag, setAddTag] = useState<boolean>(false);
  const [newTag, setNewTag] = useState<string>("");

  const { data: accountInfo } = GetAccountInfo(customerID, selectedAccountID);
  const updateAccount = UpdateAccount(customerID);

  useEffect(() => {
    if (accountInfo) {
      setTags(accountInfo.integration_tags);
    }
  }, [accountInfo]);

  return (
    <ul className="flex flex-wrap items-center gap-5 text-xs">
      <li className="text-sm dark:text-checkbox">Tags:</li>
      {addTag && (
        <article className="flex items-stretch w-max divide-x dark:divide-account border-1 dark:border-org rounded-sm">
          <article className="relative flex items-center gap-2 py-2 px-4 ring-0 dark:ring-search focus:ring-2 dark:focus:ring-signin dark:bg-account rounded-sm">
            <FontAwesomeIcon
              icon={faTag}
              className="w-4 h-4 dark:text-checkbox"
            />
            <input
              spellCheck="false"
              autoComplete="off"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              type="input"
              className="py-1 w-20 h-3 focus:outline-none dark:placeholder:text-checkbox dark:text-white dark:bg-transparent dark:bg-account dark:border-transparent dark:focus:ring-0 dark:focus:border-transparent"
            />
          </article>
          <button
            disabled={newTag === ""}
            className="px-2 dark:disabled:text-filter dark:hover:bg-checkbox dark:disabled:bg-org/20 dark:bg-org duration-100"
            onClick={() => {
              if (!tags.includes(newTag)) {
                setAddTag(false);
                setNewTag("");

                const newTags = [...tags, newTag];
                if (selectedAccountID !== "")
                  updateAccount.mutate({
                    accountID: selectedAccountID,
                    account: {
                      integration_tags: newTags,
                    },
                  });
                else setTags(newTags);
              }
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <button
            className="px-2 dark:text-account dark:hover:bg-checkbox dark:bg-org duration-100"
            onClick={() => {
              setAddTag(false);
              setNewTag("");
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </article>
      )}
      {!addTag && (
        <li
          className="flex items-center gap-2 tracking-wide dark:text-white dark:hover:text-gray-300 duration-100 cursor-pointer"
          onClick={() => setAddTag(true)}
        >
          <FontAwesomeIcon icon={faTag} className="dark:text-checkbox" />
          <p className="w-max"> Add tag</p>
        </li>
      )}
      {tags?.map((tag: string) => {
        return (
          <li
            key={tag}
            className="flex items-center px-4 py-1 w-max dark:text-white dark:bg-filter rounded-full"
          >
            <button>
              <FontAwesomeIcon
                icon={faXmark}
                onClick={() => {
                  const newTags = tags.filter(
                    (curTag: string) => curTag !== tag
                  );
                  if (selectedAccountID !== "")
                    updateAccount.mutate({
                      accountID: selectedAccountID,
                      account: {
                        integration_tags: newTags,
                      },
                    });
                  else setTags(newTags);
                }}
                className="pr-3 dark:text-white red-button"
              />
            </button>
            <p>{tag}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default AccountTags;
