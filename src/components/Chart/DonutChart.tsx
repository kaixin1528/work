import React, { useState } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from "recharts";
import { chartDataColors, severityChartColors } from "src/constants/general";
import { KeyStringVal } from "src/types/general";

const renderActiveShape = (props: any, xKey: string) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
  } = props;

  return (
    <g>
      {payload[xKey].split("_").length > 1 ? (
        <>
          <text x={cx} y={cy} dy={-10} textAnchor="middle" fill="#FFF">
            {payload[xKey].split("_")[0]}
          </text>
          <text x={cx} y={cy} dy={5} textAnchor="middle" fill="#FFF">
            {payload[xKey].split("_")[1]}
          </text>
        </>
      ) : payload[xKey].split(" ").length > 1 ? (
        <>
          <text x={cx} y={cy} dy={-10} textAnchor="middle" fill="#FFF">
            {payload[xKey].split(" ")[0]}
          </text>
          <text x={cx} y={cy} dy={5} textAnchor="middle" fill="#FFF">
            {payload[xKey].split(" ")[1]}
          </text>
        </>
      ) : (
        <text x={cx} y={cy} dy={0} textAnchor="middle" fill="#FFF">
          {payload[xKey]}
        </text>
      )}
      <text x={cx} y={cy} dy={30} textAnchor="middle" fill="#FFF">
        {`${(percent * 100).toFixed(2)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

const DonutChart = ({
  data,
  title,
  xKey,
}: {
  data: any;
  title?: string;
  xKey: string;
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <section className="h-[10rem]">
      {data && (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={(props) => renderActiveShape(props, xKey)}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={60}
              fill={
                xKey === "severity"
                  ? severityChartColors[activeIndex]
                  : [Object.keys(chartDataColors).length - 1 - activeIndex]
              }
              dataKey="count"
              onMouseEnter={onPieEnter}
            >
              {data.map((entry: KeyStringVal, index: number) => {
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      xKey === "severity"
                        ? severityChartColors[entry[xKey].toLowerCase()]
                        : chartDataColors[
                            Object.keys(chartDataColors).length - 1 - index
                          ]
                    }
                  />
                );
              })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      )}
      <h4 className="text-center text-base font-medium">{title}</h4>
    </section>
  );
};

export default DonutChart;
