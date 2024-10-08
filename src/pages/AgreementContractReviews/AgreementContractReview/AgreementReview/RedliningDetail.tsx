import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { userColors } from "src/constants/general";
import { DeleteRedlining } from "src/services/grc";
import { GetAllUsers } from "src/services/settings/users";
import { KeyStringVal } from "src/types/general";
import { convertToUTCShortString, getCustomerID } from "src/utils/general";

const RedliningDetail = ({
  agreementID,
  redline,
  selectedHighlight,
  setSelectedHighlight,
}: {
  agreementID: string;
  redline: any;
  selectedHighlight: any;
  setSelectedHighlight: any;
}) => {
  const customerID = getCustomerID();

  const deleteRedlining = DeleteRedlining(agreementID);
  const { data: allUsers } = GetAllUsers(customerID, false);

  const userEmail = allUsers?.find(
    (user: KeyStringVal) => user.user_id === redline.author_id
  )?.user_email;

  return (
    <li
      className={`grid gap-2 p-3 cursor-pointer ${
        selectedHighlight === redline.id
          ? "dark:bg-signin/30"
          : "dark:hover:bg-filter/60 duration-100"
      } `}
      onClick={() => setSelectedHighlight(redline.id)}
    >
      <header className="flex items-center justify-between gap-5 text-sm">
        {userEmail && (
          <article className="flex items-center gap-1">
            <span
              className={`grid content-center w-5 h-5 capitalize text-center text-[0.65rem] dark:text-white font-medium bg-gradient-to-b ${
                userColors[userEmail[0]?.toLowerCase()]
              } shadow-sm dark:shadow-checkbox rounded-full`}
            >
              {userEmail[0]}
            </span>{" "}
            {userEmail}{" "}
          </article>
        )}
        <span className="text-xs">
          {convertToUTCShortString(redline.created_at)}
        </span>
      </header>
      <blockquote className="flex flex-wrap break-words text-sm">
        <span className="text-reset line-through">
          {redline.old_content.text}
        </span>
        <p className="px-4 py-1 text-xs bg-no">{redline.new_edits}</p>
        <button
          className="justify-self-end px-3 py-1 bg-reset hover:bg-reset/60 duration-100 rounded-full"
          onClick={() =>
            deleteRedlining.mutate({
              redliningID: redline.id,
            })
          }
        >
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </blockquote>
      <span className="text-xs">Page {redline.pageNumber}</span>
    </li>
  );
};

export default RedliningDetail;
