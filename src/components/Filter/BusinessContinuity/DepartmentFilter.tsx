/* eslint-disable react-hooks/exhaustive-deps */
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { filterVariants } from "src/constants/general";
import { GetSOPTagNamesAndValues } from "src/services/business-continuity/sop";

const DepartmentFilter = ({
  label,
  selectedDepartment,
  setSelectedDepartment,
}: {
  label?: string;
  selectedDepartment: string[];
  setSelectedDepartment: (selectedDepartment: string[]) => void;
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  const { data: sopTags } = GetSOPTagNamesAndValues();

  const filteredList = sopTags
    ? sopTags.filter((auth: string) =>
        auth
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(query.toLowerCase().replace(/\s+/g, ""))
      )
    : [];

  const handleSelect = (department: string) => {
    if (selectedDepartment.length > 0 && selectedDepartment[0] === department) {
      setSelectedDepartment([]);
      setQuery("");
    } else {
      setSelectedDepartment([department]);
      setQuery(department);
    }
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
          value={selectedDepartment.length > 0 ? selectedDepartment[0] : query}
          onChange={(e) => {
            if (!showDropdown) setShowDropdown(true);
            setQuery(e.target.value);
            if (
              selectedDepartment.length > 0 &&
              e.target.value !== selectedDepartment[0]
            )
              setSelectedDepartment([]);
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
            {sopTags ? (
              filteredList?.length > 0 ? (
                filteredList.map((department: string) => (
                  <motion.button
                    key={department}
                    variants={filterVariants}
                    className="relative group flex items-center gap-1 py-1 px-4 text-left break-all cursor-pointer dark:hover:bg-filter/50 duration-100"
                    onClick={() => handleSelect(department)}
                  >
                    {selectedDepartment.length > 0 &&
                      selectedDepartment[0] === department && (
                        <FontAwesomeIcon icon={faCheck} className="text-no" />
                      )}
                    {department}
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

export default DepartmentFilter;
