import React, { createContext, useContext, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "./Layout";
import { ArrowLeft, Menu, LogOut } from "lucide-react";

const NavbarContext = createContext(null);

const DEFAULT_BACK_ROUTES = [
  { path: "/province", to: "/area-management", label: "Back to assets" },
  { path: "/zone", to: "/area-management", label: "Back to assets" },
  { path: "/division", to: "/area-management", label: "Back to assets" },
  { path: "/district", to: "/area-management", label: "Back to assets" },
  { path: "/tehsil", to: "/area-management", label: "Back to assets" },
  {},
];

function normalizePath(pathname = "") {
  if (!pathname) return "/";
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function getDefaultBackConfig(pathname) {
  const cleanPath = normalizePath(pathname);

  return DEFAULT_BACK_ROUTES.find((route) => {
    return cleanPath === route.path || cleanPath.startsWith(`${route.path}/`);
  });
}

export function useNavbar() {
  const ctx = useContext(NavbarContext);
  if (!ctx) throw new Error("useNavbar must be used within a NavbarProvider");
  return ctx;
}

export function NavbarProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [state, setState] = useState({
    title: "",
    subtitle: "",
    actions: null,
    backPath: null,
    backLabel: "Back",
    showBackButton: undefined,
  });

  return (
    <NavbarContext.Provider
      value={{
        state,
        setState,
        isSidebarOpen,
        setIsSidebarOpen,
        isCollapsed,
        setIsCollapsed,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
}

export default function Navbar() {
  const { state, setIsSidebarOpen } = useNavbar();
  const { isLight } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const defaultBackConfig = useMemo(
    () => getDefaultBackConfig(location.pathname),
    [location.pathname],
  );

  const handleLogout = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      // ignore
    }
    navigate("/login");
  };

  const backConfig = useMemo(() => {
    if (state.showBackButton === false) return null;

    if (state.backPath) {
      return {
        to: state.backPath,
        label: state.backLabel || "Back",
      };
    }

    return defaultBackConfig || null;
  }, [
    defaultBackConfig,
    state.backLabel,
    state.backPath,
    state.showBackButton,
  ]);

  return (
    <header
      className={`border-b ${
        isLight ? "border-black/10 bg-white" : "border-white/10 bg-slate-900/95"
      }`}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-3.5 sm:py-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className={`xl:hidden p-2 rounded-lg transition ${
              isLight
                ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                : "bg-white/5 text-slate-400 hover:bg-white/10"
            }`}
          >
            <Menu className="h-5 w-5" />
          </button>

          {backConfig ? (
            <button
              type="button"
              onClick={() => navigate(backConfig.to)}
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition ${
                isLight
                  ? "border-black/10 bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
                  : "border-white/10 bg-[#1a2236] text-[#8a95a8] hover:bg-[#212d42] hover:text-white"
              }`}
              title={backConfig.label}
              aria-label={backConfig.label}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : null}

          <div className="min-w-0 flex-1">
            <h1
              className={`text-base sm:text-lg font-medium tracking-tight truncate whitespace-nowrap ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              {state.title || ""}
            </h1>

            {state.subtitle ? (
              <p
                className={`mt-0.5 text-[10px] sm:text-sm truncate whitespace-nowrap ${
                  isLight ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {state.subtitle}
              </p>
            ) : null}
          </div>
        </div>

        <div
          className={`${state.forceSingleRow ? "flex" : "hidden sm:flex"} items-center gap-2`}
        >
          {state.actions}
          <button
            type="button"
            onClick={handleLogout}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
              {
                true: isLight
                  ? "border border-black/10 bg-slate-100 text-slate-700 hover:bg-slate-200"
                  : "border border-white/10 bg-white/5 text-white hover:bg-white/10",
              }[true]
            }`}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {state.actions && !state.forceSingleRow && (
        <div
          className={`sm:hidden border-t px-5 py-3 overflow-x-auto no-scrollbar ${
            isLight
              ? "border-black/5 bg-slate-50/50"
              : "border-white/5 bg-white/5"
          }`}
        >
          <div className="flex items-center gap-2 whitespace-nowrap">
            {state.actions}
            <button
              type="button"
              onClick={handleLogout}
              className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${isLight ? "border border-black/10 bg-slate-100 text-slate-700 hover:bg-slate-200" : "border border-white/10 bg-white/5 text-white hover:bg-white/10"}`}
            >
              <LogOut className="h-4 w-4" />
              <span className="ml-1">Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
