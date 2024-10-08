/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import StackedAreaChart from "src/components/Chart/StackedAreaChart";
import KeyValuePair from "src/components/General/KeyValuePair";
import { GetServiceLifecycle } from "src/services/summaries/application-footprint";
import { sortNumericData } from "src/utils/general";
import { useSummaryStore } from "src/stores/summaries";
import TextFilter from "src/components/Filter/General/TextFilter";

const ServiceLifecycle = () => {
  const { period, selectedReportAccount } = useSummaryStore();

  const [selectedCluster, setSelectedCluster] = useState<string>("");
  const [selectedNamespace, setSelectedNamespace] = useState<string>("");
  const [sectionProps, setSectionProps] = useState({});

  const { data: serviceLifecycle } = GetServiceLifecycle(
    period,
    selectedReportAccount?.integration_type || "",
    selectedReportAccount?.customer_cloud_id || ""
  );

  const clusters = serviceLifecycle ? Object.keys(serviceLifecycle) : [];
  const namespaces =
    serviceLifecycle && serviceLifecycle[selectedCluster]
      ? Object.keys(serviceLifecycle[selectedCluster])
      : [];
  const filteredLivecycle =
    serviceLifecycle &&
    Object.keys(serviceLifecycle)?.length > 0 &&
    serviceLifecycle[selectedCluster] &&
    sortNumericData(
      serviceLifecycle[selectedCluster][selectedNamespace]?.data,
      "timestamp",
      "asc"
    );

  useEffect(() => {
    if (serviceLifecycle && Object.keys(serviceLifecycle)?.length > 0)
      if (selectedCluster === "")
        setSelectedCluster(Object.keys(serviceLifecycle)[0]);
      else if (serviceLifecycle[selectedCluster])
        setSelectedNamespace(Object.keys(serviceLifecycle[selectedCluster])[0]);
  }, [serviceLifecycle, selectedCluster]);

  useEffect(() => {
    if (selectedCluster !== "") {
      setSelectedCluster("");
      setSelectedNamespace("");
    }
  }, [period, selectedReportAccount]);

  return (
    <section className="grid content-start gap-5 p-6 h-full dark:bg-card">
      <h4>Service Lifecycle</h4>
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
      {serviceLifecycle &&
        selectedNamespace !== "" &&
        serviceLifecycle[selectedNamespace] && (
          <header className="flex flex-wrap items-center gap-10 text-xs">
            <KeyValuePair
              label="Max Instances"
              value={serviceLifecycle[selectedNamespace]?.max_instances}
            />{" "}
            <KeyValuePair
              label="Min Instances"
              value={serviceLifecycle[selectedNamespace]?.min_instances}
            />
          </header>
        )}
      <StackedAreaChart
        data={filteredLivecycle}
        xKey="timestamp"
        yLabel="Count"
        hideLegend
        sectionProps={sectionProps}
        setSectionProps={setSectionProps}
      />
    </section>
  );
};

export default ServiceLifecycle;
