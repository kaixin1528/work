import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { attributeColors } from "src/constants/general";
import { diffColors, diffBorderColors } from "src/constants/graph";
import { useGraphStore } from "src/stores/graph";

const DiffEdge = ({ diffElementInfo }: { diffElementInfo: any }) => {
  const { selectedEdge } = useGraphStore();

  const diffEdge = selectedEdge?.data?.diffEdge;

  return (
    <section className="flex flex-col flex-grow gap-5">
      <header className="flex items-center gap-2">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.3"
            d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z"
            fill={diffColors[diffEdge.action]}
          />
          <path
            d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
            fill={diffColors[diffEdge.action]}
          />
        </svg>

        <h5 className="capitalize text-xs font-medium">
          Edge {diffEdge.action}
        </h5>
      </header>
      <section
        className={`grid gap-2 ml-1 dark:bg-tooltip ${
          diffBorderColors[diffEdge?.action]
        }`}
      >
        <header className="flex items-center justify-between px-4 py-2 text-sm dark:text-checkbox dark:bg-card">
          Source Node ID{" "}
          <FontAwesomeIcon icon={faArrowRightLong} className="mx-auto" /> Target
          Node ID
        </header>
        <article className="grid grid-cols-3 items-center px-4 py-2">
          <p className="dark:text-white font-medium text-left break-all">
            {selectedEdge?.data?.source}
          </p>
          <ul className="grid gap-3">
            {diffElementInfo &&
              diffElementInfo[
                ["created", "modified"].includes(diffEdge.action)
                  ? "new_rel"
                  : "old_rel"
              ]["rel_src"]?.map((_: { rel: string }, index: number) => {
                const oldRel =
                  ["removed", "modified"].includes(diffEdge.action) &&
                  diffElementInfo.old_rel?.rel_src[index].rel;
                const newRel =
                  ["created", "modified"].includes(diffEdge.action) &&
                  diffElementInfo.new_rel?.rel_src[index].rel;

                return (
                  <li key={index} className="grid justify-items-center gap-1">
                    {oldRel && (
                      <p
                        className={`dark:text-white break-all dark:text-white/60 ${attributeColors["removed"]} overflow-auto scrollbar`}
                      >
                        {oldRel}
                      </p>
                    )}
                    {newRel && (
                      <p
                        className={`dark:text-white break-all ${attributeColors["created"]} overflow-auto scrollbar `}
                      >
                        {newRel}
                      </p>
                    )}
                  </li>
                );
              })}
          </ul>
          <p className="text-right dark:text-white break-all font-medium">
            {selectedEdge?.data?.target}
          </p>
        </article>
      </section>
    </section>
  );
};

export default DiffEdge;
