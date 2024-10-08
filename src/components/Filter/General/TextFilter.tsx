/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { motion } from "framer-motion";
import { filterVariants } from "../../../constants/general";
import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";

const TextFilter = ({
  label,
  list,
  value,
  setValue,
  showAbove,
  width,
  searchable,
}: {
  label?: string;
  list: string[];
  value: string;
  setValue: (value: string) => void;
  showAbove?: boolean;
  width?: string;
  searchable?: boolean;
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  const filteredList = searchable
    ? list?.filter((value: string) =>
        value
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(String(query).toLowerCase().replace(/\s+/g, ""))
      )
    : list;

  return (
    <>
      <section
        className="flex items-center gap-3 text-sm"
        onMouseLeave={() => setShowDropdown(false)}
      >
        {label && (
          <h4 className="max-w-60 text-sm dark:text-checkbox">{label}</h4>
        )}
        <article
          onMouseEnter={() => setShowDropdown(true)}
          className={`relative py-2 px-7 ${
            width ? width : "w-full"
          } text-left cursor-pointer bg-gradient-to-b dark:from-tooltip dark:to-tooltip/30 focus:outline-none rounded-t-sm`}
        >
          {searchable ? (
            <input
              type="input"
              autoComplete="off"
              spellCheck="false"
              placeholder="Select"
              value={query ? query : value}
              onChange={(e) => {
                if (!showDropdown) setShowDropdown(true);
                if (searchable) setQuery(e.target.value);
              }}
              className={`${
                width ? width : ""
              } border-transparent focus:ring-0 focus:border-transparent bg-transparent focus:outline-none`}
            />
          ) : (
            <span className="pr-2 break-words">{value || "Select"}</span>
          )}
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDownIcon className="w-3 h-3" aria-hidden="true" />
          </span>
          {showDropdown && (
            <motion.article
              variants={filterVariants}
              initial="hidden"
              animate={showDropdown ? "visible" : "hidden"}
              className={`absolute ${
                showAbove ? "bottom-8" : "top-8"
              } left-0 grid content-start py-2 w-full max-h-36 dark:bg-tooltip focus:outline-none shadow-2xl dark:shadow-checkbox/30 overflow-auto scrollbar rounded-b-sm z-50`}
            >
              {filteredList?.map((item: string) => (
                <motion.button
                  key={item}
                  variants={filterVariants}
                  className={`relative py-1 px-7 text-left dark:hover:bg-filter/50 ${
                    value === item ? "dark:bg-filter" : ""
                  } duration-200`}
                  onClick={() => {
                    setValue(item);
                    setQuery("");
                  }}
                >
                  <p>{item}</p>
                </motion.button>
              ))}
            </motion.article>
          )}
        </article>
      </section>
    </>
  );
};

export default TextFilter;
