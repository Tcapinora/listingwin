"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  FileCheck2,
  LayoutDashboard,
  Menu,
  MonitorPlay,
  Plus,
  Sparkles,
  UserCog,
  X,
} from "lucide-react";
import { useState } from "react";
import { ListingProvider } from "@/components/ListingProvider";
import { AgentProfileProvider } from "@/components/AgentProfileProvider";
import { AgentProfileModal } from "@/components/AgentProfileModal";
import { AuthControls } from "@/components/AuthControls";
import { WorkflowPath } from "@/components/WorkflowPath";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/mockups", label: "Builder", icon: Sparkles },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/draft", label: "Agent Workspace", icon: MonitorPlay },
  { href: "/account", label: "Settings", icon: UserCog },
];

const workflowItems = [
  { href: "/create", label: "1. Start" },
  { href: "/details", label: "2. Story" },
  { href: "/upload", label: "3. Media" },
  { href: "/mockups", label: "4. Present" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isPresentationMode = pathname === "/presentation";

  return (
    <AgentProfileProvider>
      <ListingProvider>
        <div className="min-h-screen bg-[#F2F4F8]">
          {!isPresentationMode ? (
          <header className="sticky top-0 z-30 border-b border-white/70 bg-white/88 shadow-sm backdrop-blur-xl no-print">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:gap-6 sm:px-6 sm:py-4 lg:px-8">
              <Link href="/dashboard" className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#1F2A4A] shadow-card">
                  <Image
                    src="/brand/listingwin-mark-light-exact.png"
                    alt="ListingWin"
                    width={647}
                    height={568}
                    className="h-7 w-7 object-contain"
                  />
                </span>
                <span>
                  <span className="block text-base font-semibold tracking-tight">
                    ListingWin
                  </span>
                    <span className="hidden text-xs text-slate-500 md:block">
                    Attach. Present. Close.
                  </span>
                </span>
              </Link>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMenuOpen(true)}
                  className="grid h-11 w-11 place-items-center rounded-full border border-blue-100 bg-white text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-800"
                  aria-label="Open menu"
                  title="Open menu"
                >
                  <Menu size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setProfileOpen(true)}
                  className="grid h-11 w-11 place-items-center rounded-full border border-blue-100 bg-white text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-800"
                  aria-label="Edit Profile"
                  title="Edit Profile"
                >
                  <UserCog size={17} />
                </button>
                <Link
                  href="/draft"
                  className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-white hover:text-blue-900 sm:flex"
                >
                  <FileCheck2 size={16} />
                  Workspace
                </Link>
                <Link
                  href="/create"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-blue-800 sm:px-4"
                  aria-label="Start New Listing"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">New presentation</span>
                  <ArrowRight className="hidden sm:block" size={15} />
                </Link>
                <AuthControls />
              </div>
            </div>
            <div className="hidden border-t border-blue-50/70 lg:block">
              <div className="mx-auto flex max-w-7xl items-center gap-2 px-8 py-2.5">
                <span className="mr-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Builder
                </span>
                {workflowItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        active
                          ? "bg-blue-700 text-white shadow-sm"
                          : "bg-white/70 text-slate-600 hover:bg-blue-50 hover:text-blue-800"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </header>
          ) : null}

          <main
            className={
              isPresentationMode
                ? "min-h-screen bg-[#F2F4F8]"
                : "page-enter mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-14"
            }
          >
            {!isPresentationMode &&
            ["/create", "/details", "/upload", "/mockups", "/finish"].includes(
              pathname,
            ) ? (
              <div className="mb-7">
                <WorkflowPath active="builder" />
              </div>
            ) : null}
            {!isPresentationMode && pathname === "/draft" ? (
              <div className="mb-7">
                <WorkflowPath active="workspace" />
              </div>
            ) : null}
            {children}
          </main>

          {menuOpen ? (
            <div className="fixed inset-0 z-50">
              <button
                type="button"
                className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              />
              <aside className="relative h-full w-[82vw] max-w-sm border-r border-gray-200 bg-white p-5 shadow-soft">
                <div className="mb-7 flex items-center justify-between gap-4">
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#1F2A4A]">
                      <Image
                        src="/brand/listingwin-mark-light-exact.png"
                        alt="ListingWin"
                        width={647}
                        height={568}
                        className="h-7 w-7 object-contain"
                      />
                    </span>
                    <span>
                      <span className="block text-base font-semibold tracking-tight">
                        ListingWin
                      </span>
                      <span className="text-xs text-gray-500">
                        Attach. Present. Close.
                      </span>
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 text-gray-500"
                    aria-label="Close menu"
                    title="Close menu"
                  >
                    <X size={18} />
                  </button>
                </div>

                <nav className="grid gap-2">
                  {navItems.map((item) => {
                    const active = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                          active
                            ? "bg-blue-700 text-white"
                            : "text-slate-600 hover:bg-blue-50 hover:text-blue-800"
                        }`}
                      >
                        <Icon size={18} />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="absolute inset-x-5 bottom-5 rounded-3xl bg-blue-950 p-5 text-white">
                  <p className="text-sm font-semibold">Listing workflow</p>
                  <p className="mt-2 text-xs leading-5 text-gray-300">
                    Build the seller-facing campaign vision first. Use the
                    workspace after the presentation to close.
                  </p>
                  <Link
                    href="/draft"
                    onClick={() => setMenuOpen(false)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-950"
                  >
                    Open Agent Workspace
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </aside>
            </div>
          ) : null}
          <AgentProfileModal
            open={profileOpen}
            onClose={() => setProfileOpen(false)}
          />
        </div>
      </ListingProvider>
    </AgentProfileProvider>
  );
}
