import React from "react";
import { chartLegendColors } from "src/constants/general";
import { convertToUTCString } from "src/utils/general";

const CustomBreakdownTooltip = ({ active, payload, details }: any) => {
  if (active && payload?.length && details) {
    const timestamp = payload[0].payload.timestamp;
    const filteredPayload = details.find(
      (d: { timestamp: number }) => d.timestamp === timestamp
    );
    const types = filteredPayload
      ? Object.keys(filteredPayload).filter((k) => k !== "timestamp")
      : [];
    return (
      <article className="grid content-start px-4 py-2 gap-3 text-xs dark:bg-expand">
        <h4>{convertToUTCString(timestamp)}</h4>
        <ul className="flex items-start gap-3 overflow-auto scrollbar">
          {types?.map((type: string, index: number) => {
            return (
              <li key={index} className="grid content-start gap-1">
                <header className="flex items-center gap-2 capitalize">
                  <span
                    className={`w-2 h-2 ${
                      chartLegendColors[type.toLowerCase()] ||
                      chartLegendColors[index % 20]
                    }`}
                  ></span>
                  <h4>{type.replaceAll("_", " ")}</h4>
                </header>
                <ul className="grid px-6 list-disc">
                  {Object.entries(filteredPayload[type])?.length > 0 ? (
                    Object.entries(filteredPayload[type]).map((keyVal) => {
                      return (
                        <li key={keyVal[0]}>
                          {keyVal[0].replaceAll("_", " ")}: {keyVal[1]}
                        </li>
                      );
                    })
                  ) : (
                    <li>None</li>
                  )}
                </ul>
              </li>
            );
          })}
        </ul>
      </article>
    );
  }

  return null;
};

export default CustomBreakdownTooltip;
