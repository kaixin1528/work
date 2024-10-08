import { InvestigationStore } from "src/types/general";
import { StoreApi, UseBoundStore, create } from "zustand";

export const createShowEvidencePanel = (set: {
  (partial: InvestigationStore, replace?: boolean | undefined): void;
  (arg0: { showEvidencePanel: boolean }): void;
}) => ({
  showEvidencePanel: false,
  setShowEvidencePanel: (showEvidencePanel: boolean) =>
    set({ showEvidencePanel: showEvidencePanel }),
});

export const createSelectedEvidencePanelTab = (set: {
  (partial: InvestigationStore, replace?: boolean | undefined): void;
  (arg0: { selectedEvidencePanelTab: string }): void;
}) => ({
  selectedEvidencePanelTab: "",
  setSelectedEvidencePanelTab: (selectedEvidencePanelTab: string) =>
    set({ selectedEvidencePanelTab: selectedEvidencePanelTab }),
});

export const createSelectedEvidenceID = (set: {
  (partial: InvestigationStore, replace?: boolean | undefined): void;
  (arg0: { selectedEvidenceID: string }): void;
}) => ({
  selectedEvidenceID: "",
  setSelectedEvidenceID: (selectedEvidenceID: string) =>
    set({ selectedEvidenceID: selectedEvidenceID }),
});

export const useInvestigationStore: UseBoundStore<
  StoreApi<InvestigationStore>
> = create((set) => ({
  ...createSelectedEvidencePanelTab(set),
  ...createShowEvidencePanel(set),
  ...createSelectedEvidenceID(set),
}));
