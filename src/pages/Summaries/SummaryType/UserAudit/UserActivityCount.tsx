import { faFlag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover, Transition } from "@headlessui/react";
import { utcFormat } from "d3-time-format";
import { Fragment } from "react";
import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CustomTooltip from "src/components/Chart/Tooltip/CustomTooltip";
import { chartDataColors } from "src/constants/general";
import { GetUserActivityCounts } from "src/services/summaries/user-audit";
import { convertToDate } from "src/utils/general";

const CustomizedLabel = ({ props, d }: any) => {
  const { x, y } = props.viewBox;

  return (
    <g>
      <foreignObject
        x={x - 300}
        y={y}
        width={1000}
        height={100}
        style={{ border: "none" }}
      >
        <Popover className="relative text-xs z-50 border-none">
          <Popover.Button>
            <FontAwesomeIcon
              icon={faFlag}
              className="w-3 h-3 mt-2 ml-[18.5rem] dark:text-note"
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
            <Popover.Panel className="absolute px-4 grid w-72 h-60 z-50">
              <article className="absolute -top-5 left-40 dark:text-white dark:bg-tooltip border-1 dark:border-checkbox p-3 overflow-auto scrollbar rounded-sm">
                Unusual Activity Count : {d.unusual_activity_count}
              </article>
            </Popover.Panel>
          </Transition>
        </Popover>
      </foreignObject>
    </g>
  );
};

const UserActivityCount = ({ selectedUser }: { selectedUser: string }) => {
  const { data: userActivityAcounts } = GetUserActivityCounts(selectedUser);

  return (
    <section className="grid grid-cols-1 content-start gap-5 p-6 h-full">
      <h4>User: {selectedUser}</h4>
      {userActivityAcounts ? (
        userActivityAcounts.data.length > 0 ? (
          <article className="h-[13rem]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={userActivityAcounts?.data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis
                  type="number"
                  dataKey="timestamp"
                  domain={["dataMin", "dataMax"]}
                  tickFormatter={(v) => utcFormat("%m/%d")(convertToDate(v))}
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
                  wrapperStyle={{ margin: "5rem" }}
                  content={<CustomTooltip />}
                />
                {["activity_count"].map((key: string, index: number) => {
                  return (
                    <Line
                      key={key}
                      type="linear"
                      dataKey={key}
                      stroke={chartDataColors[index % 20]}
                      dot={false}
                    />
                  );
                })}
                {userActivityAcounts?.data?.map((d: any) => {
                  if (d.unusual_activity_count === 0) return null;
                  return (
                    <ReferenceLine
                      key={d.timestamp}
                      x={d.timestamp}
                      stroke="red"
                      label={(props) => <CustomizedLabel props={props} d={d} />}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </article>
        ) : (
          <p className="text-sm">No data available</p>
        )
      ) : null}
    </section>
  );
};

export default UserActivityCount;
