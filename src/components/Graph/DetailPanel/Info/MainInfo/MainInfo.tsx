/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import {
  faArrowRightLong,
  faStar,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AttributeTable from "src/components/Attribute/AttributeTable";
import { useGraphStore } from "src/stores/graph";
import { useState } from "react";
import { infoTabs } from "src/constants/graph";
import { useGeneralStore } from "src/stores/general";
import ReactJson from "react-json-view";
import RGNDetail from "../RegionInfo/RegionInfo";
import { GetDiffElementInfo } from "src/services/graph/evolution";
import { GetGraphSummary } from "src/services/graph/info";
import ArchiveNodes from "./ArchiveNodes";
import CVEList from "./CVEList.tsx";
import DiffEdge from "./DiffEdge";
import DiffNode from "./DiffNode";

const MainInfo = ({
  graphType,
  curSnapshotTime,
  annotationContext,
  curSearchSnapshot,
}: {
  graphType: string;
  curSnapshotTime?: number | undefined;
  annotationContext: string;
  curSearchSnapshot?: any;
}) => {
  const { env } = useGeneralStore();
  const { elementType, selectedNode, selectedEdge, diffStartTime } =
    useGraphStore();

  const integrationID = selectedNode?.data?.integrationID || "";
  const elementID = selectedNode?.id || selectedEdge?.id || "";
  const integrationType = selectedNode?.data?.integrationType || "";
  const nodeType = selectedNode?.data?.nodeType || "";
  const isArchive =
    selectedNode?.nodeType?.toLowerCase().includes("archive") || false;
  const hasDiff =
    selectedNode?.data?.diffNode || selectedEdge?.data?.diffEdge || false;
  const uniqueID = selectedNode?.data?.diffNode?.unique_id || "";

  const [selectedCategory, setSelectedCategory] =
    useState<string>("Resource Details");

  const { data: graphSummary } = GetGraphSummary(
    env,
    curSnapshotTime || 0,
    nodeType,
    integrationID
  );
  const { data: diffElementInfo } = GetDiffElementInfo(
    env,
    graphType,
    hasDiff,
    elementType,
    elementID,
    uniqueID,
    diffStartTime.snapshot || 0
  );

  const attributes =
    selectedNode?.data?.attributes || selectedEdge?.data?.attributes;
  const diffNode = selectedNode?.data?.diffNode;
  const diffEdge = selectedEdge?.data?.diffEdge;

  return (
    <section className="mt-3 overflow-auto scrollbar">
      {selectedEdge && (
        <section className="flex flex-col flex-grow content-start w-full gap-3 text-xs overflow-auto scrollbar z-50">
          {diffEdge ? (
            <DiffEdge diffElementInfo={diffElementInfo} />
          ) : (
            <section className="grid gap-2 dark:bg-tooltip">
              <header className="flex items-center justify-between px-4 py-2 text-sm dark:text-checkbox dark:bg-card">
                Source Node ID
                <FontAwesomeIcon icon={faArrowRightLong} className="mx-auto" />
                Target Node ID
              </header>
              <article className="grid grid-cols-3 items-center px-4 py-2">
                <p className="text-left dark:text-white break-all font-medium">
                  {selectedEdge.data?.source}
                </p>
                <section className="mx-auto">
                  {attributes?.length > 0 ? (
                    <ul className="grid gap-2">
                      {(Object.values(attributes[0]) as string[]).map(
                        (rel: string) => {
                          return (
                            <li key={rel} className="mx-auto">
                              <p className="w-max dark:text-white break-all overflow-auto scrollbar">
                                {rel}
                              </p>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  ) : (
                    <p>N/A</p>
                  )}
                </section>
                <p className="text-right dark:text-white break-all font-medium">
                  {selectedEdge.data?.target}
                </p>
              </article>
            </section>
          )}
        </section>
      )}

      {selectedNode && (
        <section className="flex flex-col flex-grow content-start gap-2 w-full h-full duration-200 overflow-auto scrollbar">
          {diffNode ? (
            <DiffNode diffElementInfo={diffElementInfo} />
          ) : (
            <section className="flex flex-col flex-grow content-start w-full text-[0.8rem] overflow-auto scrollbar">
              {graphSummary ? (
                <ReactJson
                  src={
                    nodeType === "CUSTOMERCLD"
                      ? graphSummary.ALL
                      : graphSummary.ALL[integrationType]
                  }
                  name={null}
                  quotesOnKeys={false}
                  displayDataTypes={false}
                  enableClipboard={false}
                  theme="harmonic"
                />
              ) : nodeType === "RGN" ? (
                <RGNDetail
                  elementID={elementID}
                  curSnapshotTime={curSnapshotTime}
                  annotationContext={annotationContext}
                  curSearchSnapshot={curSearchSnapshot}
                />
              ) : !isArchive ? (
                <section className="flex flex-col flex-grow gap-3 h-full overflow-auto scrollbar">
                  <nav className="flex items-center justify-between gap-5 text-sm">
                    {infoTabs.map((category: string) => {
                      return (
                        <button
                          key={category}
                          className={`flex items-center gap-2 p-2 w-full ${
                            selectedCategory === category
                              ? "bg-gradient-to-br dark:from-signin/20 border-b dark:border-signin/30"
                              : "border-b dark:border-signin/30"
                          }`}
                          onClick={() => setSelectedCategory(category)}
                        >
                          <FontAwesomeIcon
                            icon={
                              category.includes("Details") ? faTable : faStar
                            }
                            className={`${
                              category.includes("Details")
                                ? "text-signin"
                                : "text-note"
                            }`}
                          />
                          {category}
                        </button>
                      );
                    })}
                  </nav>
                  {selectedCategory.includes("Details") ? (
                    <AttributeTable
                      attributes={attributes}
                      curSearchSnapshot={curSearchSnapshot}
                    />
                  ) : (
                    <CVEList
                      integrationType={integrationType}
                      elementID={elementID}
                      nodeType={nodeType}
                      curSnapshotTime={curSnapshotTime}
                    />
                  )}
                </section>
              ) : (
                <ArchiveNodes />
              )}
            </section>
          )}
        </section>
      )}
    </section>
  );
};

export default MainInfo;
