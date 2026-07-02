import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "./Layout";
import { useNavbar } from "./Navbar";
import {
  LayoutDashboard,
  ClipboardList,
  MapPinned,
  ReceiptText,
  ListChecks,
  FileText,
  FileCheck2,
  Files,
  Map,
  Briefcase,
  UserCheck,
  LogOut,
  Droplets,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navSections = [
  {
    label: "Inspection Management",
    items: [
      {
        to: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        to: "/create-inspection-site",
        label: "Inspection Site",
        icon: ClipboardList,
      },
      {
        to: "/inspection-site-map",
        label: "Inspection Site Map",
        icon: MapPinned,
      },
      {
        to: "/create-boq-bill",
        label: "BOQ Bills",
        icon: ReceiptText,
      },
      {
        to: "/create-boq",
        label: "BOQ Bills List",
        icon: ListChecks,
      },
   
    ],
  },
  {
    label: "Inspector Management",
    items: [
        {
        to: "/third-party-inspection",
        label: "Third-Party Inspection",
        icon: FileText,
      },
        {
        to: "/tpv-01",
        label: "TPV 01 Proforma",
        icon: FileText,
      },
      {
        to: "/tpv-02",
        label: "TPV 02 Proforma",
        icon: FileCheck2,
      },
      {
        to: "/tpv-02a",
        label: "TPV 02A Proforma",
        icon: Files,
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        to: "/area-management",
        label: "Area management",
        icon: Map,
      },
      {
        to: "/create-contractor",
        label: "Create Contractor",
        icon: Briefcase,
      },
      {
        to: "/create-inspector",
        label: "Create Inspector",
        icon: UserCheck,
      },
    ],
  },
  {
    label: "Contractor Management",
    items: [
      {
        to: "/contractor-planning",
        label: "Contractor Planning",
        icon: UserCheck,
      },
         {
        to: "/pjp",
        label: "Permanent Journey Plan",
        icon: UserCheck,
      },
      {
        to: "/show-tpv-proforma",
        label: "TPV Proforma",
        icon: UserCheck,
      },
    ],
  },
];

function badgeClass(badge, ai, isLight) {
  if (ai) return "bg-indigo-500 text-white";
  if (!badge) return "";

  if (badge === "1,570") {
    return isLight
      ? "bg-teal-100 text-teal-700"
      : "bg-teal-500/20 text-teal-400";
  }

  if (badge === "12" || badge === "3") return "bg-amber-500 text-white";
  return "bg-rose-500 text-white";
}

export default function Sidebar() {
  const { isLight, toggleTheme } = useTheme();
  const { isSidebarOpen, setIsSidebarOpen, isCollapsed, setIsCollapsed } =
    useNavbar();

  const [openSections, setOpenSections] = useState(() =>
    navSections.reduce((acc, section) => {
      acc[section.label] = true;
      return acc;
    }, {}),
  );

  const toggleSection = (label) => {
    setOpenSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const sidebarShell = isLight
    ? "border-[#101936] bg-[#111a3d] text-white shadow-2xl shadow-slate-950/25"
    : "border-white/10 bg-black text-white shadow-2xl shadow-black/40";

  const mutedText = isLight ? "text-slate-300/85" : "text-zinc-400";
  const softBorder = "border-white/10";

  const softPanelHover = isLight ? "hover:bg-white/8" : "hover:bg-zinc-900";

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm xl:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0  flex shrink-0 flex-col overflow-y-auto rounded-r-2xl border-r transition-all duration-300 xl:sticky xl:top-0 xl:h-screen xl:translate-x-0 xl:rounded-r-none ${
          isCollapsed ? "xl:w-[72px]" : "xl:w-[260px]"
        } ${
          isSidebarOpen
            ? "translate-x-0 w-[270px]"
            : "-translate-x-full w-[270px]"
        } ${sidebarShell}`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>
          {`
            aside::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        <div
          className={`border-b ${softBorder} transition-all duration-300 ${
            isCollapsed ? "px-3 py-4" : "px-4 py-5"
          }`}
        >
          <div
            className={`flex items-center ${
              isCollapsed ? "flex-col gap-3" : "justify-between gap-2"
            }`}
          >
            <div className="flex min-w-0 items-center gap-3 overflow-hidden">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                  isLight ? "bg-white/10" : "bg-zinc-900"
                } ring-1 ring-white/10`}
              >
                <Droplets
                  className={
                    isLight ? "h-5 w-5 text-cyan-300" : "h-5 w-5 text-sky-400"
                  }
                  strokeWidth={2.2}
                />
              </div>

              {!isCollapsed && (
                <div className="min-w-0">
                  <h1 className="truncate text-[23px] font-semibold leading-7 tracking-tight text-white">
                    PSPA
                  </h1>
                  <p className={`truncate text-[13px] leading-5 ${mutedText}`}>
                    Inspection Portal
                  </p>
                </div>
              )}
            </div>

            <div
              className={`flex items-center ${
                isCollapsed ? "flex-col gap-2" : "gap-1"
              }`}
            >
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                type="button"
                aria-label="Toggle sidebar"
                className={`rounded-lg p-1.5 text-slate-200 transition ${softPanelHover} ${
                  isCollapsed ? "xl:flex" : "hidden xl:flex"
                }`}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </button>

              {!isCollapsed && (
                <button
                  onClick={toggleTheme}
                  type="button"
                  aria-label="Toggle theme"
                  className={`relative hidden h-5 w-9 shrink-0 items-center rounded-full transition xl:inline-flex ${
                    isLight ? "bg-cyan-400/90" : "bg-zinc-700"
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${
                      isLight ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              )}

              <button
                onClick={() => setIsSidebarOpen(false)}
                type="button"
                aria-label="Close sidebar"
                className={`rounded-lg p-1.5 text-slate-200 transition xl:hidden ${softPanelHover}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <nav
          className={`flex-1 transition-all duration-300 ${
            isCollapsed ? "px-3 py-3" : "px-3 py-3"
          }`}
        >
          {navSections.map((section) => {
            const isSectionOpen = openSections[section.label];

            return (
              <div key={section.label} className="mb-2">
                <button
                  type="button"
                  onClick={() => toggleSection(section.label)}
                  style={{ fontSize: "10.5px" }}
                  className={`relative mb-1.5 flex w-full items-center text-left font-semibold uppercase tracking-[0.16em] transition-opacity duration-200 ${
                    isCollapsed
                      ? "h-0 overflow-hidden opacity-0"
                      : `opacity-100 ${mutedText} hover:text-white`
                  }`}
                >
                  <ChevronDown
                    className={`-ml-1 mr-2 h-3 w-3 shrink-0 opacity-70 transition-transform duration-200 ${
                      isSectionOpen ? "rotate-0" : "-rotate-90"
                    }`}
                    strokeWidth={2.2}
                  />

                  <span className="truncate">{section.label}</span>
                </button>

                {isSectionOpen && (
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const Icon = item.icon;

                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={() => setIsSidebarOpen(false)}
                          className={({ isActive }) =>
                            `group relative flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-[13.5px] transition-all duration-200 ${
                              isCollapsed ? "justify-center px-0" : ""
                            } ${
                              isActive
                                ? "bg-[#070e25] text-white shadow-lg shadow-black/10 ring-1 ring-white/10"
                                : `${mutedText} hover:bg-white/10 hover:text-white`
                            }`
                          }
                        >
                          <Icon
                            className={`h-[17px] w-[17px] shrink-0 transition-transform ${
                              isCollapsed ? "mx-auto scale-110" : ""
                            }`}
                            strokeWidth={1.9}
                          />

                          <span
                            className={`min-w-0 flex-1 truncate transition-opacity duration-200 ${
                              isCollapsed
                                ? "opacity-0 xl:hidden"
                                : "opacity-100"
                            }`}
                          >
                            {item.label}
                          </span>

                          {!isCollapsed && item.badge && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeClass(
                                item.badge,
                                item.ai,
                                isLight,
                              )}`}
                            >
                              {item.badge}
                            </span>
                          )}

                          {isCollapsed && (
                            <div className="invisible absolute left-14 z-[100] whitespace-nowrap rounded-lg border border-white/10 bg-slate-950 px-2 py-1 text-[11px] text-white opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                              {item.label}
                            </div>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div
          className={`border-t py-3 transition-all duration-300 ${
            isCollapsed ? "px-3" : "px-4"
          } ${softBorder}`}
        >
          <div
            className={`mb-2 flex items-center gap-2 overflow-hidden ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sky-300/30 bg-sky-300/10 text-[10px] font-semibold text-sky-200">
              AR
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <div className="truncate text-[13px] font-medium text-white">
                  Admin Raza
                </div>
                <div className={`truncate text-[11px] ${mutedText}`}>
                  Administrator
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            className={`flex items-center gap-2 rounded-lg border border-white/10 text-slate-200 transition-all hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-300 ${
              isCollapsed
                ? "mx-auto h-9 w-9 justify-center p-0"
                : "w-full justify-center px-3 py-1.5"
            }`}
          >
            <LogOut className="h-4 w-4 shrink-0" strokeWidth={2} />
            {!isCollapsed && <span className="text-[12px]">Sign out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
