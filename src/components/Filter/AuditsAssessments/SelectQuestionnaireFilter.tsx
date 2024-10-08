/* eslint-disable no-restricted-globals */
import { motion } from "framer-motion";
import { filterVariants } from "../../../constants/general";
import DropdownLayout from "../../../layouts/DropdownLayout";
import { KeyStringVal } from "src/types/general";
import { GetGlobalQuestionnaires } from "src/services/audits-assessments/questionnaire";

const SelectQuestionnaireFilter = ({
  selectedQuestionnaire,
  setSelectedQuestionnaire,
}: {
  selectedQuestionnaire: KeyStringVal;
  setSelectedQuestionnaire: (selectedQuestionnaire: KeyStringVal) => void;
}) => {
  const { data: availableQuestionnaires } = GetGlobalQuestionnaires();

  return (
    <DropdownLayout
      value={selectedQuestionnaire.document_name}
      placeholder="Select Questionnaire"
    >
      {availableQuestionnaires?.map(
        (questionnaire: KeyStringVal, index: number) => (
          <motion.button
            key={index}
            variants={filterVariants}
            className="relative flex items-center gap-2 px-7 py-1 w-full break-all text-left dark:hover:bg-filter/50 duration-100"
            onClick={() => setSelectedQuestionnaire(questionnaire)}
          >
            <p>{questionnaire.document_name}</p>
          </motion.button>
        )
      )}
    </DropdownLayout>
  );
};

export default SelectQuestionnaireFilter;
