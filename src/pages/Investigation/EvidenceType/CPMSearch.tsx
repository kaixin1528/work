/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { useState, useCallback, useLayoutEffect, useEffect } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  useStoreApi,
} from "reactflow";
import { highlightPath, onInit, resetNodeStyles } from "../../../utils/graph";
import GraphControls from "../../../components/Graph/GraphControls";
import { faClock, faEyeSlash, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence } from "framer-motion";
import Loader from "../../../components/Loader/Loader";
import { renderCPMGraph } from "../../../utils/dashboard";
import { edgeTypes, nodeTypes, pageSize } from "../../../constants/general";
import { GeneralEvidenceType } from "../../../types/investigation";
import { convertToUTCString } from "src/utils/general";
import { useGraphStore } from "src/stores/graph";
import DetailPanel from "src/components/Graph/DetailPanel/DetailPanel";
import NoResults from "src/components/General/NoResults";
import { useGeneralStore } from "src/stores/general";
import ModalLayout from "src/layouts/ModalLayout";
import PaginatedListLayout from "src/layouts/PaginatedListLayout";
import { GetCPMGraph } from "src/services/dashboard/effective-networking/cpm";
import { GetENSearchResults } from "src/services/dashboard/effective-networking/effective-networking";

const CPMSearch = ({
  evidence,
  setEditQuery,
  showModal,
}: {
  evidence: GeneralEvidenceType;
  setEditQuery?: (editQuery: boolean) => void;
  showModal?: boolean;
}) => {
  const reactFlowInstance = useReactFlow();
  const store = useStoreApi();

  const { env } = useGeneralStore();
  const {
    setElementType,
    setSelectedEdge,
    setSelectedNode,
    setSelectedPanelTab,
    graphInfo,
    setGraphInfo,
  } = useGraphStore();

  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [minZoom, setMinZoom] = useState<number>(0);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );
  const [query, setQuery] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<string>("");

  const curSnapshotTime = evidence.query_start_time;

  const { data: searchResults, status: searchResultsStatus } =
    GetENSearchResults(
      env,
      evidence.results?.cloud || "",
      evidence.query_string,
      showDetails,
      false,
      curSnapshotTime,
      "cpm"
    );
  const { data: cpmGraph, status: cpmGraphStatus } = GetCPMGraph(
    env,
    evidence.results?.cloud || "",
    curSnapshotTime,
    selectedService
  );

  const filteredServiceList = searchResults?.qualifying_services?.filter(
    (nodeID: string) =>
      nodeID
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(query.toLowerCase().replace(/\s+/g, ""))
  );
  const totalCount = filteredServiceList?.length || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  useEffect(() => {
    if (searchResults?.qualifying_services.length > 0)
      setSelectedService(searchResults?.qualifying_services[0]);
  }, [searchResults]);

  useLayoutEffect(() => {
    if (cpmGraph?.nodes.length > 0 && showDetails)
      renderCPMGraph(
        cpmGraph.nodes,
        cpmGraph.edges,
        setNodes,
        setEdges,
        store,
        setMinZoom,
        reactFlowInstance
      );
  }, [cpmGraph, showDetails, minZoom]);

  const handleOnClose = () => setShowDetails(false);

  const GraphRendering = (
    <section className="flex flex-grow w-full h-[38rem] dark:bg-card rounded-sm">
      <aside className="grid w-1/4 h-full shadow-sm dark:shadow-black overflow-auto scrollbar z-10">
        <PaginatedListLayout
          placeholderText="Search any service"
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
            {filteredServiceList
              ?.slice(beginning - 1, end + 1)
              .map((service: string) => {
                return (
                  <li
                    key={service}
                    className={`flex items-center gap-2 p-2 px-4 cursor-pointer ${
                      selectedService === service
                        ? "dark:bg-signin/60"
                        : "dark:bg-tooltip dark:hover:bg-signin/30 duration-100 dark:even:bg-panel"
                    } `}
                    onClick={() => setSelectedService(service)}
                  >
                    <p className="w-full break-all">{service}</p>
                  </li>
                );
              })}
          </ul>
        </PaginatedListLayout>
      </aside>
      <section className="relative flex flex-grow flex-col">
        {[searchResultsStatus, cpmGraphStatus].includes("loading") ? (
          <Loader />
        ) : evidence.query_start_time === 0 ||
          searchResults?.qualifying_services.length === 0 ? (
          <NoResults />
        ) : searchResultsStatus === "success" ? (
          searchResults?.qualifying_services.length > 0 &&
          nodes.length > 0 && (
            <ReactFlow
              onInit={(reactFlowInstance) =>
                onInit(store, nodes, setMinZoom, reactFlowInstance)
              }
              minZoom={minZoom}
              maxZoom={1}
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              panOnDrag={true}
              panOnScroll={true}
              zoomOnScroll={true}
              zoomOnDoubleClick={true}
              onNodeMouseEnter={(_event, node) =>
                highlightPath(node, nodes, edges, setNodes, setEdges)
              }
              onNodeMouseLeave={() => resetNodeStyles(setNodes, setEdges)}
              onPaneClick={() =>
                setGraphInfo({ ...graphInfo, showPanel: false })
              }
              onNodeClick={(e, node) => {
                setElementType("node");
                setGraphInfo({ ...graphInfo, showPanel: true });
                setSelectedNode({
                  id: node["id"],
                  data: node["data"],
                });
                setSelectedEdge(undefined);
                setSelectedPanelTab("Info");
              }}
              onEdgeClick={(e, edge) => {
                setElementType("edge");
                setGraphInfo({ ...graphInfo, showPanel: true });
                setSelectedNode(undefined);
                setSelectedEdge({
                  id: edge["id"],
                  data: edge["data"],
                });
                setSelectedPanelTab("Info");
              }}
            >
              <GraphControls nodes={nodes} setMinZoom={setMinZoom} />
            </ReactFlow>
          )
        ) : null}
      </section>
      <AnimatePresence exitBeforeEnter>
        {graphInfo.showPanel && (
          <DetailPanel
            graphType="cpm"
            graphInfo={graphInfo}
            setGraphInfo={setGraphInfo}
            curSnapshotTime={curSnapshotTime}
          />
        )}
      </AnimatePresence>
    </section>
  );

  return (
    <section className="grid gap-3 px-2 pb-2 text-xs w-full">
      <article className="flex items-start gap-3 dark:text-checkbox">
        <img
          src={`/investigation/evidence-type/${evidence.evidence_type.toLowerCase()}.svg`}
          alt={evidence.evidence_type}
          className="mt-[0.4rem] w-4 h-4 dark:text-checkbox"
        />
        <article className="grid gap-1 max-w-[40rem]">
          <article className="flex items-start gap-2 py-1 px-4 w-full break-all dark:text-white dark:bg-signin/20 border dark:border-signin rounded-sm overflow-auto scrollbar">
            <img
              src={`/general/integrations/${evidence.results?.cloud?.toLowerCase()}.svg`}
              alt={String(evidence.results?.cloud)}
              className="w-4 h-4"
            />
            <p
              className={`w-full hover:whitespace-normal truncate text-ellipsis ${
                setEditQuery
                  ? "cursor-pointer dark:hover:bg-signin/40 duration-100"
                  : ""
              }`}
              onClick={() => {
                if (setEditQuery) setEditQuery(true);
              }}
            >
              {evidence.query_string}
            </p>
          </article>
          <article className="flex items-center gap-2 break-all text-[0.65rem] dark:text-checkbox">
            <FontAwesomeIcon icon={faClock} className="dark:text-admin" />
            {evidence.query_start_time !== 0 ? (
              <p>
                {convertToUTCString(evidence.query_start_time)}
                {evidence.query_start_time !== evidence.query_end_time &&
                  ` - ${convertToUTCString(evidence.query_end_time)}`}
              </p>
            ) : (
              <p>Time not selected</p>
            )}
          </article>
        </article>
        <button
          className="group flex items-center gap-2 mt-[0.4rem]"
          onClick={() => setShowDetails(!showDetails)}
        >
          <p className="w-max dark:group-hover:text-signin duration-100">
            {showDetails ? "Hide query" : "Run query"}
          </p>
          <FontAwesomeIcon
            icon={showDetails ? faEyeSlash : faPlay}
            className="dark:group-hover:text-signin duration-100"
          />
        </button>
      </article>
      {showModal ? (
        <ModalLayout
          showModal={showDetails && curSnapshotTime !== 0}
          onClose={handleOnClose}
        >
          {GraphRendering}
        </ModalLayout>
      ) : (
        showDetails && curSnapshotTime !== 0 && GraphRendering
      )}
    </section>
  );
};

export default CPMSearch;
