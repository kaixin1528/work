/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import ModalLayout from "../../../layouts/ModalLayout";
import {
  GetAllGroups,
  GetGroupInfo,
  UpdateGroup,
} from "../../../services/settings/groups";
import { Group } from "../../../types/settings";
import { checkSuperOrSiteAdmin, getCustomerID } from "../../../utils/general";
import RegularInput from "src/components/Input/RegularInput";

const EditGroup = ({
  editGroup,
  setEditGroup,
  group,
}: {
  editGroup: string;
  setEditGroup: (editGroup: string) => void;
  group: Group;
}) => {
  const customerID = getCustomerID();
  const isSuperOrSiteAdmin = checkSuperOrSiteAdmin();

  const [editGroupDetails, setEditGroupDetails] = useState({
    group_name: "",
    group_description: "",
  });
  const [valid, setValid] = useState(true);

  const { data: allGroups } = GetAllGroups(customerID, isSuperOrSiteAdmin);
  const { data: groupInfo } = GetGroupInfo(
    customerID,
    editGroup,
    isSuperOrSiteAdmin
  );
  const updateGroup = UpdateGroup(customerID);

  useEffect(() => {
    if (groupInfo) {
      setEditGroupDetails({
        group_name: groupInfo.group_name,
        group_description: groupInfo.group_description,
      });
    }
  }, [groupInfo]);

  const handleOnClose = () => {
    setValid(true);
    setEditGroup("");
  };

  return (
    <ModalLayout
      showModal={editGroup === group.group_id}
      onClose={handleOnClose}
    >
      <h4 className="text-base text-center mb-3">Edit Group</h4>
      <section className="grid gap-8">
        <RegularInput
          label="Group Name"
          keyName="group_name"
          inputs={editGroupDetails}
          setInputs={setEditGroupDetails}
          valid={valid}
          setValid={setValid}
        />
        <RegularInput
          label="Description"
          keyName="group_description"
          inputs={editGroupDetails}
          setInputs={setEditGroupDetails}
        />
        <button
          disabled={editGroupDetails.group_name === ""}
          className="mt-5 px-4 py-2 mx-auto text-sm gradient-button rounded-sm"
          onClick={() => {
            if (
              allGroups?.some(
                (curGroup: Group) =>
                  group.group_id !== curGroup.group_id &&
                  curGroup.group_name.toLowerCase().trim() ===
                    editGroupDetails.group_name.toLowerCase().trim()
              )
            )
              setValid(false);
            else {
              handleOnClose();
              updateGroup.mutate({
                groupID: editGroup,
                group: editGroupDetails,
              });
            }
          }}
        >
          Update Group
        </button>
      </section>
    </ModalLayout>
  );
};

export default EditGroup;
