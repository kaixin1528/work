import React from "react";
import { useNavigate } from "react-router-dom";
import { cyberRiskCategories } from "src/constants/summaries";
import { parseURL } from "src/utils/general";
import queryString from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";

const Categories = () => {
  const navigate = useNavigate();
  const parsed = parseURL();

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 items-stretch w-full h-full gap-5">
      {Object.keys(cyberRiskCategories).map((category: string) => {
        const filteredItems = cyberRiskCategories[category];
        return (
          <section
            key={category}
            className="grid content-start gap-3 p-4 w-full h-full dark:bg-panel black-shadow"
          >
            <h4 className="text-base">{category}</h4>
            <ul className="grid w-full h-full text-sm dark:text-checkbox max-h-96 overflow-auto scrollbar">
              {filteredItems?.map((item: string) => {
                return (
                  <button
                    key={item}
                    disabled={!["Assets and Services"].includes(item)}
                    className="flex items-center gap-2 py-2 px-4 text-left disabled:cursor-auto disabled:dark:text-filter/60 disabled:dark:bg-filter/10 dark:hover:bg-filter/60 duration-100  border-b-1 dark:border-checkbox/30"
                    onClick={() =>
                      navigate(
                        `/summaries/details?${queryString.stringify(
                          parsed
                        )}&nav=${item.toLowerCase().replaceAll(" ", "_")}`
                      )
                    }
                  >
                    <FontAwesomeIcon icon={faArrowRightLong} />
                    <h4>{item}</h4>
                  </button>
                );
              })}
            </ul>
          </section>
        );
      })}
    </section>
  );
};

export default Categories;
