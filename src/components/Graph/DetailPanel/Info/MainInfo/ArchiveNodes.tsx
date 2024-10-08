import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { pageSize } from "src/constants/general";
import { orgCloud } from "src/constants/graph";
import PaginatedListLayout from "src/layouts/PaginatedListLayout";
import { GetNodesInArchive } from "src/services/graph/info";
import { GetQueryLookup } from "src/services/graph/search";
import { useGeneralStore } from "src/stores/general";
import { useGraphStore } from "src/stores/graph";
import { convertToMicrosec, getCustomerCloud } from "src/utils/general";
import { handleViewSnapshot } from "src/utils/graph";

const ArchiveNodes = ({ curSnapshotTime }: { curSnapshotTime?: number }) => {
  const navigate = useNavigate();
  const customerCloud = getCustomerCloud();

  const { env } = useGeneralStore();
  const {
    graphInfo,
    setGraphInfo,
    setGraphSearchString,
    setGraphNav,
    setGraphSearch,
    setGraphSearching,
    selectedNode,
    setNavigationView,
    setSnapshotTime,
    snapshotTime,
  } = useGraphStore();

  const [query, setQuery] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);

  const isArchive =
    selectedNode?.nodeType?.toLowerCase().includes("archive") || false;

  const { data: nodesInArchive } = GetNodesInArchive(
    env,
    isArchive
      ? encodeURIComponent(encodeURIComponent(String(selectedNode?.id)))
      : "",
    curSnapshotTime || 0,
    isArchive
  );
  const queryLookup = GetQueryLookup();

  const filteredNodesInArchive = nodesInArchive?.filter((nodeID: string) =>
    nodeID
      .toLowerCase()
      .replace(/\s+/g, "")
      .includes(query.toLowerCase().replace(/\s+/g, ""))
  );
  const totalCount = filteredNodesInArchive?.length || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <PaginatedListLayout
      placeholderText="Search nodes in archive"
      query={query}
      totalCount={totalCount}
      totalPages={totalPages}
      beginning={beginning}
      end={end}
      setQuery={setQuery}
      pageNumber={pageNumber}
      setPageNumber={setPageNumber}
    >
      <ul className="grid">
        {filteredNodesInArchive
          ?.slice(beginning - 1, end + 1)
          .map((nodeID: string) => {
            return (
              <li
                key={nodeID}
                className="flex items-center gap-2 p-2 px-4 dark:bg-tooltip dark:even:bg-panel"
              >
                <button
                  className="dark:hover:text-signin duration-100"
                  onClick={() => {
                    setGraphNav([
                      {
                        nodeID: customerCloud,
                        nodeType: orgCloud,
                      },
                    ]);
                    setGraphInfo({
                      ...graphInfo,
                      showPanel: false,
                    });
                    queryLookup.mutate(
                      {
                        requestData: {
                          query_type: "view_in_graph",
                          id: nodeID,
                        },
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
                            convertToMicrosec(snapshotTime)
                          ),
                      }
                    );
                  }}
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>
                <p className="w-full break-all">{nodeID}</p>
              </li>
            );
          })}
      </ul>
    </PaginatedListLayout>
  );
};

export default ArchiveNodes;
