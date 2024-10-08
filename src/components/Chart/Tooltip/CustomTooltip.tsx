import React from "react";
import {
  chartLegendColors,
  severityBGColors,
  severityLegends,
} from "src/constants/general";
import { convertToUTCString, isEpoch } from "src/utils/general";

const CustomTooltip = ({ active, payload, keys, xKey, hasSeverity }: any) => {
  if (active && payload && payload.length) {
    const isDate = isEpoch(payload[0].payload[xKey]);

    const filteredKeys = keys ? keys : payload;

    return (
      <article className="grid px-4 py-2 gap-3 text-xs dark:bg-expand">
        <h4>
          {isDate
            ? convertToUTCString(payload[0].payload[xKey])
            : payload[0].payload[xKey]}
        </h4>
        <ul
          className={`${
            hasSeverity ? "flex flex-wrap flex-row-reverse" : "grid grid-cols-3"
          } gap-x-5 gap-y-2 w-max`}
        >
          {filteredKeys?.map((key: any, index: number) => {
            const value = keys ? key : key.dataKey;
            return (
              <li key={index} className="flex items-center gap-2 capitalize">
                <span
                  className={`w-2 h-2 ${
                    severityBGColors[value?.toLowerCase()] ||
                    chartLegendColors[index % 20]
                  }`}
                ></span>
                <p>{`${severityLegends[value] || value.replace("_", " ")}: ${
                  payload[0].payload[value]
                }`}</p>
              </li>
            );
          })}
        </ul>
      </article>
    );
  }

  return null;
};

export default CustomTooltip;
