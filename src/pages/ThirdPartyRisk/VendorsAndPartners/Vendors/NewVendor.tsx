import React, { useState } from "react";
import ModalLayout from "src/layouts/ModalLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import RegularInput from "src/components/Input/RegularInput";
import { attributeColors } from "src/constants/general";
import { AddVendor } from "src/services/third-party-risk/vendors-and-partners/vendors";

const NewVendor = () => {
  const [show, setShow] = useState<boolean>(false);
  const [inputs, setInputs] = useState<any>({
    name: "",
    risk_profile: "critical",
    address: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
  });

  const addVendor = AddVendor();

  const handleOnClose = () => setShow(false);
  const handleOnCloseConfirmation = () => addVendor.reset();

  return (
    <>
      <button
        className="flex items-center gap-2 px-8 py-2 mx-auto text-base dark:text-white green-gradient-button rounded-sm"
        onClick={() => {
          setShow(true);
          setInputs({
            name: "",
            risk_profile: "critical",
            address: "",
            contact_name: "",
            contact_email: "",
            contact_phone: "",
          });
        }}
      >
        <FontAwesomeIcon icon={faPlus} />
        <h4>Add Vendor</h4>
      </button>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        <section className="grid content-start gap-5 h-full">
          <h3 className="flex items-center gap-2 text-lg">
            <FontAwesomeIcon icon={faPlus} />
            Add Vendor
          </h3>
          <section className="grid md:grid-cols-2 gap-5">
            <RegularInput
              label="Vendor"
              keyName="name"
              inputs={inputs}
              setInputs={setInputs}
              required
            />
            <RegularInput
              label="Address"
              keyName="address"
              inputs={inputs}
              setInputs={setInputs}
            />
            <RegularInput
              label="Contact Name"
              keyName="contact_name"
              inputs={inputs}
              setInputs={setInputs}
              required
            />
            <RegularInput
              label="Contact Email"
              keyName="contact_email"
              inputs={inputs}
              setInputs={setInputs}
              required
            />
            <RegularInput
              label="Contact Phone"
              keyName="contact_phone"
              inputs={inputs}
              setInputs={setInputs}
            />
          </section>
          <section className="grid gap-2">
            <h4>Risk Profile</h4>
            <ul className="flex items-center gap-2">
              {["critical", "high", "medium", "low"].map((risk) => {
                return (
                  <li
                    key={risk}
                    className={`cursor-pointer capitalize ${
                      attributeColors[risk]
                    } dark:hover:bg-signin/30 duration-100 ${
                      inputs.risk_profile === risk
                        ? "ring-2 ring-offset-2 ring-offset-signin"
                        : ""
                    }`}
                    onClick={() => setInputs({ ...inputs, risk_profile: risk })}
                  >
                    {risk}
                  </li>
                );
              })}
            </ul>
          </section>
          <button
            disabled={
              inputs.name === "" ||
              inputs.risk_profile === "" ||
              inputs.contact_name === "" ||
              inputs.contact_email === ""
            }
            className="flex items-center justify-self-center gap-2 px-4 py-2 w-max dark:text-white green-gradient-button rounded-sm"
            onClick={() => {
              addVendor.mutate({
                name: inputs.name,
                risk_profile: inputs.risk_profile,
                address: inputs.address,
                contact: {
                  name: inputs.contact_name,
                  email: inputs.contact_email,
                  phone: inputs.contact_phone,
                },
              });
              handleOnClose();
            }}
          >
            <h4>Done</h4>
          </button>
        </section>
      </ModalLayout>
      <ModalLayout
        showModal={addVendor.data !== undefined}
        onClose={handleOnCloseConfirmation}
      >
        <section className="grid content-start gap-5 py-4 h-full mx-auto">
          <article className="flex items-center gap-2">
            <img
              src="/general/checkmark.svg"
              alt="checkmark"
              className="w-6 h-6"
            />
            <h3 className="text-lg">New Vendor has been created!</h3>
          </article>
        </section>
      </ModalLayout>
    </>
  );
};

export default NewVendor;
