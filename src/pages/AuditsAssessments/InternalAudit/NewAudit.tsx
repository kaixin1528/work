import React, { useState } from "react";
import ModalLayout from "src/layouts/ModalLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong, faUpload } from "@fortawesome/free-solid-svg-icons";
import SelectFrameworkFilter from "src/components/Filter/RegulationPolicy/SelectFrameworkFilter";
import { GetFrameworksWithControls } from "src/services/regulation-policy/framework";
import { useNavigate } from "react-router-dom";
import { AddAudit } from "src/services/audits-assessments/internal-audit";
import RegularInput from "src/components/Input/RegularInput";

const NewAudit = () => {
  const navigate = useNavigate();

  const [show, setShow] = useState<boolean>(false);
  const [inputs, setInputs] = useState({
    name: "",
  });
  const [selectedFramework, setSelectedFramework] = useState<any>({
    id: "",
    name: "",
  });

  const { data: frameworksWithControls } = GetFrameworksWithControls();
  const addAudit = AddAudit();

  const handleOnClose = () => setShow(false);
  const handleOnCloseConfirmation = () => addAudit.reset();

  return (
    <>
      <button
        className="flex items-center gap-2 px-8 py-2 mx-auto text-base dark:text-white green-gradient-button rounded-sm"
        onClick={() => {
          setShow(true);
          setInputs({
            name: "",
          });
          setSelectedFramework({ id: "", name: "" });
        }}
      >
        <FontAwesomeIcon icon={faUpload} />
        <h4>Start Internal Audit</h4>
      </button>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        <section className="grid content-start gap-5 h-[20rem]">
          <h3 className="flex items-center gap-2 text-lg">
            <FontAwesomeIcon icon={faUpload} />
            Start Internal Audit
          </h3>
          <RegularInput
            label="Name"
            keyName="name"
            inputs={inputs}
            setInputs={setInputs}
            required
          />
          <article className="grid gap-2">
            <h4>Framework</h4>
            <SelectFrameworkFilter
              selectedFramework={selectedFramework}
              setSelectedFramework={setSelectedFramework}
              list={frameworksWithControls?.data}
            />
          </article>
          <button
            disabled={selectedFramework.id === "" || inputs.name === ""}
            className="flex items-center justify-self-center gap-2 px-4 py-2 w-max dark:text-white green-gradient-button rounded-sm"
            onClick={() => {
              addAudit.mutate({
                name: inputs.name,
                framework_id: selectedFramework.id,
              });
              handleOnClose();
            }}
          >
            <h4>Done</h4>
          </button>
        </section>
      </ModalLayout>
      <ModalLayout
        showModal={addAudit.data !== undefined}
        onClose={handleOnCloseConfirmation}
      >
        <section className="grid content-start gap-5 py-4 h-full mx-auto">
          <article className="flex items-center gap-2">
            <img
              src="/general/checkmark.svg"
              alt="checkmark"
              className="w-6 h-6"
            />
            <h3 className="text-lg">New Internal Audit has been created!</h3>
          </article>
          <button
            className="px-4 py-2 mx-auto w-max dark:hover:bg-filter/30 duration-100 rounded-full"
            onClick={() => {
              navigate(
                `/audits-assessments/audit/details?audit_id=${addAudit.data.audit_id}&framework_id=${selectedFramework.id}`
              );
              handleOnCloseConfirmation();
            }}
          >
            <h4>
              Go to Internal Audit <FontAwesomeIcon icon={faArrowRightLong} />
            </h4>
          </button>
        </section>
      </ModalLayout>
    </>
  );
};

export default NewAudit;
