import { ChevronDownIcon } from "@heroicons/react/solid";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { filterVariants } from "src/constants/general";

const RegionFilter = ({
  label,
  regions,
  selected,
  setSelected,
}: {
  label: string;
  regions: string[];
  selected: string;
  setSelected: (selected: string) => void;
}) => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const filteredRegions = regions.filter((region) =>
    region
      .toLowerCase()
      .replace(/\s+/g, "")
      .includes(query.toLowerCase().replace(/\s+/g, ""))
  );

  return (
    <section className="flex items-center gap-3 z-40">
      <h4 className="dark:text-checkbox">{label} *:</h4>
      <section
        className="flex items-start gap-3 text-xs text-left"
        onMouseLeave={() => setShowDropdown(false)}
      >
        <article
          onMouseMove={() => setShowDropdown(true)}
          className="relative py-2 px-4 w-full cursor-pointer bg-gradient-to-b dark:from-tooltip dark:to-tooltip/30 focus:outline-none rounded-t-sm"
        >
          <input
            type="input"
            autoComplete="off"
            spellCheck="false"
            placeholder="Select"
            value={selected}
            onChange={(e) => {
              if (!showDropdown) setShowDropdown(true);
              setSelected(e.target.value);
              setQuery(e.target.value);
            }}
            className="w-max border-transparent focus:ring-0 focus:border-transparent bg-transparent focus:outline-none"
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
              {filteredRegions?.map((item: string, index: number) => (
                <motion.button
                  key={index}
                  variants={filterVariants}
                  className={`relative group py-1 px-4 text-left break-all dark:hover:bg-filter/50 ${
                    selected === item ? "dark:bg-filter" : ""
                  } duration-100`}
                  onClick={() => setSelected(item)}
                >
                  <p>{item}</p>
                </motion.button>
              ))}
            </motion.article>
          )}
        </article>
      </section>
    </section>
  );
};

export default RegionFilter;
