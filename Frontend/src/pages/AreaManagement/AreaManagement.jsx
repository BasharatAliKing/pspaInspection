import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNavbar } from "../../components/Navbar";
import { useTheme } from "../../components/Layout";
import KPICard from "../../components/KPICard";
import {
  Building2,
  Landmark,
  MapPinned,
  Map,
  PanelsTopLeft,
  LocateFixed,
  ChevronRight,
  Eye,
  RefreshCw,
} from "lucide-react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

const HIERARCHY_API_URLS = {
  provinces: `${API_BASE_URL}/api/list-province/`,
  divisions: `${API_BASE_URL}/api/list-division/`,
  districts: `${API_BASE_URL}/api/list-district/`,
  tehsils: `${API_BASE_URL}/api/list-tehsil/`,
  zones: `${API_BASE_URL}/api/list-zone/`,
};

const hierarchyTypes = [
  {
    title: "Add Province",
    description:
      "Create province records to establish the top-level administrative units.",
    icon: Landmark,
    route: "/province",
    badge: "Level 1",
  },
  {
    title: "Add Zone",
    description:
      "Create zone records to define the fifth-level administrative units.",
    icon: PanelsTopLeft,
    route: "/zone",
    badge: "Level 2",
  },
  {
    title: "Add Division",
    description:
      "Create division records to define the second-level administrative units.",
    icon: Building2,
    route: "/division",
    badge: "Level 3",
  },
  {
    title: "Add District",
    description:
      "Create district records to establish the third-level administrative units.",
    icon: MapPinned,
    route: "/district",
    badge: "Level 4",
  },
  {
    title: "Add Tehsil",
    description:
      "Create tehsil records to establish the fourth-level administrative units.",
    icon: Map,
    route: "/tehsil",
    badge: "Level 5",
  },
];

const overviewItems = [
  { label: "Province", key: "provinces", route: "/province", level: "Level 1" },
  { label: "Zone", key: "zones", route: "/zone", level: "Level 2" },
  { label: "Division", key: "divisions", route: "/division", level: "Level 3" },
  { label: "District", key: "districts", route: "/district", level: "Level 4" },
  { label: "Tehsil", key: "tehsils", route: "/tehsil", level: "Level 5" },
];

const initialStats = {
  provinces: 0,
  divisions: 0,
  districts: 0,
  tehsils: 0,
  zones: 0,
};

const parseResponseSafely = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return await response.json();
  }

  const text = await response.text();
  return { nonJson: true, text };
};

const extractListFromResponse = (result) => {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.results)) return result.results;
  if (Array.isArray(result?.data?.data)) return result.data.data;
  if (Array.isArray(result?.data?.results)) return result.data.results;
  return [];
};

const extractCountFromResponse = (result) => {
  if (typeof result?.count === "number") return result.count;
  if (typeof result?.data?.count === "number") return result.data.count;
  if (typeof result?.data?.data?.count === "number")
    return result.data.data.count;
  return extractListFromResponse(result).length;
};

const formatNumber = (value) => {
  const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;
  return safeValue.toLocaleString();
};

export default function AreaManagement() {
  const { isLight } = useTheme();
  const { setState } = useNavbar();
  const navigate = useNavigate();

  const [stats, setStats] = useState(initialStats);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const pageClasses = isLight
    ? "bg-slate-100 text-slate-900"
    : "bg-[#0b0f1a] text-[#e8edf5]";

  const surface = isLight
    ? "bg-white border-black/10"
    : "bg-[#111827] border-white/10";

  const mutedSurface = isLight ? "bg-slate-50" : "bg-[#1a2236]";
  const textMuted = isLight ? "text-slate-600" : "text-[#8a95a8]";
  const textSoft = isLight ? "text-slate-400" : "text-[#4f5a6e]";

  const fetchHierarchyStats = useCallback(async () => {
    setIsLoadingStats(true);
    setErrorMessage("");

    const requests = Object.entries(HIERARCHY_API_URLS).map(
      async ([key, url]) => {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        const result = await parseResponseSafely(response);

        if (!response.ok) {
          throw new Error(
            result?.message ||
              result?.detail ||
              `Failed to fetch ${key.replace(/s$/, "")}.`,
          );
        }

        return [key, extractCountFromResponse(result)];
      },
    );

    const results = await Promise.allSettled(requests);
    const nextStats = { ...initialStats };
    const failedRequests = [];

    results.forEach((result, index) => {
      const key = Object.keys(HIERARCHY_API_URLS)[index];

      if (result.status === "fulfilled") {
        const [responseKey, count] = result.value;
        nextStats[responseKey] = count;
      } else {
        failedRequests.push(key);
      }
    });

    setStats(nextStats);

    if (failedRequests.length > 0) {
      setErrorMessage(
        `Unable to load ${failedRequests.join(", ")}. Please check these list APIs.`,
      );
    }

    setIsLoadingStats(false);
  }, []);

  useEffect(() => {
    fetchHierarchyStats();
  }, [fetchHierarchyStats]);

  useEffect(() => {
    setState({
      title: "Area Management",
      subtitle: "Create and manage complete administrative hierarchy",
      forceSingleRow: true,
    });

    return () => setState({ title: "", subtitle: "", actions: null });
  }, [setState, navigate, mutedSurface, textMuted]);

  const metricCards = useMemo(
    () => [
      {
        title: "Total Divisions",
        value: stats.divisions,
        subtitle: "Administrative divisions",
        tone: "blue",
        icon: Building2,
      },
      {
        title: "Total Districts",
        value: stats.districts,
        subtitle: "Registered districts",
        tone: "green",
        icon: MapPinned,
      },
      {
        title: "Total Tehsils",
        value: stats.tehsils,
        subtitle: "Registered tehsils",
        tone: "amber",
        icon: Map,
      },
      {
        title: "Total Zones",
        value: stats.zones,
        subtitle: "Registered zones",
        tone: "indigo",
        icon: PanelsTopLeft,
      },
    ],
    [stats],
  );

  return (
    <div className={cn("min-h-screen w-full", pageClasses)}>
      <div
        className={cn(
          "pointer-events-none fixed inset-0 opacity-100",
          isLight
            ? "[background-image:linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.04)_1px,transparent_1px)]"
            : "[background-image:linear-gradient(rgba(59,130,246,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.025)_1px,transparent_1px)]",
          "[background-size:44px_44px]",
        )}
      />

      <div className="relative z-10 px-5 py-6 md:px-7">
        {errorMessage && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-red-500/25 bg-red-500/10 px-4 py-3">
            <span className="text-[12px] text-red-500">{errorMessage}</span>

            <button
              type="button"
              onClick={fetchHierarchyStats}
              className="inline-flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[11px] font-medium text-red-500 transition hover:bg-red-500/20"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        )}

        <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {metricCards.map((card) => (
            <KPICard
              key={card.title}
              title={card.title}
              value={isLoadingStats ? "..." : formatNumber(card.value)}
              subtitle={card.subtitle}
              icon={card.icon}
              tone={card.tone}
            />
          ))}
        </section>

        <section className="mb-5 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className={cn("rounded-[10px] border p-5", surface)}>
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div
                  className={cn(
                    "text-[12px] font-medium uppercase tracking-[0.07em]",
                    textMuted,
                  )}
                >
                  Select hierarchy type
                </div>
                <div className={cn("mt-1 text-[11px]", textSoft)}>
                  Add or manage records for each administrative level
                </div>
              </div>

              <button
                type="button"
                onClick={fetchHierarchyStats}
                disabled={isLoadingStats}
                className={cn(
                  "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-[12px] font-medium transition",
                  mutedSurface,
                  textMuted,
                  isLoadingStats && "cursor-not-allowed opacity-70",
                )}
              >
                <RefreshCw
                  className={cn(
                    "h-3.5 w-3.5",
                    isLoadingStats && "animate-spin",
                  )}
                />
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {hierarchyTypes.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => navigate(item.route)}
                    className={cn(
                      "group rounded-[10px] border p-4 text-left transition",
                      isLight
                        ? "border-black/10 bg-white hover:border-blue-500/25 hover:bg-blue-50/40"
                        : "border-white/10 bg-[#111827] hover:border-blue-500/25 hover:bg-[#1a2236]",
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-[14px] border border-blue-500/25 bg-blue-500/10 text-blue-500">
                          <Icon className="h-5 w-5" strokeWidth={2} />
                        </div>

                        <div>
                          <div className="font-serif text-[18px] font-light tracking-[-0.03em]">
                            {item.title}
                          </div>
                          <div className="mt-1">
                            <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-medium text-blue-500">
                              {item.badge}
                            </span>
                          </div>
                        </div>
                      </div>

                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-blue-500" />
                    </div>
                    <p className={cn("text-[12px] leading-6", textMuted)}>
                      {item.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <aside className={cn("rounded-[10px] border p-5", surface)}>
            <div className="mb-5">
              <div
                className={cn(
                  "text-[12px] font-medium uppercase tracking-[0.07em]",
                  textMuted,
                )}
              >
                Overview
              </div>
              <div className="mt-2 font-serif text-[26px] font-light leading-none tracking-[-0.03em]">
                Hierarchy levels
              </div>
              <div className={cn("mt-2 text-[11px]", textSoft)}>
                Province, Zone, Division, District & Tehsil
              </div>
            </div>

            <div className="space-y-2">
              {overviewItems.map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-[10px] border px-3 py-2",
                    isLight
                      ? "border-black/10 bg-slate-50"
                      : "border-white/10 bg-[#1a2236]",
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-[13px] font-medium">
                        {item.label}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(item.route)}
                    className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] font-medium text-blue-500 transition hover:bg-blue-500/20"
                  >
                    <Eye className="h-3 w-3" />
                    View
                  </button>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
