import {
  faCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {
  ResponsiveContainer,
  XAxis,
  Label,
  YAxis,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";
import { GetTableCoverage } from "src/services/business-continuity/sop";

export const CustomTooltip = ({
  active,
  payload,
  keys,
  xKey,
  hasSeverity,
}: any) => {
  if (active && payload && payload.length) {
    const filteredKeys = keys ? keys : payload;

    return (
      <article className="grid px-4 py-2 gap-3 text-xs dark:bg-expand">
        <h4 className="text-sm">Starting Page: {payload[0].payload[xKey]}</h4>
        <ul className="grid gap-3">
          {filteredKeys?.map((key: any, index: number) => {
            const value = keys ? key : key.dataKey;
            if (value === "table_id") return null;
            return (
              <li key={index} className="flex items-center gap-2 capitalize">
                <p>{`${value.replace("_", " ")}: ${payload[0].payload[value]}${
                  value === "coverage" ? "%" : ""
                }`}</p>
                {value === "coverage" ? (
                  payload[0].payload[value] < 85 ? (
                    <FontAwesomeIcon
                      icon={faTriangleExclamation}
                      className="w-4 h-4 text-[#FFA500]"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="w-4 h-4 text-[#82ca9d]"
                    />
                  )
                ) : null}
              </li>
            );
          })}
        </ul>
      </article>
    );
  }

  return null;
};

const TableCoverage = ({
  sopID,
  versionID,
}: {
  sopID: string;
  versionID: string;
}) => {
  const { data: tableCoverage } = GetTableCoverage(versionID);

  const data = tableCoverage?.tables;
  const xKey = "starting_page";
  const keys =
    tableCoverage?.tables?.length > 0
      ? (Object.keys(data[0]).filter((k) => k !== xKey) as string[])
      : [];

  return (
    <section className="grid gap-3">
      {tableCoverage && (
        <span className="text-center">
          Total Tables: {tableCoverage.total_tables}
        </span>
      )}
      {tableCoverage ? (
        data?.length > 0 ? (
          <section className="grid grid-cols-1 h-[15rem]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 20,
                }}
              >
                <XAxis
                  dataKey={xKey}
                  domain={["dataMin", "dataMax"]}
                  tick={{ fill: "white" }}
                  ticks={[
                    data[0][xKey],
                    data[Math.round(data.length / 2) - 1][xKey],
                    data[data.length - 1][xKey],
                  ]}
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
                    value="Starting Page"
                    position="insideBottom"
                    angle={0}
                    dy={20}
                  />
                </XAxis>
                <YAxis
                  domain={[0, 100]}
                  dataKey="coverage"
                  tick={{ fill: "white" }}
                  tickLine={{ stroke: "white" }}
                  tickCount={5}
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
                    value="Coverage (%)"
                    position="insideLeft"
                    angle={-90}
                  />
                </YAxis>
                <defs>
                  <linearGradient id="coverage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="15%" stopColor="#82ca9d" stopOpacity={1} />
                    <stop offset="0%" stopColor="#FFA500" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <Area
                  type="linear"
                  dataKey="coverage"
                  stackId="1"
                  stroke="#82ca9d"
                  fill="url(#coverage)"
                />
                <Tooltip content={<CustomTooltip keys={keys} xKey={xKey} />} />
              </AreaChart>
            </ResponsiveContainer>
          </section>
        ) : (
          <p>No table coverage available</p>
        )
      ) : null}
    </section>
  );
};

export default TableCoverage;
