
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  BarChart3,
  Flame,
  Goal,
  Home,
  LayoutDashboard,
  ListTodo,
  UserRound,
} from "lucide-react";
import { useGetProfile } from "@/lib/queries/profile";

type SidebarItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  match?: "exact" | "prefix";
};

const items: SidebarItem[] = [
  { label: "Home", href: "/", icon: Home, match: "exact" },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    match: "prefix",
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: ListTodo,
    match: "prefix",
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    match: "prefix",
  },
  { label: "Goals", href: "/dashboard/goals", icon: Goal, match: "prefix" },
  {
    label: "Streaks",
    href: "/dashboard/streaks",
    icon: Flame,
    match: "prefix",
  },
];

function isActive(pathname: string, item: SidebarItem) {
  if (item.match === "exact") return pathname === item.href;
  if (item.href === "/") return pathname === "/";
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

type SidebarMenuProps = {
  onNavigate?: () => void;
};

const SidebarMenu = ({ onNavigate }: SidebarMenuProps) => {
  const pathname = usePathname() ?? "/";
  const { data, isLoading } = useGetProfile();

  const profile = data?.data?.data;
  const fullName =
    profile?.firstName || profile?.lastName
      ? `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim()
      : null;
  const initials = fullName
    ? fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("")
    : "U";

  return (
    <div className="pt-5 h-full flex flex-col min-h-0">
      <div className="px-2 text-[11px] font-semibold tracking-wider text-white/60 uppercase">
        Menu
      </div>

      <div className="mt-3 space-y-1">
        {items.map((item) => {
          const active = isActive(pathname, item);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onNavigate?.()}
              aria-current={active ? "page" : undefined}
              className={[
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                active
                  ? "bg-white/10 text-white"
                  : "text-white/75 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-lg border transition-colors",
                  active
                    ? "border-white/15 bg-white/10"
                    : "border-white/10 bg-white/5 group-hover:border-white/15 group-hover:bg-white/5",
                ].join(" ")}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>

              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto pt-5">
        <div className="border-t border-glass-border pt-4">
          <Link
            href="/profile"
            onClick={() => onNavigate?.()}
            className={[
              "flex items-center gap-3 rounded-2xl p-3 transition-colors",
              "hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
            ].join(" ")}
          >
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
              {profile?.imageUrl ? (
                <Image
                  src={profile.imageUrl}
                  alt={fullName ? `${fullName} avatar` : "Profile avatar"}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-xs font-semibold text-white/85">
                    {initials}
                  </span>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 min-w-0">
                <div className="truncate text-sm font-semibold text-white">
                  {isLoading ? "Loading..." : (fullName ?? "Your Profile")}
                </div>
                {profile?.isTwoFAEnabled ? (
                  <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                    2FA
                  </span>
                ) : null}
              </div>
              <div className="truncate text-xs text-white/60">
                {isLoading ? "Fetching details" : (profile?.email ?? "")}
              </div>
            </div>

            <UserRound className="h-[18px] w-[18px] text-white/60" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;
