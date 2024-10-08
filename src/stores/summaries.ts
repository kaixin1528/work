import { SummaryStore } from "src/types/general";
import { Account } from "src/types/settings";
import { StoreApi, UseBoundStore, create } from "zustand";

export const createPeriod = (set: {
  (partial: SummaryStore, replace?: boolean | undefined): void;
  (arg0: { period: number }): void;
}) => ({
  period: 3,
  setPeriod: (period: number) => set({ period: period }),
});

export const createSelectedReportAccount = (set: {
  (partial: SummaryStore, replace?: boolean | undefined): void;
  (arg0: { selectedReportAccount: Account | undefined }): void;
}) => ({
  selectedReportAccount: undefined,
  setSelectedReportAccount: (selectedReportAccount: Account | undefined) =>
    set({ selectedReportAccount: selectedReportAccount }),
});

export const createSelectedVRSeverity = (set: {
  (partial: SummaryStore, replace?: boolean | undefined): void;
  (arg0: { selectedVRSeverity: string }): void;
}) => ({
  selectedVRSeverity: "CRITICAL",
  setSelectedVRSeverity: (selectedVRSeverity: string) =>
    set({ selectedVRSeverity: selectedVRSeverity }),
});

export const createSelectedVRCVE = (set: {
  (partial: SummaryStore, replace?: boolean | undefined): void;
  (arg0: { selectedVRCVE: string }): void;
}) => ({
  selectedVRCVE: "",
  setSelectedVRCVE: (selectedVRCVE: string) =>
    set({ selectedVRCVE: selectedVRCVE }),
});

export const createSelectedVRIntegrationType = (set: {
  (partial: SummaryStore, replace?: boolean | undefined): void;
  (arg0: { selectedVRIntegrationType: string }): void;
}) => ({
  selectedVRIntegrationType: "AWS",
  setSelectedVRIntegrationType: (selectedVRIntegrationType: string) =>
    set({ selectedVRIntegrationType: selectedVRIntegrationType }),
});

export const createSelectedVRPage = (set: {
  (partial: SummaryStore, replace?: boolean | undefined): void;
  (arg0: { selectedVRPage: number }): void;
}) => ({
  selectedVRPage: 1,
  setSelectedVRPage: (selectedVRPage: number) =>
    set({ selectedVRPage: selectedVRPage }),
});

export const createSelectedDSNav = (set: {
  (partial: SummaryStore, replace?: boolean | undefined): void;
  (arg0: { selectedDSNav: string }): void;
}) => ({
  selectedDSNav: "Database",
  setSelectedDSNav: (selectedDSNav: string) =>
    set({ selectedDSNav: selectedDSNav }),
});

export const createSelectedDSResourceType = (set: {
  (partial: SummaryStore, replace?: boolean | undefined): void;
  (arg0: { selectedDSResourceType: string }): void;
}) => ({
  selectedDSResourceType: "",
  setSelectedDSResourceType: (selectedDSResourceType: string) =>
    set({ selectedDSResourceType: selectedDSResourceType }),
});

export const createSelectedDSResourceID = (set: {
  (partial: SummaryStore, replace?: boolean | undefined): void;
  (arg0: { selectedDSResourceID: string }): void;
}) => ({
  selectedDSResourceID: "",
  setSelectedDSResourceID: (selectedDSResourceID: string) =>
    set({ selectedDSResourceID: selectedDSResourceID }),
});

export const createSelectedCSAction = (set: {
  (partial: SummaryStore, replace?: boolean | undefined): void;
  (arg0: { selectedCSAction: string }): void;
}) => ({
  selectedCSAction: "",
  setSelectedCSAction: (selectedCSAction: string) =>
    set({ selectedCSAction: selectedCSAction }),
});

export const createSelectedCSNodeType = (set: {
  (partial: SummaryStore, replace?: boolean | undefined): void;
  (arg0: { selectedCSNodeType: string }): void;
}) => ({
  selectedCSNodeType: "",
  setSelectedCSNodeType: (selectedCSNodeType: string) =>
    set({ selectedCSNodeType: selectedCSNodeType }),
});

export const createSelectedCSNodeID = (set: {
  (partial: SummaryStore, replace?: boolean | undefined): void;
  (arg0: { selectedCSNodeID: string }): void;
}) => ({
  selectedCSNodeID: "",
  setSelectedCSNodeID: (selectedCSNodeID: string) =>
    set({ selectedCSNodeID: selectedCSNodeID }),
});

export const useSummaryStore: UseBoundStore<StoreApi<SummaryStore>> = create(
  (set) => ({
    ...createPeriod(set),
    ...createSelectedReportAccount(set),
    ...createSelectedVRSeverity(set),
    ...createSelectedVRCVE(set),
    ...createSelectedVRIntegrationType(set),
    ...createSelectedVRPage(set),
    ...createSelectedDSNav(set),
    ...createSelectedDSResourceType(set),
    ...createSelectedDSResourceID(set),
    ...createSelectedCSAction(set),
    ...createSelectedCSNodeType(set),
    ...createSelectedCSNodeID(set),
  })
);
