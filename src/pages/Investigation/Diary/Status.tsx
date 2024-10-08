/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import {
  faCheck,
  faLock,
  faLockOpen,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useState } from "react";
import { parseURL, lastUpdatedAt, decodeJWT } from "../../../utils/general";
import { EditDiary } from "../../../types/investigation";
import ModalLayout from "../../../layouts/ModalLayout";
import { useGeneralStore } from "src/stores/general";
import {
  GetInvestigation,
  UpdateInvestigation,
} from "src/services/investigation/diary/diary";

const Status = ({ editDiaryDetails }: { editDiaryDetails: EditDiary }) => {
  const parsed = parseURL();
  const jwt = decodeJWT();

  const { env } = useGeneralStore();

  const [changeStatus, setChangeStatus] = useState<boolean>(false);

  const { data: diary } = GetInvestigation(env, parsed.diary_id);
  const editDiary = UpdateInvestigation(env);

  const isOwner = diary?.owner === jwt?.name;

  const handleOnClose = () => setChangeStatus(false);

  return (
    <article className="flex items-center gap-7 justify-self-end divide-x dark:divide-checkbox">
      {diary?.is_private ? (
        <Fragment>
          <button
            className="flex items-center gap-3 px-2 py-1 text-xs group dark:bg-lock/30 dark:hover:bg-lock/10 border dark:border-lock dark:hover:border-lock/60 duration-100"
            onClick={() => setChangeStatus(true)}
          >
            <FontAwesomeIcon icon={faLock} className="dark:text-lock" />
            <p>PRIVATE</p>
          </button>
          <ModalLayout showModal={changeStatus} onClose={handleOnClose}>
            <section className="grid gap-5">
              <h4 className="text-base text-center mb-3">
                Are you sure you want to make this diary public? Please note
                that you cannot revert this diary back to private.
              </h4>
              <section className="flex items-center justify-self-end gap-5 mx-5 text-xs">
                <button
                  className="px-4 py-1 bg-gradient-to-b dark:from-filter dark:to-filter/60 dark:hover:from-filter dark:hover:to-filter/30 rounded-sm"
                  onClick={handleOnClose}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-1 bg-gradient-to-b dark:from-admin dark:to-admin/60 dark:hover:from-admin dark:hover:to-admin/30 rounded-sm"
                  onClick={() => {
                    handleOnClose();
                    editDiary.mutate({
                      editDiary: {
                        ...editDiaryDetails,
                        is_private: false,
                      },
                    });
                  }}
                >
                  Make Public
                </button>
              </section>
            </section>
          </ModalLayout>
        </Fragment>
      ) : (
        <article className="flex items-center gap-3 text-sm">
          <FontAwesomeIcon
            icon={faLockOpen}
            className="w-3 h-3 dark:text-admin"
          />
          <p className="hidden md:block">PUBLIC</p>
        </article>
      )}

      {/* diary status */}
      <article className="flex items-center gap-2 pl-5 text-sm">
        {/* diary status toggle */}
        <article className="grid md:flex items-center gap-5 text-xs dark:text-white">
          <button
            disabled={!isOwner}
            className={`flex items-center px-2 py-1 ${
              editDiaryDetails.status === "OPEN"
                ? "border dark:border-purple-500 dark:bg-purple-500/20"
                : "hidden lg:block"
            }`}
            onClick={() => {
              editDiary.mutate({
                editDiary: {
                  ...editDiaryDetails,
                  status: "OPEN",
                },
              });
            }}
          >
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="mr-2 dark:text-purple-500"
            />
            OPEN
          </button>
          <button
            disabled={!isOwner}
            className={`flex items-center px-2 py-1 ${
              editDiaryDetails.status === "CLOSED"
                ? "border dark:border-contact dark:bg-no/20"
                : "hidden lg:block"
            }`}
            onClick={() => {
              editDiary.mutate({
                editDiary: {
                  ...editDiaryDetails,
                  status: "CLOSED",
                },
              });
            }}
          >
            <FontAwesomeIcon icon={faCheck} className="mr-2 dark:text-no" />
            CLOSED
          </button>
        </article>
      </article>

      {/* diary created time */}
      <article className="flex items-center gap-2 pl-5 text-sm">
        <h4 className="hidden md:block dark:text-checkbox">Created</h4>
        <p className="w-max">{lastUpdatedAt(diary?.created_at)}</p>
      </article>
    </article>
  );
};

export default Status;
