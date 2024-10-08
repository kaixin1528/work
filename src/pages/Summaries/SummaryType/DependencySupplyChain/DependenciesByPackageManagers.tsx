import { faFlag, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { ReferenceLine, Tooltip } from "recharts";
import StackedAreaChart from "../../../../components/Chart/StackedAreaChart";
import { GetDependencyCountByPackageManagers } from "src/services/summaries/dependency-supply-chain";
import { sortNumericData } from "src/utils/general";
import { useSummaryStore } from "src/stores/summaries";
import CustomTooltip from "src/components/Chart/Tooltip/CustomTooltip";

const CustomizedLabel = ({ props, marker }: any) => {
  const { x, y } = props.viewBox;
  return (
    <g>
      <foreignObject
        x={x - 35}
        y={y - 10}
        width={70}
        height={100}
        style={{ border: "none" }}
      >
        <article className="group text-center">
          <FontAwesomeIcon
            icon={marker.type === "release" ? faFlag : faTag}
            className="w-3 h-3 mt-2 dark:text-white"
          />
          <p className="hidden group-hover:block p-2 text-xs w-full break-all dark:bg-tooltip rounded-sm">
            {marker.name}
          </p>
        </article>
      </foreignObject>
    </g>
  );
};

const DependenciesByPackageManagers = ({
  selectedOrg,
  selectedRepo,
  selectedBranch,
}: {
  selectedOrg: string;
  selectedRepo: string;
  selectedBranch: string;
}) => {
  const { period } = useSummaryStore();

  const [sectionProps, setSectionProps] = useState({});

  const { data: getDependencyCountsByPackageManagers } =
    GetDependencyCountByPackageManagers(
      period,
      "GITHUB",
      selectedOrg,
      selectedRepo,
      selectedBranch
    );

  const sortedData = sortNumericData(
    getDependencyCountsByPackageManagers?.data,
    "timestamp",
    "asc"
  );

  return (
    <section className="grid w-full h-[15rem]">
      <h4 className="w-max">
        Dependency count by package managers in {selectedBranch} branch
      </h4>
      <StackedAreaChart
        data={sortedData}
        xKey="timestamp"
        yLabel="Count"
        sectionProps={sectionProps}
        setSectionProps={setSectionProps}
      >
        <Tooltip content={<CustomTooltip />} />
        {getDependencyCountsByPackageManagers?.releases?.map((marker: any) => {
          return (
            <ReferenceLine
              key={marker.timestamp}
              x={marker.timestamp}
              stroke="white"
              label={(props) => (
                <CustomizedLabel props={props} marker={marker} />
              )}
            />
          );
        })}
      </StackedAreaChart>
    </section>
  );
};

export default DependenciesByPackageManagers;
