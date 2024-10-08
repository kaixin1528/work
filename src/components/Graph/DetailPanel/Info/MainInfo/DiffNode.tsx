import React from "react";
import DiffAttribute from "src/components/Attribute/DiffAttribute";
import { diffColors, diffBorderColors } from "src/constants/graph";
import TableLayout from "src/layouts/TableLayout";
import { useGraphStore } from "src/stores/graph";

const DiffNode = ({ diffElementInfo }: { diffElementInfo: any }) => {
  const { selectedNode } = useGraphStore();

  const diffNode = selectedNode?.data?.diffNode;

  return (
    <section className="flex flex-col flex-grow gap-5 h-full overflow-auto scrollbar">
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
            fill={diffColors[diffNode.action]}
          />
          <path
            d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
            fill={diffColors[diffNode.action]}
          />
        </svg>

        <h5 className="capitalize text-xs font-medium">
          Node {diffNode.action}
        </h5>
      </header>
      <TableLayout fullHeight>
        <thead>
          <tr className="text-sm text-left dark:text-checkbox">
            <th className="px-4 py-3 font-medium">Attribute</th>
            <th className="px-4 py-3 break-words font-medium">Detail</th>
          </tr>
        </thead>
        <tbody className={`${diffBorderColors[diffNode.action]} ml-1`}>
          {diffElementInfo &&
            Object.keys(
              diffElementInfo[
                ["created", "modified"].includes(diffNode.action)
                  ? "new_state"
                  : "old_state"
              ]
            ).map((attribute: string) => {
              const oldAttribute =
                ["removed", "modified"].includes(diffNode.action) &&
                diffElementInfo.old_state[attribute];
              const newAttribute =
                ["created", "modified"].includes(diffNode.action) &&
                diffElementInfo.new_state[attribute];
              if (oldAttribute === null || newAttribute === null) return null;
              return (
                <DiffAttribute
                  key={`${diffNode.action}-${
                    newAttribute?.display_name || oldAttribute?.display_name
                  }-${newAttribute?.data_type || oldAttribute?.data_type}`}
                  action={diffNode.action}
                  oldAttribute={oldAttribute}
                  newAttribute={newAttribute}
                />
              );
            })}
        </tbody>
      </TableLayout>
    </section>
  );
};

export default DiffNode;
