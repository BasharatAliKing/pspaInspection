import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar, { NavbarProvider } from "./Navbar";

const ThemeContext = createContext(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within Layout");
  }
  return ctx;
}

export default function Layout() {
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("pspa-theme");
    if (saved === "light" || saved === "dark") return saved;
    return "dark";
  });

  const shouldHideSidebar = location.pathname === "/inspection-site-map";

  useEffect(() => {
    localStorage.setItem("pspa-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const isLight = theme === "light";

  const themeValue = useMemo(
    () => ({
      theme,
      isLight,
      toggleTheme: () =>
        setTheme((prev) => (prev === "light" ? "dark" : "light")),
      setTheme,
    }),
    [theme, isLight],
  );

 return (
  <ThemeContext.Provider value={themeValue}>
    <NavbarProvider>
      <div
        className={
          isLight
            ? "h-screen overflow-hidden bg-slate-100 text-slate-900"
            : "h-screen overflow-hidden bg-slate-950 text-slate-100"
        }
      >
        <div className="relative flex h-screen overflow-hidden">
          {!shouldHideSidebar && <Sidebar />}

          <main className="relative z-10 flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
            {!shouldHideSidebar && <Navbar />}

            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </NavbarProvider>
  </ThemeContext.Provider>
);
}
