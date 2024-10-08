/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from "react";
import { heatmapMaxColors } from "src/constants/summaries";
import { utcFormat } from "d3-time-format";
import { convertToDate, sortNumericData } from "src/utils/general";
import {
  GetClusterNamespace,
  GetServiceScalingVolatility,
} from "src/services/summaries/application-footprint";
import { useSummaryStore } from "src/stores/summaries";
import TextFilter from "src/components/Filter/General/TextFilter";
import NumericFilter from "src/components/Filter/General/NumericFilter";
import { KeyNumVal } from "src/types/general";

const ServicesScalingVolatility = () => {
  const { period, selectedReportAccount } = useSummaryStore();

  const [selectedCluster, setSelectedCluster] = useState<string>("");
  const [selectedNamespace, setSelectedNamespace] = useState<string>("");
  const [topN, setTopN] = useState<number>(10);

  const { data: clusterNamespaces } = GetClusterNamespace(
    period,
    selectedReportAccount?.integration_type || "",
    selectedReportAccount?.customer_cloud_id || ""
  );
  const { data: serviceScalingVolatility } = GetServiceScalingVolatility(
    period,
    selectedReportAccount?.integration_type || "",
    selectedReportAccount?.customer_cloud_id || "",
    selectedCluster,
    selectedNamespace,
    topN
  );

  const clusters = clusterNamespaces ? Object.keys(clusterNamespaces) : [];
  const namespaces =
    clusterNamespaces && selectedCluster !== ""
      ? clusterNamespaces[selectedCluster]
      : [];
  const filteredVolatilities =
    serviceScalingVolatility &&
    Object.keys(serviceScalingVolatility)?.length > 0 &&
    serviceScalingVolatility[selectedCluster] &&
    serviceScalingVolatility[selectedCluster][selectedNamespace];

  useEffect(() => {
    if (clusters?.length > 0)
      if (selectedCluster === "") setSelectedCluster(clusters[0]);
      else if (namespaces?.length > 0 && selectedNamespace === "")
        setSelectedNamespace(namespaces[0]);
  }, [clusters, namespaces, selectedCluster, selectedNamespace]);

  useEffect(() => {
    if (selectedCluster !== "") {
      setSelectedCluster("");
      setSelectedNamespace("");
      setTopN(10);
    }
  }, [period, selectedReportAccount]);

  const HeatMap = ({ keyName }: { keyName: string }) => {
    const initialValue = 0;
    const overallCount =
      filteredVolatilities && Object.keys(filteredVolatilities)?.length > 0
        ? Object.values(filteredVolatilities)?.reduce(
            (allCount: number, serviceData: any) => {
              const serviceCount = serviceData.reduce(
                (dailyCount: number, service: any) => {
                  const count = service[keyName];
                  return count > dailyCount ? count : dailyCount;
                },
                initialValue
              ) as number;
              return (
                serviceCount > allCount ? serviceCount : allCount
              ) as number;
            },
            initialValue
          )
        : initialValue;

    return (
      <section className="grid content-start gap-3">
        <h4 className="capitalize text-center">{keyName} Counts</h4>
        <section className="grid gap-2 w-full text-xs">
          {Object.values(filteredVolatilities).map(
            (service: any, valueIndex: number) => {
              const sortedService = sortNumericData(
                service,
                "timestamp",
                "asc"
              );
              return (
                <Fragment key={valueIndex}>
                  <article className="flex items-center gap-5 ">
                    <h4 className="w-44 break-all">
                      {Object.keys(filteredVolatilities)[valueIndex]}
                    </h4>
                    <ul className="flex items-center gap-1 w-full h-full">
                      {sortedService.map((bucket: any, index: number) => {
                        const pct = Math.floor(
                          Number((bucket[keyName] / overallCount).toFixed(1)) *
                            100
                        );
                        return (
                          <li
                            key={index}
                            className={`group relative grid py-4 w-full h-max text-center ${heatmapMaxColors[pct]} border border-no/10`}
                          >
                            {bucket[keyName]}
                          </li>
                        );
                      })}
                    </ul>
                  </article>
                  {valueIndex ===
                    Object.keys(filteredVolatilities).length - 1 && (
                    <article className="flex items-center gap-5 text-center">
                      <span className="w-44"></span>
                      <ul className="flex items-center gap-1 w-full h-full">
                        {sortedService.map(
                          (bucket: KeyNumVal, index: number) => {
                            return (
                              <li key={index} className="grid gap-1 w-full">
                                {[1, 2].includes(period) ? (
                                  <span>
                                    {utcFormat("%H:%M")(
                                      convertToDate(bucket.timestamp)
                                    )}
                                  </span>
                                ) : (
                                  <>
                                    <span>
                                      {utcFormat("%b")(
                                        convertToDate(bucket.timestamp)
                                      )}
                                    </span>
                                    <span>
                                      {utcFormat("%d")(
                                        convertToDate(bucket.timestamp)
                                      )}
                                    </span>
                                  </>
                                )}
                              </li>
                            );
                          }
                        )}
                      </ul>
                    </article>
                  )}
                </Fragment>
              );
            }
          )}
        </section>
      </section>
    );
  };

  return (
    <section className="grid content-start w-full h-full gap-5 p-6 dark:bg-card">
      <h4>Services Scaling Volatility</h4>

      <section className="grid content-start gap-5">
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
            label="Services"
            value={topN}
            setValue={setTopN}
            max={31}
          />
        </article>
        {serviceScalingVolatility ? (
          filteredVolatilities &&
          Object.keys(filteredVolatilities)?.length > 0 ? (
            <section className="grid gap-10">
              <HeatMap keyName="max" />
              <HeatMap keyName="min" />
            </section>
          ) : (
            <p className="text-sm">No data available</p>
          )
        ) : null}
      </section>
    </section>
  );
};

export default ServicesScalingVolatility;
