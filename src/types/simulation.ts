import { Account } from "./settings";

export interface SimulationStore {
  selectedSimulationAccount: Account | undefined;
  setSelectedSimulationAccount: (
    selectedSimulationAccount: Account | undefined
  ) => void;
  selectedSimulationTab: string;
  setSelectedSimulationTab: (selectedSimulationTab: string) => void;
  simulationSnapshotTime: Date | null;
  setSimulationSnapshotTime: (simulationSnapshotTime: Date | null) => void;
  selectedSimulationPackage: string;
  setSelectedSimulationPackage: (selectedSimulationPackage: string) => void;
  selectedSimulationScope: string;
  setSelectedSimulationScope: (selectedSimulationScope: string) => void;
  selectedSimulationNodeObj: SimulationNodeObj | null;
  setSelectedSimulationNodeObj: (
    selectedSimulationNodeObj: SimulationNodeObj | null
  ) => void;
  selectedSimulationAnnotationType: string;
  setSelectedSimulationAnnotationType: (
    selectedSimulationAnnotationType: string
  ) => void;
}

export interface SimulationNodeObj {
  integration_type: string;
  node_class: string;
  source: string;
  target: string[];
}
