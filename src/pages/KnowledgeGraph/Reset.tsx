import React from "react";
import { defaultDepth, initialDiffFilter, orgCloud } from "src/constants/graph";
import { useGeneralStore } from "src/stores/general";
import { useGraphStore } from "src/stores/graph";
import { getCustomerCloud } from "src/utils/general";

const Reset = ({
  setSelectedReturnType,
}: {
  setSelectedReturnType?: (selectedReturnType: string) => void;
}) => {
  const customerCloud = getCustomerCloud();

  const { setError } = useGeneralStore();
  const {
    setGraphInfo,
    setGraphNav,
    setGraphSearchString,
    setDiffIntegrationType,
    setDiffView,
    setDiffFilter,
    setDiffStartTime,
    setGraphSearch,
    setGraphSearching,
    navigationView,
    setSnapshotTime,
    setSnapshotIndex,
    setCurSearchSnapshot,
    setTemporalSearchTimestamps,
    setSelectedTemporalDay,
    setSelectedTemporalTimestamp,
    setTemporalStartDate,
    setTemporalEndDate,
  } = useGraphStore();

  return (
    <button
      data-test="reset-graph"
      className="group relative px-4 py-2 text-xs red-button border dark:border-reset dark:hover:border-reset/70 duration-100 rounded-sm"
      onClick={() => {
        setGraphSearch(false);
        setGraphSearching(false);
        setGraphSearchString("");
        setCurSearchSnapshot(null);
        setError({ url: "", message: "" });
        if (setSelectedReturnType) setSelectedReturnType("");

        switch (navigationView) {
          case "snapshots":
            setSnapshotIndex(-1);
            setSnapshotTime(new Date());
            setGraphInfo({
              root: customerCloud,
              depth: defaultDepth,
              showOnlyAgg: true,
              showPanel: false,
            });
            setGraphNav([
              {
                nodeID: customerCloud,
                nodeType: orgCloud,
              },
            ]);
            break;
          case "evolution":
            setDiffIntegrationType("ALL");
            setDiffView("month");
            setDiffStartTime({ month: 0 });
            setDiffFilter(initialDiffFilter);
            break;
          case "temporal":
            setTemporalStartDate(new Date());
            setTemporalEndDate(new Date());
            setTemporalSearchTimestamps({});
            setSelectedTemporalDay("");
            setSelectedTemporalTimestamp(-1);
            break;
        }
      }}
    >
      <p className="w-max">Reset</p>
      <span className="hidden group-hover:block absolute top-10 right-0 p-2 w-max text-xs dark:text-white dark:bg-filter black-shadow rounded-sm z-20">
        Reset{" "}
        {navigationView === "evolution" ? "to monthly view" : "graph and query"}
      </span>
    </button>
  );
};

export default Reset;
