import { SimulationStore } from "src/types/general";
import { Account } from "src/types/settings";
import { SimulationNodeObj } from "src/types/simulation";
import { StoreApi, UseBoundStore, create } from "zustand";

export const createSelectedSimulationAccount = (set: {
  (partial: SimulationStore, replace?: boolean | undefined): void;
  (arg0: { selectedSimulationAccount: Account | undefined }): void;
}) => ({
  selectedSimulationAccount: undefined,
  setSelectedSimulationAccount: (
    selectedSimulationAccount: Account | undefined
  ) => set({ selectedSimulationAccount: selectedSimulationAccount }),
});

export const createSelectedSimulationTab = (set: {
  (partial: SimulationStore, replace?: boolean | undefined): void;
  (arg0: { selectedSimulationTab: string }): void;
}) => ({
  selectedSimulationTab: "Package Info",
  setSelectedSimulationTab: (selectedSimulationTab: string) =>
    set({ selectedSimulationTab: selectedSimulationTab }),
});

export const createSimulationSnapshotTime = (set: {
  (partial: SimulationStore, replace?: boolean | undefined): void;
  (arg0: { simulationSnapshotTime: Date | null }): void;
}) => ({
  simulationSnapshotTime: new Date(),
  setSimulationSnapshotTime: (simulationSnapshotTime: Date | null) =>
    set({ simulationSnapshotTime: simulationSnapshotTime }),
});

export const createSelectedSimulationPackage = (set: {
  (partial: SimulationStore, replace?: boolean | undefined): void;
  (arg0: { selectedSimulationPackage: string }): void;
}) => ({
  selectedSimulationPackage: "",
  setSelectedSimulationPackage: (selectedSimulationPackage: string) =>
    set({ selectedSimulationPackage: selectedSimulationPackage }),
});

export const createSelectedSimulationScope = (set: {
  (partial: SimulationStore, replace?: boolean | undefined): void;
  (arg0: { selectedSimulationScope: string }): void;
}) => ({
  selectedSimulationScope: "",
  setSelectedSimulationScope: (selectedSimulationScope: string) =>
    set({ selectedSimulationScope: selectedSimulationScope }),
});

export const createSelectedSimulationNodeObj = (set: {
  (partial: SimulationStore, replace?: boolean | undefined): void;
  (arg0: { selectedSimulationNodeObj: SimulationNodeObj | null }): void;
}) => ({
  selectedSimulationNodeObj: null,
  setSelectedSimulationNodeObj: (
    selectedSimulationNodeObj: SimulationNodeObj | null
  ) => set({ selectedSimulationNodeObj: selectedSimulationNodeObj }),
});

export const createSelectedSimulationAnnotationType = (set: {
  (partial: SimulationStore, replace?: boolean | undefined): void;
  (arg0: { selectedSimulationAnnotationType: string }): void;
}) => ({
  selectedSimulationAnnotationType: "impact",
  setSelectedSimulationAnnotationType: (
    selectedSimulationAnnotationType: string
  ) =>
    set({ selectedSimulationAnnotationType: selectedSimulationAnnotationType }),
});

export const useSimulationStore: UseBoundStore<StoreApi<SimulationStore>> =
  create((set) => ({
    ...createSelectedSimulationAccount(set),
    ...createSelectedSimulationTab(set),
    ...createSimulationSnapshotTime(set),
    ...createSelectedSimulationPackage(set),
    ...createSelectedSimulationScope(set),
    ...createSelectedSimulationScope(set),
    ...createSelectedSimulationNodeObj(set),
    ...createSelectedSimulationAnnotationType(set),
  }));
