/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useCallback, useState, useEffect } from "react";
import { Line, Bar } from "@visx/shape";
import { scaleTime, scaleLinear } from "@visx/scale";
import { extent, max, min } from "d3-array";
import { defaultStyles } from "@visx/tooltip";
import { useTooltip, TooltipWithBounds } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import { Grid } from "@visx/grid";
import { Annotation, HtmlLabel } from "@visx/annotation";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Primary from "./Primary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faBan,
  faDeleteLeft,
} from "@fortawesome/free-solid-svg-icons";
import Supporting from "./Supporting";
import {
  ChartData,
  PatternInfo,
  Events,
  Event,
  MetricType,
  LevelTest,
  SpikeTest,
} from "../../../../../types/dashboard";
import { convertToDate, convertToUTCString } from "src/utils/general";

// Initialize some variables
const chartSeparation = 40;
export const accentColor = "#b7b7a4";
export const background = "#F18D04";

const ContainerMetrics = ({
  primary,
  supporting,
  patternInfo,
  events,
  metricTypes,
  previousDays,
  compact = false,
  width,
  height,
  margin = {
    top: 30,
    left: 100,
    bottom: 50,
    right: 40,
  },
}: {
  primary: ChartData[];
  supporting: ChartData[];
  patternInfo: PatternInfo;
  events: Events;
  metricTypes: MetricType[] | undefined;
  previousDays: string;
  compact?: boolean;
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}) => {
  // const eventRef = useRef();
  const [filteredSupporting, setFilteredSupporting] =
    useState<any[]>(supporting);
  const [filteredPrimary, setFilteredPrimary] = useState<ChartData[]>(primary);

  useEffect(() => {
    setFilteredPrimary(primary);
    setFilteredSupporting(supporting);
  }, [primary, supporting]);

  const metricUom = metricTypes && metricTypes[0].metric_uom;

  const spikeTest = patternInfo && patternInfo.spike_test;
  const levelTest = patternInfo && patternInfo.level_test;
  const outOfMemoryEvent = events.OUT_OF_MEMORY_EVENT;
  const deleteEvent = events.DELETE_EVENT;

  // area accessors
  const keys =
    supporting.length > 0
      ? Object.keys(supporting[0]).filter((k) => k !== "timestamp")
      : ([] as string[]);

  //line accessors
  const getDate = (d: ChartData) => convertToDate(d.timestamp);
  const getMetric = (d: ChartData) => d.metric_value;

  const stackedTotals = supporting.reduce(
    (allTotals: number[], currentDate: ChartData) => {
      const totalStacked = keys.reduce((dailyTotal, k) => {
        dailyTotal += Number(currentDate[k]);
        return dailyTotal;
      }, 0);
      allTotals.push(totalStacked);
      return allTotals;
    },
    [] as number[]
  );

  const innerHeight = height - margin.top - margin.bottom;
  const topChartBottomMargin = compact
    ? chartSeparation / 2
    : chartSeparation + 10;

  // bounds
  const xMax = Math.max(width - margin.left - margin.right, 0);
  const yMax = Math.max(innerHeight, 0);

  // line scales
  const dateScale = useMemo(
    () =>
      scaleTime<number>({
        range: [0, xMax],
        domain: extent(filteredPrimary, getDate) as [Date, Date],
      }),
    [xMax, filteredPrimary]
  );

  const metricScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [innerHeight, 0],
        domain: [
          min(filteredPrimary, getMetric) ||
            0 - (min(filteredPrimary, getMetric) || 0) * 0.6,
          max(filteredPrimary, getMetric) ||
            0 + (max(filteredPrimary, getMetric) || 0) * 0.2,
        ],
        nice: true,
      }),
    [filteredPrimary, innerHeight]
  );

  // area scales
  const stackedDateScale = useMemo(
    () =>
      scaleTime<number>({
        range: [0, xMax],
        domain: extent(filteredSupporting, getDate) as [Date, Date],
      }),
    [xMax, filteredSupporting]
  );

  const stackedScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [innerHeight, 0],
        domain: [0, Math.max(...stackedTotals)],
        nice: true,
      }),
    [stackedTotals, innerHeight]
  );

  const {
    tooltipData,
    tooltipTop,
    tooltipLeft = xMax,
    showTooltip,
    hideTooltip,
  } = useTooltip();

  // tooltip handler
  const handleTooltip = useCallback(
    (
      event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>
    ) => {
      const { x } = localPoint(event) || { x: 0 };
      const currentX = x - margin.left;
      const x0 = Date.parse(String(dateScale.invert(currentX)));

      const d =
        filteredPrimary[filteredPrimary.length - 1].timestamp >= x0 &&
        x0 > filteredPrimary[filteredPrimary.length - 1].timestamp - 10000
          ? filteredPrimary[filteredPrimary.length - 1]
          : filteredPrimary.find((d: ChartData) => d.timestamp === x0);

      if (d) {
        showTooltip({
          tooltipData: d,
          tooltipTop: metricScale(getMetric(d)) + margin.top,
          tooltipLeft: dateScale(getDate(d)) + margin.left,
        });
      }
    },
    [filteredPrimary]
  );

  return (
    <section className="relative grid grid-cols-1">
      <svg width={width} height={height}>
        <Grid
          top={margin.top}
          left={margin.left}
          xScale={dateScale}
          yScale={stackedScale}
          width={xMax}
          height={innerHeight}
          numTicksRows={8}
          stroke="#253D55"
          strokeOpacity={0.5}
        />
        <text
          x="40"
          y="9"
          // transform="rotate(-90)"
          fontSize={10}
          className="dark:text-white"
          stroke="#FFF"
          strokeWidth={0.5}
          fill="#FFF"
        >
          {metricUom?.name} ({metricUom?.short_name})
        </text>
        <Bar
          x={margin.left}
          y={margin.top}
          width={xMax}
          height={innerHeight}
          fill="transparent"
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => hideTooltip()}
        />
        {tooltipData && (
          <g>
            <Line
              from={{ x: tooltipLeft, y: margin.top }}
              to={{ x: tooltipLeft, y: innerHeight + margin.top }}
              stroke={accentColor}
              strokeWidth={0.5}
              pointerEvents="none"
              strokeDasharray="5,2"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={4}
              fill="black"
              fillOpacity={0.1}
              stroke="black"
              strokeOpacity={0.1}
              strokeWidth={2}
              pointerEvents="none"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={4}
              fill="white"
              stroke="white"
              strokeWidth={2}
              pointerEvents="none"
            />
          </g>
        )}
        {levelTest?.map((level: LevelTest, index: number) => {
          const annotateDatum = primary.find(
            (d: ChartData) =>
              d.timestamp ===
              levelTest[levelTest.length - index - 1].window_start
          );

          const windowStart =
            levelTest[levelTest.length - index - 1].window_start;

          const windowEnd = levelTest[levelTest.length - index - 1].window_end;

          if (
            filteredPrimary.length > 0 &&
            filteredPrimary[0].timestamp <
              levelTest[levelTest.length - index - 1].window_start &&
            levelTest[levelTest.length - index - 1].window_end <
              filteredPrimary[filteredPrimary.length - 1].timestamp
          )
            return (
              <Annotation
                key={index}
                x={dateScale(getDate(annotateDatum as ChartData)) + margin.left}
                // y={margin.top}
                y={165}
                dx={-10}
                dy={-15}
              >
                <Line
                  from={{
                    x:
                      dateScale(getDate(annotateDatum as ChartData)) +
                      margin.left,
                    y: 0,
                  }}
                  to={{
                    x:
                      dateScale(getDate(annotateDatum as ChartData)) +
                      margin.left,
                    y: innerHeight + margin.top,
                  }}
                  stroke="#7894B0"
                  strokeWidth={0.5}
                  pointerEvents="none"
                  className="text-green-500"
                />
                <Bar
                  key={level.timestamp}
                  x={dateScale(convertToDate(windowStart)) + margin.left}
                  y={0}
                  width={
                    dateScale(convertToDate(windowEnd)) -
                    dateScale(convertToDate(windowStart))
                  }
                  height={10}
                  fill={
                    levelTest[levelTest.length - index - 1].pattern_value === 1
                      ? "#61AE25"
                      : "#F04163"
                  }
                  opacity={0.7}
                  onTouchStart={handleTooltip}
                  onTouchMove={handleTooltip}
                  onMouseMove={handleTooltip}
                  onMouseLeave={() => hideTooltip()}
                />
                <HtmlLabel
                  anchorLineStroke="transparent"
                  containerStyle={{
                    width: 48,
                    height: -10,
                    color: "white",
                    fontSize: "0.3em",
                    lineHeight: "1em",
                    padding: "0.2rem 1rem",
                    fontWeight: 200,
                    zIndex: 0,
                    overflow: "visible",
                  }}
                >
                  <article className="w-full fixed">
                    <Popover className="relative">
                      {({ open }) => {
                        return (
                          <>
                            <Popover.Button className="group px-3.5 pt-3">
                              <FontAwesomeIcon
                                icon={
                                  levelTest[levelTest.length - index - 1]
                                    .pattern_value === 1
                                    ? faArrowUp
                                    : faArrowDown
                                }
                                className={`hidden w-2 h-3 pointer-events-auto ${
                                  open
                                    ? levelTest[levelTest.length - index - 1]
                                        .pattern_value === 1
                                      ? "dark:text-[#61AE25]"
                                      : "dark:text-[#F04163]"
                                    : "dark:text-checkbox"
                                }`}
                              />
                            </Popover.Button>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="opacity-0 translate-y-1"
                              enterTo="opacity-100 translate-y-0"
                              leave="transition ease-in duration-150"
                              leaveFrom="opacity-100 translate-y-0"
                              leaveTo="opacity-0 translate-y-1"
                            >
                              <Popover.Panel
                                className={`pointer-events-auto absolute w-56 px-4 ${
                                  annotateDatum &&
                                  dateScale(getDate(annotateDatum)) +
                                    width * 0.25 >
                                    width
                                    ? "-ml-52"
                                    : "ml-4"
                                } `}
                              >
                                <article className="relative grid gap-1 -top-20 dark:text-white dark:bg-metric p-3 overflow-hidden">
                                  <header>
                                    <article className="grid gap-3">
                                      <h4 className="text-xs font-medium">
                                        Level Shift
                                      </h4>
                                      <p className="text-[0.65rem] font-medium dark:text-checkbox">
                                        <span className="dark:text-white">
                                          Start:{" "}
                                        </span>
                                        {convertToUTCString(
                                          levelTest[
                                            levelTest.length - index - 1
                                          ].window_start
                                        )}
                                      </p>
                                      <p className="text-[0.65rem] font-medium dark:text-checkbox">
                                        <span className="dark:text-white">
                                          End:{" "}
                                        </span>

                                        {convertToUTCString(
                                          levelTest[
                                            levelTest.length - index - 1
                                          ].window_end
                                        )}
                                      </p>
                                    </article>
                                  </header>
                                </article>
                              </Popover.Panel>
                            </Transition>
                          </>
                        );
                      }}
                    </Popover>
                  </article>
                </HtmlLabel>
              </Annotation>
            );
          return null;
        })}
        {outOfMemoryEvent?.map((outMemory: Event, index: number) => {
          const annotateDatum = primary.find(
            (d: ChartData) =>
              d.timestamp ===
              outOfMemoryEvent[outOfMemoryEvent.length - index - 1].event_time
          );

          if (
            filteredPrimary.length > 0 &&
            filteredPrimary[0].timestamp <
              (annotateDatum as ChartData).timestamp &&
            (annotateDatum as ChartData).timestamp <
              filteredPrimary[filteredPrimary.length - 1].timestamp
          ) {
            return (
              <Annotation
                key={index}
                x={dateScale(outMemory.event_time) + margin.left}
                y={max(filteredPrimary, getMetric)}
                dx={-10}
                dy={-15}
              >
                <Line
                  from={{
                    x: dateScale(outMemory.event_time) + margin.left,
                    y: margin.top,
                  }}
                  to={{
                    x: dateScale(outMemory.event_time) + margin.left,
                    y: innerHeight + margin.top,
                  }}
                  stroke="#F04163"
                  strokeWidth={3}
                  pointerEvents="none"
                  strokeDasharray="5,2"
                />
                <HtmlLabel
                  anchorLineStroke="transparent"
                  containerStyle={{
                    width: 48,
                    height: -10,
                    color: "white",
                    fontSize: "0.3em",
                    lineHeight: "1em",
                    padding: "0.2rem 1rem",
                    fontWeight: 200,
                    zIndex: 9999,
                    overflow: "visible",
                  }}
                >
                  <article className="w-full fixed z-10">
                    <Popover className="relative">
                      <Popover.Button className="group px-3 py-2 mt-3">
                        <FontAwesomeIcon
                          icon={faBan}
                          className="w-3 h-3 text-[#F04163]"
                        />
                      </Popover.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel
                          className={`pointer-events-auto absolute z-50 w-48 px-4 -mt-8 ${
                            dateScale(outMemory.event_time) + width * 0.25 >
                            width
                              ? "-ml-44"
                              : "ml-8"
                          } `}
                        >
                          <article className="relative grid gap-1 z-50 dark:text-white dark:bg-tooltip p-3 overflow-hidden">
                            <h4 className="text-sm font-medium">
                              {outMemory.context.logs}
                            </h4>
                          </article>
                        </Popover.Panel>
                      </Transition>
                    </Popover>
                  </article>
                </HtmlLabel>
              </Annotation>
            );
          }
          return null;
        })}
        {deleteEvent?.map((event: Event, index: number) => {
          const annotateDatum = primary.find(
            (d: ChartData) =>
              d.timestamp ===
              deleteEvent[deleteEvent.length - index - 1].event_time
          );

          if (
            filteredPrimary.length > 0 &&
            filteredPrimary[0].timestamp <
              (annotateDatum as ChartData).timestamp &&
            (annotateDatum as ChartData).timestamp <
              filteredPrimary[filteredPrimary.length - 1].timestamp
          ) {
            return (
              <Annotation
                key={index}
                x={dateScale(event.event_time) + margin.left}
                y={max(filteredPrimary, getMetric)}
                dx={-10}
                dy={-15}
              >
                <Line
                  from={{
                    x:
                      dateScale(getDate(annotateDatum as ChartData)) +
                      margin.left,
                    y: margin.top,
                  }}
                  to={{
                    x:
                      dateScale(getDate(annotateDatum as ChartData)) +
                      margin.left,
                    y: innerHeight + margin.top,
                  }}
                  stroke="#7894B0"
                  strokeWidth={0.5}
                  pointerEvents="none"
                  className="text-green-500"
                />
                <HtmlLabel
                  anchorLineStroke="transparent"
                  containerStyle={{
                    width: 48,
                    height: -10,
                    color: "white",
                    fontSize: "0.3em",
                    lineHeight: "1em",
                    padding: "0.2rem 1rem",
                    fontWeight: 200,
                    zIndex: 9999,
                    overflow: "visible",
                  }}
                >
                  <article className="w-full fixed z-10">
                    <Popover className="relative">
                      <Popover.Button className="group px-3 py-2 mt-3">
                        <FontAwesomeIcon
                          icon={faDeleteLeft}
                          className="w-3 h-3 text-reset"
                        />
                      </Popover.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel
                          className={`pointer-events-auto absolute z-50 w-48 px-4 -mt-8 ${
                            dateScale(event.event_time) + width * 0.25 > width
                              ? "-ml-44"
                              : "ml-8"
                          } `}
                        >
                          <article className="relative grid gap-1 z-50 dark:text-white dark:bg-tooltip p-3 overflow-hidden">
                            <h4 className="text-sm font-medium">
                              {event.context.logs}
                            </h4>
                          </article>
                        </Popover.Panel>
                      </Transition>
                    </Popover>
                  </article>
                </HtmlLabel>
              </Annotation>
            );
          }
          return null;
        })}
        {spikeTest?.map((spike: SpikeTest, index: number) => {
          const annotateDatum = primary.find(
            (d: ChartData) =>
              d.timestamp === spikeTest[spikeTest.length - index - 1].timestamp
          );

          if (
            filteredPrimary.length > 0 &&
            filteredPrimary[0].timestamp <
              (annotateDatum as ChartData).timestamp &&
            (annotateDatum as ChartData).timestamp <
              filteredPrimary[filteredPrimary.length - 1].timestamp
          )
            return (
              <Annotation
                key={index}
                x={dateScale(getDate(annotateDatum as ChartData)) + margin.left}
                y={10}
                dx={-10}
                dy={-15}
              >
                <Line
                  from={{
                    x:
                      dateScale(getDate(annotateDatum as ChartData)) +
                      margin.left,
                    y: margin.top,
                  }}
                  to={{
                    x:
                      dateScale(getDate(annotateDatum as ChartData)) +
                      margin.left,
                    y: innerHeight + margin.top,
                  }}
                  stroke="#FCEE21"
                  strokeWidth={0.5}
                  pointerEvents="none"
                  className="text-green-500"
                />
                <HtmlLabel
                  anchorLineStroke="transparent"
                  containerStyle={{
                    width: 48,
                    height: -10,
                    color: "white",
                    fontSize: "0.3em",
                    lineHeight: "1em",
                    padding: "0.2rem 1rem",
                    fontWeight: 200,
                    zIndex: 0,
                    overflow: "visible",
                  }}
                >
                  <article className="w-full fixed">
                    <Popover className="relative">
                      {({ open }) => {
                        return (
                          <>
                            <Popover.Button className="group px-3 py-2 mt-3">
                              <img
                                src="/dashboard/expanded/cont/spike.svg"
                                alt="spike"
                                className={`w-3 h-3 pointer-events-none ${
                                  open
                                    ? spikeTest[spikeTest.length - index - 1]
                                        .pattern_value === 1
                                      ? "dark:text-[#61AE25]"
                                      : "dark:text-[#F04163]"
                                    : "dark:text-[#FCEE21]"
                                }`}
                              />
                            </Popover.Button>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="opacity-0 translate-y-1"
                              enterTo="opacity-100 translate-y-0"
                              leave="transition ease-in duration-150"
                              leaveFrom="opacity-100 translate-y-0"
                              leaveTo="opacity-0 translate-y-1"
                            >
                              <Popover.Panel
                                className={`pointer-events-auto absolute w-56 px-4 ${
                                  annotateDatum &&
                                  dateScale(getDate(annotateDatum)) +
                                    width * 0.25 >
                                    width
                                    ? "-ml-52"
                                    : "ml-4"
                                } `}
                              >
                                <article className="relative grid gap-1 -top-20 dark:text-white dark:bg-metric p-3 overflow-hidden">
                                  <header>
                                    <article className="grid gap-2">
                                      <h4 className="text-xs font-medium">
                                        {spikeTest[spikeTest.length - index - 1]
                                          .pattern_value === 1
                                          ? "Spike Up"
                                          : "Spike Down"}
                                      </h4>
                                      <p className="text-[0.65rem] font-medium dark:text-checkbox">
                                        {convertToUTCString(
                                          spikeTest[
                                            spikeTest.length - index - 1
                                          ].timestamp
                                        )}
                                      </p>
                                    </article>
                                  </header>
                                </article>
                              </Popover.Panel>
                            </Transition>
                          </>
                        );
                      }}
                    </Popover>
                  </article>
                </HtmlLabel>
              </Annotation>
            );
          return null;
        })}
        {supporting.length > 0 && (
          <Supporting
            hideBottomAxis
            hideLeftAxis
            supporting={filteredSupporting}
            width={width}
            height={innerHeight}
            margin={{ ...margin, bottom: topChartBottomMargin }}
            xScale={stackedDateScale}
            yScale={stackedScale}
            previousDays={previousDays}
          />
        )}
        <Primary
          width={width}
          yMax={yMax}
          filteredPrimary={filteredPrimary}
          margin={{ ...margin, bottom: topChartBottomMargin }}
          xScale={dateScale}
          yScale={metricScale}
        />
      </svg>
      {tooltipData && (
        <article className="absolute w-full">
          <TooltipWithBounds
            key={Math.random()}
            top={metricScale(getMetric(tooltipData))}
            left={tooltipLeft}
            style={{
              ...defaultStyles,
              background: "#495867",
              fontSize: "0.8rem",
            }}
          >
            <p className="py-1 dark:text-white">
              {getMetric(tooltipData)} {metricUom?.short_name}
            </p>
          </TooltipWithBounds>
        </article>
      )}
    </section>
  );
};

export default ContainerMetrics;
