import React, { useState } from "react";
import ModalLayout from "src/layouts/ModalLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import RegularInput from "src/components/Input/RegularInput";
import { EditVendorGroup } from "src/services/third-party-risk/vendors-and-partners/vendor-groups";

const UpdateVendorGroup = ({
  groupID,
  vendorGroup,
}: {
  groupID: string;
  vendorGroup: any;
}) => {
  const [show, setShow] = useState<boolean>(false);
  const [inputs, setInputs] = useState<any>({
    name: vendorGroup.name,
    description: vendorGroup.description,
  });

  const editVendor = EditVendorGroup(groupID);

  const handleOnClose = () => setShow(false);

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
        <section className="grid content-start gap-5 h-full">
          <h3 className="flex items-center gap-2 text-lg">
            <FontAwesomeIcon icon={faEdit} />
            Edit Vendor Group
          </h3>
          <RegularInput
            label="Vendor Group"
            keyName="name"
            inputs={inputs}
            setInputs={setInputs}
            required
          />
          <RegularInput
            label="Description"
            keyName="description"
            inputs={inputs}
            setInputs={setInputs}
          />
          <button
            disabled={inputs.name === ""}
            className="flex items-center justify-self-center gap-2 px-4 py-2 w-max dark:text-white green-gradient-button rounded-sm"
            onClick={() => {
              editVendor.mutate({
                name: inputs.name,
                description: inputs.description,
              });
              handleOnClose();
            }}
          >
            <h4>Done</h4>
          </button>
        </section>
      </ModalLayout>
    </>
  );
};

export default UpdateVendorGroup;
