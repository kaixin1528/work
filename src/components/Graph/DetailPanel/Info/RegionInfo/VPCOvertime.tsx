/* eslint-disable no-restricted-globals */
import { useState } from "react";
import MultiLineChart from "src/components/Chart/MultiLineChart";
import { GetRegionCounts } from "src/services/dashboard/region";
import { useGeneralStore } from "src/stores/general";
import { Filter } from "src/types/general";
import {
  parseURL,
  sortNumericData,
  calcTimeFromSnapshot,
} from "src/utils/general";

const times = [
  {
    name: "1d",
    value: 8.64e7,
  },
  {
    name: "7d",
    value: 604800000,
  },
];

const VPCOvertime = ({
  elementID,
  resourcesFilter,
  setResourcesFilter,
}: {
  elementID: string;
  resourcesFilter: Filter[];
  setResourcesFilter: (resourcesFilter: Filter[]) => void;
}) => {
  const parsed = parseURL();

  const { env } = useGeneralStore();

  const [previousDays, setPreviousDays] = useState<string>("1d");
  const [sectionProps, setSectionProps] = useState({});

  const { data: regionCounts } = GetRegionCounts(
    env,
    parsed.integration,
    elementID,
    resourcesFilter
  );

  const sortedRegionCounts = sortNumericData(
    regionCounts?.resource_counts_over_time,
    "timestamp",
    "asc"
  );

  return (
    <section
      data-test="resource-counts-over-time"
      className="grid gap-2 mt-3 text-xs"
    >
      <nav className="flex text-xs mx-auto dark:text-white dark:bg-filter w-max">
        {times.map((time: { name: string; value: number }) => {
          return (
            <button
              key={time.name}
              className={`px-4 py-1 font-semibold  ${
                previousDays === time.name
                  ? "bg-gradient-to-b dark:from-main dark:to-checkbox dark:text-white"
                  : "dark:text-expand dark:hover:text-white dark:bg-filter hover:bg-gradient-to-b dark:hover:from-filter dark:hover:to-checkbox duration-500"
              }`}
              onClick={() => {
                setPreviousDays(time.name);
                setResourcesFilter([
                  {
                    field: "timestamp",
                    op: "ge",
                    value: calcTimeFromSnapshot(time.value),
                    type: "integer",
                    set_op: "and",
                  },
                ]);
              }}
            >
              {time.name}
            </button>
          );
        })}
      </nav>
      {sortedRegionCounts?.length > 0 && (
        <MultiLineChart
          data={sortedRegionCounts}
          xKey="timestamp"
          yLabel="Count"
          sectionProps={sectionProps}
          setSectionProps={setSectionProps}
        />
      )}
    </section>
  );
};

export default VPCOvertime;
