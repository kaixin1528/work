import React, { useState } from "react";
import ModalLayout from "src/layouts/ModalLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RegularInput from "src/components/Input/RegularInput";
import { AddVendorGroup } from "src/services/third-party-risk/vendors-and-partners/vendor-groups";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const NewVendorGroup = () => {
  const [show, setShow] = useState<boolean>(false);
  const [inputs, setInputs] = useState<any>({
    name: "",
    description: "",
  });

  const addVendorGroup = AddVendorGroup();

  const handleOnClose = () => setShow(false);
  const handleOnCloseConfirmation = () => addVendorGroup.reset();

  return (
    <>
      <button
        className="flex items-center gap-2 px-8 py-2 mx-auto text-base dark:text-white green-gradient-button rounded-sm"
        onClick={() => {
          setShow(true);
          setInputs({
            name: "",
          });
        }}
      >
        <FontAwesomeIcon icon={faPlus} />
        <h4>Add Vendor Group</h4>
      </button>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        <section className="grid content-start gap-5 h-full">
          <h3 className="flex items-center gap-2 text-lg">
            <FontAwesomeIcon icon={faPlus} />
            Add Vendor Group
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
              addVendorGroup.mutate({
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
      <ModalLayout
        showModal={addVendorGroup.data !== undefined}
        onClose={handleOnCloseConfirmation}
      >
        <section className="grid content-start gap-5 py-4 h-full mx-auto">
          <article className="flex items-center gap-2">
            <img
              src="/general/checkmark.svg"
              alt="checkmark"
              className="w-6 h-6"
            />
            <h3 className="text-lg">New Vendor Group has been created!</h3>
          </article>
        </section>
      </ModalLayout>
    </>
  );
};

export default NewVendorGroup;
