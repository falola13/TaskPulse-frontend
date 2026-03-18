import { create } from "zustand";

type AuthState = {
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  is2FARequired: boolean;
  setIs2FARequired: (is2FARequired: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  loggedIn: false,
  setLoggedIn: (value) => set({ loggedIn: value }),
  is2FARequired: false,
  setIs2FARequired: (value) => set({ is2FARequired: value }),
}));
