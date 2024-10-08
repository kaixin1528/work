import React, { useState } from "react";
import RegularInput from "src/components/Input/RegularInput";
import ModalLayout from "src/layouts/ModalLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong, faUpload } from "@fortawesome/free-solid-svg-icons";
import { AddAssessment } from "src/services/audits-assessments/questionnaire";
import GeneralSnapshotDatepicker from "src/components/Datepicker/GeneralSnapshotDatepicker";
import Tags from "./Tags";
import { KeyStringVal } from "src/types/general";
import { useGRCStore } from "src/stores/grc";
import { decodeJWT } from "src/utils/general";

const NewAssessment = ({
  selectedSourceType,
}: {
  selectedSourceType: string;
}) => {
  const jwt = decodeJWT();

  const { setSelectedGRCAssessment } = useGRCStore();

  const [show, setShow] = useState<boolean>(false);
  const [inputs, setInputs] = useState<any>({
    name: "",
    requesting_party: "",
    owner: "",
    reviewer: "",
    due_date: Date.now() * 1000,
    tags: [],
    source_type: selectedSourceType,
  });

  const addAssessment = AddAssessment();

  const handleOnClose = () => setShow(false);
  const handleOnCloseConfirmation = () => addAssessment.reset();

  return (
    <>
      <button
        className="flex items-center gap-2 px-8 py-2 mx-auto text-base dark:text-white green-gradient-button rounded-sm"
        onClick={() => {
          setShow(true);
          setInputs({
            name: "",
            requesting_party: "",
            owner: "",
            reviewer: "",
            due_date: Date.now() * 1000,
            tags: [],
            source_type: selectedSourceType,
          });
        }}
      >
        <FontAwesomeIcon icon={faUpload} />
        <h4>Start Assessment</h4>
      </button>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        <section className="grid content-start gap-5 h-full">
          <h3 className="flex items-center gap-2 text-lg">
            <FontAwesomeIcon icon={faUpload} />
            Start Assessment
          </h3>
          <article className="grid lg:grid-cols-2 gap-10">
            <RegularInput
              label="Name"
              keyName="name"
              inputs={inputs}
              setInputs={setInputs}
              required
            />
            <RegularInput
              label="Requesting Party"
              keyName="requesting_party"
              inputs={inputs}
              setInputs={setInputs}
            />
            <GeneralSnapshotDatepicker
              label="Due Date"
              keyName="due_date"
              inputs={inputs}
              setInputs={setInputs}
              onlyFutureDate
            />
          </article>
          <Tags inputs={inputs} setInputs={setInputs} />
          <button
            disabled={inputs.name === ""}
            className="flex items-center justify-self-center gap-2 px-4 py-2 w-max dark:text-white green-gradient-button rounded-sm"
            onClick={() => {
              addAssessment.mutate({
                name: inputs.name,
                requestingParty: inputs.requesting_party,
                dueDate: inputs.due_date,
                owner: jwt?.sub,
                reviewer: null,
                tags: inputs.tags.reduce(
                  (pV: string[], cV: KeyStringVal) => [...pV, cV.tag_id],
                  []
                ),
                sourceType: inputs.source_type,
              });
              handleOnClose();
            }}
          >
            Done
          </button>
        </section>
      </ModalLayout>
      <ModalLayout
        showModal={addAssessment.data !== undefined}
        onClose={handleOnCloseConfirmation}
      >
        <section className="grid content-start gap-5 py-4 h-full mx-auto">
          <article className="flex items-center gap-2">
            <img
              src="/general/checkmark.svg"
              alt="checkmark"
              className="w-6 h-6"
            />
            <h3 className="text-lg">{inputs.name} created!</h3>
          </article>
          <button
            className="px-4 py-2 mx-auto w-max dark:hover:bg-filter/30 duration-100 rounded-full"
            onClick={() => {
              setSelectedGRCAssessment(addAssessment.data);
              sessionStorage.assessment_id = addAssessment.data.assessment_id;
              sessionStorage.assessment_name = addAssessment.data.name;
              handleOnCloseConfirmation();
            }}
          >
            <h4>
              Go to Assessment <FontAwesomeIcon icon={faArrowRightLong} />
            </h4>
          </button>
        </section>
      </ModalLayout>
    </>
  );
};

export default NewAssessment;
