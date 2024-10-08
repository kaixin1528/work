/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronDownIcon } from "@heroicons/react/solid";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { filterVariants } from "src/constants/general";
import { SearchVendor } from "src/services/third-party-risk/vendors-and-partners/vendors";
import { KeyStringVal } from "src/types/general";

const ThirdPartyFilter = ({
  label,
  inputs,
  setInputs,
}: {
  label?: string;
  inputs: any;
  setInputs: (inputs: KeyStringVal) => void;
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const search = SearchVendor();

  const handleSelect = (vendor: string) => {
    setInputs({ ...inputs, name: vendor });
  };

  useEffect(() => {
    search.mutate({
      vendor: "",
    });
  }, []);

  return (
    <section
      className="grid gap-3 text-sm text-left"
      onMouseLeave={() => setShowDropdown(false)}
    >
      {label && <h4 className="text-sm">{label}</h4>}
      <article
        onMouseMove={() => setShowDropdown(true)}
        className="relative py-2 px-4 cursor-pointer bg-gradient-to-b dark:from-tooltip dark:to-tooltip/30 focus:outline-none rounded-t-sm"
      >
        <input
          type="input"
          autoComplete="off"
          spellCheck="false"
          placeholder="Select"
          value={inputs.name}
          onChange={(e) => {
            if (!showDropdown) setShowDropdown(true);
            setInputs({ ...inputs, name: e.target.value });
            search.mutate({
              vendor: e.target.value,
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
            {search.data ? (
              search.data.length > 0 ? (
                search.data?.map((item: string) => (
                  <motion.button
                    key={item}
                    variants={filterVariants}
                    className="relative group flex gap-1 py-1 px-4 text-left break-all cursor-pointer dark:hover:bg-filter/50 duration-100"
                    onClick={() => handleSelect(item)}
                  >
                    {item}
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

export default ThirdPartyFilter;
