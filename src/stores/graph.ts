import { StoreApi, UseBoundStore, create } from "zustand";
import {
  GraphNav,
  DiffStartTime,
  ContextMenu,
  GraphStore,
} from "../types/graph";
import { GraphNode, GraphEdge, GraphInfo } from "src/types/general";
import {
  defaultDepth,
  initialContextMenu,
  initialDiffFilter,
  orgCloud,
} from "src/constants/graph";

export const createGraphNav = (set: {
  (partial: GraphStore, replace?: boolean | undefined): void;
  (arg0: { graphNav: GraphNav[] }): void;
}) => ({
  graphNav: [
    {
      nodeID: "",
      nodeType: orgCloud,
    },
  ],
  setGraphNav: (graphNav: GraphNav[]) => set({ graphNav: graphNav }),
});

export const createDiffIntegrationType = (set: {
  (partial: GraphStore, replace?: boolean | undefined): void;
  (arg0: { diffIntegrationType: string }): void;
}) => ({
  diffIntegrationType: "",
  setDiffIntegrationType: (diffIntegrationType: string) =>
    set({ diffIntegrationType: diffIntegrationType }),
});

export const createDiffView = (set: {
  (partial: GraphStore, replace?: boolean | undefined): void;
  (arg0: { diffView: string }): void;
}) => ({
  diffView: "month",
  setDiffView: (diffView: string) => set({ diffView: diffView }),
});

export const createDiffStartTime = (set: {
  (partial: GraphStore, replace?: boolean | undefined): void;
  (arg0: { diffStartTime: DiffStartTime }): void;
}) => ({
  diffStartTime: { month: 0 },
  setDiffStartTime: (diffStartTime: DiffStartTime) =>
    set({ diffStartTime: diffStartTime }),
});

export const createDiffFilter = (set: {
  (partial: GraphStore, replace?: boolean | undefined): void;
  (arg0: { diffFilter: string[] }): void;
}) => ({
  diffFilter: initialDiffFilter,
  setDiffFilter: (diffFilter: string[]) => set({ diffFilter: diffFilter }),
});

export const createNavigationView = (set: {
  (partial: GraphStore, replace?: boolean | undefined): void;
  (arg0: { navigationView: string }): void;
}) => ({
  navigationView: "snapshots",
  setNavigationView: (navigationView: string) =>
    set({ navigationView: navigationView }),
});

export const createElementType = (set: {
  (partial: GraphStore, replace?: boolean | undefined): void;
  (arg0: { elementType: string }): void;
}) => ({
  elementType: "",
  setElementType: (elementType: string) => set({ elementType: elementType }),
});

export const createSelectedNode = (set: {
  (partial: GraphStore, replace?: boolean | undefined): void;
  (arg0: { selectedNode: GraphNode | undefined }): void;
}) => ({
  selectedNode: undefined,
  setSelectedNode: (node: GraphNode | undefined) => set({ selectedNode: node }),
});

export const createSelectedEdge = (set: {
  (partial: GraphStore, replace?: boolean | undefined): void;
  (arg0: { selectedEdge: GraphEdge | undefined }): void;
}) => ({
  selectedEdge: undefined,
  setSelectedEdge: (edge: GraphEdge | undefined) => set({ selectedEdge: edge }),
});

export const createGraphInfo = (set: {
  (partial: GraphStore, replace?: boolean | undefined): void;
  (arg0: { graphInfo: GraphInfo }): void;
}) => ({
  graphInfo: {
    root: "",
    depth: defaultDepth,
    showOnlyAgg: true,
    showPanel: false,
  },
  setGraphInfo: (graphInfo: GraphInfo) => set({ graphInfo: graphInfo }),
});

export const createSelectedPanelTab = (set: {
  (partial: GraphStore, replace?: boolean | undefined): void;
  (arg0: { selectedPanelTab: string }): void;
}) => ({
  selectedPanelTab: "Info",
  setSelectedPanelTab: (selectedPanelTab: string) =>
    set({ selectedPanelTab: selectedPanelTab }),
});

export const createShowGraphAnnotations = (set: {
  (partial: GraphStore, replace?: boolean | undefined): void;
  (arg0: { showGraphAnnotations: boolean }): void;
}) => ({
  showGraphAnnotations: true,
  setShowGraphAnnotations: (showGraphAnnotations: boolean) =>
    set({ showGraphAnnotations: showGraphAnnotations }),
});

export const createGraphSearchString = (set: {
  (partial: GraphStore, replace?: boolean | undefined): void;
  (arg0: { graphSearchString: string }): void;
}) => ({
  graphSearchString: "",
  setGraphSearchString: (graphSearchString: string) =>
    set({ graphSearchString: graphSearchString }),
});

export const createGraphSearch = (set: {
  (partial: GraphStore, replace?: boolean | undefined): void;
  (arg0: { graphSearch: boolean }): void;
}) => ({
  graphSearch: false,
  setGraphSearch: (graphSearch: boolean) => set({ graphSearch: graphSearch }),
});

export const createGraphSearching = (set: {
  (partial: GraphStore, replace?: boolean | undefined): void;
  (arg0: { graphSearching: boolean }): void;
}) => ({
  graphSearching: false,
  setGraphSearching: (graphSearching: boolean) =>
    set({ graphSearching: graphSearching }),
});

export const createSnapshotTime = (set: {
  (partial: GraphStore, replace?: boolean | undefined): void;
  (arg0: { snapshotTime: Date | null }): void;
}) => ({
  snapshotTime: new Date(),
  setSnapshotTime: (snapshotTime: Date | null) =>
    set({ snapshotTime: snapshotTime }),
});

export const createSnapshotIndex = (set: {
  (partial: GraphStore, replace?: boolean | undefined): void;
  (arg0: { snapshotIndex: number }): void;
}) => ({
  snapshotIndex: -1,
  setSnapshotIndex: (snapshotIndex: number) =>
    set({ snapshotIndex: snapshotIndex }),
});

export const createCurSearchSnapshot = (set: {
  (partial: GraphStore, replace?: boolean | undefined): void;
  (arg0: { curSearchSnapshot: any }): void;
}) => ({
  curSearchSnapshot: null,
  setCurSearchSnapshot: (curSearchSnapshot: any) =>
    set({ curSearchSnapshot: curSearchSnapshot }),
});

export const createTemporalStartDate = (set: {
  (partial: GraphStore, replace?: boolean | undefined): void;
  (arg0: { temporalStartDate: Date }): void;
}) => ({
  temporalStartDate: new Date(),
  setTemporalStartDate: (temporalStartDate: Date) =>
    set({ temporalStartDate: temporalStartDate }),
});

export const createTemporalEndDate = (set: {
  (partial: GraphStore, replace?: boolean | undefined): void;
  (arg0: { temporalEndDate: Date }): void;
}) => ({
  temporalEndDate: new Date(),
  setTemporalEndDate: (temporalEndDate: Date) =>
    set({ temporalEndDate: temporalEndDate }),
});

export const createTemporalSearchTimestamps = (set: {
  (partial: GraphStore, replace?: boolean | undefined): void;
  (arg0: { temporalSearchTimestamps: any }): void;
}) => ({
  temporalSearchTimestamps: {},
  setTemporalSearchTimestamps: (temporalSearchTimestamps: any) =>
    set({ temporalSearchTimestamps: temporalSearchTimestamps }),
});

export const createSelectedTemporalDay = (set: {
  (partial: GraphStore, replace?: boolean | undefined): void;
  (arg0: { selectedTemporalDay: string }): void;
}) => ({
  selectedTemporalDay: "",
  setSelectedTemporalDay: (selectedTemporalDay: string) =>
    set({ selectedTemporalDay: selectedTemporalDay }),
});

export const createSelectedTemporalTimestamp = (set: {
  (partial: GraphStore, replace?: boolean | undefined): void;
  (arg0: { selectedTemporalTimestamp: number }): void;
}) => ({
  selectedTemporalTimestamp: -1,
  setSelectedTemporalTimestamp: (selectedTemporalTimestamp: number) =>
    set({ selectedTemporalTimestamp: selectedTemporalTimestamp }),
});

export const createSelectedContextMenu = (set: {
  (partial: GraphStore, replace?: boolean | undefined): void;
  (arg0: { selectedContextMenu: ContextMenu }): void;
}) => ({
  selectedContextMenu: initialContextMenu,
  setSelectedContextMenu: (selectedContextMenu: ContextMenu) =>
    set({ selectedContextMenu: selectedContextMenu }),
});

export const useGraphStore: UseBoundStore<StoreApi<GraphStore>> = create(
  (set) => ({
    ...createGraphNav(set),
    ...createDiffIntegrationType(set),
    ...createDiffView(set),
    ...createDiffStartTime(set),
    ...createDiffFilter(set),
    ...createNavigationView(set),
    ...createElementType(set),
    ...createSelectedNode(set),
    ...createSelectedEdge(set),
    ...createGraphInfo(set),
    ...createSelectedPanelTab(set),
    ...createShowGraphAnnotations(set),
    ...createGraphSearchString(set),
    ...createGraphSearch(set),
    ...createGraphSearching(set),
    ...createSnapshotTime(set),
    ...createSnapshotIndex(set),
    ...createCurSearchSnapshot(set),
    ...createTemporalStartDate(set),
    ...createTemporalEndDate(set),
    ...createTemporalSearchTimestamps(set),
    ...createSelectedTemporalDay(set),
    ...createSelectedTemporalTimestamp(set),
    ...createSelectedContextMenu(set),
  })
);
