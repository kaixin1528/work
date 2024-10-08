/* eslint-disable react-hooks/exhaustive-deps */
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { filterVariants } from "src/constants/general";
import { SearchGRCVerticals } from "src/services/regulation-policy/overview";
import { KeyStringVal } from "src/types/general";

const VerticalFilter = ({
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

  const search = SearchGRCVerticals();

  const handleSelect = (vertical: KeyStringVal) => {
    const value = `${vertical.industry}-${vertical.sub_category}`;
    if (inputs.verticals.includes(value))
      setInputs({
        ...inputs,
        verticals: inputs.verticals.filter(
          (curVertical: string) => curVertical !== value
        ),
      });
    else setInputs({ ...inputs, verticals: [...inputs.verticals, value] });
    setQuery("");
  };

  useEffect(() => {
    search.mutate({
      vertical: "",
    });
  }, []);

  return (
    <section
      className="grid content-start gap-3"
      onMouseLeave={() => setShowDropdown(false)}
    >
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
              search.mutate({
                vertical: e.target.value,
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
                  search.data?.map((item: KeyStringVal) => (
                    <motion.button
                      key={`${item.industry}-${item.sub_category}`}
                      variants={filterVariants}
                      className="relative group flex gap-1 py-1 px-4 text-left break-all cursor-pointer dark:hover:bg-filter/50 duration-100"
                      onClick={() => handleSelect(item)}
                    >
                      {inputs.verticals.includes(
                        `${item.industry}-${item.sub_category}`
                      ) && (
                        <FontAwesomeIcon icon={faCheck} className="text-no" />
                      )}
                      {item.industry} - {item.sub_category}
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
      <ul className="flex flex-wrap items-center gap-2">
        {inputs.verticals.map((item: string, index: number) => {
          return (
            <li
              key={index}
              className="flex items-center gap-2 px-3 py-1 dark:bg-signin/30 border dark:border-signin rounded-sm"
            >
              {item.replaceAll("_", " ")}
              <button
                className="dark:hover:text-filter duration-100"
                onClick={() =>
                  setInputs({
                    ...inputs,
                    verticals: inputs.verticals.filter(
                      (curItem: string) => curItem !== item
                    ),
                  })
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

export default VerticalFilter;
