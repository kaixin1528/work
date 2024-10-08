/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { GetServiceActivity } from "src/services/summaries/application-footprint";
import { useSummaryStore } from "src/stores/summaries";
import MultiLineChart from "src/components/Chart/MultiLineChart";
import TextFilter from "src/components/Filter/General/TextFilter";
import { sortNumericData } from "src/utils/general";

const ServiceActivity = () => {
  const { period, selectedReportAccount } = useSummaryStore();

  const [selectedCluster, setSelectedCluster] = useState<string>("");
  const [selectedNamespace, setSelectedNamespace] = useState<string>("");
  const [sectionProps, setSectionProps] = useState({});

  const { data: serviceActivity } = GetServiceActivity(
    period,
    selectedReportAccount?.integration_type || "",
    selectedReportAccount?.customer_cloud_id || ""
  );

  const clusters = serviceActivity ? Object.keys(serviceActivity) : [];
  const namespaces =
    serviceActivity && serviceActivity[selectedCluster]
      ? Object.keys(serviceActivity[selectedCluster])
      : [];
  const filteredServiceActivity =
    serviceActivity &&
    Object.keys(serviceActivity)?.length > 0 &&
    serviceActivity[selectedCluster] &&
    sortNumericData(
      serviceActivity[selectedCluster][selectedNamespace],
      "timestamp",
      "asc"
    );

  useEffect(() => {
    if (serviceActivity && Object.keys(serviceActivity)?.length > 0)
      if (selectedCluster === "")
        setSelectedCluster(Object.keys(serviceActivity)[0]);
      else if (serviceActivity[selectedCluster])
        setSelectedNamespace(Object.keys(serviceActivity[selectedCluster])[0]);
  }, [serviceActivity, selectedCluster]);

  useEffect(() => {
    if (selectedCluster !== "") {
      setSelectedCluster("");
      setSelectedNamespace("");
    }
  }, [period, selectedReportAccount]);

  return (
    <section className="grid content-start gap-5 p-6 dark:bg-card">
      <h4>Service Activity</h4>
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
      <MultiLineChart
        data={filteredServiceActivity}
        xKey="timestamp"
        yLabel="Count"
        hideLegend
        sectionProps={sectionProps}
        setSectionProps={setSectionProps}
      />
    </section>
  );
};

export default ServiceActivity;
