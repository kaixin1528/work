import React from "react";
import { KeyStringVal } from "src/types/general";

const Damage = ({ simulationAnnotation }: { simulationAnnotation: any }) => {
  return (
    <section className="flex flex-col flex-grow gap-1 mt-4 overflow-auto scrollbar">
      <table className="table-fixed dark:bg-card overflow-auto scrollbar">
        <thead>
          <tr className="text-sm text-left dark:text-checkbox">
            <th className="px-4 py-3 font-medium">Problem</th>
            <th className="px-4 py-3 break-words font-medium">Reason</th>
            <th className="px-4 py-3 break-words font-medium">Remedy</th>
          </tr>
        </thead>
        <tbody>
          {simulationAnnotation?.message.map((issue: KeyStringVal) => {
            return (
              <tr
                key={issue.problem}
                className="dark:bg-tooltip dark:even:bg-panel"
              >
                <td className="px-4 py-3">{issue.problem}</td>
                <td className="px-4 py-3">{issue.reason}</td>
                <td className="px-4 py-3">{issue.remedy}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

export default Damage;
