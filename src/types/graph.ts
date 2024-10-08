import { GraphEdge, GraphInfo, GraphNode, KeyStringVal } from "./general";

export interface GraphStore {
  graphNav: GraphNav[];
  setGraphNav: (graphNav: GraphNav[]) => void;
  diffIntegrationType: string;
  setDiffIntegrationType: (diffIntegrationType: string) => void;
  diffView: string;
  setDiffView: (diffView: string) => void;
  diffStartTime: DiffStartTime;
  setDiffStartTime: (diffStartTime: DiffStartTime) => void;
  diffFilter: string[];
  setDiffFilter: (diffFilter: string[]) => void;
  navigationView: string;
  setNavigationView: (navigationView: string) => void;
  elementType: string;
  setElementType: (elementType: string) => void;
  selectedNode: GraphNode | undefined;
  setSelectedNode: (selectedNode: GraphNode | undefined) => void;
  selectedEdge: GraphEdge | undefined;
  setSelectedEdge: (selectedEdge: GraphEdge | undefined) => void;
  graphInfo: GraphInfo;
  setGraphInfo: (graphInfo: GraphInfo) => void;
  selectedPanelTab: string;
  setSelectedPanelTab: (selectedPanelTab: string) => void;
  showGraphAnnotations: boolean;
  setShowGraphAnnotations: (showGraphAnnotations: boolean) => void;
  graphSearchString: string;
  setGraphSearchString: (graphSearchString: string) => void;
  graphSearch: boolean;
  setGraphSearch: (graphSearch: boolean) => void;
  graphSearching: boolean;
  setGraphSearching: (graphSearching: boolean) => void;
  snapshotTime: Date | null;
  setSnapshotTime: (snapshotTime: Date | null) => void;
  snapshotIndex: number;
  setSnapshotIndex: (snapshotIndex: number) => void;
  curSearchSnapshot: any;
  setCurSearchSnapshot: (curSearchSnapshot: any) => void;
  temporalStartDate: Date;
  setTemporalStartDate: (temporalStartDate: Date) => void;
  temporalEndDate: Date;
  setTemporalEndDate: (temporalEndDate: Date) => void;
  temporalSearchTimestamps: any;
  setTemporalSearchTimestamps: (temporalSearchTimestamps: any) => void;
  selectedTemporalDay: string;
  setSelectedTemporalDay: (selectedTemporalDay: string) => void;
  selectedTemporalTimestamp: number;
  setSelectedTemporalTimestamp: (selectedTemporalTimestamp: number) => void;
  selectedContextMenu: ContextMenu;
  setSelectedContextMenu: (selectedContextMenu: ContextMenu) => void;
}
export interface GraphNav {
  nodeID: string;
  nodeType: string;
}

export interface NoteType {
  id: string;
  author_email: string;
  is_edited: boolean;
  created_at: number;
  last_updated_at: number;
  body: string;
  content: string;
}

export interface DiffStartTime {
  month?: number;
  day?: number;
  hour?: number;
  snapshot?: number;
}

export interface SearchResult {
  [key: string]: {
    source_nodes: string[];
    qualifying_nodes: string[];
    depth: number;
    common_ancestor: string;
  };
}

export interface Result {
  source_nodes: string[];
  qualifying_nodes: string[];
  depth?: number;
  common_ancestor?: string;
}

export interface SearchDaysResult {
  [key: string]: {
    start: number;
    end: number;
  };
}

export interface DiffBucket {
  [key: string]: number;
}

export interface SearchTemporalIndexes {
  [key: number]: number[];
}

export interface SnapshotTimestampType {
  timestamps: number[];
  missing: number[];
}

export interface OriginalGraphNode {
  id: string;
  mostrecenttimestamp: number;
  type: string;
  type_id: string;
  cloud_id: string;
  region: string;
  parent_node_id: string[];
  level: number;
  has_comments: boolean;
  has_events: boolean;
  impacted?: KeyStringVal;
  position?: { x: number; y: number };
}

export interface OriginalGraphEdge {
  source_id: string;
  edge_id: string;
  rel_src: { rel: string }[];
  target_id: string;
  impacted?: boolean;
}

export interface DiffStats {
  created: number;
  modified: number;
  removed: number;
}

export interface Rel {
  rel_src: { rel: string }[];
  rel_target: { rel: string }[];
}
export interface DiffEdge {
  old_timestamp: number;
  new_timestamp: number;
  action: string;
  src_id: string;
  dst_id: string;
  old_rel: Rel;
  new_rel: Rel;
}

export interface ContextMenu {
  id: string;
  integrationType: string;
  nodeType: string;
  top: number | false;
  left: number | false;
  right: number | false;
  bottom: number | false;
}

export interface QueryLookup {
  query_type: string;
  id?: string;
  type?: string;
  radius?: number;
  impact_radius?: number;
  connected?: string;
  property_name?: string;
  property_operator?: string;
  property_value?: string;
  repo_name?: string;
  branch_name?: string;
  name?: string;
}
