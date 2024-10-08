import { ChevronDownIcon } from "@heroicons/react/solid";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { filterVariants } from "src/constants/general";
import { initialMatch } from "src/constants/graph";
import { GetCypherAutocompleteValues } from "src/services/graph/autocomplete";
import { useGeneralStore } from "src/stores/general";
import { KeyStringVal } from "src/types/general";

const CypherMatchFilter = ({
  list,
  queryParam,
  keyName,
  match,
  setMatch,
  conditions,
  startTime,
  endTime,
}: {
  list?: string[];
  queryParam: string;
  keyName: string;
  match: KeyStringVal;
  setMatch: (match: KeyStringVal) => void;
  conditions: KeyStringVal[];
  startTime: number;
  endTime: number;
}) => {
  const { env } = useGeneralStore();

  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [hover, setHover] = useState<string>("");

  const value = match[keyName];

  const { data: autocompleteValues } = GetCypherAutocompleteValues(
    env,
    queryParam,
    match,
    conditions,
    startTime,
    endTime,
    ""
  );

  const filteredList = (autocompleteValues?.query_params || list)?.filter(
    (item: string) =>
      item
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(value.toLowerCase().replace(/\s+/g, ""))
  );

  const nodeTypeMetadata = autocompleteValues?.metadata;

  const handleSelect = (item: string) => {
    switch (keyName) {
      case "match1Name":
        setMatch({
          ...initialMatch,
          [keyName]: item,
        });
        break;
      case "match2Name":
        if (match.match1Name === "id")
          setMatch({
            ...match,
            [keyName]: item,
            relName: "",
            relValue: "",
            match2Value: "",
          });
        else
          setMatch({
            ...match,
            [keyName]: item,
            match2Value: "",
          });
        break;
      default:
        if (
          match.match1Name === "id" &&
          ["radius", "impact_radius"].includes(keyName)
        )
          setMatch({
            ...match,
            [keyName]: item,
            relValue: "",
            match2Name: "",
            match2Value: "",
          });
        else
          setMatch({
            ...match,
            [keyName]: item,
          });
    }
  };

  return (
    <section
      className="flex items-start gap-3 text-xs text-left"
      onMouseLeave={() => setShowDropdown(false)}
    >
      <article
        onClick={() => setShowDropdown(true)}
        className="relative py-2 px-4 w-full cursor-pointer bg-gradient-to-b dark:from-tooltip dark:to-tooltip/30 focus:outline-none rounded-t-sm"
      >
        <input
          type="input"
          autoComplete="off"
          spellCheck="false"
          placeholder="Select"
          value={value}
          onChange={(e) => {
            if (!showDropdown) setShowDropdown(true);
            handleSelect(e.target.value);
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
            {filteredList?.map((item: string) => (
              <motion.button
                key={item}
                variants={filterVariants}
                className={`relative group py-1 px-4 text-left break-all dark:hover:bg-filter/50 ${
                  value === item ? "dark:bg-filter" : ""
                } duration-100`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setHover(item)}
                onMouseLeave={() => setHover("")}
              >
                <p>{item}</p>
              </motion.button>
            ))}
          </motion.article>
        )}
      </article>
      {nodeTypeMetadata && nodeTypeMetadata[hover] && (
        <ul className="grid gap-1 px-4 py-1 dark:bg-tooltip border-1 dark:border-checkbox">
          {nodeTypeMetadata[hover].name?.map((name: string, index: number) => {
            return (
              <li key={index} className="flex items-start gap-2 w-max">
                <img
                  src={`/general/integrations/${nodeTypeMetadata[hover].cloud[
                    index
                  ].toLowerCase()}.svg`}
                  alt={nodeTypeMetadata[hover].cloud[index]}
                  className="w-4 h-4"
                />
                {name}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default CypherMatchFilter;
