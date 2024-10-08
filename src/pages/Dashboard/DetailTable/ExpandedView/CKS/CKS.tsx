/* eslint-disable no-restricted-globals */
import { utcFormat } from "d3-time-format";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Label,
  AreaChart,
  Area,
} from "recharts";
import { chartLegendColors } from "../../../../../constants/general";
import ExpandedViewLayout from "../../../../../layouts/ExpandedViewLayout";
import {
  convertToDate,
  convertToUTCString,
  parseURL,
  sortNumericData,
} from "../../../../../utils/general";
import { KeyNumVal } from "src/types/general";
import { useGeneralStore } from "src/stores/general";
import CustomLegend from "src/components/Chart/CustomLegend";
import { GetEKSResources } from "src/services/dashboard/infra";

const CKS = ({ selectedNodeID }: { selectedNodeID: string }) => {
  const parsed = parseURL();

  const { env } = useGeneralStore();

  const { data: resources, status: resourcesStatus } = GetEKSResources(
    env,
    parsed.integration,
    selectedNodeID
  );

  const sortedResourcesTotal = sortNumericData(
    resources?.resources_total,
    "timestamp",
    "asc"
  );

  const sortedResourcesUsage = sortNumericData(
    resources?.resources_usage,
    "timestamp",
    "asc"
  );

  const data = sortedResourcesUsage?.map((usage: KeyNumVal) => {
    const curTotal = sortedResourcesTotal.find(
      (total: KeyNumVal) => total.timestamp === usage.timestamp
    );
    return {
      ...usage,
      cont: (usage.cont / curTotal.cont) * 100,
      ccs: (usage.ccs / curTotal.ccs) * 100,
      cns: (usage.cns / curTotal.cns) * 100,
      wkld: (usage.wkld / curTotal.wkld) * 100,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (resources && active && payload && payload.length) {
      return (
        <article className="grid p-4 gap-2 text-xs dark:bg-filter">
          <h4>{convertToUTCString(label)}</h4>
          <ul className="grid">
            {payload.map((nodeType: any, index: number) => {
              return (
                <li key={index} className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 ${chartLegendColors[index % 20]}`}
                  ></span>
                  <span className="uppercase">{`${payload[index].name}: `}</span>
                  {`${nodeType.value ? nodeType.value.toFixed(1) : "0"}% - (${
                    sortedResourcesUsage?.find(
                      (obj: { timestamp: number }) => obj.timestamp === label
                    )[nodeType.name]
                  } used/${
                    sortedResourcesTotal?.find(
                      (obj: { timestamp: number }) => obj.timestamp === label
                    )[nodeType.name]
                  } total)`}
                </li>
              );
            })}
          </ul>
        </article>
      );
    }

    return null;
  };

  return (
    <ExpandedViewLayout selectedNodeID={selectedNodeID}>
      {resourcesStatus === "success" && (!data || data?.length === 0) && (
        <p className="dark:text-white mx-auto">No data available</p>
      )}
      {data?.length > 0 && (
        <article className="w-full h-[10rem]">
          <ResponsiveContainer width="95%" height="100%">
            <AreaChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis
                dataKey="timestamp"
                ticks={[
                  data[0].timestamp,
                  data[Math.floor(data.length / 2)].timestamp,
                  data[data.length - 1].timestamp,
                ]}
                tickFormatter={(v) => utcFormat("%b %d")(convertToDate(v))}
                tick={{ fill: "white" }}
                tickLine={{ stroke: "white" }}
                style={{
                  fontSize: "0.65rem",
                }}
              />
              <YAxis
                type="number"
                tickCount={3}
                domain={[0, 100]}
                tick={{ fill: "white" }}
                tickLine={{ stroke: "white" }}
                style={{
                  fontSize: "0.65rem",
                }}
              >
                <Label
                  style={{
                    textAnchor: "middle",
                    fontSize: "0.65rem",
                    fill: "white",
                  }}
                  angle={0}
                  value="Resources Used (%)"
                  dx={20}
                  dy={-60}
                />
              </YAxis>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                content={<CustomLegend />}
                verticalAlign="top"
                height={55}
              />
              <Area
                type="linear"
                dataKey="cont"
                stackId="1"
                fillOpacity={1}
                stroke="#61AE25"
                fill="#61AE25"
              />
              <Area
                type="linear"
                dataKey="ccs"
                stackId="1"
                stroke="#D0D104"
                fill="#D0D104"
              />
              <Area
                type="linear"
                dataKey="cns"
                stackId="1"
                stroke="#25A1CB"
                fill="#25A1CB"
              />
              <Area
                type="linear"
                dataKey="wkld"
                stackId="1"
                stroke="#F18D04"
                fill="#F18D04"
              />
            </AreaChart>
          </ResponsiveContainer>
        </article>
      )}
    </ExpandedViewLayout>
  );
};

export default CKS;
