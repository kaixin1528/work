/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import GeneralSnapshotDatepicker from "src/components/Datepicker/GeneralSnapshotDatepicker";
import RegularInput from "src/components/Input/RegularInput";
import ModalLayout from "src/layouts/ModalLayout";
import { UpdateAssessment } from "src/services/audits-assessments/questionnaire";
import Tags from "./Tags";
import { KeyStringVal } from "src/types/general";
import { getCustomerID } from "src/utils/general";
import { GetAllUsers } from "src/services/settings/users";

const EditAssessment = ({
  selectedAssessment,
  selectedSourceType,
}: {
  selectedAssessment: any;
  selectedSourceType: string;
}) => {
  const customerID = getCustomerID();

  const [editAssessmentID, setEditAssessmentID] = useState<string>("");
  const [inputs, setInputs] = useState<any>({
    name: "",
    requesting_party: "",
    owner: "",
    reviewer: "",
    due_date: "",
    tags: "",
    questionnaires: [],
    source_type: selectedSourceType,
  });

  const editAssessment = UpdateAssessment();
  const { data: allUsers } = GetAllUsers(customerID, false);

  const handleOnClose = () => setEditAssessmentID("");

  return (
    <>
      <button
        className="flex items-center p-2 dark:bg-signin dark:hover:bg-signin/60 duration-100 rounded-full"
        onClick={() => {
          setEditAssessmentID(selectedAssessment.assessment_id);
          setInputs({
            name: selectedAssessment.name,
            requesting_party: selectedAssessment.requesting_party,
            owner:
              allUsers?.find(
                (user: KeyStringVal) =>
                  user.user_email === selectedAssessment.owner
              )?.user_id || "",
            reviewer:
              allUsers?.find(
                (user: KeyStringVal) =>
                  user.user_email === selectedAssessment.reviewer
              )?.user_id || "",
            due_date: selectedAssessment.due_date,
            tags: selectedAssessment.tags,
            questionnaires: selectedAssessment.questionnaires || [],
            source_type: selectedSourceType,
          });
        }}
      >
        <FontAwesomeIcon icon={faEdit} />
      </button>
      <ModalLayout
        showModal={editAssessmentID === selectedAssessment.assessment_id}
        onClose={handleOnClose}
      >
        <section className="grid content-start gap-5 h-full">
          <h3 className="flex items-center gap-2 text-lg">
            <FontAwesomeIcon icon={faEdit} />
            Update Assessment
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
            className="flex items-center justify-self-center gap-2 px-4 py-2 w-max dark:text-white gradient-button rounded-sm"
            onClick={() => {
              editAssessment.mutate({
                assessmentID: selectedAssessment.assessment_id,
                name: inputs.name,
                requestingParty: inputs.requesting_party,
                dueDate: inputs.due_date,
                owner: inputs.owner,
                reviewer: null,
                questionnaires: inputs.questionnaires,
                tags: inputs.tags.reduce(
                  (pV: string[], cV: KeyStringVal) => [...pV, cV.tag_id],
                  []
                ),
                sourceType: inputs.source_type,
              });
              handleOnClose();
            }}
          >
            <h4>Save</h4>
          </button>
        </section>
      </ModalLayout>
    </>
  );
};

export default EditAssessment;
