import { ChevronDownIcon } from "@heroicons/react/solid";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { filterVariants } from "src/constants/general";
import { GetSOPList } from "src/services/business-continuity/sop";
import { KeyStringVal } from "src/types/general";

const BIAFilter = ({
  inputs,
  setInputs,
}: {
  inputs: KeyStringVal;
  setInputs: (inputs: KeyStringVal) => void;
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const { data: sopList } = GetSOPList([]);

  const filteredList = (
    [
      ...new Set(
        sopList?.data.reduce(
          (pV: string[], cV: KeyStringVal) => [...pV, cV.sop_name],
          []
        )
      ),
    ] as string[]
  ).filter((sopName: string) =>
    sopName
      .toLowerCase()
      .replace(/\s+/g, "")
      .includes(inputs.sop_name.toLowerCase().replace(/\s+/g, ""))
  );

  const handleSelect = (sopName: string) => {
    const sopID = sopList?.data.find(
      (sop: KeyStringVal) => sop.sop_name === sopName
    )?.sop_id;
    setInputs({
      ...inputs,
      sop_id: sopID,
      sop_name: sopName,
    });
  };

  return (
    <section
      className="grid gap-1 text-left"
      onMouseLeave={() => setShowDropdown(false)}
    >
      <h4 className="dark:text-checkbox justify-self-start">Procedure Name</h4>
      <article
        onMouseEnter={() => setShowDropdown(true)}
        className="relative py-2 px-4 w-full cursor-pointer bg-gradient-to-b dark:from-tooltip dark:to-tooltip/30 focus:outline-none rounded-t-sm"
      >
        <input
          type="input"
          autoComplete="off"
          spellCheck="false"
          placeholder="Select"
          value={inputs.sop_name}
          onChange={(e) => {
            if (!showDropdown) setShowDropdown(true);
            setInputs({
              ...inputs,
              sop_name: e.target.value,
            });
          }}
          className="w-full border-transparent focus:ring-0 focus:border-transparent bg-transparent focus:outline-none"
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon className="w-3 h-3" aria-hidden="true" />
        </span>
        {showDropdown && (
          <motion.article
            variants={filterVariants}
            initial="hidden"
            animate={showDropdown ? "visible" : "hidden"}
            className={`absolute top-8 right-0 grid content-start py-2 w-full max-h-36 dark:bg-tooltip focus:outline-none shadow-2xl dark:shadow-checkbox/30 overflow-auto scrollbar rounded-b-sm z-50`}
          >
            {filteredList?.map((sopName: string) => (
              <motion.button
                key={sopName}
                variants={filterVariants}
                className={`relative group py-1 px-4 text-left break-all dark:hover:bg-filter/50 ${
                  inputs.sop_name === sopName ? "dark:bg-filter" : ""
                } duration-100`}
                onClick={() => handleSelect(sopName)}
              >
                <p>{sopName}</p>
              </motion.button>
            ))}
          </motion.article>
        )}
      </article>
    </section>
  );
};

export default BIAFilter;
