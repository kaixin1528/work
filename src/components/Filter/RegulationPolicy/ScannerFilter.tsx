/* eslint-disable react-hooks/exhaustive-deps */
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { filterVariants } from "src/constants/general";
import { GetAllScanners } from "src/services/regulation-policy/regulation-policy";
import { KeyStringVal } from "src/types/general";

const ScannerFilter = ({
  label,
  inputs,
  setInputs,
}: {
  label?: string;
  inputs: any;
  setInputs: (inputs: KeyStringVal) => void;
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  const { data: scanners } = GetAllScanners(showDropdown);

  const filteredScanners =
    query !== ""
      ? scanners?.filter((scanner: string) =>
          scanner
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        )
      : scanners;

  const handleSelect = (scanner: string) => {
    if (inputs.scanners.includes(scanner))
      setInputs({
        ...inputs,
        scanners: inputs.scanners.filter(
          (curScanner: string) => curScanner !== scanner
        ),
      });
    else setInputs({ ...inputs, scanners: [...inputs.scanners, scanner] });
    setQuery("");
  };

  return (
    <section
      className="flex items-center gap-3 text-sm text-left"
      onMouseLeave={() => setShowDropdown(false)}
    >
      {label && <h4 className="text-sm dark:text-checkbox">{label}</h4>}
      <article
        onMouseMove={() => setShowDropdown(true)}
        className="relative py-2 px-4 w-[25rem] bg-gradient-to-b dark:from-tooltip dark:to-tooltip/30 focus:outline-none rounded-t-sm"
      >
        <input
          type="input"
          autoComplete="off"
          spellCheck="false"
          placeholder="Select"
          value={query}
          onChange={(e) => {
            if (!showDropdown) setShowDropdown(true);
            setQuery(e.target.value);
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
            {filteredScanners ? (
              filteredScanners.length > 0 ? (
                filteredScanners?.map((scanner: string) => (
                  <motion.button
                    key={scanner}
                    variants={filterVariants}
                    className="relative group flex gap-1 py-1 px-4 text-left break-all cursor-pointer dark:hover:bg-filter/50 duration-100"
                    onClick={() => handleSelect(scanner)}
                  >
                    {inputs.scanners.includes(scanner) && (
                      <FontAwesomeIcon icon={faCheck} className="text-no" />
                    )}
                    {scanner}
                  </motion.button>
                ))
              ) : (
                <p className="px-4">No results found</p>
              )
            ) : null}
          </motion.article>
        )}
      </article>
    </section>
  );
};

export default ScannerFilter;
