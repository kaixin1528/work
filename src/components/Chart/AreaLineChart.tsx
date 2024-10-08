/* eslint-disable react-hooks/exhaustive-deps */
import { utcFormat } from "d3-time-format";
import React, { useEffect } from "react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
  Area,
  Label,
  Tooltip,
  ComposedChart,
  Line,
} from "recharts";
import { convertToDate } from "src/utils/general";
import { chartDataColors } from "../../constants/general";
import CustomLegend from "./CustomLegend";
import CustomTooltip from "./Tooltip/CustomTooltip";

const AreaLineChart = ({
  data,
  title,
  xKey,
  areaKey,
  lineKey,
  yLabel,
  children,
  hideLegend,
  hasSeverity,
  sectionProps,
  setSectionProps,
}: {
  data: any;
  title?: string;
  xKey: string;
  areaKey: string;
  lineKey: string;
  yLabel: string;
  children?: any;
  hideLegend?: boolean;
  hasSeverity?: boolean;
  sectionProps: any;
  setSectionProps: (sectionProps: any) => void;
}) => {
  const keys = [areaKey, lineKey];

  useEffect(() => {
    setSectionProps(
      keys.reduce(
        (a: any, cV: string) => {
          a[cV] = false;
          return a;
        },
        { hover: null }
      )
    );
  }, []);

  return (
    <>
      {data ? (
        data.length > 0 ? (
          <section className="grid grid-cols-1 w-full h-[15rem]">
            <h4 className="text-center">{title}</h4>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data}>
                <XAxis
                  dataKey={xKey}
                  domain={["dataMin", "dataMax"]}
                  tick={{ fill: "white" }}
                  ticks={[
                    data[0][xKey],
                    data[Math.round(data.length / 2) - 1][xKey],
                    data[data.length - 1][xKey],
                  ]}
                  tickFormatter={(v) => {
                    if (xKey.includes("time"))
                      return utcFormat("%m/%d/%y")(convertToDate(v));
                    else return v;
                  }}
                  tickLine={{ stroke: "white" }}
                  tickMargin={10}
                  interval="preserveEnd"
                  style={{
                    fontSize: "0.75rem",
                  }}
                />
                <YAxis
                  tick={{ fill: "white" }}
                  tickLine={{ stroke: "white" }}
                  tickCount={3}
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
                    value={yLabel}
                    position="insideLeft"
                    angle={-90}
                  />
                </YAxis>
                {!hideLegend && (
                  <Legend
                    content={
                      <CustomLegend
                        keys={keys}
                        hasSeverity={hasSeverity}
                        sectionProps={sectionProps}
                        setSectionProps={setSectionProps}
                      />
                    }
                    verticalAlign="top"
                    height={50}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey={areaKey}
                  fill={chartDataColors[0]}
                  stroke={chartDataColors[0]}
                  hide={sectionProps[areaKey] === true}
                  fillOpacity={Number(
                    sectionProps.hover === areaKey || !sectionProps.hover
                      ? 1
                      : 0.6
                  )}
                />
                <Line
                  type="monotone"
                  dataKey={lineKey}
                  stroke={
                    sectionProps.hover === lineKey || !sectionProps.hover
                      ? chartDataColors[1]
                      : chartDataColors[0]
                  }
                  hide={sectionProps[lineKey] === true}
                  strokeOpacity={Number(
                    sectionProps.hover === lineKey || !sectionProps.hover
                      ? 1
                      : 0.6
                  )}
                />
                {children ? (
                  children
                ) : (
                  <Tooltip
                    content={
                      <CustomTooltip
                        keys={keys}
                        hasSeverity={hasSeverity}
                        xKey={xKey}
                      />
                    }
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </section>
        ) : (
          <p className="text-sm">No data available</p>
        )
      ) : null}
    </>
  );
};

export default AreaLineChart;
