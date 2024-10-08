/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { useState, useCallback, useLayoutEffect } from "react";
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
import { renderFirewallGraph } from "../../../utils/dashboard";
import { edgeTypes, nodeTypes } from "../../../constants/general";
import { GeneralEvidenceType } from "../../../types/investigation";
import { convertToUTCString } from "src/utils/general";
import { useGraphStore } from "src/stores/graph";
import DetailPanel from "src/components/Graph/DetailPanel/DetailPanel";
import NoResults from "src/components/General/NoResults";
import { useGeneralStore } from "src/stores/general";
import ModalLayout from "src/layouts/ModalLayout";
import { defaultDepth } from "src/constants/graph";
import { GraphInfo } from "src/types/general";
import { GetENSearchResults } from "src/services/dashboard/effective-networking/effective-networking";

const FirewallSearch = ({
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
  } = useGraphStore();

  const [localGraphInfo, setLocalGraphInfo] = useState<GraphInfo>({
    root: "",
    depth: defaultDepth,
    showOnlyAgg: true,
    showPanel: false,
  });
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [minZoom, setMinZoom] = useState<number>(0);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const curSnapshotTime = evidence.query_start_time;

  const { data: searchResults, status: searchResultsStatus } =
    GetENSearchResults(
      env,
      evidence.results?.cloud || "",
      evidence.query_string,
      showDetails,
      false,
      curSnapshotTime,
      "firewall"
    );

  useLayoutEffect(() => {
    if (searchResults)
      renderFirewallGraph(
        searchResults.qualifying_nodes,
        searchResults.qualifying_edges,
        setNodes,
        setEdges,
        searchResults,
        store,
        setMinZoom,
        reactFlowInstance
      );
  }, [searchResults, minZoom]);

  const handleOnClose = () => setShowDetails(false);

  const GraphRendering = (
    <section className="relative flex flex-col flex-grow w-full h-[38rem] dark:bg-card rounded-sm">
      {searchResultsStatus === "loading" ? (
        <Loader />
      ) : searchResultsStatus === "success" ? (
        searchResults?.qualifying_nodes.length > 0 && nodes.length > 0 ? (
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
              setLocalGraphInfo({ ...localGraphInfo, showPanel: false })
            }
            onNodeClick={(e, node) => {
              setElementType("node");
              setLocalGraphInfo({ ...localGraphInfo, showPanel: true });
              setSelectedNode({
                id: node["id"],
                data: node["data"],
              });
              setSelectedEdge(undefined);
              setSelectedPanelTab("Info");
            }}
            onEdgeClick={(e, edge) => {
              setElementType("edge");
              setLocalGraphInfo({ ...localGraphInfo, showPanel: true });
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
        ) : (
          (evidence.query_start_time === 0 ||
            searchResults?.qualifying_nodes.length === 0) && <NoResults />
        )
      ) : null}
      <AnimatePresence exitBeforeEnter>
        {localGraphInfo.showPanel && (
          <DetailPanel
            graphType="firewall"
            graphInfo={localGraphInfo}
            setGraphInfo={setLocalGraphInfo}
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
          className="mt-[0.4rem] w-4 h-4"
        />
        <article className="grid gap-1 max-w-[40rem]">
          <article className="flex items-start gap-2 py-1 px-4 w-full break-all dark:text-white dark:bg-signin/20 border dark:border-signin rounded-sm overflow-auto scrollbar">
            {/* firewall search by cloud */}
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
          <article className="flex items-center gap-2 break-all text-[0.65rem]">
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
            {showDetails ? "Hide" : "Run"} query
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

export default FirewallSearch;
