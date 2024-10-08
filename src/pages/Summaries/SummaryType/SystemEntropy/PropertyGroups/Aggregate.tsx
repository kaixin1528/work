import React from "react";
import { accordionColors } from "src/constants/general";
import { periodMapping, severityTooltipColors } from "src/constants/summaries";
import { GetPropertyGroupChanges } from "src/services/summaries/system-entropy";
import { useSummaryStore } from "src/stores/summaries";
import { KeyStringVal } from "src/types/general";

const Aggregate = () => {
  const { period } = useSummaryStore();

  const { data: propertyGroups } = GetPropertyGroupChanges(period);

  return (
    <>
      {propertyGroups ? (
        <section className="grid content-start gap-10 px-10 py-4 w-full h-full text-center dark:bg-card">
          <h4 className="text-base">
            {periodMapping[period]} aggregate changes by property groups
          </h4>
          {propertyGroups.length > 0 ? (
            <section className="grid gap-2">
              <ul className="flex items-center gap-1 justify-self-center w-full h-full text-xs">
                {propertyGroups.map((bucket: KeyStringVal, index: number) => {
                  const levelColor =
                    accordionColors[bucket.level.toLowerCase()];
                  return (
                    <li
                      key={index}
                      className="relative group grid w-full h-max cursor-not-allowed black-shadow/70"
                    >
                      <article className="grid w-full h-max black-shadow/70">
                        <span className={`${levelColor[0]}`}></span>
                        <span className={`${levelColor[1]}`}></span>
                        <span className={`${levelColor[0]}`}></span>
                      </article>
                      <article
                        className={`absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:flex py-2 px-6 w-max uppercase text-left ${
                          severityTooltipColors[bucket.level.toLowerCase()]
                        } z-10`}
                      >
                        <h4>{bucket.level}</h4>
                      </article>
                    </li>
                  );
                })}
              </ul>
              <ul className="flex items-center gap-1 justify-self-center w-full h-full">
                {propertyGroups.map((bucket: KeyStringVal, index: number) => {
                  return (
                    <li
                      key={index}
                      className="grid gap-1 w-full text-xs capitalize"
                    >
                      {bucket.category.replaceAll("_", " ")}
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : (
            <p>No data available</p>
          )}
        </section>
      ) : null}
    </>
  );
};

export default Aggregate;
