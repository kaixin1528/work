/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { motion } from "framer-motion";
import { filterVariants } from "../../../constants/general";
import DropdownLayout from "../../../layouts/DropdownLayout";
import { KeyStringVal } from "src/types/general";
import { GetFrameworks } from "src/services/regulation-policy/framework";

const CompareFrameworkFilter = ({
  selectedCompareFramework,
  setSelectedCompareFramework,
}: {
  selectedCompareFramework: KeyStringVal;
  setSelectedCompareFramework: (selectedCompareFramework: KeyStringVal) => void;
}) => {
  const { data: frameworks } = GetFrameworks();

  return (
    <DropdownLayout
      label="Selected Framework"
      value={selectedCompareFramework.name}
      width="w-[50rem]"
      placeholder="Select framework"
    >
      {frameworks?.data.map((framework: KeyStringVal, index: number) => (
        <motion.button
          key={index}
          variants={filterVariants}
          className={`relative px-7 py-1 w-full break-words text-left dark:hover:bg-filter/50 ${
            framework.id === selectedCompareFramework.id ? "dark:bg-filter" : ""
          } duration-100`}
          onClick={() => setSelectedCompareFramework(framework)}
        >
          <p>{framework.name}</p>
        </motion.button>
      ))}
    </DropdownLayout>
  );
};

export default CompareFrameworkFilter;
