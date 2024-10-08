import React, { useState } from "react";
import MultiLineChart from "../../../../components/Chart/MultiLineChart";
import { GetDependencyCountByActiveBranches } from "src/services/summaries/dependency-supply-chain";
import { useSummaryStore } from "src/stores/summaries";

const DependenciesByActiveBranch = ({
  selectedOrg,
  selectedRepo,
}: {
  selectedOrg: string;
  selectedRepo: string;
}) => {
  const { period } = useSummaryStore();

  const [sectionProps, setSectionProps] = useState({});

  const { data: getDependencyCountsByActiveBranches } =
    GetDependencyCountByActiveBranches(
      period,
      "GITHUB",
      selectedOrg,
      selectedRepo
    );

  return (
    <section className="grid gap-3 w-full h-full">
      <h4 className="w-max">
        Dependency count by 10 most active branches in {selectedRepo}
      </h4>
      {getDependencyCountsByActiveBranches ? (
        getDependencyCountsByActiveBranches.data.length > 0 ? (
          <MultiLineChart
            data={getDependencyCountsByActiveBranches?.data}
            xKey="timestamp"
            yLabel="Count"
            sectionProps={sectionProps}
            setSectionProps={setSectionProps}
          />
        ) : (
          <p>No data available</p>
        )
      ) : null}
    </section>
  );
};

export default DependenciesByActiveBranch;
