import { DiffStats } from "../../../types/graph";
import { useGraphStore } from "src/stores/graph";

const DiffLegend = ({
  legend,
  setPageNumber,
}: {
  legend: DiffStats;
  setPageNumber: (pageNumber: number) => void;
}) => {
  const { diffFilter, setDiffFilter } = useGraphStore();

  const handleNodeFilter = (selectedAction: string) => {
    if (diffFilter.includes(selectedAction)) {
      const nodeFilter = diffFilter.filter(
        (action) => action !== selectedAction
      );
      setDiffFilter(nodeFilter);
    } else {
      const nodeFilter = [...diffFilter, selectedAction];
      setDiffFilter(nodeFilter);
    }
    setPageNumber(1);
  };

  return (
    <section className="flex items-center gap-10 text-xs overflow-auto scrollbar">
      {["removed", "modified", "created"].map((action) => {
        return (
          <button
            key={action}
            className="flex items-center gap-2"
            onClick={() => handleNodeFilter(action)}
          >
            <input
              type="checkbox"
              checked={diffFilter.includes(action)}
              className="form-checkbox w-4 h-4 border-0 dark:focus:ring-0 dark:text-checkbox dark:focus:border-checkbox focus:ring dark:focus:ring-offset-0 dark:focus:ring-checkbox focus:ring-opacity-50"
              onChange={() => handleNodeFilter(action)}
            />
            <p>{legend[action]}</p>
            <h4>{action}</h4>
            <img
              src={`/graph/evolution/${action}-nodes.svg`}
              alt={`${action} nodes`}
              className="w-4 h-4"
            />
          </button>
        );
      })}
    </section>
  );
};

export default DiffLegend;
