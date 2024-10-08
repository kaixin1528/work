import React, { useState } from "react";
import StackedBarChart from "src/components/Chart/StackedBarChart";

const SeverityCountsByYear = ({ cpeAnalytics }: { cpeAnalytics: any }) => {
  const [sectionProps, setSectionProps] = useState({});

  return (
    <>
      {cpeAnalytics ? (
        cpeAnalytics.data.length > 0 ? (
          <section className="grid grid-cols-1 p-4 w-full h-[15rem] dark:bg-panel">
            <StackedBarChart
              data={cpeAnalytics.data}
              title="Severity Counts By Year"
              xKey="year"
              yLabel="Count"
              hideLegend
              hideXLabel
              hasSeverity
              sectionProps={sectionProps}
              setSectionProps={setSectionProps}
            />
          </section>
        ) : (
          <p className="text-sm">No data available</p>
        )
      ) : null}
    </>
  );
};

export default SeverityCountsByYear;
