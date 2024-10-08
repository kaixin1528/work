/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  faCircleInfo,
  faDiagramProject,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover, Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AttributeValue from "src/components/Attribute/AttributeValue";
import TableLayout from "src/layouts/TableLayout";
import {
  GetEffectiveIP,
  GetPortProtocol,
  GetFirewallElementInfo,
} from "src/services/dashboard/effective-networking/firewall";
import { GetQueryLookup } from "src/services/graph/search";
import { useGeneralStore } from "src/stores/general";
import { useGraphStore } from "src/stores/graph";
import { EffectiveIPType, PortProtocolType } from "src/types/dashboard";
import { convertToMicrosec } from "src/utils/general";
import { handleViewSnapshot, searchPropertyValues } from "src/utils/graph";

const FirewallInfo = ({
  curSnapshotTime,
}: {
  curSnapshotTime: number | undefined;
}) => {
  const navigate = useNavigate();

  const { env } = useGeneralStore();
  const {
    graphInfo,
    setGraphInfo,
    graphSearchString,
    setGraphSearchString,
    setGraphSearch,
    setGraphSearching,
    selectedNode,
    selectedEdge,
    setNavigationView,
    setSelectedNode,
    setSelectedEdge,
    setElementType,
    elementType,
    setSnapshotTime,
    snapshotTime,
  } = useGraphStore();

  const elementID = selectedNode?.id || selectedEdge?.id || "";
  const integrationType =
    selectedNode?.data?.integrationType ||
    selectedEdge?.data?.integrationType ||
    "";
  const nodeType = selectedNode?.data?.nodeType || "";

  const { data: effectiveIP } = GetEffectiveIP(
    env,
    integrationType,
    elementID,
    nodeType
  );
  const { data: portProtocol } = GetPortProtocol(
    env,
    integrationType,
    elementID,
    nodeType
  );
  const { data: firewallElementInfo } = GetFirewallElementInfo(
    env,
    integrationType,
    elementID,
    elementType,
    nodeType,
    Number(curSnapshotTime)
  );
  const queryLookup = GetQueryLookup();

  const attributes =
    selectedNode?.data?.attributes || selectedEdge?.data?.attributes;

  useEffect(() => {
    if (firewallElementInfo) {
      if (elementType === "node") {
        setSelectedNode({
          id: firewallElementInfo.node_id,
          integrationType: firewallElementInfo.cloud_id,
          nodeType: firewallElementInfo.node_class,
          nodeTypeName: firewallElementInfo.type,
          data: {
            id: firewallElementInfo.node_id,
            integrationType: firewallElementInfo.cloud_id,
            nodeType: firewallElementInfo.node_class,
            nodeTypeName: firewallElementInfo.type,
            attributes: firewallElementInfo.attributes,
            uniqueID: firewallElementInfo.unique_id,
          },
        });
        setSelectedEdge(undefined);
      } else if (elementType === "edge") {
        setSelectedEdge({
          id: firewallElementInfo.edge_id,
          integrationType: firewallElementInfo.cloud_id,
          data: {
            id: firewallElementInfo.edge_id,
            integrationType: firewallElementInfo.cloud_id,
            attributes: firewallElementInfo.attributes,
          },
        });
        setSelectedNode(undefined);
      }
      setElementType("");
    }
  }, [firewallElementInfo, elementType]);

  return (
    <>
      {selectedEdge && (
        <TableLayout>
          <thead>
            <tr className="text-sm dark:text-checkbox text-left">
              <th className="px-4 py-3 font-medium">Port Range/Protocol</th>
              <th className="px-4 py-3 break-words font-medium">Rules</th>
            </tr>
          </thead>
          <tbody>
            {attributes &&
              Object.keys(attributes).map((attribute, index) => {
                return (
                  <tr
                    key={index}
                    className="py-3 px-4 text-xs dark:bg-tooltip dark:even:bg-panel"
                  >
                    <td className="py-3 px-4">{attribute}</td>
                    <td className="py-3 px-4 overflow-auto scrollbar break-all">
                      <ul className="grid px-3 list-disc">
                        {attributes[attribute].map(
                          (attribute: string, index: number) => {
                            return <li key={index}>{attribute} </li>;
                          }
                        )}
                      </ul>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </TableLayout>
      )}
      {selectedNode && (
        <section className="flex flex-col flex-grow w-full content-start mt-3 gap-2 duration-300 overflow-auto scrollbar">
          {selectedNode?.nodeType !== "EffectiveIP" && (
            <article className="flex items-center gap-5 text-sm">
              {["View in graph", "View blast radius"].map((option) => {
                return (
                  <button
                    key={option}
                    className="flex items-center gap-2 px-4 py-2 dark:text-white dark:hover:text-checkbox duration-100 bg-gradient-to-br dark:from-signin/20  border-b dark:border-signin/30"
                    onClick={() =>
                      queryLookup.mutate(
                        {
                          requestData: {
                            query_type: option.includes("radius")
                              ? "blast_radius"
                              : "view_in_graph",
                            id: selectedNode?.id,
                            ...(option.includes("radius") ? { radius: 1 } : {}),
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
                      )
                    }
                  >
                    {option.includes("graph") ? (
                      <FontAwesomeIcon
                        icon={faDiagramProject}
                        className="w-3 h-3"
                      />
                    ) : (
                      <img
                        src="/dashboard/firewall/blast-radius.svg"
                        alt="blast radius"
                      />
                    )}
                    <p>{option}</p>
                  </button>
                );
              })}
            </article>
          )}
          <TableLayout fullHeight>
            <thead>
              <tr className="text-sm dark:text-checkbox text-left">
                <th className="px-4 py-3 font-medium">Attribute</th>
                <th className="px-4 py-3 break-words font-medium">Detail</th>
              </tr>
            </thead>
            <tbody>
              {attributes &&
                Object.keys(attributes).map(
                  (attribute: string, index: number) => {
                    const curAttribute = attributes[attribute];
                    return (
                      <tr
                        key={`keyinfo-${index}`}
                        className="text-xs dark:bg-tooltip dark:even:bg-panel"
                      >
                        <td className="flex items-start gap-2 py-3 px-4 pr-10 dark:text-white font-medium">
                          {selectedNode?.nodeType !== "EffectiveIP" && (
                            <button
                              className="dark:hover:text-signin duration-100"
                              onClick={() => {
                                setGraphInfo({
                                  ...graphInfo,
                                  showPanel: false,
                                });
                                setGraphSearch(true);
                                setGraphSearching(false);
                                setGraphSearchString(
                                  searchPropertyValues(
                                    graphSearchString,
                                    curAttribute,
                                    "node_property"
                                  )
                                );
                              }}
                            >
                              <FontAwesomeIcon icon={faSearch} />
                            </button>
                          )}
                          {selectedNode?.nodeType === "EffectiveIP"
                            ? attribute
                            : curAttribute.display_name}
                          {curAttribute.long_desc && (
                            <Popover className="relative">
                              <Popover.Button>
                                <FontAwesomeIcon
                                  icon={faCircleInfo}
                                  className="w-3 h-3 dark:text-checkbox z-0"
                                />
                              </Popover.Button>
                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                              >
                                <Popover.Panel className="pointer-events-auto absolute w-56 px-4 z-50">
                                  <p className="absolute -top-16 dark:text-white dark:bg-metric p-3 overflow-hidden rounded-sm">
                                    {curAttribute.long_desc}
                                  </p>
                                </Popover.Panel>
                              </Transition>
                            </Popover>
                          )}
                        </td>
                        <td className="py-3 px-4 break-all">
                          {Array.isArray(curAttribute) &&
                            selectedNode?.nodeType === "EffectiveIP" &&
                            curAttribute.map((val: string) => {
                              return <p key={val}>{val}</p>;
                            })}
                          {selectedNode?.nodeType !== "EffectiveIP" && (
                            <AttributeValue attribute={curAttribute} />
                          )}
                        </td>
                      </tr>
                    );
                  }
                )}
              {effectiveIP?.map((attribute: EffectiveIPType, index: number) => {
                const key = Object.keys(attribute.properties)[0];
                return (
                  <tr
                    key={index}
                    className="text-xs dark:bg-tooltip dark:even:bg-panel"
                  >
                    <td className="flex items-start gap-1 py-3 px-4 dark:text-white font-medium text-right">
                      {key} - {attribute.is_egress ? "egress" : "ingress"}
                    </td>
                    <td className="py-3 px-4 overflow-auto scrollbar break-all">
                      <ul className="grid gap-1 list-disc px-3">
                        {attribute.properties[key].map(
                          (attribute: string, index: number) => {
                            return <li key={index}>{attribute}</li>;
                          }
                        )}
                      </ul>
                    </td>
                  </tr>
                );
              })}
              {portProtocol?.map(
                (attribute: PortProtocolType, index: number) => {
                  const key = Object.keys(attribute.properties)[0];
                  return (
                    <tr
                      key={index}
                      className="text-xs dark:bg-tooltip dark:even:bg-panel"
                    >
                      <td className="flex items-start gap-1 py-3 px-4 dark:text-white font-medium text-right">
                        {key} - {attribute.is_egress ? "egress" : "ingress"}
                      </td>
                      <td className="py-3 px-4 overflow-auto scrollbar break-all">
                        <ul className="grid gap-1 list-disc px-3">
                          {attribute.properties[key].map(
                            (attribute: string, index: number) => {
                              return <li key={index}>{attribute}</li>;
                            }
                          )}
                        </ul>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </TableLayout>
        </section>
      )}
    </>
  );
};

export default FirewallInfo;
