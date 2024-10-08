import {
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  getIncomers,
  getOutgoers,
  Edge,
  Node,
  Box,
  Rect,
  ReactFlowInstance,
  getTransformForBounds,
} from "reactflow";
import { depthHeights } from "../constants/graph";
import { GraphInfo, KeyStringVal } from "../types/general";
import {
  ContextMenu,
  OriginalGraphEdge,
  OriginalGraphNode,
  Result,
  SearchDaysResult,
  SearchResult,
  SearchTemporalIndexes,
} from "../types/graph";
import { convertToDate, convertToMicrosec } from "./general";
import ELK from "elkjs/lib/elk.bundled.js";

export const getELKLayoutedMainElements = async (
  nodes: any,
  edges: any,
  width: number,
  height: number,
  options = {}
) => {
  const elk = new ELK();

  const isHorizontal = options?.["elk.direction"] === "RIGHT";
  const graph = {
    id: "root",
    layoutOptions: options,
    children: nodes.map((node: any) => ({
      ...node,
      // Adjust the target and source handle positions based on the layout
      // direction.
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",

      // Hardcode a width and height for elk to use when layouting.
      width: width,
      height: height,
    })),
    edges: edges,
  };

  try {
    const layoutedGraph = await elk.layout(graph);

    return {
      nodes: layoutedGraph.children?.map((node_1: any) => ({
        ...node_1,
        // React Flow expects a position property on the node instead of `x`
        // and `y` fields.
        position: { x: node_1.x, y: node_1.y },
      })),
      edges: layoutedGraph.edges,
    };
  } catch (message) {
    throw new Error(String(message));
  }
};

// re-centers the react flow graph according to viewport
export const onInit = (
  store: any,
  nodes: Node[],
  setMinZoom: (minZoom: number) => void,
  reactFlowInstance: ReactFlowInstance
) => {
  const { width, height } = store.getState();
  let heights: number[] = [];
  let widths: number[] = [];

  nodes.forEach((node: Node) => {
    heights = [...heights, node.position.y];
    widths = [...widths, node.position.x];
  });

  const maxHeight = Math.max(...heights) + 192;
  const maxWidth = Math.max(...widths) + 192;

  const transformBounds = getTransformForBounds(
    { height: maxHeight, width: maxWidth, x: 0, y: 0 },
    width,
    height,
    0,
    1
  );

  setMinZoom(transformBounds[2]);
  reactFlowInstance.setViewport({
    x: transformBounds[0],
    y: transformBounds[1],
    zoom: transformBounds[2],
  });
};

// creates a list of react flow nodes and edges
// based on the original list of nodes/edges fetched from the API
export const renderMainGraph = (
  nodes: OriginalGraphNode[],
  edges: OriginalGraphEdge[],
  setNodes: (nodes: any) => void,
  setEdges: (edges: Edge[]) => void,
  store: any,
  setMinZoom: (minZoom: number) => void,
  reactFlowInstance: ReactFlowInstance,
  curSearchSnapshot?: Result | null,
  graphAnnotations?: any,
  diffNodes?: any,
  diffEdges?: any,
  simulationAnnotations?: any,
  affectedNodeIDs?: any,
  showHorizontal?: boolean
) => {
  let nodesPerLevel = {} as { [key: number]: number };

  // for each react flow node, store important info in the data object
  const tempNodes = nodes.map((node: OriginalGraphNode) => {
    if (node.level !== null)
      nodesPerLevel[node.level] = nodesPerLevel[node.level] + 1 || 1;

    // agg, non-agg node type
    const type =
      node.type_id?.includes("AGG") || node.type_id?.includes("ARCHIVE")
        ? "AGG"
        : "NON_AGG";
    const simulationAnnotation = simulationAnnotations?.find(
      (obj: KeyStringVal) => obj.node_id === node.id
    );
    return {
      id: node.id || "",
      integrationType: node.cloud_id,
      nodeTypeName: node.type,
      nodeType: node.type_id,
      type: type,
      // zIndex: node.id === selectedContextMenu ? 999 : 1,
      data: {
        id: node.id || "",
        integrationType: node.cloud_id,
        nodeTypeName: node.type,
        nodeType: node.type_id,
        type: type,
        isHorizontal: showHorizontal,
        hasEvents: node.has_events,
        hasComments: node.has_comments,
        level: node.level,
        isSearched: curSearchSnapshot?.source_nodes?.includes(node.id)
          ? "source"
          : curSearchSnapshot?.qualifying_nodes?.includes(node.id)
          ? "qualifying"
          : null,
        diffNode: diffNodes?.find((obj: KeyStringVal) => obj.id === node.id),
        graphAnnotation: graphAnnotations?.find(
          (obj: KeyStringVal) => obj.graph_artifact_id === node.id
        )?.annotation,
        simulationAnnotation: simulationAnnotation,
        impacted: affectedNodeIDs?.includes(node.id),
      },
      position: { x: 0, y: 0 },
    };
  });

  // for each react flow edge, store important info in the data object
  const tempEdges = edges.map((edge: OriginalGraphEdge) => {
    return {
      id: edge.edge_id || "",
      type: "main",
      source: edge.source_id,
      target: edge.target_id,
      animated: edge.impacted ? true : false,
      data: {
        id: edge.edge_id || "",
        source: edge.source_id,
        target: edge.target_id,
        diffEdge: diffEdges?.find(
          (obj: KeyStringVal) =>
            `${obj.source_id}-${obj.target_id}` === edge.edge_id
        ),
        graphAnnotation: graphAnnotations?.find(
          (obj: KeyStringVal) => obj.graph_artifact_id === edge.edge_id
        )?.annotation,
        simulationAnnotation: simulationAnnotations?.find(
          (obj: KeyStringVal) => obj.graph_artifact_id === edge.edge_id
        ),
        impacted: edge.impacted,
      },
    };
  });

  if (Object.values(nodesPerLevel).length > 0) {
    // gets the maximum nodes of a level
    const maxNodesByLevel = Math.max(
      ...(Object.values(nodesPerLevel) as number[])
    );

    // gets the difference between min and max nodes on a level basis
    const minMaxDepthDiff =
      Math.max(...(Object.keys(nodesPerLevel) as any)) -
        Math.min(...(Object.keys(nodesPerLevel) as any)) || 1;

    // resets the nodes/edges positions according to directed graph layout
    getELKLayoutedMainElements(
      tempNodes,
      tempEdges,
      maxNodesByLevel >= 8
        ? 300
        : maxNodesByLevel * (2812.5 * Math.E ** (-0.66 * maxNodesByLevel)),
      minMaxDepthDiff * depthHeights[minMaxDepthDiff + 1],
      {
        "elk.direction": showHorizontal ? "RIGHT" : "DOWN",
        "elk.algorithm": showHorizontal ? "layered" : "mrtree",
      }
    ).then(({ nodes: layoutedNodes, edges: layoutedEdges }: any) => {
      onInit(store, layoutedNodes, setMinZoom, reactFlowInstance);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    });
  } else {
    onInit(store, tempNodes, setMinZoom, reactFlowInstance);
    setNodes(tempNodes);
    setEdges(tempEdges);
  }
};

// get all incoming nodes of a node
export const getAllIncomers = (
  node: Node,
  nodes: Node[],
  edges: Edge[]
): Node[] => {
  return getIncomers(node, nodes, edges).reduce<Node[]>(
    (memo, incomer) => [
      ...memo,
      incomer,
      ...getAllIncomers(incomer, nodes, edges),
    ],
    []
  );
};

// get all outgoing nodes of a node
export const getAllOutgoers = (
  node: Node,
  nodes: Node[],
  edges: Edge[]
): Node[] => {
  return getOutgoers(node, nodes, edges).reduce<Node[]>(
    (memo, outgoer) => [
      ...memo,
      outgoer,
      ...getAllOutgoers(outgoer, nodes, edges),
    ],
    []
  );
};

// highlight the edges that connect to a node
export const highlightPath = (
  node: Node,
  nodes: Node[],
  edges: Edge[],
  setNodes: (nodes: any) => void,
  setEdges: (edges: any) => void
) => {
  const allIncomers = getAllIncomers(node, nodes, edges);
  const allOutgoers = getAllOutgoers(node, nodes, edges);

  const incomerIds = allIncomers.map((i: Node) => i.id);
  const outgoerIds = allOutgoers.map((o: Node) => o.id);

  setNodes((prevNodes: Node[]) => {
    return prevNodes?.map((currentNode: Node) => {
      if (allOutgoers.length > 0 || allIncomers.length > 0) {
        const highlight =
          currentNode.id === node.id ||
          incomerIds.includes(currentNode.id) ||
          outgoerIds.includes(currentNode.id);

        currentNode.style = {
          ...currentNode.style,
          opacity: highlight ? 1 : 0.25,
        };
      }
      return currentNode;
    });
  });

  setEdges((prevEdges: Edge[]) => {
    return prevEdges?.map((currentEdge: Edge) => {
      const animated =
        (incomerIds.includes(currentEdge.source) &&
          incomerIds.includes(currentEdge.target)) ||
        ((node.id === currentEdge.source ||
          outgoerIds.includes(currentEdge.source)) &&
          outgoerIds.includes(currentEdge.target)) ||
        node.id === currentEdge.target;
      currentEdge.animated = animated;

      currentEdge.style = {
        ...currentEdge.style,
        stroke: animated ? "#EA9010" : "#b1b1b7",
        opacity: animated ? 1 : 0.25,
      };

      return currentEdge;
    });
  });
};

// unhighlight the edges that connect to a node
export const resetNodeStyles = (
  setNodes: (nodes: any) => void,
  setEdges: (edges: any) => void
) => {
  setNodes((prevNodes: Node[]) => {
    return prevNodes?.map((currentNode: Node) => {
      currentNode.style = {
        ...currentNode.style,
        opacity: 1,
      };

      return currentNode;
    });
  });

  setEdges((prevEdges: Edge[]) => {
    return prevEdges?.map((currentEdge: Edge) => {
      currentEdge.animated = false;
      currentEdge.style = {
        ...currentEdge.style,
        stroke: "#b1b1b7",
        opacity: 1,
      };
      return currentEdge;
    });
  });
};

const getBoundsOfBoxes = (box1: Box, box2: Box): Box => ({
  x: Math.min(box1.x, box2.x),
  y: Math.min(box1.y, box2.y),
  x2: Math.max(box1.x2, box2.x2),
  y2: Math.max(box1.y2, box2.y2),
});

export const rectToBox = ({ x, y, width, height }: Rect): Box => ({
  x,
  y,
  x2: x + width,
  y2: y + height,
});

export const boxToRect = ({ x, y, x2, y2 }: Box): Rect => ({
  x,
  y,
  width: x2 - x,
  height: y2 - y,
});

// get viewport values
export const getBoundsofRects = (rect1: Rect, rect2: Rect): Rect =>
  boxToRect(getBoundsOfBoxes(rectToBox(rect1), rectToBox(rect2)));

export const closestTime = (timestamp: number, timestamps: number[]) => {
  return timestamps.reduce((a, b) => {
    const extraMinutes = new Date(timestamp / 1000).getUTCMinutes();
    const filteredTimestamp =
      extraMinutes === 0 ? timestamp : timestamp - extraMinutes * 6e7 + 3.6e9;
    let aDiff = Math.abs(Number(a) - Number(filteredTimestamp));
    let bDiff = Math.abs(Number(b) - Number(filteredTimestamp));

    if (aDiff === bDiff) {
      return a > b ? a : b;
    } else {
      return bDiff < aDiff ? b : a;
    }
  }, 0);
};

export const closestValue = (value: number, values: any[]) => {
  return values.reduce((a, b) => {
    let aDiff = Math.abs(Number(a) - Number(value));
    let bDiff = Math.abs(Number(b) - Number(value));

    if (aDiff === bDiff) {
      return a > b ? a : b;
    } else {
      return bDiff < aDiff ? b : a;
    }
  }, 0);
};

export const useKeyPress = (
  targetKey: string,
  setEnterKeyPress: (enterKeyPress: boolean) => void
) => {
  const [keyPressed, setKeyPressed] = useState(false);

  const downHandler = (event: { key: string; preventDefault: () => void }) => {
    if (event.key === targetKey) {
      event.preventDefault();
      setKeyPressed(true);
    }
  };

  const upHandler = (event: { key: string; preventDefault: () => void }) => {
    if (event.key === targetKey) {
      event.preventDefault();
      setKeyPressed(false);
      setEnterKeyPress(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", downHandler);
    document.addEventListener("keyup", upHandler);
    return () => {
      document.removeEventListener("keydown", downHandler);
      document.removeEventListener("keyup", upHandler);
    };
  });

  return keyPressed;
};

// autocomplete on key press
export const keyPressAutocomplete = (
  showAutocompleteParams: boolean,
  showAutocompleteValues: boolean,
  filteredAutocompleteParams: string[],
  filteredAutocompleteValues: string[],
  downPress: boolean,
  upPress: boolean,
  cursor: number,
  setCursor: Dispatch<SetStateAction<number>>,
  autocompleteRef: MutableRefObject<any[]>
) => {
  if (downPress) {
    const listLength = showAutocompleteParams
      ? filteredAutocompleteParams.length
      : showAutocompleteValues
      ? filteredAutocompleteValues.length
      : 0;
    setCursor((prevCursor: number) =>
      prevCursor < listLength - 1 ? prevCursor + 1 : 0
    );
  } else if (upPress) {
    setCursor((prevCursor: number) => (prevCursor > 0 ? prevCursor - 1 : 0));
  }

  if (autocompleteRef && autocompleteRef.current[cursor]) {
    autocompleteRef.current[cursor].scrollIntoView();
  }
};

// select suggest query on key press
export const keyPressSuggestQueries = (
  list: string[],
  downPress: boolean,
  upPress: boolean,
  cursor: number,
  setCursor: Dispatch<SetStateAction<number>>,
  autocompleteRef: MutableRefObject<any[]>
) => {
  if (downPress) {
    const listLength = list?.length || 0;
    setCursor((prevCursor: number) =>
      prevCursor < listLength - 1 ? prevCursor + 1 : 0
    );
  } else if (upPress) {
    setCursor((prevCursor: number) => (prevCursor > 0 ? prevCursor - 1 : 0));
  }

  if (autocompleteRef && autocompleteRef.current[cursor]) {
    autocompleteRef.current[cursor].scrollIntoView();
  }
};

// break down search string into query params and query values
export const deconstructSearchString = (searchString: string) => {
  const obj = {} as KeyStringVal,
    re = new RegExp("(.*?):(.*?)(?: |$)", "g");
  String(searchString).replace(
    re,
    (_, key: string, value) => (obj[key.trim()] = value.trim())
  );

  return obj;
};

// get single property operator in a property search
export const getPropertyOperator = (searchString: string) => {
  const operatorRegex = /[^A-Za-z_0-9@]/;
  const valueRegex = /[^A-Za-z_0-9@][A-Za-z_0-9]/;
  return searchString.search(operatorRegex) !== -1
    ? searchString.slice(
        searchString.search(operatorRegex),
        searchString.indexOf('"') !== -1
          ? searchString.indexOf('"')
          : searchString.search(valueRegex) !== -1
          ? searchString.search(valueRegex) + 1
          : searchString.length
      )
    : "";
};

// get list of property names
export const getPropertyNames = (searchString: string) => {
  return searchString.split(",").reduce((pV: string[], cV: string) => {
    const operator = getPropertyOperator(cV);

    return [
      ...pV,
      cV.slice(0, operator !== "" ? cV.indexOf(operator) : cV.length + 1),
    ];
  }, []);
};

// get list of property operators
export const getPropertyOperators = (searchString: string) => {
  return searchString.split(",").reduce((pV: string[], cV: string) => {
    const operator = getPropertyOperator(cV);

    if (operator !== "") return [...pV, operator];
    else return [...pV];
  }, []);
};

// get list of property values
export const getPropertyValues = (searchString: string) => {
  return searchString.split(",").reduce((pV: string[], cV: string) => {
    const operator = getPropertyOperator(cV);
    const value =
      operator !== ""
        ? cV.slice(cV.indexOf(operator) + operator.length).replaceAll('"', "")
        : "";

    if (value !== "") return [...pV, value];
    else return [...pV];
  }, []);
};

// get last query param for autocomplete
export const getLastQueryParam = (
  searchString: string,
  autocompleteClick: string
) => {
  const obj = deconstructSearchString(searchString);
  if (Object.keys(obj).length > 0) {
    const lastQueryParam = Object.keys(obj)[Object.keys(obj).length - 1];
    const lastQueryValues = obj[Object.keys(obj)[Object.keys(obj).length - 1]];

    if (lastQueryParam.slice(-8) === "property") {
      const lastPart =
        lastQueryValues.split(",")[lastQueryValues.split(",").length - 1];
      const operators = getPropertyOperators(lastPart);
      const lastOperator =
        operators.length > 0 ? operators[operators.length - 1] : "";
      const propertyNames = getPropertyNames(lastPart);
      const lastPropertyName =
        propertyNames.length > 0 ? propertyNames[propertyNames.length - 1] : "";
      const propertyValues = getPropertyValues(lastPart);
      const lastPropertyValue =
        propertyValues.length > 0
          ? propertyValues[propertyValues.length - 1]
          : "";

      const filteredAutocompleteClick = autocompleteClick.replace(
        lastQueryParam,
        ""
      );
      const propertyName = filteredAutocompleteClick.search(/^[^!~=<>]+$/);
      const operator = filteredAutocompleteClick.search(/^[!~=<>]+$/);

      let filteredLastQueryParam =
        operator !== -1 ||
        (lastPropertyValue !== "" &&
          lastPart.lastIndexOf(lastOperator) <
            searchString.lastIndexOf(lastPropertyValue))
          ? "property_value"
          : (propertyName !== -1 &&
              lastPart.includes(filteredAutocompleteClick)) ||
            (lastOperator !== "" &&
              searchString.lastIndexOf(lastPropertyName) <
                searchString.lastIndexOf(lastOperator))
          ? "property_operator"
          : "property_name";

      return lastQueryParam.lastIndexOf("_") !== -1
        ? `${lastQueryParam.slice(
            0,
            lastQueryParam.lastIndexOf("_") + 1
          )}${filteredLastQueryParam}`
        : filteredLastQueryParam;
    } else return lastQueryParam;
  } else return "";
};

// handle autocomplete params on click/press
export const handleAutocompleteParamsToggle = (
  searchString: string,
  setSearchString: (searchString: string) => void,
  value: string
) => {
  const lastSpace = searchString.lastIndexOf(" ");

  setSearchString(
    `${
      lastSpace === -1
        ? `${value}:`
        : `${searchString.slice(0, lastSpace)} ${value}:`
    }`
  );
};

// handle autocomplete values on click/press
export const handleAutocompleValuesToggle = (
  searchString: string,
  setSearchString: (searchString: string) => void,
  value: string,
  autocompleteClick: string
) => {
  const obj = deconstructSearchString(searchString);
  if (Object.keys(obj).length > 0) {
    const lastQueryParam = Object.keys(obj)[Object.keys(obj).length - 1];
    const lastQueryValues = obj[Object.keys(obj)[Object.keys(obj).length - 1]];

    if (lastQueryParam.slice(-8) === "property") {
      const lastParam = getLastQueryParam(searchString, autocompleteClick);
      if (lastParam.includes("property_name")) {
        if (lastQueryValues.split(",").length > 1)
          setSearchString(
            `${searchString.slice(0, searchString.lastIndexOf(","))},${value}`
          );
        else
          setSearchString(
            `${searchString.slice(0, searchString.lastIndexOf(":"))}:${value}`
          );
      } else if (lastParam.includes("operator")) {
        const propertyNames = getPropertyNames(lastQueryValues);
        const lastPropertyName =
          propertyNames.length > 0
            ? propertyNames[propertyNames.length - 1]
            : "";
        if (lastPropertyName !== "")
          setSearchString(
            `${searchString.slice(
              0,
              searchString.lastIndexOf(lastPropertyName) +
                lastPropertyName.length
            )}${value}`
          );
      } else if (lastParam.includes("property_value")) {
        const operators = getPropertyOperators(lastQueryValues);
        const lastOperator =
          operators.length > 0 ? operators[operators.length - 1] : "";
        if (lastOperator !== "")
          setSearchString(
            `${searchString.slice(
              0,
              searchString.lastIndexOf(lastOperator) + lastOperator.length
            )}"${value}"`
          );
      }
    } else
      setSearchString(
        `${searchString.slice(0, searchString.lastIndexOf(":"))}:${value} `
      );
  }
};

// handle query on last query param
export const handleAutocompleteQuery = (
  searchString: string,
  setQuery: (query: string) => void,
  autocompleteClick: string,
  setAutocompleteClick: (autocompleteClick: string) => void
) => {
  if ([",", " ", ":"].includes(searchString.slice(-1))) {
    setQuery("");
    setAutocompleteClick("");
  } else {
    const obj = deconstructSearchString(searchString);
    if (Object.keys(obj).length > 0) {
      const lastQueryParam = Object.keys(obj)[Object.keys(obj).length - 1];
      const lastQueryValues =
        obj[Object.keys(obj)[Object.keys(obj).length - 1]];
      if (lastQueryParam.slice(-8) === "property") {
        const queryParam = getLastQueryParam(searchString, autocompleteClick);
        if (queryParam.includes("property_name")) {
          setQuery(
            searchString.slice(
              searchString.lastIndexOf(
                lastQueryValues.split(",").length > 1 ? "," : ":"
              ) + 1
            )
          );
        } else if (queryParam.includes("operator")) {
          const propertyNames = getPropertyNames(lastQueryValues);
          const lastPropertyName =
            propertyNames.length > 0
              ? propertyNames[propertyNames.length - 1]
              : "";
          if (lastPropertyName !== "")
            setQuery(
              searchString.slice(
                searchString.lastIndexOf(lastPropertyName) +
                  lastPropertyName.length
              )
            );
        } else if (queryParam.includes("property_value")) {
          const operators = getPropertyOperators(lastQueryValues);
          const lastOperator =
            operators.length > 0 ? operators[operators.length - 1] : "";
          if (lastOperator !== "")
            setQuery(
              searchString.slice(
                searchString.lastIndexOf(lastOperator) + lastOperator.length
              )
            );
        }
      } else
        setQuery(
          searchString.slice(
            searchString.lastIndexOf(":") + 1,
            searchString.lastIndexOf(" ") > searchString.lastIndexOf(":")
              ? searchString.lastIndexOf(" ")
              : searchString.length
          )
        );
    } else setQuery("");
  }
};

// get snapshot time
export const handleGetSnapshotTime = (
  snapshotAvailable: any,
  snapshotTimestamps: any,
  snapshotTime: Date | null,
  setSnapshotTime: (snapshotTime: Date) => void,
  setSnapshotIndex: (snapshotIndex: number) => void
) => {
  if (snapshotTimestamps) {
    if (snapshotTimestamps.missing.length === 24 && snapshotAvailable) {
      const latestSnapshot = convertToDate(snapshotAvailable.latest_snapshot);
      setSnapshotIndex(latestSnapshot.getUTCHours());
      setSnapshotTime(latestSnapshot);
    } else {
      const sortedSnapshotTimes = snapshotTimestamps?.timestamps.sort();
      const curTime = closestTime(
        convertToMicrosec(snapshotTime),
        sortedSnapshotTimes.filter(
          (x: number) => !snapshotTimestamps.missing.includes(x)
        )
      );
      setSnapshotIndex(sortedSnapshotTimes.indexOf(curTime));
      setSnapshotTime(convertToDate(curTime));
    }
  }
};

// graph playback
export const handlePlayback = (
  ref: any,
  outerCondition: boolean,
  innerCondition: boolean,
  setPlayback: (playback: boolean) => void,
  setIndex: (index: any) => void,
  indexValue: number | string,
  arr: string | any[],
  prevIndex: number,
  nextIndex: number,
  duration: number
) => {
  function reset() {
    if (ref.current) {
      clearTimeout(ref.current);
    }
  }
  reset();

  if (outerCondition) {
    if (innerCondition) {
      if (typeof indexValue === "string")
        ref.current = setTimeout(() => {
          setPlayback(false);
          setIndex(indexValue);
        }, duration);
      else {
        setPlayback(false);
        setIndex(indexValue);
      }
    } else {
      ref.current = setTimeout(() => {
        setIndex(prevIndex === arr.length ? 0 : nextIndex);
      }, duration);
    }
  }
  return () => {
    reset();
  };
};

// copy text to clipboard
export const copyToClipboard = (content: string) => {
  const el = document.createElement("textarea");
  el.value = content;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

// sets graph info, source/qualifying nodes
// on a succesful snapshot/temporal search query
export const handleMainSearchResults = (
  search: boolean,
  searchDays: SearchDaysResult,
  searchResults: SearchResult,
  navigationView: string,
  curSnapshotTime: number,
  setCurSearchSnapshot: any,
  selectedTemporalTimestamp: number,
  selectedTemporalDay: string,
  temporalSearchTimestamps: SearchTemporalIndexes,
  setSelectedTemporalDay: (selectedTemporalDay: string) => void,
  setTemporalSearchTimestamps: (
    temporalSearchTimestamps: SearchTemporalIndexes
  ) => void,
  setSelectedTemporalTimestamp: (selectedTemporalTimestamp: number) => void,
  graphInfo: GraphInfo,
  setGraphInfo: (graphInfo: GraphInfo) => void,
  temporalRef: RefObject<HTMLElement>
) => {
  if (search && searchResults) {
    if (
      navigationView === "temporal" &&
      searchDays &&
      Object.keys(temporalSearchTimestamps).length === 0
    ) {
      const availableDays = {} as { [key: string]: number[] };

      Object.keys(searchDays).map((day: string) => {
        const dayStart = searchDays[day].start;
        const dayEnd = searchDays[day].end;

        // get the list of snapshot times in between this day
        const availableTimestamps = Object.keys(searchResults).reduce(
          (pV: number[], cV: any) => {
            if (
              Number(cV) >= dayStart &&
              Number(cV) <= dayEnd &&
              searchResults[cV].qualifying_nodes.length > 0
            )
              return [...pV, cV];
            else return [...pV];
          },
          []
        );

        // if day has snapshots, day will be rendered
        if (availableTimestamps.length > 0)
          availableDays[day] = availableTimestamps.sort();
        return availableDays;
      });

      // temporal search
      if (Object.keys(availableDays).length > 0) {
        const lastDay =
          Object.keys(availableDays)[Object.keys(availableDays).length - 1];

        const lastTimestamp =
          Object.values(availableDays)[Object.values(availableDays).length - 1][
            Object.values(availableDays)[
              Object.values(availableDays).length - 1
            ].length - 1
          ];

        if (selectedTemporalDay === "") setSelectedTemporalDay(lastDay);
        if (selectedTemporalTimestamp === -1)
          setSelectedTemporalTimestamp(lastTimestamp);
        setTemporalSearchTimestamps(availableDays);
        setCurSearchSnapshot(searchResults[curSnapshotTime]);

        if (temporalRef?.current) {
          temporalRef.current.scrollIntoView({
            behavior: "smooth",
          });
        }
      }
    }
    // snapshot search
    else {
      if (Object.keys(searchResults).length > 0) {
        const currentSnapshot = searchResults[Object.keys(searchResults)[0]];
        const maxDepth = currentSnapshot.depth || 0;
        const lca = currentSnapshot.common_ancestor || "";
        setGraphInfo({
          ...graphInfo,
          root: lca,
          depth: maxDepth,
          showOnlyAgg: false,
        });
      }
      setCurSearchSnapshot(searchResults[curSnapshotTime]);
    }
  }
};

// search existing query with selected property values
export const searchPropertyValues = (
  searchString: string,
  curAttribute: any,
  property: string
) => {
  const operator = "=";

  const values = Array.isArray(curAttribute.value)
    ? curAttribute.value.reduce(
        (pV: string, cV: string) =>
          `${pV}${pV !== "" ? "," : ""}${
            (curAttribute as any).property_name
          }${operator}"${cV}"`,
        ""
      )
    : `${curAttribute.property_name}${operator}"${curAttribute.value}"`;

  const startsWithProperty = searchString.startsWith(property)
    ? `${searchString.slice(
        0,
        searchString.indexOf(" ")
      )},${values}${searchString.slice(searchString.indexOf(" "))}`
    : "";

  const propertyStartIndex = searchString.indexOf(` ${property}`);
  const propertyEndIndex = searchString.slice(propertyStartIndex).indexOf('" ');
  const containsProperty =
    propertyStartIndex !== -1
      ? `${searchString.slice(
          0,
          propertyEndIndex !== -1
            ? propertyEndIndex + propertyStartIndex + 1
            : searchString.length
        )},${values}${searchString.slice(
          propertyEndIndex !== -1
            ? propertyEndIndex + propertyStartIndex + 1
            : searchString.length
        )}`
      : "";

  const noProperty = `${searchString} ${property}:${values}`;

  return startsWithProperty || containsProperty || noProperty;
};

// view snapshot search
export const handleViewSnapshot = (
  searchString: string,
  setNavigationView: (navigationView: string) => void,
  setGraphSearch: (graphSearch: boolean) => void,
  setGraphSearching: (graphSearching: boolean) => void,
  setGraphSearchString: (graphSearchString: string) => void,
  navigate: any,
  setSnapshotTime: (snapshotTime: Date | null) => void,
  curSnapshotTime?: number
) => {
  setNavigationView("snapshots");
  setGraphSearch(true);
  setGraphSearching(false);
  setGraphSearchString(searchString);
  if (curSnapshotTime && setSnapshotTime)
    setSnapshotTime(convertToDate(curSnapshotTime));
  else setSnapshotTime(new Date());
  navigate("/graph/summary");
};

// set the z index of the selected node's context menu to 999
export const handleViewContextMenu = (
  selectedContextMenu: ContextMenu,
  setNodes: (nodes: any) => void
) => {
  setNodes((prevNodes: any) =>
    prevNodes.map((node: any) => ({
      ...node,
      zIndex: selectedContextMenu.id === node.id ? 999 : 1,
    }))
  );
};

export const onNodeContextMenu = (
  e: { preventDefault: () => void; clientY: number; clientX: number },
  node: any,
  ref: any,
  setSelectedContextMenu: (selectedContextMenu: ContextMenu) => void
) => {
  // Prevent native context menu from showing
  e.preventDefault();

  // Calculate position of the context menu. We want to make sure it
  // doesn't get positioned off-screen.
  const pane = ref?.current.getBoundingClientRect();
  setSelectedContextMenu({
    id: node.id,
    integrationType: node.integrationType,
    nodeType: node.nodeType,
    top: e.clientY < pane.height - 250 && e.clientY - 200,
    left: e.clientX < pane.width - 250 && e.clientX - 50,
    right: e.clientX >= pane.width - 250 && pane.width - e.clientX,
    bottom: e.clientY >= pane.height - 250 && pane.height - e.clientY + 200,
  });
};

// get key-value pairs of autocomplete
export const getAutocompleteKeyValuePairs = (obj: any) => {
  return Object.assign(
    {},
    ...Object.entries(obj).map((keyVal) => {
      if (keyVal[0].slice(-8) !== "property") {
        if (keyVal[1] === "") return null;
        return { [keyVal[0]]: keyVal[1] };
      } else {
        return Object.assign(
          {},
          ...["name", "operator", "value"]
            .map((key) => {
              let arr = [] as string[];
              switch (key) {
                case "name":
                  arr = getPropertyNames(obj[keyVal[0]]);
                  break;
                case "operator":
                  arr = getPropertyOperators(obj[keyVal[0]]);
                  break;
                case "value":
                  arr = getPropertyValues(obj[keyVal[0]]);
                  break;
              }
              if (arr.length === 0) return null;
              return {
                [`${keyVal[0]}_${key}`]: arr,
              };
            })
            .filter(Boolean)
        );
      }
    })
  );
};

// get list of key-value pairs for cypher matches
export const getCypherMatches = (match: KeyStringVal) => {
  return {
    ...(match.match1Value && { [match.match1Name]: match.match1Value }),
    ...(!["", "all"].includes(match.relValue) && {
      [match.relName]: match.relValue,
    }),
    ...(match.match2Value && { [match.match2Name]: match.match2Value }),
  };
};

// get list of key-value pairs for cypher conditions
export const getCypherProperties = (conditions: KeyStringVal[]) => {
  const obj = {} as any;
  conditions.forEach((condition) => {
    const propertyType = `${
      ["connected", "annotation", "extension"].includes(condition.match)
        ? `${condition.match}_property`
        : "property"
    }`;
    let value = "";
    ["name", "operator", "value"].forEach((suffix) => {
      switch (suffix) {
        case "name":
          value = condition.propertyName;
          break;
        case "operator":
          value = condition.propertyOperator;
          break;
        case "value":
          value = "***";
          break;
      }

      if (value) {
        const keyName = `${propertyType}_${suffix}`;
        obj[keyName] = obj[keyName]
          ? [...obj[keyName], value].filter(Boolean)
          : [value];
      }
    });
  });
  return obj;
};
