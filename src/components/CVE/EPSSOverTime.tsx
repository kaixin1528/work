import React, { useState } from "react";
import { GetEPSSOverTime } from "src/services/general/cve";
import { useGeneralStore } from "src/stores/general";
import MultiLineChart from "../Chart/MultiLineChart";

const EPSSOverTime = ({ selectedCVE }: { selectedCVE: string }) => {
  const { env } = useGeneralStore();

  const [sectionProps, setSectionProps] = useState({});

  const { data: epss } = GetEPSSOverTime(env, selectedCVE);

  return (
    <>
      {epss && (
        <section className="grid md:grid-cols-2 gap-10 w-full h-full">
          <MultiLineChart
            title="Percentile over time"
            data={epss.percentile}
            xKey="publish_time"
            yLabel="Percentile"
            sectionProps={sectionProps}
            setSectionProps={setSectionProps}
          />
          <MultiLineChart
            title="EPSS over time"
            data={epss.epss}
            xKey="publish_time"
            yLabel="EPSS Score"
            sectionProps={sectionProps}
            setSectionProps={setSectionProps}
          />
        </section>
      )}
    </>
  );
};

export default EPSSOverTime;
