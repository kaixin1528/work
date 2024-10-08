import React, { useState } from "react";
import ModalLayout from "src/layouts/ModalLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import RegularInput from "src/components/Input/RegularInput";
import NumericFilter from "src/components/Filter/General/NumericFilter";
import { attributeColors } from "src/constants/general";
import { decodeJWT } from "src/utils/general";
import { EditVendor } from "src/services/third-party-risk/vendors-and-partners/vendors";

const UpdateVendor = ({
  vendorID,
  vendor,
}: {
  vendorID: string;
  vendor: any;
}) => {
  const jwt = decodeJWT();

  const [show, setShow] = useState<boolean>(false);
  const [inputs, setInputs] = useState<any>({
    name: vendor.name,
    last_updated: vendor.last_updated,
    risk_profile: vendor.risk_profile,
    address: vendor.address,
    contact_name: vendor.contact_name,
    contact_email: vendor.contact_email,
    contact_phone: vendor.contact_phone,
  });
  const [numAssessments, setNumAssessments] = useState<number>(
    vendor.number_of_assessments
  );

  const editVendor = EditVendor(vendorID);

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
          <h3 className="text-lg">Edit Vendor</h3>
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
          <NumericFilter
            label="Number of Asssessments"
            value={numAssessments}
            setValue={setNumAssessments}
          />
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
              editVendor.mutate({
                name: inputs.name,
                risk_profile: inputs.risk_profile,
                address: inputs.address,
                contact: {
                  name: inputs.contact_name,
                  email: inputs.contact_email,
                  phone: inputs.contact_phone,
                },
                last_updated: Date.now() * 1000,
                number_of_assessments: numAssessments,
                analyst: jwt?.sub,
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

export default UpdateVendor;
