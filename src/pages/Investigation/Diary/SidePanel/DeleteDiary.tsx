/* eslint-disable no-restricted-globals */
import { useState } from "react";
import { DiaryType } from "../../../../types/investigation";
import ModalLayout from "../../../../layouts/ModalLayout";
import { useGeneralStore } from "src/stores/general";
import { decodeJWT } from "src/utils/general";
import { DeleteInvestigation } from "src/services/investigation/diary/diary";

const DeleteDiary = ({ diary }: { diary: DiaryType }) => {
  const jwt = decodeJWT();

  const { env } = useGeneralStore();

  const [deleteDiaryID, setDeleteDiaryID] = useState<string>("");

  const deletediary = DeleteInvestigation(env);

  const handleOnClose = () => setDeleteDiaryID("");

  return (
    <>
      {diary.owner === jwt?.name && (
        <button
          className="px-2 py-1 my-10 bg-gradient-to-b dark:from-reset dark:to-reset/60 dark:hover:to-reset/30 duration-100"
          onClick={() => setDeleteDiaryID(diary.diary_id)}
        >
          Delete Diary
        </button>
      )}
      <ModalLayout
        showModal={deleteDiaryID === diary.diary_id}
        onClose={handleOnClose}
      >
        <section className="grid gap-5">
          <h4 className="text-base text-center mb-3">
            Are you sure you want to delete this investigation diary?
          </h4>
          <section className="flex items-center gap-5 mx-auto text-sm">
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
                deletediary.mutate({
                  diaryID: deleteDiaryID,
                });
              }}
            >
              Delete Diary
            </button>
          </section>
        </section>
      </ModalLayout>
    </>
  );
};

export default DeleteDiary;
