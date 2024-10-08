/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import StackedBarChart from "src/components/Chart/StackedBarChart";
import TextFilter from "src/components/Filter/General/TextFilter";
import { GetLiveServices } from "src/services/summaries/application-footprint";
import { useSummaryStore } from "src/stores/summaries";
import { sortNumericData } from "src/utils/general";

const LiveResources = () => {
  const { period, selectedReportAccount } = useSummaryStore();

  const [selectedCluster, setSelectedCluster] = useState<string>("");
  const [selectedNamespace, setSelectedNamespace] = useState<string>("");
  const [sectionProps, setSectionProps] = useState({});

  const { data: liveServices } = GetLiveServices(
    period,
    selectedReportAccount?.integration_type || "",
    selectedReportAccount?.customer_cloud_id || ""
  );

  const clusters = liveServices ? Object.keys(liveServices) : [];
  const namespaces =
    liveServices && liveServices[selectedCluster]
      ? Object.keys(liveServices[selectedCluster])
      : [];
  const filteredLiveServices =
    liveServices &&
    Object.keys(liveServices)?.length > 0 &&
    liveServices[selectedCluster] &&
    sortNumericData(
      liveServices[selectedCluster][selectedNamespace],
      "timestamp",
      "asc"
    );

  useEffect(() => {
    if (liveServices && Object.keys(liveServices)?.length > 0)
      if (selectedCluster === "")
        setSelectedCluster(Object.keys(liveServices)[0]);
      else if (liveServices[selectedCluster])
        setSelectedNamespace(Object.keys(liveServices[selectedCluster])[0]);
  }, [liveServices, selectedCluster]);

  useEffect(() => {
    if (selectedCluster !== "") {
      setSelectedCluster("");
      setSelectedNamespace("");
    }
  }, [period, selectedReportAccount]);

  return (
    <section className="grid content-start gap-5 p-6 w-full h-full dark:bg-card">
      <h4>Live Resources</h4>
      <article className="flex items-center gap-10">
        <TextFilter
          label="Cluster"
          list={clusters}
          value={selectedCluster}
          setValue={setSelectedCluster}
        />
        <TextFilter
          label="Namespace"
          list={namespaces}
          value={selectedNamespace}
          setValue={setSelectedNamespace}
        />
      </article>
      <StackedBarChart
        data={filteredLiveServices}
        xKey="Service"
        xLabel="Service"
        yLabel="# of Services"
        hideLegend
        sectionProps={sectionProps}
        setSectionProps={setSectionProps}
      />
    </section>
  );
};

export default LiveResources;
