"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import clsx from "clsx";
import SidebarMenu from "./SidebarMenu";

type DashboardSidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

const DashboardSidebar = ({ mobileOpen, onClose }: DashboardSidebarProps) => {
  return (
    <nav
      className={clsx(
        "bg-sidebar-bg flex h-screen max-w-[min(280px,88vw)] w-full shrink-0 flex-col border-glass-border border-r py-5 px-3 backdrop-blur-xl sm:px-4 sm:py-6",
        "fixed inset-y-0 left-0 z-[100] transition-transform duration-300 ease-out",
        "lg:relative lg:z-auto lg:max-w-[240px] lg:translate-x-0 lg:shadow-none",
        mobileOpen
          ? "translate-x-0 shadow-2xl shadow-black/40"
          : "-translate-x-full pointer-events-none lg:pointer-events-auto lg:translate-x-0",
      )}
      aria-hidden={false}
    >
      <div className="flex items-center justify-between gap-2 border-b border-glass-border pb-3 sm:pb-4">
        <Link
          href="/"
          className="block min-w-0 flex-1"
          onClick={onClose}
        >
          <div className="relative h-9 w-36 sm:h-10 sm:w-40 md:h-12 md:w-48">
            <Image
              src="/TaskPulse.png"
              alt="TaskPulse Logo"
              fill
              priority
              className="object-contain object-left"
            />
          </div>
        </Link>
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25 lg:hidden"
          aria-label="Close sidebar"
          onClick={onClose}
        >
          <span className="text-lg leading-none">×</span>
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        <SidebarMenu onNavigate={onClose} />
      </div>
    </nav>
  );
};

export default DashboardSidebar;
