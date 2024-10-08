import { utcFormat } from "d3-time-format";
import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from "recharts";
import {
  severityLegends,
  severityBGColors,
  severityChartColors,
} from "src/constants/general";
import {
  convertToDate,
  convertToUTCString,
  sortNumericData,
} from "src/utils/general";

const SeverityCountsChart = ({
  vulnerabilities,
  setImageTimestamp,
}: {
  vulnerabilities: any;
  setImageTimestamp: (imageTimestamp: number) => void;
}) => {
  const keys =
    vulnerabilities?.severity_counts.length > 0
      ? (
          Object.keys(vulnerabilities.severity_counts[0]).filter(
            (k) => !["timestamp", "image_tag"].includes(k)
          ) as string[]
        ).reverse()
      : [];

  const severityCounts =
    vulnerabilities?.severity_counts.length === 1
      ? [
          vulnerabilities.severity_counts[0],
          {
            ...vulnerabilities.severity_counts[0],
            timestamp: Date.now() * 1000,
          },
        ]
      : sortNumericData(vulnerabilities?.severity_counts, "timestamp", "asc");

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <article className="grid gap-2 p-4 -mt-20 text-xs dark:bg-filter">
          <h4>{convertToUTCString(label)}</h4>
          <p className="flex items-center gap-1 break-all">
            Image Tag:
            <span className="dark:text-signin">
              {
                vulnerabilities?.image_tag_scan_timestamps[
                  payload[0].payload.timestamp
                ]
              }
            </span>
          </p>
          <ul className="grid">
            {Object.entries(severityLegends)
              .reverse()
              .map((keyVal: [string, unknown], index: number) => {
                const value =
                  payload[0].payload[String(keyVal[0])] ||
                  payload[0].payload[String(keyVal[1])];
                const color =
                  severityBGColors[keyVal[0]] ||
                  severityBGColors[String(keyVal[1])];
                return (
                  <li key={keyVal[0]} className="flex items-center gap-2">
                    <span className={`w-3 h-3 ${color}`}></span>
                    <h4>
                      {keyVal[0]} ({keyVal[1]}):
                    </h4>
                    <p>{value}</p>
                  </li>
                );
              })}
          </ul>
        </article>
      );
    }

    return null;
  };

  const CustomTick = (props: any) => {
    const { x, y, payload } = props.props;

    const imageTag =
      (vulnerabilities?.image_tag_scan_timestamps[payload.value] &&
        `${vulnerabilities?.image_tag_scan_timestamps[payload.value].slice(
          0,
          8
        )}${
          vulnerabilities?.image_tag_scan_timestamps[payload.value].length > 8
            ? "..."
            : ""
        }`) ||
      (severityCounts &&
        severityCounts[severityCounts.length - 1].image_tag &&
        `${severityCounts[severityCounts.length - 1].image_tag.slice(0, 8)}${
          severityCounts[severityCounts.length - 1].image_tag.length > 8
            ? "..."
            : ""
        }`);

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="start"
          fill="#fff"
          fontSize="0.65rem"
        >
          {utcFormat("%m/%d/%y")(convertToDate(payload.value))}
        </text>
        <text
          x={0}
          y={0}
          dy={32}
          textAnchor="start"
          fill="#fff"
          fontSize="0.65rem"
        >
          {imageTag}
        </text>
      </g>
    );
  };

  return (
    <section className="grid gap-2">
      <header className="flex items-center gap-10 dark:text-checkbox">
        <h4 className="">Severity Counts</h4>
        <ul className="flex flex-row-reverse gap-5 text-xs capitalize">
          {Object.entries(severityLegends).map((keyVal: [string, unknown]) => {
            const color =
              severityBGColors[keyVal[0]] ||
              severityBGColors[String(keyVal[1])];
            return (
              <li key={keyVal[0]} className="flex items-center gap-2">
                <span className={`w-3 h-3 ${color}`}></span>
                <h4>
                  {keyVal[0]} ({keyVal[1]})
                </h4>
              </li>
            );
          })}
        </ul>
      </header>
      <article className="w-full h-[12rem]">
        <ResponsiveContainer width="95%" height="100%">
          <AreaChart
            data={severityCounts}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 20,
            }}
            onMouseMove={(e: any) => {
              if (e?.activePayload)
                setImageTimestamp(e.activePayload[0].payload.timestamp);
              else setImageTimestamp(-1);
            }}
          >
            <XAxis
              dataKey="timestamp"
              domain={["dataMin", "dataMax"]}
              tick={(props) => vulnerabilities && <CustomTick props={props} />}
              tickLine={{ stroke: "white" }}
            />
            <YAxis
              type="number"
              tickCount={3}
              tick={{ fill: "white" }}
              tickLine={{ stroke: "white" }}
              style={{
                fontSize: "0.65rem",
              }}
            />
            <Tooltip content={<CustomTooltip keys={keys} />} />
            {keys.map((key: string) => {
              return (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={severityChartColors[key]}
                  fill={severityChartColors[key]}
                  stackId="1"
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </article>
    </section>
  );
};

export default SeverityCountsChart;
