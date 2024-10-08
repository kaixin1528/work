import React, { useState } from "react";
import SummaryLayout from "src/layouts/SummaryLayout";
import CVEByYear from "./CVEByYear";
import Overview from "./Overview/Overview";
import SelectionOptions from "../../SelectionOptions";

const CommonVulnerabilities = () => {
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [selectedVersion, setSelectedVersion] = useState<string>("");

  return (
    <SummaryLayout name="Common Vulnerabilities" hidePeriod>
      <section className="grid content-start gap-5">
        <SelectionOptions
          short="vr"
          long="vulnerability-risks"
          selectedSource={selectedSource}
          setSelectedSource={setSelectedSource}
          selectedVersion={selectedVersion}
          setSelectedVersion={setSelectedVersion}
        />
        <Overview
          selectedSource={selectedSource}
          selectedVersion={selectedVersion}
        />
        <CVEByYear
          selectedSource={selectedSource}
          selectedVersion={selectedVersion}
        />
      </section>
    </SummaryLayout>
  );
};

export default CommonVulnerabilities;
