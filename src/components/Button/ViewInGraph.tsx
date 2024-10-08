import { faDiagramProject } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { GetQueryLookup } from "src/services/graph/search";
import { useGraphStore } from "src/stores/graph";
import { QueryLookup } from "src/types/graph";
import { handleViewSnapshot } from "src/utils/graph";

const ViewInGraph = ({
  requestData,
  curSnapshotTime,
}: {
  requestData: QueryLookup;
  curSnapshotTime?: number;
}) => {
  const navigate = useNavigate();

  const {
    setNavigationView,
    setGraphSearch,
    setGraphSearching,
    setGraphSearchString,
    setSnapshotTime,
  } = useGraphStore();

  const queryLookup = GetQueryLookup();

  return (
    <article className="grid gap-1 text-xs">
      <button
        className="flex items-center gap-2 w-max"
        onClick={() =>
          queryLookup.mutate(
            {
              requestData: requestData,
            },
            {
              onSuccess: (queryString) =>
                handleViewSnapshot(
                  queryString,
                  setNavigationView,
                  setGraphSearch,
                  setGraphSearching,
                  setGraphSearchString,
                  navigate,
                  setSnapshotTime,
                  curSnapshotTime
                ),
            }
          )
        }
      >
        <FontAwesomeIcon
          icon={faDiagramProject}
          className="dark:text-checkbox"
        />
        <p>View in graph</p>
      </button>
    </article>
  );
};

export default ViewInGraph;
