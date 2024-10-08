import { GeneralStore, KeyStringVal } from "src/types/general";
import { StoreApi, UseBoundStore, create } from "zustand";

export const createOpenSidebar = (set: {
  (partial: GeneralStore, replace?: boolean | undefined): void;
  (arg0: { openSidebar: boolean }): void;
}) => ({
  openSidebar: false,
  setOpenSidebar: (openSidebar: boolean) => set({ openSidebar: openSidebar }),
});

export const createError = (set: (arg0: { error: KeyStringVal }) => void) => ({
  error: {
    url: "",
    message: "",
  },
  setError: (error: KeyStringVal) => set({ error: error }),
});

export const createEnv = (set: {
  (partial: GeneralStore, replace?: boolean | undefined): void;
  (arg0: { env: string }): void;
}) => ({
  env: "",
  setEnv: (env: string) => set({ env: env }),
});

export const createSpotlightSearchString = (set: {
  (partial: GeneralStore, replace?: boolean | undefined): void;
  (arg0: { spotlightSearchString: string }): void;
}) => ({
  spotlightSearchString: "",
  setSpotlightSearchString: (spotlightSearchString: string) =>
    set({ spotlightSearchString: spotlightSearchString }),
});

export const useGeneralStore: UseBoundStore<StoreApi<GeneralStore>> = create(
  (set) => ({
    ...createOpenSidebar(set),
    ...createError(set),
    ...createEnv(set),
    ...createSpotlightSearchString(set),
  })
);
