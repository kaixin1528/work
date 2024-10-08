import { utcFormat } from "d3-time-format";
import React, { useState } from "react";
import {
  Area,
  AreaChart,
  Label,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CustomLegend from "src/components/Chart/CustomLegend";
import CustomInfoTooltip from "src/components/Chart/Tooltip/CustomInfoTooltip";
import NumericFilter from "src/components/Filter/General/NumericFilter";
import {
  severityChartColors,
  chartDataColors,
  severities,
} from "src/constants/general";
import { GetSLAOverallCountsBySeverity } from "src/services/summaries/sla-remediation";
import { KeyNumVal } from "src/types/general";
import { convertToDate } from "src/utils/general";

const SeverityCountsOvertime = ({
  selectedSource,
  selectedVersion,
  selectedIntegrationType,
  selectedSourceAccountID,
  setSelectedService,
}: {
  selectedSource: string;
  selectedVersion: string;
  selectedIntegrationType: string;
  selectedSourceAccountID: string;
  setSelectedService: (selectedService: string) => void;
}) => {
  const [sectionProps, setSectionProps] = useState<any>({});

  const [numScans, setNumScans] = useState(100);

  const { data: severityCountsOvertime } = GetSLAOverallCountsBySeverity(
    selectedSource,
    selectedVersion,
    selectedIntegrationType,
    selectedSourceAccountID,
    numScans
  );

  const keys =
    severityCountsOvertime?.counts.length > 0
      ? severities.filter((severity: string) =>
          Object.keys(severityCountsOvertime?.counts[0]).includes(severity)
        )
      : [];
  const filteredData =
    severityCountsOvertime?.counts?.length === 1
      ? [
          ...severityCountsOvertime?.counts,
          {
            ...severityCountsOvertime?.counts[0],
            timestamp: Date.now() * 1000,
          },
        ]
      : severityCountsOvertime?.counts;

  return (
    <section className="grid gap-5 p-4 dark:bg-card black-shadow">
      <article className="mx-auto">
        <NumericFilter
          label="Number of Scans"
          value={numScans}
          setValue={setNumScans}
        />
      </article>
      {severityCountsOvertime ? (
        filteredData.length > 0 ? (
          <section className="grid grid-cols-1 w-full h-[15rem]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={filteredData}
                onClick={(e: any) => {
                  const serviceName = severityCountsOvertime?.ranges.find(
                    (range: KeyNumVal) =>
                      range.first_seen_start_range <= e.activeLabel &&
                      range.first_seen_end_range >= e.activeLabel
                  )?.image_grouping_id;
                  setSelectedService(serviceName);
                }}
                margin={{
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 20,
                }}
              >
                <XAxis
                  dataKey="timestamp"
                  domain={["dataMin", "dataMax"]}
                  tick={{ fill: "white" }}
                  ticks={[
                    filteredData[0]["timestamp"],
                    filteredData[Math.round(filteredData.length / 2) - 1][
                      "timestamp"
                    ],
                    filteredData[filteredData.length - 1]["timestamp"],
                  ]}
                  tickFormatter={(v) => utcFormat("%m/%d/%y")(convertToDate(v))}
                  tickLine={{ stroke: "white" }}
                  tickMargin={10}
                  interval="preserveEnd"
                  style={{
                    fontSize: "0.75rem",
                  }}
                >
                  <Label
                    style={{
                      textAnchor: "middle",
                      fontSize: "0.75rem",
                      fill: "white",
                    }}
                    value="Scan End Time"
                    position="insideBottom"
                    angle={0}
                    dy={20}
                  />
                </XAxis>
                <YAxis
                  domain={["dataMin", "dataMax"]}
                  tick={{ fill: "white" }}
                  tickLine={{ stroke: "white" }}
                  tickCount={2}
                  tickFormatter={(value) => value.toFixed(0)}
                  tickMargin={10}
                  style={{
                    fontSize: "0.85rem",
                  }}
                >
                  <Label
                    style={{
                      textAnchor: "middle",
                      fontSize: "0.65rem",
                      fill: "white",
                    }}
                    value="Count"
                    position="insideLeft"
                    angle={-90}
                  />
                </YAxis>
                <Legend
                  content={
                    <CustomLegend
                      keys={keys}
                      hasSeverity
                      sectionProps={sectionProps}
                      setSectionProps={setSectionProps}
                    />
                  }
                  verticalAlign="top"
                  height={50}
                />
                {keys.map((key: string, index: number) => {
                  const filteredKey = key.toLowerCase();
                  const color =
                    severityChartColors[filteredKey] ||
                    chartDataColors[index % 20];
                  return (
                    <Area
                      key={key}
                      type="linear"
                      dataKey={key}
                      stackId="1"
                      stroke={color}
                      fill={color}
                      hide={sectionProps[key] === true}
                      fillOpacity={Number(
                        sectionProps.hover === key || !sectionProps.hover
                          ? 1
                          : 0.6
                      )}
                      dot
                    />
                  );
                })}
                <Tooltip
                  content={
                    <CustomInfoTooltip
                      details={severityCountsOvertime?.ranges}
                      hasSeverity
                    />
                  }
                />
              </AreaChart>
            </ResponsiveContainer>
          </section>
        ) : (
          <p className="text-sm">No data available</p>
        )
      ) : null}
    </section>
  );
};

export default SeverityCountsOvertime;
