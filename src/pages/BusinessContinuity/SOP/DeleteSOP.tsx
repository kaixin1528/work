import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import ModalLayout from "src/layouts/ModalLayout";
import {
  DeleteSOPVersion,
  GetSOPVersions,
  RemoveSOP,
} from "src/services/business-continuity/sop";
import { parseURL } from "src/utils/general";

const DeleteSOP = ({ versionID }: { versionID: string }) => {
  const parsed = parseURL();

  const [show, setShow] = useState<boolean>(false);

  const sopID = String(parsed.sop_id) || "";

  const removeSOP = RemoveSOP();
  const removeVersion = DeleteSOPVersion(sopID);
  const { data: sopVersions } = GetSOPVersions(sopID);

  const deleteEntity = sopVersions?.length > 0 ? "version" : "procedure";
  const deleting = removeVersion.status === "loading";

  const handleOnClose = () => setShow(false);

  return (
    <>
      <button
        disabled={deleting}
        className="flex items-center p-2 dark:disabled:bg-filter dark:bg-reset dark:hover:bg-reset/60 duration-100 rounded-full"
        onClick={() => setShow(true)}
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
      <ModalLayout showModal={show} onClose={() => setShow(false)}>
        <section className="grid gap-5">
          <h4 className="text-base text-center mb-3">
            Are you sure you want to delete this {deleteEntity}?
          </h4>
          <section className="flex items-center gap-5 mx-auto text-sm">
            <button
              className="px-4 py-1 bg-gradient-to-b dark:from-filter dark:to-filter/60 dark:hover:from-filter dark:hover:to-filter/30 rounded-sm"
              onClick={handleOnClose}
            >
              Cancel
            </button>
            <button
              disabled={deleting}
              className="px-4 py-1 red-gradient-button rounded-sm"
              onClick={() => {
                if (deleteEntity === "version")
                  removeVersion.mutate({
                    versionID: versionID,
                  });
                else
                  removeSOP.mutate({
                    sopID: sopID,
                  });
                handleOnClose();
              }}
            >
              Delete {deleteEntity}
            </button>
          </section>
        </section>
      </ModalLayout>
    </>
  );
};

export default DeleteSOP;
