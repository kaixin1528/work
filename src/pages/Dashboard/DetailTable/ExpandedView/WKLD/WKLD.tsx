/* eslint-disable no-restricted-globals */
import { attributeColors } from "../../../../../constants/general";
import MultiLineChart from "../../../../../components/Chart/MultiLineChart";
import ExpandedViewLayout from "../../../../../layouts/ExpandedViewLayout";
import { parseURL } from "../../../../../utils/general";
import TableLayout from "../../../../../layouts/TableLayout";
import { KeyStringVal } from "src/types/general";
import { useGeneralStore } from "src/stores/general";
import { GetPodExpanded } from "src/services/dashboard/infra";
import { useState } from "react";

const WKLD = ({ selectedNodeID }: { selectedNodeID: string }) => {
  const parsed = parseURL();

  const { env } = useGeneralStore();

  const [sectionProps, setSectionProps] = useState({});

  const { data: podExpanded, status: podExpandedStatus } = GetPodExpanded(
    env,
    parsed.integration,
    selectedNodeID.slice(0, selectedNodeID.indexOf(":"))
  );

  return (
    <ExpandedViewLayout selectedNodeID={selectedNodeID}>
      {podExpanded && Object.keys(podExpanded).length > 0 && (
        <article className="flex items-center gap-5">
          <h4>{podExpanded.pod_name}</h4>
          {podExpanded["Run As Root"] && (
            <span className={`${attributeColors["active"]}`}>Run As Root</span>
          )}
          {podExpanded["Run As Non Root"] && (
            <span className={`${attributeColors["disabled"]}`}>
              Run As Non Root
            </span>
          )}
        </article>
      )}

      {podExpanded && Object.keys(podExpanded).length > 0 && (
        <section className="flex items-center gap-10">
          {(Object.entries(podExpanded["Node Selector"])?.length > 0 ||
            podExpanded["IP List"]?.length > 0) && (
            <TableLayout>
              <thead>
                <tr className="flex px-4 gap-10 py-3 text-sm dark:text-checkbox">
                  <th className="font-medium w-2/5 text-right">Attribute</th>
                  <th className="font-medium overflow-auto scrollbar break-words">
                    Detail
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(podExpanded["Node Selector"]).map((keyVal) => {
                  return (
                    <tr
                      key={keyVal[0]}
                      className="flex items-start gap-10 py-3 px-4 text-xs dark:bg-tooltip dark:even:bg-panel"
                    >
                      <td className="w-2/5 dark:text-white text-right font-medium">
                        {keyVal[0]}
                      </td>
                      <td
                        className={`${
                          attributeColors[String(keyVal[1]).toLowerCase()]
                        } overflow-auto scrollbar break-all`}
                      >
                        {String(keyVal[1])}
                      </td>
                    </tr>
                  );
                })}
                <tr className="flex items-start gap-10 py-3 px-4 text-xs dark:bg-tooltip dark:even:bg-panel">
                  <td className="w-2/5 dark:text-white text-right font-medium">
                    IP Address
                  </td>
                  <td className="w-max">
                    <article className="grid gap-1">
                      {podExpanded["IP List"].map((item: KeyStringVal) => {
                        return <article key={item.ip}>{item.ip}</article>;
                      })}
                    </article>
                  </td>
                </tr>
              </tbody>
            </TableLayout>
          )}

          {podExpanded?.counts.length > 0 && (
            <MultiLineChart
              data={podExpanded.counts}
              xKey="timestamp"
              yLabel="Count"
              sectionProps={sectionProps}
              setSectionProps={setSectionProps}
            />
          )}
        </section>
      )}

      {podExpandedStatus === "success" &&
        (!podExpanded ||
          (podExpanded && Object.keys(podExpanded).length === 0)) && (
          <p className="dark:text-white mx-auto">No data available</p>
        )}
    </ExpandedViewLayout>
  );
};

export default WKLD;
