/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { useEffect, useState } from "react";
import BrushLineChart from "./ContainerMetrics";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import { MetricCategory } from "../../../../../types/dashboard";
import { Filter, KeyStringVal } from "../../../../../types/general";
import {
  calcTimeFromSnapshot,
  parseURL,
  sortNumericData,
} from "../../../../../utils/general";
import {
  containerlegends,
  containerMetricColors,
  containerTimes,
} from "../../../../../constants/dashboard";
import ExpandedViewLayout from "../../../../../layouts/ExpandedViewLayout";
import { useGeneralStore } from "src/stores/general";
import {
  GetContainerMetricCategories,
  GetContainerMetrics,
} from "src/services/dashboard/infra";
import TextFilter from "src/components/Filter/General/TextFilter";

const CONT = ({ selectedNodeID }: { selectedNodeID: string }) => {
  const parsed = parseURL();

  const { env } = useGeneralStore();

  const [category, setCategory] = useState<string>("");
  const [previousDays, setPreviousDays] = useState<string>("7d");
  const [metricsFilter, setMetricsFilter] = useState<Filter[]>([
    {
      field: "timestamp",
      op: "ge",
      value: calcTimeFromSnapshot(6.048e11),
      type: "integer",
      set_op: "and",
    },
  ]);

  const { data: categories } = GetContainerMetricCategories(
    env,
    parsed.integration,
    selectedNodeID,
    parsed.node_type
  );
  const { data: containerMetrics } = GetContainerMetrics(
    env,
    parsed.integration,
    selectedNodeID,
    category,
    metricsFilter
  );

  const metricTypes =
    categories?.length > 0 && category !== ""
      ? (
          categories.find(
            (item: MetricCategory) => item.category === category
          ) as MetricCategory
        ).members
      : undefined;
  const categoryNames = categories?.reduce(
    (pV: string[], cV: KeyStringVal) => [...pV, cV.category],
    []
  );

  const metricNames =
    containerMetrics?.supporting.length > 0
      ? Object.keys(containerMetrics.supporting[0]).slice(1)
      : [];

  useEffect(() => {
    setCategory("");
    setPreviousDays("7d");
  }, [selectedNodeID, parsed.category, parsed.node_type]);

  useEffect(() => {
    if (categoryNames?.length > 0 && category === "")
      setCategory(categoryNames[0]);
  }, [categoryNames]);

  return (
    <ExpandedViewLayout selectedNodeID={selectedNodeID}>
      <h4 className="text-sm dark:text-checkbox">Metrics</h4>
      <article className="flex gap-10 items-center">
        <TextFilter
          label="Category"
          list={categories}
          value={category}
          setValue={setCategory}
        />
        <nav className="flex text-xs dark:text-white dark:bg-filter">
          {containerTimes.map((time: { name: string; value: number }) => {
            return (
              <button
                key={time.name}
                className={`px-4 py-1 font-semibold  ${
                  previousDays === time.name
                    ? "bg-gradient-to-b dark:from-main dark:to-checkbox dark:text-white"
                    : "dark:text-expand dark:hover:text-white dark:bg-filter hover:bg-gradient-to-b dark:hover:from-filter dark:hover:to-checkbox duration-500"
                }`}
                onClick={() => {
                  setPreviousDays(time.name);
                  setMetricsFilter([
                    {
                      field: "timestamp",
                      op: "ge",
                      value: calcTimeFromSnapshot(time.value),
                      type: "integer",
                      set_op: "and",
                    },
                  ]);
                }}
              >
                {time.name}
              </button>
            );
          })}
        </nav>

        {/* legends */}
        {categories?.length > 0 && (
          <ul className="flex items-center gap-5 text-[0.7rem]">
            <li className="flex items-center gap-2 uppercase">
              <span className="w-3 border border-[#61AE25]"></span>
              <h4>
                {metricTypes &&
                  metricTypes[0].metric_name.slice(
                    metricTypes[0].metric_name.lastIndexOf(".") + 1
                  )}
              </h4>
            </li>
            {metricNames?.map((name: string, index: number) => {
              return (
                <li key={name} className="flex items-center gap-2 uppercase">
                  <span
                    className={`w-3 h-3 border ${containerMetricColors[index]}`}
                  ></span>

                  <h4>{name.slice(name.lastIndexOf(".") + 1)}</h4>
                </li>
              );
            })}

            {containerlegends.map((legend: { icon: string; name: string }) => {
              return (
                <li key={legend.name} className="flex items-center gap-2">
                  <img
                    src={legend.icon}
                    alt={legend.name}
                    className="w-3 h-3"
                  />
                  <h4 className="text-[0.7rem]">{legend.name}</h4>
                </li>
              );
            })}
          </ul>
        )}
      </article>

      {/* no metrics available */}
      {(categories?.length === 0 || containerMetrics?.primary.length === 0) && (
        <p>No metrics available</p>
      )}

      {/* metrics available */}
      {containerMetrics?.primary.length > 0 && (
        <section className="w-11/12 h-[12rem] text-xs dark:text-white">
          {
            <ParentSize>
              {({ width, height }) => (
                <BrushLineChart
                  primary={sortNumericData(
                    containerMetrics.primary,
                    "timestamp",
                    "asc"
                  )}
                  supporting={sortNumericData(
                    containerMetrics.supporting,
                    "timestamp",
                    "asc"
                  )}
                  patternInfo={containerMetrics.pattern_info}
                  events={containerMetrics.events}
                  metricTypes={metricTypes}
                  previousDays={previousDays}
                  width={width}
                  height={height}
                />
              )}
            </ParentSize>
          }
        </section>
      )}
    </ExpandedViewLayout>
  );
};

export default CONT;
