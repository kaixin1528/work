import React from "react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Label,
  Tooltip,
  Scatter,
  ScatterChart,
} from "recharts";
import CustomTooltip from "src/components/Chart/Tooltip/CustomTooltip";
import { chartDataColors } from "src/constants/general";

const CVECountsByYear = ({ cpeAnalytics }: { cpeAnalytics: any }) => {
  const keys = ["count"];

  return (
    <>
      {cpeAnalytics ? (
        cpeAnalytics.data.length > 0 ? (
          <section className="grid grid-cols-1 p-4 w-full h-[15rem] dark:bg-panel">
            <h4 className="text-center">CVE Counts By Year</h4>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{
                  top: 5,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <XAxis
                  type="number"
                  dataKey="year"
                  domain={["dataMin", "dataMax"]}
                  tick={{ fill: "white" }}
                  tickLine={{ stroke: "white" }}
                  tickMargin={10}
                  interval="preserveStartEnd"
                  style={{
                    fontSize: "0.65rem",
                  }}
                />
                <YAxis
                  dataKey="count"
                  domain={["dataMin", "dataMax"]}
                  tick={{ fill: "white" }}
                  tickLine={{ stroke: "white" }}
                  tickFormatter={(value) => value.toFixed(0)}
                  tickCount={3}
                  tickMargin={10}
                  style={{
                    fontSize: "0.75rem",
                  }}
                >
                  <Label
                    style={{
                      textAnchor: "middle",
                      fontSize: "0.85rem",
                      fill: "white",
                    }}
                    value="Count"
                    position="insideLeft"
                    angle={-90}
                  />
                </YAxis>
                <Tooltip content={<CustomTooltip keys={keys} />} />
                <Scatter data={cpeAnalytics.data} fill={chartDataColors[0]} />
              </ScatterChart>
            </ResponsiveContainer>
          </section>
        ) : (
          <p className="text-sm">No data available</p>
        )
      ) : null}
    </>
  );
};

export default CVECountsByYear;
