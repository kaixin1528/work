import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { pageSize } from "src/constants/general";
import PaginatedListLayout from "src/layouts/PaginatedListLayout";
import { GetCVEListForNode } from "src/services/graph/info";
import { useGeneralStore } from "src/stores/general";
import { useGraphStore } from "src/stores/graph";

const CVEList = ({
  integrationType,
  elementID,
  nodeType,
  curSnapshotTime,
}: {
  integrationType: string;
  elementID: string;
  nodeType: string;
  curSnapshotTime?: number;
}) => {
  const navigate = useNavigate();

  const { env } = useGeneralStore();
  const { graphInfo, setGraphInfo, selectedNode } = useGraphStore();

  const [query, setQuery] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);

  const uniqueID = selectedNode?.data?.uniqueID || "";

  const { data: cveList } = GetCVEListForNode(
    env,
    integrationType,
    elementID,
    nodeType,
    curSnapshotTime || 0,
    uniqueID
  );

  const filteredCVEs =
    query !== ""
      ? cveList?.filter((nodeID: string) =>
          nodeID
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        )
      : cveList;
  const totalCount = filteredCVEs?.length || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <>
      {cveList ? (
        cveList.length > 0 ? (
          <PaginatedListLayout
            placeholderText="Search CVE Id"
            query={query}
            totalCount={totalCount}
            totalPages={totalPages}
            beginning={beginning}
            end={end}
            setQuery={setQuery}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          >
            <ul className="grid max-h-[20rem] overflow-auto scrollbar">
              {filteredCVEs
                ?.slice(beginning - 1, end + 1)
                .map((cveID: string) => {
                  return (
                    <li
                      key={cveID}
                      className="flex items-center gap-2 p-2 px-4 dark:bg-tooltip dark:even:bg-panel"
                    >
                      <button
                        className="break-all dark:hover:text-filter duration-100"
                        onClick={() => {
                          setGraphInfo({ ...graphInfo, showPanel: false });
                          navigate(`/cves/details?cve_id=${cveID}`);
                        }}
                      >
                        {cveID}
                      </button>
                    </li>
                  );
                })}
            </ul>
          </PaginatedListLayout>
        ) : (
          <p className="text-sm">No data available</p>
        )
      ) : null}
    </>
  );
};

export default CVEList;
