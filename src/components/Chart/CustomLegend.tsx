import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {
  chartLegendColors,
  severityBGColors,
  severityLegends,
} from "src/constants/general";
import {
  handleLegendMouseEnter,
  handleLegendMouseLeave,
  handleSelectSection,
} from "src/utils/general";

const CustomLegend = ({
  payload,
  keys,
  hasSeverity,
  sectionProps,
  setSectionProps,
}: any) => {
  return (
    <section className="flex items-center gap-5 pb-2 place-content-center w-full text-base">
      {sectionProps && (
        <article className="group relative">
          <FontAwesomeIcon
            icon={faCircleInfo}
            className="w-3 h-3 dark:text-checkbox z-0 focus:outline-none border-none"
          />
          <p className="hidden group-hover:block absolute top-7 left-0 w-60 text-sm dark:text-white dark:bg-tooltip p-3 overflow-hidden rounded-sm">
            You can select and unselect legends to hide/show parts
          </p>
        </article>
      )}

      <ul
        className={`flex ${
          hasSeverity ? "flex-row-reverse" : ""
        } items-center gap-5 py-2 capitalize text-xs place-content-center overflow-auto scrollbar`}
      >
        {keys.map((key: any, index: number) => {
          return (
            <li
              key={index}
              className={`flex items-center gap-2 cursor-pointer  ${
                sectionProps && sectionProps[key] === true
                  ? "dark:text-filter"
                  : ""
              } ${sectionProps ? "dark:hover:text-filter duration-100" : ""}`}
              onMouseOver={() => {
                if (sectionProps && setSectionProps)
                  handleLegendMouseEnter(key, sectionProps, setSectionProps);
              }}
              onMouseOut={() => {
                if (sectionProps && setSectionProps)
                  handleLegendMouseLeave(sectionProps, setSectionProps);
              }}
            >
              <span
                className={`w-3 h-[0.2rem] ${
                  severityBGColors[key.toLowerCase()] ||
                  chartLegendColors[index % 20]
                }`}
              ></span>
              <p className="w-max">
                {severityLegends[key] || key.replaceAll("_", " ")}
              </p>
              {keys.length > 1 && sectionProps && setSectionProps && (
                <input
                  type="checkbox"
                  checked={!sectionProps[key]}
                  className="form-checkbox w-4 h-4 border-0 dark:focus:ring-0 dark:text-checkbox dark:focus:border-checkbox focus:ring dark:focus:ring-offset-0 dark:focus:ring-checkbox focus:ring-opacity-50"
                  onChange={() =>
                    handleSelectSection(key, sectionProps, setSectionProps)
                  }
                />
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default CustomLegend;
