import { create } from "zustand";

type Store = {
  akashKey: string | null;
  setAkashKey: (akashKey: string | null) => void;
};

export const useStore = create<Store>((set) => ({
  akashKey: null,
  setAkashKey: (akashKey: string | null) => set({ akashKey }),
}));
////
