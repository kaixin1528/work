/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { motion } from "framer-motion";
import { filterVariants } from "../../../constants/general";
import DropdownLayout from "../../../layouts/DropdownLayout";
import { KeyStringVal } from "src/types/general";
import { GetPolicyGroups } from "src/services/regulation-policy/policy";
import { useEffect } from "react";

const ComparePolicyGroupFilter = ({
  selectedComparePolicyGroup,
  setSelectedComparePolicyGroup,
}: {
  selectedComparePolicyGroup: KeyStringVal;
  setSelectedComparePolicyGroup: (
    selectedComparePolicyGroup: KeyStringVal
  ) => void;
}) => {
  const { data: policyGroups } = GetPolicyGroups();

  useEffect(() => {
    if (policyGroups?.length > 0)
      setSelectedComparePolicyGroup(policyGroups[0]);
  }, [policyGroups]);

  return (
    <DropdownLayout
      value={selectedComparePolicyGroup.title}
      width="w-[15rem]"
      placeholder="Select policy group"
    >
      {policyGroups?.map((policyGroup: KeyStringVal, index: number) => (
        <motion.button
          key={index}
          variants={filterVariants}
          className={`relative py-1 px-7 text-left break-all dark:hover:bg-filter/50 ${
            policyGroup.title === selectedComparePolicyGroup.title
              ? "dark:bg-filter"
              : ""
          } duration-100`}
          onClick={() => setSelectedComparePolicyGroup(policyGroup)}
        >
          <p>{policyGroup.title}</p>
        </motion.button>
      ))}
    </DropdownLayout>
  );
};

export default ComparePolicyGroupFilter;
