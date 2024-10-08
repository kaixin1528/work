/* eslint-disable no-restricted-globals */
import { useGeneralStore } from "src/stores/general";
import { useGraphStore } from "../../stores/graph";
import { getCustomerCloud } from "../../utils/general";
import { defaultDepth, initialDiffFilter } from "src/constants/graph";

const ViewTabs = () => {
  const customerCloud = getCustomerCloud();

  const { setError } = useGeneralStore();
  const {
    setGraphInfo,
    setGraphNav,
    setGraphSearchString,
    setDiffView,
    setDiffStartTime,
    setGraphSearch,
    setGraphSearching,
    navigationView,
    setNavigationView,
    setDiffFilter,
    setSnapshotTime,
    setCurSearchSnapshot,
    setTemporalSearchTimestamps,
    setSelectedTemporalDay,
    setSelectedTemporalTimestamp,
    setTemporalStartDate,
    setTemporalEndDate,
  } = useGraphStore();

  const navigation = (view: string) => {
    setNavigationView(view);
    setGraphInfo({
      root: customerCloud,
      depth: defaultDepth,
      showOnlyAgg: true,
      showPanel: false,
    });
    setGraphNav([
      {
        nodeID: customerCloud,
        nodeType: "Organization Cloud",
      },
    ]);
    setDiffView("month");
    setDiffStartTime({ month: 0 });
    setDiffFilter(initialDiffFilter);
    setTemporalSearchTimestamps({});
    setSelectedTemporalDay("");
    setSelectedTemporalTimestamp(-1);
    setTemporalStartDate(new Date());
    setTemporalEndDate(new Date());
    setGraphSearch(false);
    setGraphSearching(false);
    setGraphSearchString("");
    setSnapshotTime(new Date());
    setCurSearchSnapshot(null);
    setError({ url: "", message: "" });
  };

  return (
    <header className="hidden md:flex items-center gap-4 text-sm">
      {["snapshots", "evolution", "temporal"].map((curNavigationView) => {
        return (
          <button
            key={curNavigationView}
            className="flex items-center gap-2 w-max"
            onClick={() => navigation(curNavigationView)}
          >
            <img
              src={`/graph/navigation/${curNavigationView}.svg`}
              alt={curNavigationView}
              className={`w-5 h-5 ${
                navigationView === curNavigationView ? "clicked" : "regular"
              }`}
            />
            <p
              className={`hidden lg:block capitalize ${
                navigationView === curNavigationView
                  ? "dark:text-signin"
                  : "dark:text-checkbox"
              }`}
            >
              {curNavigationView !== "temporal"
                ? curNavigationView
                : "Search Across Time"}
            </p>
          </button>
        );
      })}
    </header>
  );
};

export default ViewTabs;
