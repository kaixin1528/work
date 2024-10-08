import React, { useState } from "react";
import StackedAreaChart from "src/components/Chart/StackedAreaChart";
import { GetPageCoverage } from "src/services/business-continuity/sop";

const PageCoverage = ({
  sopID,
  versionID,
}: {
  sopID: string;
  versionID: string;
}) => {
  const [sectionProps, setSectionProps] = useState({});

  const { data: pageCoverage } = GetPageCoverage(sopID, versionID);

  return (
    <StackedAreaChart
      data={pageCoverage}
      xKey="page_num"
      xLabel="Page Number"
      yLabel="Coverage (%)"
      sectionProps={sectionProps}
      setSectionProps={setSectionProps}
      hideLegend
    />
  );
};

export default PageCoverage;
