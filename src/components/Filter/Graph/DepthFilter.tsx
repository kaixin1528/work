/* eslint-disable no-restricted-globals */
import { useGraphStore } from "src/stores/graph";

const DepthFilter = () => {
  const { graphSearch, setGraphSearching, graphInfo, setGraphInfo } =
    useGraphStore();

  return (
    <section className="flex items-center gap-3 text-xs dark:text-white">
      <h4>Depth</h4>
      <article className="flex items-center gap-2 dark:text-white">
        <button
          disabled={graphSearch || graphInfo.depth < 1}
          className="px-1 dark:disabled:text-filter dark:bg-signin/30 dark:disabled:bg-filter/30 dark:disabled:border-filter border dark:border-signin dark:hover:border-signin/60 duration-100 rounded-sm"
          onClick={() => {
            setGraphSearching(false);
            if (graphInfo.depth > 0)
              setGraphInfo({
                ...graphInfo,
                depth: graphInfo.depth - 1,
                showOnlyAgg: true,
                showPanel: false,
              });
          }}
        >
          -
        </button>
        <input
          type="input"
          inputMode="numeric"
          pattern="\d{1}"
          disabled={graphSearch}
          value={graphInfo.depth > 4 ? 4 : graphInfo.depth}
          onChange={(e) => {
            const val = Number(e.target.value.slice(-1));
            setGraphSearching(false);
            setGraphInfo({
              ...graphInfo,
              depth: val > 4 ? 4 : val,
              showOnlyAgg: true,
              showPanel: false,
            });
          }}
          className="px-2 w-7 h-5 text-center dark:disabled:text-filter dark:bg-signin/30 dark:disabled:bg-filter/30 focus:outline-none"
        />
        <button
          disabled={graphSearch || graphInfo.depth > 3}
          className="px-1 dark:disabled:text-filter dark:bg-signin/30 dark:disabled:bg-filter/30 dark:disabled:border-filter border dark:border-signin dark:hover:border-signin/60 duration-100 rounded-sm"
          onClick={() => {
            setGraphSearching(false);
            if (graphInfo.depth < 4)
              setGraphInfo({
                ...graphInfo,
                depth: graphInfo.depth + 1,
                showOnlyAgg: true,
                showPanel: false,
              });
          }}
        >
          +
        </button>
      </article>
    </section>
  );
};

export default DepthFilter;
