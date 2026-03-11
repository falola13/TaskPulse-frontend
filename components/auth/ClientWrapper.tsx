"use client";

import { authService } from "@/lib/services/auth";
import { useAuthStore } from "@/lib/store/authStore";
import React, { useEffect } from "react";

const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);

  // useEffect(() => {
  //   const checkLogin = async () => {
  //     try {
  //       const res = await authService.getProfile();
  //       setLoggedIn(res.status === 200);
  //     } catch {
  //       setLoggedIn(false);
  //     }
  //   };

  //   checkLogin();
  // }, [setLoggedIn]);

  return <>{children}</>;
};

export default ClientWrapper;
