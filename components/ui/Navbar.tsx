"use client";
import Link from "next/link";
import React, { useCallback, useMemo, useState } from "react";
import Button from "./Button";
import Cookies from "js-cookie";
import { authService } from "@/lib/services/auth";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Menu, PanelLeft, Search, X } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import clsx from "clsx";
import { useGetProfile } from "@/lib/queries/profile";

type NavItem = { label: string; href: string; match?: "exact" | "prefix" };

function isActive(pathname: string, item: NavItem) {
  if (item.match === "exact") return pathname === item.href;
  if (item.href === "/") return pathname === "/";
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function getPageTitle(pathname: string) {
  const clean = (pathname || "/").split("?")[0].split("#")[0];
  const map: Record<string, string> = {
    "/": "Home",
    "/dashboard": "Dashboard",
    "/dashboard/analytics": "Analytics",
    "/dashboard/goals": "Goals",
    "/dashboard/streaks": "Streaks",
    "/profile": "Profile",
    "/login": "Login",
    "/register": "Register",
  };

  if (map[clean]) return map[clean];

  const last = clean.split("/").filter(Boolean).pop();
  if (!last) return "Home";

  return last
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

function NavLinks({
  items,
  pathname,
  onNavigate,
  variant = "desktop",
}: {
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
  variant?: "desktop" | "mobile";
}) {
  const base =
    variant === "desktop"
      ? "inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold transition-colors"
      : "flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors";

  return (
    <>
      {items.map((item) => {
        const active = isActive(pathname, item);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={clsx(
              base,
              "text-white/80 hover:text-white hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25",
              active && "bg-white/10 text-white"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

function UserChip() {
  const { data } = useGetProfile();
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
    <Link
      href="/profile"
      className={clsx(
        "hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5",
        "text-white/85 hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
      )}
    >
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
        {initials}
      </span>
      <span className="max-w-40 truncate text-sm font-semibold">
        {fullName ?? "Profile"}
      </span>
    </Link>
  );
}

function LogoutButton({
  onLogout,
  variant = "desktop",
}: {
  onLogout: () => void;
  variant?: "desktop" | "mobile";
}) {
  return (
    <button
      type="button"
      onClick={onLogout}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25",
        "bg-white/10 hover:bg-white/15 text-white",
        variant === "desktop" ? "h-9 w-9" : "h-10 px-4 w-full rounded-xl"
      )}
      aria-label="Logout"
    >
      <LogOut size={18} />
      {variant === "mobile" ? <span>Logout</span> : null}
    </button>
  );
}

type NavbarProps = {
  /** When set (e.g. dashboard), shows a control to open the sidebar on small screens. */
  onOpenSidebar?: () => void;
};

const Navbar = ({ onOpenSidebar }: NavbarProps) => {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const [isOpen, setIsOpen] = useState(false);
  const { loggedIn, setLoggedIn } = useAuthStore();
  const title = useMemo(() => getPageTitle(pathname), [pathname]);

  const closeMobile = useCallback(() => setIsOpen(false), []);

  const handleLogout = useCallback(async () => {
    Cookies.remove("access_token");
    setLoggedIn(false);
    try {
      const res = await authService.logout();
      toast.success(res.data.message);
    } catch {
      // If backend logout fails, client should still be logged out.
      toast.success("Logged out");
    } finally {
      closeMobile();
      router.push("/login");
    }
  }, [closeMobile, router, setLoggedIn]);

  const baseLinks = useMemo<NavItem[]>(
    () => [{ label: "Home", href: "/", match: "exact" }],
    []
  );

  const authLinks = useMemo<NavItem[]>(
    () => [
      { label: "Dashboard", href: "/dashboard", match: "prefix" },
      { label: "Profile", href: "/profile", match: "prefix" },
    ],
    []
  );

  const guestLinks = useMemo<NavItem[]>(
    () => [
      { label: "Login", href: "/login", match: "exact" },
      { label: "Register", href: "/register", match: "exact" },
    ],
    []
  );

  return (
    <nav className="bg-sidebar-bg/70 backdrop-blur-xl border-b border-glass-border px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          {onOpenSidebar ? (
            <button
              type="button"
              onClick={onOpenSidebar}
              className="lg:hidden inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white/90 transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
              aria-label="Open side navigation"
            >
              <PanelLeft size={22} strokeWidth={2} />
            </button>
          ) : null}
          <h1 className="min-w-0 truncate text-base font-semibold text-white sm:text-lg">
            {title}
          </h1>
          {loggedIn ? (
            <span className="hidden sm:inline-flex rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-white/70">
              Workspace
            </span>
          ) : null}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center font-semibold text-sm ">
          {loggedIn ? (
            <>
              <div className="relative hidden lg:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={16} />
                <input
                  placeholder="Search tasks…"
                  className="w-72 rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white/85 placeholder:text-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
                />
              </div>

              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
                aria-label="Notifications"
              >
                <Bell size={18} />
              </button>

              <UserChip />
              <LogoutButton onLogout={handleLogout} />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
              >
                Login
              </Link>
              <Link href="/register" className="ml-1">
                <Button type="button" className="hover:bg-white/15">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button*/}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white/90 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25 rounded-lg p-1"
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div id="mobile-nav" className="md:hidden mt-3 space-y-2 pb-4 font-semibold">
          {loggedIn ? (
            <>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={16} />
                  <input
                    placeholder="Search tasks…"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white/85 placeholder:text-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
                  />
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
                    aria-label="Notifications"
                  >
                    <Bell size={16} />
                    Alerts
                  </button>
                  <Link
                    href="/profile"
                    onClick={closeMobile}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
                  >
                    Profile
                  </Link>
                </div>
              </div>

              <LogoutButton onLogout={handleLogout} variant="mobile" />
            </>
          ) : (
            <>
              <Link href="/login" onClick={closeMobile} className="block">
                <Button type="button" className="w-full hover:bg-white/15" variant="outline">
                  Login
                </Button>
              </Link>
              <Link href="/register" onClick={closeMobile} className="block">
                <Button type="button" className="w-full hover:bg-white/15">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
