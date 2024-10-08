import { useState } from "react";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import { convertToDate, parseURL } from "src/utils/general";
import { heatmapColors } from "src/constants/summaries";
import { utcFormat } from "d3-time-format";

export const data = [
  {
    timestamp: 1676682518,
    group_1: 150,
    group_2: 150,
    group_3: 150,
    group_4: 150,
    group_5: 150,
    group_6: 150,
  },
  {
    timestamp: 1676682518,
    group_1: 150,
    group_2: 150,
    group_3: 150,
    group_4: 150,
    group_5: 150,
    group_6: 150,
  },
  {
    timestamp: 1676682518,
    group_1: 150,
    group_2: 150,
    group_3: 150,
    group_4: 150,
    group_5: 150,
    group_6: 150,
  },
  {
    timestamp: 1676682518,
    group_1: 250,
    group_2: 50,
    group_3: 150,
    group_4: 150,
    group_5: 100,
    group_6: 100,
  },
  {
    timestamp: 1676682518,
    group_1: 150,
    group_2: 150,
    group_3: 150,
    group_4: 150,
    group_5: 150,
    group_6: 150,
  },
  {
    timestamp: 1676682518,
    group_1: 150,
    group_2: 150,
    group_3: 150,
    group_4: 150,
    group_5: 150,
    group_6: 150,
  },
  {
    timestamp: 1676682518,
    group_1: 150,
    group_2: 150,
    group_3: 100,
    group_4: 200,
    group_5: 300,
    group_6: 300,
  },
];

const ResourceActivity = ({
  setSelectedResourceActivity,
}: {
  setSelectedResourceActivity: (selectedResourceActivity: string) => void;
}) => {
  const navigate = useNavigate();
  const parsed = parseURL();

  const [filter, setFilter] = useState<string>("all");

  const keys =
    data?.length > 0
      ? Object.keys(data[0]).filter((k) => k !== "timestamp")
      : [];

  const overallMax = data.reduce((allDays, currentDay) => {
    const dayMax = keys.reduce((dailyMax, k) => {
      return currentDay[k] > dailyMax ? currentDay[k] : dailyMax;
    }, 0) as number;
    return (dayMax > allDays ? dayMax : allDays) as number;
  }, 0);

  return (
    <section className="grid gap-5 p-6 w-full dark:bg-panel">
      <header className="flex items-center justify-between gap-10">
        <h4>Resource Activity</h4>
        <ul className="flex items-center gap-5 text-xs">
          {["all", "read", "created", "updated", "deleted"].map((status) => {
            return (
              <li key={status} className="flex items-center gap-2 capitalize">
                <input
                  type="checkbox"
                  checked={filter === status}
                  className="form-checkbox w-4 h-4 border-0 dark:focus:ring-0 dark:text-signin dark:focus:border-signin focus:ring dark:focus:ring-offset-0 dark:focus:ring-checkbox focus:ring-opacity-50"
                  onChange={() => setFilter(status)}
                />
                <h4>{status}</h4>
              </li>
            );
          })}
        </ul>
      </header>
      {data ? (
        data?.length > 0 ? (
          <section className="flex items-start w-full h-full text-sm">
            <ul className="grid">
              {keys.map((key: string) => {
                return (
                  <li
                    key={key}
                    className="py-[1.31rem] pr-[1.3rem] text-center w-max text-ellipsis"
                  >
                    {key}
                  </li>
                );
              })}
            </ul>
            {data?.map((day) => {
              return (
                <article key={day.timestamp} className="grid w-full h-full">
                  <ul className="grid">
                    {keys.map((key: string) => {
                      const pct = Math.floor(
                        Number((day[key] / overallMax).toFixed(1)) * 100
                      );

                      return (
                        <li
                          key={`${key}-${day.timestamp}`}
                          className={`p-5 text-center cursor-pointer ${heatmapColors[pct]} dark:hover:bg-signin/30 duration-100 border-1 dark:border-checkbox rounded-sm`}
                          onClick={() => {
                            navigate(
                              `/summaries/details?${queryString.stringify(
                                parsed
                              )}&resource_activity=${key}-${day.timestamp}`
                            );
                            setSelectedResourceActivity(
                              `${key}-${day.timestamp}`
                            );
                          }}
                        >
                          {day[key]}
                        </li>
                      );
                    })}
                    <li className="pt-2 text-center">
                      {utcFormat("%b %d")(convertToDate(day.timestamp))}
                    </li>
                  </ul>
                </article>
              );
            })}
          </section>
        ) : (
          <p className="text-sm">No data available</p>
        )
      ) : null}
    </section>
  );
};

export default ResourceActivity;
