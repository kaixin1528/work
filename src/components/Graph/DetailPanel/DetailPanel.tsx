/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { RefObject, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faInfoCircle,
  faTimeline,
  faTriangleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Alerts from "./Alerts";
import Notes from "./Notes";
import Timeline from "./Timeline";
import { getCustomerCloud } from "../../../utils/general";
import PanelLayout from "../../../layouts/PanelLayout";
import { useGraphStore } from "src/stores/graph";
import { detailPanelTabs } from "src/constants/general";
import FirewallInfo from "./Info/FirewallInfo";
import MainInfo from "./Info/MainInfo/MainInfo";
import RegionInfo from "./Info/RegionInfo/RegionInfo";
import Damage from "./Damage";
import Impact from "./Impact";
import { orgCloud } from "src/constants/graph";
import CPMInfo from "./Info/CPMInfo";
import { GraphInfo } from "src/types/general";
import { GetMainElementInfo } from "src/services/graph/info";
import { GetSimulationElementInfo } from "src/services/simulation";
import { useGeneralStore } from "src/stores/general";
import { GetInsightVMInfo } from "src/services/summaries/vulnerability-risks";
import CopyToClipboard from "src/components/General/CopyToClipboard";

const DetailPanel = ({
  graphType,
  graphInfo,
  setGraphInfo,
  curSnapshotTime,
  simulationAnnotation,
  curSearchSnapshot,
}: {
  graphType: string;
  graphInfo: GraphInfo;
  setGraphInfo: (graphInfo: GraphInfo) => void;
  curSnapshotTime?: number;
  simulationAnnotation?: any;
  curSearchSnapshot?: any;
}) => {
  const customerCloud = getCustomerCloud();

  const { env } = useGeneralStore();
  const {
    selectedPanelTab,
    setSelectedPanelTab,
    selectedNode,
    selectedEdge,
    setSelectedNode,
    setSelectedEdge,
    setElementType,
    elementType,
  } = useGraphStore();

  const panelRef = useRef() as RefObject<HTMLElement>;

  const elementID = selectedNode?.id || selectedEdge?.id || "";
  const integrationType =
    (selectedNode || selectedEdge)?.data?.integrationType || "";
  const sourceAccountID = selectedNode?.data?.sourceAccountID || "";
  const nodeType = selectedNode?.data?.nodeType || "";
  const uniqueID =
    selectedNode?.data?.diffNode?.unique_id ||
    selectedNode?.data?.uniqueID ||
    "";
  const annotationContext = simulationAnnotation?.annotation || "";
  const hasDiff =
    selectedNode?.data?.diffNode || selectedEdge?.data?.diffEdge || false;

  const { data: mainElementInfo } = GetMainElementInfo(
    env,
    hasDiff,
    annotationContext,
    elementID,
    elementType,
    nodeType,
    curSnapshotTime || 0,
    integrationType
  );
  const { data: simulationElementInfo } = GetSimulationElementInfo(
    env,
    annotationContext,
    elementID,
    elementType
  );
  const { data: insightVMInfo } = GetInsightVMInfo(
    integrationType,
    String(sourceAccountID),
    elementID
  );

  const handleOnClose = () => setGraphInfo({ ...graphInfo, showPanel: false });

  useEffect(() => {
    if (simulationElementInfo || insightVMInfo || mainElementInfo) {
      let elementInfo;
      if (simulationElementInfo) elementInfo = simulationElementInfo;
      else if (insightVMInfo) elementInfo = insightVMInfo;
      else if (mainElementInfo) elementInfo = mainElementInfo;
      if (elementType === "node") {
        setSelectedNode({
          id: elementInfo.node_id,
          integrationType: elementInfo.cloud_id,
          nodeTypeName: elementInfo.type,
          nodeType: elementInfo.node_class,
          data: {
            id: elementInfo.node_id,
            integrationID: elementInfo.integration_id,
            integrationType: elementInfo.cloud_id,
            nodeTypeName: elementInfo.type,
            nodeType: elementInfo.node_class,
            attributes: elementInfo.attributes,
            diffNode: null,
            uniqueID: elementInfo.unique_id,
          },
        });
        setSelectedEdge(undefined);
      } else if (elementType === "edge") {
        setSelectedEdge({
          id: elementInfo.edge_id_src,
          data: {
            id: elementInfo.edge_id_src,
            source: elementInfo.source_id,
            target: elementInfo.target_id,
            attributes: elementInfo.rel_src,
            diffEdge: null,
          },
        });
        setSelectedNode(undefined);
      }
      setElementType("");
    }
  }, [mainElementInfo, simulationElementInfo, insightVMInfo, elementType]);

  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (!panelRef?.current?.contains(event.target)) handleOnClose();
    };
    const handleEscape = (event: {
      key: string;
      preventDefault: () => void;
    }) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleOnClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [panelRef]);

  const show =
    graphInfo.showPanel ||
    selectedNode !== undefined ||
    selectedEdge !== undefined;

  return (
    <PanelLayout showPanel={show} panelRef={panelRef} graph>
      <section className="flex flex-col gap-3 h-full">
        <header className="grid gap-2">
          <button
            className={`absolute left-5 ${selectedNode ? "top-6" : "top-9"}`}
            onClick={handleOnClose}
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="w-5 h-5 dark:text-checkbox dark:hover:text-checkbox/30 duration-100"
            />
          </button>
          <article className="flex items-center gap-5 mt-5">
            {selectedNode && (
              <article className="flex items-center gap-2">
                {selectedNode.data?.integrationType && (
                  <img
                    src={`/graph/nodes/${selectedNode.data?.integrationType?.toLowerCase()}/${selectedNode.data?.nodeType?.toLowerCase()}.svg`}
                    alt="node"
                    className="w-6 h-6"
                  />
                )}
                <h4 className="mt-1 text-sm">
                  {selectedNode.data?.nodeType} -{" "}
                  {selectedNode.data?.nodeTypeName}
                </h4>
              </article>
            )}
          </article>
          {elementID !== "" && (
            <article
              className={`flex flex-wrap items-start gap-3 text-lg break-all ${
                elementID.includes(customerCloud) ? "capitalize truncate" : ""
              }`}
            >
              <CopyToClipboard copiedValue={elementID} />
              <h4>{elementID === customerCloud ? orgCloud : elementID}</h4>
            </article>
          )}
        </header>

        <nav className="grid md:flex gap-1 w-full h-max text-sm">
          {detailPanelTabs.map((category) => {
            if (
              ((selectedEdge ||
                elementID.includes("agg") ||
                elementID === customerCloud) &&
                ["Alerts", "Timeline"].includes(category)) ||
              (nodeType === "EffectiveIP" && category === "Timeline") ||
              ((selectedEdge || !simulationAnnotation) &&
                ["Impact", "Damages"].includes(category)) ||
              (["impact", "damage"].includes(graphType) &&
                ["Alerts", "Notes"].includes(category)) ||
              (simulationAnnotation?.annotation_type === "damage" &&
                category === "Impact") ||
              (simulationAnnotation?.annotation_type === "impact" &&
                category === "Damages") ||
              (integrationType === "INSIGHTVM" && category === "Timeline")
            )
              return null;
            return (
              <button
                key={category}
                className={`px-4 py-3 w-full h-max font-semibold ${
                  ["Impact", "Damages"].includes(category)
                    ? "dark:bg-reset/10 border dark:border-reset"
                    : selectedPanelTab === category
                    ? "dark:bg-signin/10 border dark:border-signin"
                    : "dark:text-checkbox dark:hover:text-white dark:bg-filter/10 border dark:border-filter"
                } duration-100`}
                onClick={() => setSelectedPanelTab(category)}
              >
                {category === "Info" && (
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="mr-2 dark:text-signin"
                  />
                )}
                {category === "Alerts" && (
                  <FontAwesomeIcon
                    icon={faTriangleExclamation}
                    className="mr-2 dark:text-event"
                  />
                )}
                {category === "Notes" && (
                  <FontAwesomeIcon
                    icon={faComment}
                    className="mr-2 dark:text-user"
                  />
                )}
                {category === "Timeline" && (
                  <FontAwesomeIcon
                    icon={faTimeline}
                    className="mr-2 dark:text-note"
                  />
                )}
                {category}
              </button>
            );
          })}
        </nav>

        {selectedPanelTab === "Info" ? (
          graphType === "cpm" ? (
            <CPMInfo curSnapshotTime={curSnapshotTime} />
          ) : graphType === "firewall" ? (
            <FirewallInfo curSnapshotTime={curSnapshotTime} />
          ) : graphType === "region" ? (
            <RegionInfo
              elementID={elementID}
              curSnapshotTime={curSnapshotTime}
              annotationContext={annotationContext}
              curSearchSnapshot={curSearchSnapshot}
            />
          ) : (
            <MainInfo
              graphType={graphType}
              curSnapshotTime={curSnapshotTime}
              annotationContext={annotationContext}
              curSearchSnapshot={curSearchSnapshot}
            />
          )
        ) : null}

        {selectedPanelTab === "Impact" && (
          <Impact simulationAnnotation={simulationAnnotation} />
        )}

        {selectedPanelTab === "Damages" && (
          <Damage simulationAnnotation={simulationAnnotation} />
        )}

        {selectedPanelTab === "Alerts" && (
          <Alerts
            integrationType={integrationType}
            elementID={elementID}
            curSnapshotTime={curSnapshotTime}
          />
        )}

        {selectedPanelTab === "Notes" && (
          <Notes
            elementID={elementID}
            integrationType={integrationType}
            nodeType={nodeType}
          />
        )}

        {selectedPanelTab === "Timeline" && (
          <Timeline
            elementID={elementID}
            nodeType={nodeType}
            uniqueID={uniqueID}
          />
        )}
      </section>
    </PanelLayout>
  );
};

export default DetailPanel;
