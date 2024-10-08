import { utcFormat } from "d3-time-format";
import { ResponsiveContainer, BarChart, XAxis, Tooltip, Bar } from "recharts";
import { CategoricalChartState } from "recharts/types/chart/generateCategoricalChart";
import { KeyNumVal, KeyStringVal } from "src/types/general";
import { convertToDate, convertToUTCShortString } from "src/utils/general";

const colors = ["#00AC46", "#D0D104", "#FF3131"];

const Summary = ({
  policyDrift,
  setSelectedChange,
}: {
  policyDrift: any;
  setSelectedChange: (selectedChange: KeyStringVal) => void;
}) => {
  const CustomTooltip = ({ active, payload, data }: any) => {
    if (active && payload && payload.length) {
      const filteredData = data?.find(
        (diff: KeyNumVal) =>
          payload[0].payload.source_upload_time === diff.target_upload_time
      );
      if (!filteredData) return null;
      return (
        <article className="grid px-4 py-2 gap-3 -mt-20 text-xs dark:bg-filter">
          <h4>
            {convertToUTCShortString(filteredData?.source_upload_time)} -{" "}
            {convertToUTCShortString(payload[0].payload.source_upload_time)}
          </h4>
          <span>
            v{filteredData?.source_version} - v
            {payload[0].payload.source_version}
          </span>
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
      const payload = data.activePayload[0].payload;
      setSelectedChange({
        source_version: payload.source_version,
        source_version_id: payload.source_version_id,
        target_version_id: payload.target_version_id,
        target_version: payload.target_version,
      });
    }
  };

  return (
    <section className="grid grid-cols-1 h-[5rem]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={policyDrift}
          style={{ cursor: "pointer" }}
          onClick={(data) => handleOnClick(data)}
        >
          <XAxis
            dataKey="source_upload_time"
            domain={["dataMin", "dataMax"]}
            tickLine={{ stroke: "white" }}
            tick={{ stroke: "white" }}
            tickFormatter={(v) => {
              const version = policyDrift?.find(
                (drift: KeyNumVal) => drift.source_upload_time === v
              )?.source_version;
              return `${utcFormat("%b %d %Y")(convertToDate(v))} (v${version})`;
            }}
            tickMargin={10}
            interval="preserveStartEnd"
            style={{
              fontSize: "0.65rem",
            }}
          />
          <Tooltip
            cursor={{ fill: "#23394F", fillOpacity: 0.4 }}
            content={<CustomTooltip data={policyDrift} />}
          />
          <Bar dataKey="added" stackId="a" fill="#00AC46" />
          <Bar dataKey="modified" stackId="a" fill="#D0D104" />
          <Bar dataKey="removed" stackId="a" fill="#FF3131" />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
};

export default Summary;
