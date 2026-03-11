"use client";

import { useAuthStore } from "@/lib/store/authStore";
import { useRef } from "react";

export function AuthStoreInitializer({ loggedIn }: { loggedIn: boolean }) {
  const initialized = useRef(false);

  if (!initialized.current) {
    // This syncs the store IMMEDIATELY on the first render
    useAuthStore.setState({ loggedIn });
    initialized.current = true;
  }

  return null; // This component renders nothing visually
}
