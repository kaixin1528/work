import { KeyStringVal } from "src/types/general";
import { GRCStore } from "src/types/grc";
import { StoreApi, UseBoundStore, create } from "zustand";

export const createGRCCategory = (set: {
  (partial: GRCStore, replace?: boolean | undefined): void;
  (arg0: { GRCCategory: string }): void;
}) => ({
  GRCCategory: "overview",
  setGRCCategory: (GRCCategory: string) => set({ GRCCategory: GRCCategory }),
});

export const createGRCQuery = (set: {
  (partial: GRCStore, replace?: boolean | undefined): void;
  (arg0: { GRCQuery: string }): void;
}) => ({
  GRCQuery: "",
  setGRCQuery: (GRCQuery: string) => set({ GRCQuery: GRCQuery }),
});

export const createGRCQueryOption = (set: {
  (partial: GRCStore, replace?: boolean | undefined): void;
  (arg0: { GRCQueryOption: string }): void;
}) => ({
  GRCQueryOption: "metadata",
  setGRCQueryOption: (GRCQueryOption: string) =>
    set({ GRCQueryOption: GRCQueryOption }),
});

export const createSelectedMappingNode = (set: {
  (partial: GRCStore, replace?: boolean | undefined): void;
  (arg0: { selectedMappingNode: any }): void;
}) => ({
  selectedMappingNode: undefined,
  setSelectedMappingNode: (node: GRCStore | undefined) =>
    set({ selectedMappingNode: node }),
});

export const createGRCQuestionIDNotif = (set: {
  (partial: GRCStore, replace?: boolean | undefined): void;
  (arg0: { GRCQuestionIDNotif: string }): void;
}) => ({
  GRCQuestionIDNotif: "",
  setGRCQuestionIDNotif: (GRCQuestionIDNotif: string) =>
    set({ GRCQuestionIDNotif: GRCQuestionIDNotif }),
});

export const createSelectedGRCAssessment = (set: {
  (partial: GRCStore, replace?: boolean | undefined): void;
  (arg0: { selectedGRCAssessment: KeyStringVal }): void;
}) => ({
  selectedGRCAssessment: { name: "", assessment_id: "" },
  setSelectedGRCAssessment: (selectedGRCAssessment: KeyStringVal) =>
    set({ selectedGRCAssessment: selectedGRCAssessment }),
});

export const createSelectedGRCQuestionBank = (set: {
  (partial: GRCStore, replace?: boolean | undefined): void;
  (arg0: { selectedGRCQuestionBank: KeyStringVal }): void;
}) => ({
  selectedGRCQuestionBank: { name: "", question_bank_id: "" },
  setSelectedGRCQuestionBank: (selectedGRCQuestionBank: KeyStringVal) =>
    set({ selectedGRCQuestionBank: selectedGRCQuestionBank }),
});

export const createSelectedAnchorID = (set: {
  (partial: GRCStore, replace?: boolean | undefined): void;
  (arg0: { selectedAnchorID: string }): void;
}) => ({
  selectedAnchorID: "",
  setSelectedAnchorID: (selectedAnchorID: string) =>
    set({ selectedAnchorID: selectedAnchorID }),
});

export const createShowGRCPanel = (set: {
  (partial: GRCStore, replace?: boolean | undefined): void;
  (arg0: { showGRCPanel: boolean }): void;
}) => ({
  showGRCPanel: false,
  setShowGRCPanel: (showGRCPanel: boolean) =>
    set({ showGRCPanel: showGRCPanel }),
});

export const createSelectedGRCPanelTab = (set: {
  (partial: GRCStore, replace?: boolean | undefined): void;
  (arg0: { selectedGRCPanelTab: string }): void;
}) => ({
  selectedGRCPanelTab: "",
  setSelectedGRCPanelTab: (selectedGRCPanelTab: string) =>
    set({ selectedGRCPanelTab: selectedGRCPanelTab }),
});

export const useGRCStore: UseBoundStore<StoreApi<GRCStore>> = create((set) => ({
  ...createGRCCategory(set),
  ...createGRCQuery(set),
  ...createGRCQueryOption(set),
  ...createSelectedMappingNode(set),
  ...createGRCQuestionIDNotif(set),
  ...createSelectedGRCAssessment(set),
  ...createSelectedGRCQuestionBank(set),
  ...createSelectedAnchorID(set),
  ...createShowGRCPanel(set),
  ...createSelectedGRCPanelTab(set),
}));
