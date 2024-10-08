/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import StackedBarChart from "src/components/Chart/StackedBarChart";
import NumericFilter from "src/components/Filter/General/NumericFilter";
import TextFilter from "src/components/Filter/General/TextFilter";
import { GetMaxReleases } from "src/services/summaries/application-footprint";
import { useSummaryStore } from "src/stores/summaries";
import { sortNumericData } from "src/utils/general";

const ImagesPushed = ({ defaultTopN }: { defaultTopN: number }) => {
  const { period, selectedReportAccount } = useSummaryStore();

  const [selectedCluster, setSelectedCluster] = useState<string>("");
  const [selectedNamespace, setSelectedNamespace] = useState<string>("");
  const [topN, setTopN] = useState<number>(defaultTopN);
  const [sectionProps, setSectionProps] = useState({});

  const { data: maxReleases } = GetMaxReleases(
    period,
    selectedReportAccount?.integration_type || "",
    selectedReportAccount?.customer_cloud_id || "",
    topN
  );

  const clusters = maxReleases ? Object.keys(maxReleases) : [];
  const namespaces =
    maxReleases && maxReleases[selectedCluster]
      ? Object.keys(maxReleases[selectedCluster])
      : [];
  const filteredReleases =
    maxReleases &&
    Object.keys(maxReleases)?.length > 0 &&
    maxReleases[selectedCluster] &&
    maxReleases[selectedCluster][selectedNamespace];

  useEffect(() => {
    if (maxReleases && Object.keys(maxReleases)?.length > 0)
      if (selectedCluster === "")
        setSelectedCluster(Object.keys(maxReleases)[0]);
      else if (maxReleases[selectedCluster])
        setSelectedNamespace(Object.keys(maxReleases[selectedCluster])[0]);
  }, [maxReleases, selectedCluster]);

  useEffect(() => {
    if (selectedCluster !== "") {
      setSelectedCluster("");
      setSelectedNamespace("");
      setTopN(defaultTopN);
    }
  }, [period, selectedReportAccount]);

  return (
    <section className="grid content-start gap-5 p-6 w-full h-full dark:bg-card">
      <h4>Images Pushed</h4>
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
        <NumericFilter
          label="Images"
          value={topN}
          setValue={setTopN}
          max={filteredReleases?.num_images}
        />
      </article>
      <StackedBarChart
        data={sortNumericData(filteredReleases?.releases, "timestamp", "asc")}
        xKey="image_group"
        xLabel="Image Group"
        yLabel="Count"
        hideLegend
        sectionProps={sectionProps}
        setSectionProps={setSectionProps}
      />
    </section>
  );
};

export default ImagesPushed;
