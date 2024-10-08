import React, { useState } from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import TextFilter from "src/components/Filter/General/TextFilter";
import {
  GetPolicyVersions,
  GetPolicyDriftCoverage,
} from "src/services/regulation-policy/policy";
import { KeyStringVal } from "src/types/general";
import { parseURL } from "src/utils/general";

const Coverage = ({
  selectedFramework,
}: {
  selectedFramework: KeyStringVal;
}) => {
  const parsed = parseURL();

  const [selectedPolicyVersion, setSelectedPolicyVersion] =
    useState<string>("");

  const { data: policyVersions } = GetPolicyVersions(
    "policies",
    String(parsed.policy_id)
  );

  const versions = policyVersions?.reduce(
    (pV: string[], cV: KeyStringVal) => [...pV, cV.version],
    []
  );
  const selectedVersionID =
    policyVersions?.find(
      (version: KeyStringVal) => version.version === selectedPolicyVersion
    )?.version_id || "";

  const { data: coverage } = GetPolicyDriftCoverage(
    selectedFramework.id,
    selectedVersionID
  );

  return (
    <>
      <article className="flex items-center gap-10 w-full">
        <TextFilter
          label="Version"
          list={versions}
          value={selectedPolicyVersion}
          setValue={setSelectedPolicyVersion}
        />
      </article>
      {coverage && (
        <article className="grid gap-3 mx-auto text-center text-xl">
          <h4 className="text-center text-lg">Coverage</h4>
          <CircularProgressbarWithChildren
            strokeWidth={10}
            value={Number(coverage?.coverage)}
            maxValue={100}
            styles={buildStyles({
              trailColor: "#FFF",
              pathColor: "#fcba03",
            })}
            className="w-32 h-32"
          >
            <span>{coverage?.coverage}%</span>
          </CircularProgressbarWithChildren>
        </article>
      )}
    </>
  );
};

export default Coverage;
