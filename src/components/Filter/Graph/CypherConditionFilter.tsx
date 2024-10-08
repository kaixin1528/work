/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { motion } from "framer-motion";
import { filterVariants } from "../../../constants/general";
import { KeyStringVal } from "src/types/general";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { useGeneralStore } from "src/stores/general";
import { conditionKeyMapping, newCondition } from "src/constants/graph";
import { GetCypherAutocompleteValues } from "src/services/graph/autocomplete";

const CypherConditionFilter = ({
  label,
  list,
  index,
  keyName,
  match,
  condition,
  conditions,
  setConditions,
  startTime,
  endTime,
}: {
  label?: string;
  list?: string[];
  index: number;
  keyName: string;
  match: KeyStringVal;
  condition: KeyStringVal;
  conditions: KeyStringVal[];
  setConditions: (conditions: KeyStringVal[]) => void;
  startTime?: number;
  endTime?: number;
}) => {
  const { env } = useGeneralStore();

  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [hover, setHover] = useState<string>("");

  const value = condition[keyName];

  const { data: autocompleteValues } = GetCypherAutocompleteValues(
    env,
    `${
      ["connected", "annotation", "extension"].includes(condition.match)
        ? `${condition.match}_`
        : ""
    }${conditionKeyMapping[keyName]}` || "",
    match,
    conditions,
    Number(startTime),
    Number(endTime),
    keyName === "propertyValue" ? condition.propertyName : ""
  );

  const filteredList = (autocompleteValues?.query_params || list)?.filter(
    (item: string) =>
      item
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(value.toLowerCase().replace(/\s+/g, ""))
  );
  const propertyMetadata = autocompleteValues?.metadata;

  const handleSelect = (item: string) => {
    setConditions(
      conditions.map((condition, curIndex) => {
        if (curIndex === index) {
          switch (keyName) {
            case "match":
              return {
                ...newCondition,
                [keyName]: item,
              };
            case "propertyName":
              return {
                ...condition,
                [keyName]: item,
                propertOperator: "",
                propertyValue: "",
              };
            case "propertyOperator":
              return {
                ...condition,
                [keyName]: item,
                propertyValue: "",
              };
            default:
              return {
                ...condition,
                [keyName]: item,
              };
          }
        } else return condition;
      })
    );
  };

  return (
    <section
      className="relative flex items-start gap-3 text-xs text-left"
      onMouseLeave={() => setShowDropdown(false)}
    >
      <article
        onClick={() => setShowDropdown(true)}
        className="relative py-2 pl-4 pr-8 cursor-pointer bg-gradient-to-b dark:from-tooltip dark:to-tooltip/30 focus:outline-none rounded-t-sm"
      >
        <input
          type="input"
          autoComplete="off"
          spellCheck="false"
          placeholder={label || "Select"}
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
      {propertyMetadata &&
        propertyMetadata[hover]?.name?.every(
          (value: string) => value !== null
        ) && (
          <ul className="grid gap-1 px-4 py-1 dark:bg-tooltip border-1 dark:border-checkbox">
            {propertyMetadata[hover].name.map((name: string, index: number) => {
              return (
                <li key={index} className="flex items-start gap-2">
                  {propertyMetadata[hover].cloud && hover !== "CUSTOMERCLD" && (
                    <img
                      src={`/general/integrations/${propertyMetadata[
                        hover
                      ].cloud[index].toLowerCase()}.svg`}
                      alt={propertyMetadata[hover].cloud[index]}
                      className="w-4 h-4"
                    />
                  )}
                  {name}
                </li>
              );
            })}
          </ul>
        )}
    </section>
  );
};

export default CypherConditionFilter;
