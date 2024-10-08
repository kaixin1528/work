/* eslint-disable no-restricted-globals */
import { useEffect, useState } from "react";
import TopRepos from "./TopRepos";
import SummaryLayout from "../../../../layouts/SummaryLayout";
import Branches from "./Branches";
import Commits from "./Commits";
import Tags from "./Tags";
import Releases from "./Releases";
import Runs from "./Runs";
import Commiters from "./Commiters";
import { GetDevWorkflowRepos } from "src/services/summaries/dev-workflow";
import { useSummaryStore } from "src/stores/summaries";
import { useGeneralStore } from "src/stores/general";

const DevWorkflow = () => {
  const { env } = useGeneralStore();
  const { period } = useSummaryStore();

  const [selectedOrgName, setSelectedOrgName] = useState<string>("");
  const [selectedRepo, setSelectedRepo] = useState<string>("");

  const { data: repos } = GetDevWorkflowRepos(env, period);

  const startMarker = repos?.start_marker;
  const endMarker = repos?.end_marker;

  useEffect(() => {
    if (repos?.length > 0) setSelectedRepo(repos[0].repo_ID);
  }, [repos]);

  return (
    <SummaryLayout name="Development Workflow">
      <TopRepos
        setSelectedOrgName={setSelectedOrgName}
        selectedRepo={selectedRepo}
        setSelectedRepo={setSelectedRepo}
      />
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full h-full text-sm">
        <Branches
          selectedOrgName={selectedOrgName}
          selectedRepo={selectedRepo}
          startMarker={startMarker}
          endMarker={endMarker}
        />
        <Tags
          selectedOrgName={selectedOrgName}
          selectedRepo={selectedRepo}
          startMarker={startMarker}
          endMarker={endMarker}
        />
        <Commiters
          selectedOrgName={selectedOrgName}
          selectedRepo={selectedRepo}
          startMarker={startMarker}
          endMarker={endMarker}
        />
        <Commits
          selectedOrgName={selectedOrgName}
          selectedRepo={selectedRepo}
          startMarker={startMarker}
          endMarker={endMarker}
        />
        <Releases
          selectedOrgName={selectedOrgName}
          selectedRepo={selectedRepo}
          startMarker={startMarker}
          endMarker={endMarker}
        />
        <Runs
          selectedOrgName={selectedOrgName}
          selectedRepo={selectedRepo}
          startMarker={startMarker}
          endMarker={endMarker}
        />
      </section>
    </SummaryLayout>
  );
};

export default DevWorkflow;
