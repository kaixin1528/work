/* eslint-disable react-hooks/exhaustive-deps */
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { filterVariants } from "src/constants/general";
import { GetAuditTrailTypes } from "src/services/regulation-policy/overview";
import { checkIsAdminOrSuperAdmin } from "src/utils/general";

const AuditTrailTypesFilter = ({
  label,
  inputs,
  setInputs,
}: {
  label?: string;
  inputs: string[];
  setInputs: (inputs: string[]) => void;
}) => {
  const isAdmin = checkIsAdminOrSuperAdmin();

  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const { data: auditTrailTypes } = GetAuditTrailTypes();

  const handleSelect = (value: string) => {
    setInputs([...inputs, value]);
  };

  return (
    <section
      className="grid content-start gap-3"
      onMouseLeave={() => setShowDropdown(false)}
    >
      <article className="flex items-center gap-3 text-left">
        {label && <h4 className="text-sm dark:text-checkbox">{label}</h4>}
        <article
          onMouseMove={() => setShowDropdown(true)}
          className="relative py-2 px-4 w-[20rem] cursor-pointer bg-gradient-to-b dark:from-tooltip dark:to-tooltip/30 focus:outline-none rounded-t-sm"
        >
          <input
            type="input"
            autoComplete="off"
            spellCheck="false"
            placeholder="Select"
            value=""
            onChange={(e) => {
              if (!showDropdown) setShowDropdown(true);
              handleSelect(e.target.value);
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
              className={`absolute top-8 right-0 grid content-start py-2 w-full max-h-36
             bg-gradient-to-b dark:from-tooltip dark:to-tooltip
           focus:outline-none shadow-2xl dark:shadow-checkbox/30 overflow-auto scrollbar rounded-b-sm z-50`}
            >
              {auditTrailTypes ? (
                auditTrailTypes?.length > 0 ? (
                  auditTrailTypes.map((item: string) => {
                    if (
                      ["USER_SIGNED_IN", "USER_SIGNED_OUT"].includes(item) &&
                      !isAdmin
                    )
                      return null;
                    return (
                      <motion.button
                        key={item}
                        variants={filterVariants}
                        disabled={inputs.includes(item)}
                        className="relative group flex gap-1 py-1 px-4 text-left break-all dark:hover:bg-filter/50 duration-100"
                        onClick={() => handleSelect(item)}
                      >
                        {inputs.includes(item) && (
                          <FontAwesomeIcon icon={faCheck} className="text-no" />
                        )}
                        {item.replaceAll("_", " ")}
                      </motion.button>
                    );
                  })
                ) : (
                  <p className="px-4">No results found</p>
                )
              ) : null}
            </motion.article>
          )}
        </article>
      </article>
      <ul className="flex flex-wrap items-center gap-2">
        {inputs.map((item: string, index: number) => {
          return (
            <li
              key={index}
              className="flex items-center gap-2 px-3 py-1 dark:bg-signin/30 border dark:border-signin rounded-sm"
            >
              {item.replaceAll("_", " ")}
              <button
                className="dark:hover:text-filter duration-100"
                onClick={() =>
                  setInputs(
                    inputs.filter((curItem: string) => curItem !== item)
                  )
                }
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default AuditTrailTypesFilter;
