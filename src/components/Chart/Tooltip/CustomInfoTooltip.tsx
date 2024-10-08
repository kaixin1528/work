import React from "react";
import {
  chartLegendColors,
  severities,
  severityBGColors,
  severityLegends,
} from "src/constants/general";
import { convertToUTCString } from "src/utils/general";

const CustomInfoTooltip = ({ active, payload, details, hasSeverity }: any) => {
  if (active && payload?.length && details) {
    const timestamp = payload[0].payload.timestamp;
    const filteredPayload = details?.find(
      (d: { first_seen_end_range: number }) =>
        d.first_seen_end_range === timestamp
    );

    return (
      <article className="grid content-start px-4 py-2 gap-3 text-xs dark:bg-expand">
        {filteredPayload && (
          <header className="grid gap-3">
            {filteredPayload.image_grouping_id && (
              <h4 className="break-all">
                Service: {filteredPayload?.image_grouping_id}
              </h4>
            )}
            <h4>
              {convertToUTCString(filteredPayload.first_seen_start_range)} -{" "}
              {convertToUTCString(filteredPayload.first_seen_end_range)}
            </h4>
          </header>
        )}
        <ul
          className={`${
            hasSeverity ? "flex flex-wrap flex-row-reverse" : "grid grid-cols-3"
          }  gap-x-5 gap-y-2 w-max`}
        >
          {severities.map((key: string, index: number) => {
            return (
              <li key={index} className="flex items-center gap-2 capitalize">
                <span
                  className={`w-2 h-2 ${
                    severityBGColors[key.toLowerCase()] ||
                    chartLegendColors[index % 20]
                  }`}
                ></span>
                <p>{`${severityLegends[key] || key.replace("_", " ")}: ${
                  payload[0].payload[key]
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

export default CustomInfoTooltip;
