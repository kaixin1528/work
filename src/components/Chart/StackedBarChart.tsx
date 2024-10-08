/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Legend,
  Label,
  Tooltip,
} from "recharts";
import {
  chartDataColors,
  severities,
  severityChartColors,
} from "src/constants/general";
import CustomLegend from "./CustomLegend";
import { utcFormat } from "d3-time-format";
import { convertToDate } from "src/utils/general";
import CustomTooltip from "./Tooltip/CustomTooltip";

const StackedBarChart = ({
  data,
  title,
  xKey,
  xLabel,
  yLabel,
  hideLegend,
  hideXLabel,
  children,
  hasSeverity,
  sectionProps,
  setSectionProps,
}: {
  data: any;
  title?: string;
  xKey: string;
  xLabel?: string;
  yLabel: string;
  hideLegend?: boolean;
  hideXLabel?: boolean;
  children?: any;
  hasSeverity?: boolean;
  sectionProps: any;
  setSectionProps: (sectionProps: any) => void;
}) => {
  const keys = hasSeverity
    ? severities
    : data?.length > 0
    ? (Object.keys(data[0]).filter((k) => k !== xKey) as string[])
    : [];
  const showVerticalTick = data?.length > 7;

  const CustomTick = (props: any) => {
    const { x, y, payload } = props.props;

    return (
      <g style={{ textAnchor: "middle" }} transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={0}
          transform="rotate(-90)"
          textAnchor="end"
          fill="#fff"
          fontSize="0.65rem"
        >
          {String(payload.value).slice(0, 10)}
          {payload.value.length > 10 && "..."}
        </text>
      </g>
    );
  };

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
              <BarChart
                data={data}
                style={{ cursor: "pointer" }}
                margin={{
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: hideXLabel ? 50 : showVerticalTick ? 100 : 30,
                }}
              >
                <XAxis
                  dataKey={xKey}
                  tickLine={{ stroke: "white" }}
                  tickFormatter={(v) => {
                    if (xKey === "timestamp")
                      return utcFormat("%m/%d/%y")(convertToDate(v));
                    else return v;
                  }}
                  tick={
                    showVerticalTick
                      ? (props) => <CustomTick props={props} />
                      : { fill: "white" }
                  }
                  interval={0}
                  tickMargin={10}
                  style={{
                    fontSize: "0.75rem",
                    width: "1rem",
                  }}
                >
                  {!hideXLabel && xLabel && (
                    <Label
                      style={{
                        textAnchor: "middle",
                        fontSize: "0.85rem",
                        fill: "white",
                      }}
                      angle={0}
                      value={xLabel}
                      dx={0}
                      dy={showVerticalTick ? 100 : 30}
                    />
                  )}
                </XAxis>
                <YAxis
                  tick={{ fill: "white" }}
                  tickLine={{ stroke: "white" }}
                  tickFormatter={(value) => value.toFixed(0)}
                  tickCount={3}
                  tickMargin={10}
                  style={{
                    fontSize: "0.65rem",
                  }}
                >
                  <Label
                    style={{
                      textAnchor: "middle",
                      fontSize: "0.85rem",
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

                {keys.map((key: string, index: number) => {
                  const filteredKey = key.toLowerCase();
                  const color =
                    severityChartColors[filteredKey] ||
                    chartDataColors[index % 20];
                  return (
                    <Bar
                      key={key}
                      dataKey={key}
                      stackId="a"
                      fill={color}
                      hide={sectionProps[key] === true}
                      fillOpacity={Number(
                        sectionProps.hover === key || !sectionProps.hover
                          ? 1
                          : 0.6
                      )}
                    />
                  );
                })}

                {children ? (
                  children
                ) : (
                  <Tooltip
                    cursor={{ fill: "#23394F", fillOpacity: 0.4 }}
                    content={
                      <CustomTooltip
                        keys={keys}
                        xKey={xKey}
                        hasSeverity={hasSeverity}
                      />
                    }
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </section>
        ) : (
          <p className="text-sm">No data available</p>
        )
      ) : null}
    </>
  );
};

export default StackedBarChart;
