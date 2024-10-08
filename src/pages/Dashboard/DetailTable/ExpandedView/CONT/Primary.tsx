import { LinePath } from "@visx/shape";
import { AxisLeft, AxisBottom, AxisScale } from "@visx/axis";
import { Group } from "@visx/group";
import { curveLinear } from "@visx/curve";

import { utcFormat } from "d3-time-format";
import { extent } from "d3-array";
import { ChartData } from "../../../../../types/dashboard";
import { convertToDate } from "src/utils/general";

export type AnnotationProps = {
  width: number;
  yMax: number;
  compact?: boolean;
  filteredPrimary: ChartData[];
  margin: { top: number; right: number; bottom: number; left: number };
  xScale: AxisScale<any>;
  yScale: AxisScale<number>;
  top?: number;
  left?: number;
  hideBottomAxis?: boolean;
  hideLeftAxis?: boolean;
  children?: React.ReactNode;
};

const axisColor = "#fff";
const axisBottomTickLabelProps = {
  textAnchor: "middle" as const,
  fontFamily: "Arial",
  fontSize: 10,
  fill: axisColor,
};
const axisLeftTickLabelProps = {
  dx: "-0.25em",
  dy: "0.25em",
  fontFamily: "Arial",
  fontSize: 10,
  textAnchor: "end" as const,
  fill: axisColor,
};

export const orange = "#ff7e67";
export const greens = ["#ecf4f3", "#68b0ab", "#006a71"];

const Primary = ({
  width,
  yMax,
  compact = false,
  filteredPrimary,
  margin,
  xScale,
  yScale,
  top,
  left,
  hideBottomAxis = false,
  hideLeftAxis = false,
  children,
}: AnnotationProps) => {
  const getDate = (d: ChartData) => convertToDate(d.timestamp);
  const getMetric = (d: ChartData) => d.metric_value;

  const timeRange =
    Date.parse(String(extent(filteredPrimary, getDate)[1])) * 1000 -
    Date.parse(String(extent(filteredPrimary, getDate)[0])) * 1000;

  return (
    <>
      <Group left={left || margin.left} top={top || margin.top}>
        <LinePath
          curve={curveLinear}
          stroke="#61AE25"
          strokeWidth={1.5}
          data={filteredPrimary}
          x={(d) => xScale(getDate(d)) ?? 0}
          y={(d) => yScale(getMetric(d)) ?? 0}
        />
        {!hideBottomAxis && (
          <AxisBottom
            // hideAxisLine
            hideTicks
            top={yMax}
            scale={xScale}
            tickFormat={(v: Date, i: number) =>
              timeRange <= 8.64e10
                ? utcFormat("%H:%M")(v)
                : utcFormat("%b %d")(v)
            }
            numTicks={width > 520 ? 10 : 5}
            stroke={axisColor}
            strokeWidth={0.3}
            tickStroke={axisColor}
            tickLabelProps={() => axisBottomTickLabelProps}
          />
        )}
        {!hideLeftAxis && (
          <AxisLeft
            // hideAxisLine
            hideTicks
            scale={yScale}
            numTicks={4}
            stroke={axisColor}
            strokeWidth={0.3}
            tickStroke={axisColor}
            tickLabelProps={() => axisLeftTickLabelProps}
          />
        )}
        {children}
      </Group>
    </>
  );
};

export default Primary;
