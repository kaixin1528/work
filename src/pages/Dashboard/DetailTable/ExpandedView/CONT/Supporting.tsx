import { AreaStack } from "@visx/shape";
import { SeriesPoint } from "@visx/shape/lib/types";
import { AxisLeft, AxisBottom, AxisScale } from "@visx/axis";
import { Group } from "@visx/group";
import { LinearGradient } from "@visx/gradient";
import { curveLinear } from "@visx/curve";
import {
  metricColors,
  axisColor,
  axisLeftTickLabelProps,
} from "../../../../../constants/dashboard";
import { axisBottomTickLabelProps } from "../CCR/VulnerabilitySpans";
import { ChartData } from "../../../../../types/dashboard";
import { convertToDate } from "src/utils/general";

const Supporting = ({
  supporting,
  width,
  height,
  margin,
  xScale,
  yScale,
  previousDays,
  hideBottomAxis = false,
  hideLeftAxis = false,
  top,
  left,
  children,
}: {
  supporting: ChartData[];
  xScale: AxisScale<number>;
  yScale: AxisScale<number>;
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  previousDays: string;
  hideBottomAxis?: boolean;
  hideLeftAxis?: boolean;
  top?: number;
  left?: number;
  children?: React.ReactNode;
}) => {
  const keys: string[] = Object.keys(supporting[0]).filter(
    (k) => k !== "timestamp"
  );

  const getDate = (d: ChartData) => convertToDate(d.timestamp);
  const getY0 = (d: SeriesPoint<any>) => d[0];
  const getY1 = (d: SeriesPoint<any>) => d[1];

  return width < 10 ? null : (
    <Group left={left || margin.left} top={top || margin.top}>
      {keys.map((key, index) => {
        return (
          <LinearGradient
            id={String(index)}
            from={metricColors[index]}
            fromOpacity={1}
            to={metricColors[index]}
            toOpacity={0.3}
          />
        );
      })}
      <AreaStack
        top={margin.top}
        left={margin.left}
        keys={keys}
        data={supporting}
        x={(d) => xScale(getDate(d.data)) as number}
        y0={(d) => yScale(getY0(d)) as number}
        y1={(d) => yScale(getY1(d)) as number}
        curve={curveLinear}
      >
        {({ stacks, path }) =>
          stacks.map((stack, index: number) => {
            return (
              <path
                key={`stack-${stack.key}`}
                d={path(stack) || ""}
                fill={`url(#${index})`}
              />
            );
          })
        }
      </AreaStack>
      {!hideBottomAxis && (
        <AxisBottom
          hideAxisLine
          hideTicks
          top={height}
          scale={xScale}
          numTicks={previousDays === "7d" ? 7 : 10}
          stroke={axisColor}
          tickStroke={axisColor}
          tickLabelProps={() => axisBottomTickLabelProps}
        />
      )}
      {!hideLeftAxis && (
        <AxisLeft
          hideAxisLine
          hideTicks
          scale={yScale}
          numTicks={4}
          stroke={axisColor}
          tickStroke={axisColor}
          tickLabelProps={() => axisLeftTickLabelProps}
        />
      )}
      {children}
    </Group>
  );
};

export default Supporting;
