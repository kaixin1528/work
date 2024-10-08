/* eslint-disable react-hooks/exhaustive-deps */
import { utcFormat } from "d3-time-format";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Label,
} from "recharts";
import { convertToDate } from "src/utils/general";
import {
  chartDataColors,
  severities,
  severityChartColors,
} from "../../constants/general";
import CustomTooltip from "./Tooltip/CustomTooltip";
import CustomLegend from "./CustomLegend";
import { useEffect } from "react";

const MultiLineChart = ({
  data,
  title,
  xKey,
  xLabel,
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
  xLabel?: string;
  yLabel: string;
  children?: any;
  hideLegend?: boolean;
  hasSeverity?: boolean;
  sectionProps: any;
  setSectionProps: (sectionProps: any) => void;
}) => {
  const keys = hasSeverity
    ? severities
    : data?.length > 0
    ? (Object.keys(data[0]).filter((k) => k !== xKey) as string[])
    : [];

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
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 0,
                  bottom: 5,
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
                >
                  <Label
                    style={{
                      textAnchor: "middle",
                      fontSize: "0.75rem",
                      fill: "white",
                    }}
                    value={xLabel}
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
                    value={yLabel}
                    position="insideLeft"
                    angle={-90}
                  />
                </YAxis>
                <Tooltip
                  content={
                    <CustomTooltip keys={keys} hasSeverity={hasSeverity} />
                  }
                />
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
                    height={36}
                  />
                )}
                {keys.map((key: string, index: number) => {
                  const filteredKey = key.toLowerCase();
                  const color =
                    severityChartColors[filteredKey] ||
                    chartDataColors[index % 20];
                  return (
                    <Line
                      key={key}
                      type="linear"
                      dataKey={key}
                      stroke={color}
                      dot={false}
                      hide={sectionProps[key] === true}
                      fillOpacity={Number(
                        sectionProps.hover === key || !sectionProps.hover
                          ? 1
                          : 0.6
                      )}
                    />
                  );
                })}
                {children}
              </LineChart>
            </ResponsiveContainer>
          </section>
        ) : (
          <p className="text-sm">No data available</p>
        )
      ) : null}
    </>
  );
};

export default MultiLineChart;
