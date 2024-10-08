import React, { useState } from "react";
import ModalLayout from "../../../layouts/ModalLayout";
import { CreateGroup, GetAllGroups } from "../../../services/settings/groups";
import { Group } from "../../../types/settings";
import { getCustomerID } from "../../../utils/general";
import RegularInput from "src/components/Input/RegularInput";

const AddGroup = () => {
  const customerID = getCustomerID();

  const [addGroup, setAddGroup] = useState<boolean>(false);
  const [valid, setValid] = useState(true);
  const [addGroupDetails, setAddGroupDetails] = useState({
    group_name: "",
    group_description: "",
  });

  const { data: allGroups } = GetAllGroups(customerID, false);
  const createGroup = CreateGroup(customerID);

  const handleOnClose = () => {
    setValid(true);
    setAddGroup(false);
  };

  return (
    <>
      <button
        className="px-4 py-2 green-gradient-button duration-100 rounded-sm"
        onClick={() => {
          setAddGroup(true);
          setAddGroupDetails({
            group_name: "",
            group_description: "",
          });
        }}
      >
        Create New Group
      </button>
      <ModalLayout showModal={addGroup} onClose={handleOnClose}>
        <header className="text-center mb-3">
          <h4 className="text-base">Create Group</h4>
          <p className="dark:text-checkbox">Enter group details</p>
        </header>
        <section className="grid gap-8">
          <RegularInput
            label="Group Name"
            keyName="group_name"
            inputs={addGroupDetails}
            setInputs={setAddGroupDetails}
            valid={valid}
            setValid={setValid}
          />
          <RegularInput
            label="Description"
            keyName="group_description"
            inputs={addGroupDetails}
            setInputs={setAddGroupDetails}
          />
          <button
            disabled={addGroupDetails.group_name === ""}
            className="mt-5 px-4 py-2 mx-auto text-sm green-gradient-button rounded-sm"
            onClick={() => {
              if (
                allGroups?.some(
                  (group: Group) =>
                    group.group_name.toLowerCase().trim() ===
                    addGroupDetails.group_name.toLowerCase().trim()
                )
              )
                setValid(false);
              else {
                handleOnClose();
                createGroup.mutate({ group: addGroupDetails });
              }
            }}
          >
            Add Group
          </button>
        </section>
      </ModalLayout>
    </>
  );
};

export default AddGroup;
