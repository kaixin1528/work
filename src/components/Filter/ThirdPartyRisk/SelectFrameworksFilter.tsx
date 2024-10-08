/* eslint-disable no-restricted-globals */
import { motion } from "framer-motion";
import { filterVariants } from "../../../constants/general";
import DropdownLayout from "../../../layouts/DropdownLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { KeyStringVal } from "src/types/general";

const SelectFrameworksFilter = ({
  label,
  inputs,
  setInputs,
  list,
  selectedTextSize,
  width,
}: {
  label?: string;
  inputs: any;
  setInputs: (inputs: any) => void;
  list: KeyStringVal[];
  selectedTextSize?: string;
  width?: string;
}) => {
  return (
    <DropdownLayout
      label={label}
      value=""
      width={`${width ? width : "w-full"}`}
      placeholder="Select framework"
      selectedTextSize={selectedTextSize}
    >
      {list?.map((standard: KeyStringVal, index: number) => (
        <motion.button
          key={index}
          variants={filterVariants}
          className="relative flex items-center gap-2 px-7 py-3 w-full break-all text-left dark:hover:bg-filter/50 duration-100"
          onClick={() => {
            if (inputs.framework_ids.includes(standard.id))
              setInputs({
                ...inputs,
                framework_ids: inputs.framework_ids.filter(
                  (id: string) => id !== standard.id
                ),
              });
            else
              setInputs({
                ...inputs,
                framework_ids: [...inputs.framework_ids, standard.id],
              });
          }}
        >
          {inputs.framework_ids.includes(standard.id) && (
            <FontAwesomeIcon icon={faCheck} className="text-no" />
          )}
          <p>{standard.name}</p>
        </motion.button>
      ))}
    </DropdownLayout>
  );
};

export default SelectFrameworksFilter;
