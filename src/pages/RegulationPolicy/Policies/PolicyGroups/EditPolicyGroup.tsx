/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  GetPolicyGroup,
  UpdatePolicyGroup,
} from "src/services/regulation-policy/policy";
import { useEffect, useState } from "react";
import ModalLayout from "src/layouts/ModalLayout";
import RegularInput from "src/components/Input/RegularInput";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EditPolicyGroup = ({ policyGroupID }: { policyGroupID: string }) => {
  const [show, setShow] = useState<boolean>(false);
  const [inputs, setInputs] = useState<any>({
    title: "",
    description: "",
  });

  const { data: policyGroup } = GetPolicyGroup(policyGroupID);
  const editPolicyGroup = UpdatePolicyGroup();

  const handleOnClose = () => setShow(false);

  useEffect(() => {
    if (policyGroup && inputs.title === "" && inputs.description === "")
      setInputs({
        title: policyGroup.title,
        description: policyGroup.description,
      });
  }, [policyGroup]);

  return (
    <>
      <button
        className="flex items-center p-2 dark:bg-signin dark:hover:bg-signin/60 duration-100 rounded-full"
        onClick={() => setShow(true)}
      >
        <FontAwesomeIcon icon={faEdit} />
      </button>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        <section className="grid gap-5">
          <h4 className="text-lg">Edit Policy Group</h4>
          <RegularInput
            label="Title"
            keyName="title"
            inputs={inputs}
            setInputs={setInputs}
          />
          <RegularInput
            label="Description"
            keyName="description"
            inputs={inputs}
            setInputs={setInputs}
          />
          <button
            disabled={inputs.title === ""}
            className="justify-self-end px-4 py-1 text-xs gradient-button"
            onClick={() => {
              handleOnClose();
              editPolicyGroup.mutate({
                policyGroupID: policyGroupID,
                title: inputs.title,
                description: inputs.description,
              });
            }}
          >
            Save
          </button>
        </section>
      </ModalLayout>
    </>
  );
};

export default EditPolicyGroup;
