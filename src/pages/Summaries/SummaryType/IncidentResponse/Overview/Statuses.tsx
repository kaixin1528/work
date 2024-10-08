import React from "react";
import { stackedHeights, statusColors } from "src/constants/summaries";
import { GetIRSummary } from "src/services/summaries/incident-response";
import { closestValue } from "src/utils/graph";

const Statuses = () => {
  const { data: irSummary } = GetIRSummary();
  const total =
    irSummary &&
    Object.values(irSummary.status).reduce((pV: number, cV: any) => pV + cV, 0);

  return (
    <>
      {irSummary && (
        <section className="flex items-center gap-5 py-4 px-8 mx-auto w-full h-full text-xs">
          <ul className="grid h-40">
            {Object.entries(irSummary.status).map((keyVal: any) => {
              const pct = closestValue(
                keyVal[1] / total,
                Object.keys(stackedHeights)
              );
              const status = keyVal[0].toLowerCase();
              if (pct === "0") return null;
              return (
                <li
                  key={keyVal[0]}
                  className={`relative group w-5 ${stackedHeights[pct]} ${statusColors[status]} cursor-pointer`}
                >
                  <article className="hidden group-hover:flex items-center absolute left-5 top-1/2 gap-2 px-2 py-1 w-max dark:bg-tooltip rounded-md">
                    <span className={`w-3 h-3 ${statusColors[status]}`}></span>
                    {keyVal[1]} {keyVal[0]}
                  </article>
                </li>
              );
            })}
          </ul>
          <ul className="grid self-center gap-2">
            {Object.keys(irSummary.status).map((status) => (
              <li key={status} className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 ${statusColors[status.toLowerCase()]}`}
                ></span>
                <h4>
                  {status} ({irSummary.status[status]})
                </h4>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
};

export default Statuses;
