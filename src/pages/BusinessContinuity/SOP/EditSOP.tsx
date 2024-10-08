/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import ModalLayout from "src/layouts/ModalLayout";
import RegularInput from "src/components/Input/RegularInput";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  GetSOPDepartments,
  UpdateSOP,
} from "src/services/business-continuity/sop";
import Tags from "./Tags";

const EditSOP = ({
  sopID,
  sopName,
  tag,
}: {
  sopID: string;
  sopName: string;
  tag: string;
}) => {
  const [show, setShow] = useState<boolean>(false);
  const [inputs, setInputs] = useState<any>({
    sop_name: sopName,
    tag_name: tag,
    selected_tag: "",
    entered_tag: "",
  });

  const editSOP = UpdateSOP(sopID);
  const { data: departments } = GetSOPDepartments();

  const handleOnClose = () => setShow(false);

  useEffect(() => {
    if (departments?.includes(tag)) setInputs({ ...inputs, selected_tag: tag });
    else setInputs({ ...inputs, entered_tag: tag });
  }, [departments]);

  return (
    <>
      <button
        className="flex items-center p-2 dark:bg-signin dark:hover:bg-signin/60 duration-100 rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          setShow(true);
        }}
      >
        <FontAwesomeIcon icon={faEdit} />
      </button>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        <section className="grid gap-5">
          <h4 className="text-lg">Edit Procedure</h4>
          <RegularInput
            label="Procedure Name"
            keyName="sop_name"
            inputs={inputs}
            setInputs={setInputs}
            required
          />
          <Tags inputs={inputs} setInputs={setInputs} />
          <button
            disabled={inputs.sop_name === ""}
            className="px-4 py-1 mx-auto gradient-button"
            onClick={() => {
              editSOP.mutate({
                sopName: inputs.sop_name,
                tag:
                  inputs.selected_tag !== ""
                    ? inputs.selected_tag
                    : inputs.entered_tag,
              });
              handleOnClose();
            }}
          >
            Save
          </button>
        </section>
      </ModalLayout>
    </>
  );
};

export default EditSOP;
