/* eslint-disable react-hooks/exhaustive-deps */
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import React from "react";
import { filterVariants } from "src/constants/general";
import DropdownLayout from "src/layouts/DropdownLayout";
import { GetRiskComplianceControlFilters } from "src/services/regulation-policy/regulation-policy";
import { KeyStringVal } from "src/types/general";

const ControlFilter = ({
  documentType,
  documentID,
  label,
  keyName,
  inputs,
  setInputs,
}: {
  documentType: string;
  documentID: string;
  label?: string;
  keyName: string;
  inputs: KeyStringVal;
  setInputs: (inputs: KeyStringVal) => void;
}) => {
  const { data: controlFilters } = GetRiskComplianceControlFilters(
    documentType,
    documentID
  );

  const filteredList = controlFilters && controlFilters[keyName];

  return (
    <>
      {filteredList?.length > 0 && (
        <DropdownLayout
          label={label}
          value={inputs[keyName]}
          placeholder="Select"
          width="w-[20rem]"
        >
          {filteredList?.map((curVal: string, index: number) => {
            const selected = inputs[keyName] === curVal;
            return (
              <motion.button
                key={index}
                variants={filterVariants}
                className="relative flex items-center gap-2 px-7 py-1 w-full break-all text-left dark:hover:bg-filter/50 duration-100"
                onClick={() => {
                  if (selected) setInputs({ ...inputs, [keyName]: "" });
                  else setInputs({ ...inputs, [keyName]: curVal });
                }}
              >
                {selected && (
                  <FontAwesomeIcon icon={faCheck} className="text-no" />
                )}
                <p>{curVal}</p>
              </motion.button>
            );
          })}
        </DropdownLayout>
      )}
    </>
  );
};

export default ControlFilter;
