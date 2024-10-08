import React from "react";
import {
  ResponsiveContainer,
  XAxis,
  Label,
  YAxis,
  Tooltip,
  Line,
  LineChart,
  CartesianGrid,
} from "recharts";
import CustomTooltip from "src/components/Chart/Tooltip/CustomTooltip";
import { chartDataColors } from "src/constants/general";
import { GetDiffGraph } from "src/services/regulation-policy/overview";

const DiffGraph = ({
  documentID,
  selectedPolicyID,
}: {
  documentID: string;
  selectedPolicyID: string;
}) => {
  const { data: diffGraph } = GetDiffGraph(documentID, selectedPolicyID);

  const keys = ["framework_mapped"];

  return (
    <>
      {diffGraph?.policy_diff_points.length > 1 && (
        <section className="grid grid-cols-1 w-full h-[15rem]">
          <h4 className="text-center text-lg">Coverage Change by Version</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={diffGraph?.policy_diff_points}
              margin={{
                top: 10,
                right: 0,
                left: 0,
                bottom: 20,
              }}
            >
              <XAxis
                dataKey="version_number"
                domain={["dataMin", "dataMax"]}
                tick={{ fill: "white" }}
                tickCount={3}
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
                  value="Version"
                  position="insideBottom"
                  angle={0}
                  dy={20}
                />
              </XAxis>
              <YAxis
                domain={["dataMin", "dataMax"]}
                tick={{ fill: "white" }}
                tickLine={false}
                tickCount={3}
                tickFormatter={(value) => value.toFixed(0)}
                tickMargin={10}
                style={{
                  fontSize: "0.85rem",
                }}
                axisLine={false}
              >
                <Label
                  style={{
                    textAnchor: "middle",
                    fontSize: "0.65rem",
                    fill: "white",
                  }}
                  value="% Coverage"
                  position="insideLeft"
                  angle={-90}
                />
              </YAxis>
              <CartesianGrid
                horizontal={true}
                vertical={false}
                stroke="#41576D"
              />
              <Tooltip
                content={<CustomTooltip keys={keys} xKey="version_number" />}
              />
              {keys.map((key: string, index: number) => {
                const color = chartDataColors[index % 20];
                return (
                  <Line
                    key={key}
                    type="linear"
                    dataKey={key}
                    stroke={color}
                    dot={false}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </section>
      )}
    </>
  );
};

export default DiffGraph;
