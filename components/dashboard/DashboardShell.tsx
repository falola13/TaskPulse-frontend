"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import Navbar from "@/components/ui/Navbar";

export default function DashboardShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileSidebarOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return undefined;
  }, [mobileSidebarOpen]);

  return (
    <div className="h-screen flex overflow-hidden bg-[#060A12]">
      {mobileSidebarOpen ? (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-90 bg-black/55 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      ) : null}

      <DashboardSidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <main className="relative flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <div className="sticky top-0 z-50 w-full shrink-0">
          <Navbar onOpenSidebar={() => setMobileSidebarOpen(true)} />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
