import { utcFormat } from "d3-time-format";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";
import { CategoricalChartState } from "recharts/types/chart/generateCategoricalChart";
import { useGraphStore } from "src/stores/graph";
import { convertToDate, convertToUTCString } from "src/utils/general";

const colors = ["#00AC46", "#FFFDD0", "#FF3131"];

const DiffSummary = ({ diffSummary }: { diffSummary: any }) => {
  const {
    graphInfo,
    setGraphInfo,
    diffView,
    setDiffView,
    diffStartTime,
    setDiffStartTime,
    setSelectedNode,
    setSelectedEdge,
  } = useGraphStore();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <article className="grid px-4 py-2 -mt-5 ml-5 gap-3 text-xs dark:bg-filter z-0">
          <h4>{convertToUTCString(payload[0].payload.start_time)}</h4>
          <ul className="flex flex-col-reverse gap-2">
            {payload.map((entry: any, index: number) => {
              return (
                <li
                  key={index}
                  style={{
                    color: colors[index],
                  }}
                >
                  {entry.value} {entry.dataKey}
                </li>
              );
            })}
          </ul>
        </article>
      );
    }

    return null;
  };

  const handleOnClick = (data: CategoricalChartState) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const startTime = data.activePayload[0].payload.start_time;
      switch (diffView) {
        case "month":
          setDiffView("day");
          setDiffStartTime({
            ...diffStartTime,
            day: startTime,
          });
          break;
        case "day":
          setDiffView("hour");
          setDiffStartTime({
            ...diffStartTime,
            hour: startTime,
          });
          break;
        case "hour":
          setDiffView("snapshot");
          setDiffStartTime({
            ...diffStartTime,
            snapshot: startTime,
          });
          break;
        case "snapshot":
          setDiffStartTime({
            ...diffStartTime,
            snapshot: startTime,
          });
          break;
      }
      setSelectedNode(undefined);
      setSelectedEdge(undefined);
      setGraphInfo({ ...graphInfo, showPanel: false });
      sessionStorage.evolutionTree = [];
    }
  };

  return (
    <section className="grid grid-cols-1 h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={diffSummary}
          style={{ cursor: "pointer" }}
          onClick={(data) => handleOnClick(data)}
        >
          <XAxis
            dataKey="start_time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(v) =>
              diffView === "month"
                ? utcFormat("%b %Y")(convertToDate(v))
                : diffView === "day"
                ? utcFormat("%b %d")(convertToDate(v))
                : `${utcFormat("%H:%M")(convertToDate(v))}`
            }
            tick={{ fill: "white" }}
            tickLine={{ stroke: "white" }}
            tickMargin={10}
            interval="preserveStartEnd"
            style={{
              fontSize: "0.65rem",
            }}
          />
          <YAxis
            tick={{ fill: "white" }}
            tickLine={{ stroke: "white" }}
            tickMargin={10}
            style={{
              fontSize: "0.65rem",
            }}
          />
          <Tooltip
            cursor={{ fill: "#23394F", fillOpacity: 0.4 }}
            content={<CustomTooltip />}
          />
          <Bar dataKey="created" stackId="a" fill="#00AC46" />
          <Bar dataKey="modified" stackId="a" fill="#FFFDD0" />
          <Bar dataKey="removed" stackId="a" fill="#FF3131" />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
};

export default DiffSummary;
