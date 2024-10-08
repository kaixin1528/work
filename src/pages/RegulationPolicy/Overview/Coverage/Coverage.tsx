/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import Frameworks from "./Frameworks";
import PolicyGroups from "./PolicyGroups/PolicyGroups";
import { GetCoverage } from "src/services/regulation-policy/overview";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";

const Coverage = () => {
  const [selectedFrameworkIDs, setSelectedFrameworkIDs] = useState<string[]>(
    []
  );
  const [selectedPolicyIDs, setSelectedPolicyIDs] = useState<string[]>([]);

  const { data: getCoverage, status: coverageStatus } = GetCoverage(
    selectedFrameworkIDs,
    selectedPolicyIDs
  );

  return (
    <section className="flex flex-col flex-grow gap-7">
      <h4 className="text-center text-xl">Coverage</h4>
      {coverageStatus === "loading" ? (
        <img
          src="/general/coffee-loading-animated.svg"
          alt="loader"
          className="mx-auto w-72"
        />
      ) : (
        coverageStatus === "success" && (
          <article className="grid gap-3 mx-auto text-center text-xl">
            <CircularProgressbarWithChildren
              strokeWidth={10}
              value={getCoverage}
              maxValue={100}
              styles={buildStyles({
                trailColor: "#FFF",
                pathColor: "#fcba03",
              })}
              className="w-40 h-40"
            >
              <span>{getCoverage}%</span>
            </CircularProgressbarWithChildren>
          </article>
        )
      )}
      <section className="grid md:grid-cols-2 gap-10">
        <Frameworks
          selectedFrameworkIDs={selectedFrameworkIDs}
          setSelectedFrameworkIDs={setSelectedFrameworkIDs}
        />
        <PolicyGroups
          selectedPolicyIDs={selectedPolicyIDs}
          setSelectedPolicyIDs={setSelectedPolicyIDs}
        />
      </section>
    </section>
  );
};

export default Coverage;
