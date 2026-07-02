import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Droplets,
  Eye,
  FileCheck2,
  Filter,
  Layers,
  MapPin,
  Navigation,
  Search,
  Table2,
  Tally5,
  X,
} from "lucide-react";
import { useNavbar } from "../../components/Navbar";
import { useTheme } from "../../components/Layout";
import KPICard from "../../components/KPICard";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value) || 0);
}

function titleCase(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function dateOnly(value) {
  if (!value) return "";
  const raw = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return raw.slice(0, 10);
  return parsed.toISOString().slice(0, 10);
}

function getStatusTone(status) {
  if (status === "completed") return "border-green-500/25 bg-green-500/10 text-green-500";
  if (status === "in_progress") return "border-blue-500/25 bg-blue-500/10 text-blue-500";
  if (status === "assigned") return "border-amber-500/25 bg-amber-500/10 text-amber-500";
  if (status === "rejected") return "border-red-500/25 bg-red-500/10 text-red-500";
  return "border-slate-500/25 bg-slate-500/10 text-slate-500";
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
];

const HIERARCHY_LEVELS = [
  { type: "province", label: "Province", key: "provinceName" },
  { type: "zone", label: "Zone", key: "zoneName", parent: "province" },
  { type: "division", label: "Division", key: "divisionName", parent: "zone" },
  { type: "district", label: "District", key: "districtName", parent: "division" },
  { type: "tehsil", label: "Tehsil", key: "tehsilName", parent: "district" },
  { type: "area", label: "Area", key: "areaName", parent: "tehsil" },
];

const EMPTY_HIERARCHY = {
  province: "",
  zone: "",
  division: "",
  district: "",
  tehsil: "",
  area: "",
};

const DEMO_FORMS = [
  {
    id: "FORM-01",
    title: "Asset Condition Inspection",
    subtitle: "Civil condition, plant structure, taps and serviceability",
    icon: Building2,
    tone: "blue",
  },
  {
    id: "FORM-02",
    title: "Water Quality Assessment",
    subtitle: "TDS, turbidity, odor, taste and sample observations",
    icon: Droplets,
    tone: "green",
  },
  {
    id: "FORM-03",
    title: "O&M Compliance Review",
    subtitle: "Operator presence, logbook, chemical dosing and safety",
    icon: ClipboardCheck,
    tone: "amber",
  },
];

const DEMO_INSPECTIONS = [
  {
    id: 1,
    formId: "FORM-01",
    formName: "Asset Condition Inspection",
    siteCode: "PSPA-LHR-0001",
    assetName: "Lahore RO Filtration Plant",
    assetType: "RO",
    assetStatus: "Operational",
    provinceName: "Punjab",
    zoneName: "Central Zone",
    divisionName: "Lahore Division",
    districtName: "Lahore",
    tehsilName: "Model Town",
    areaName: "Township",
    jurisdiction: "Urban Water Supply Cell",
    inspector: "Inspection Team A",
    status: "completed",
    scheduledDate: "2026-06-01",
    completedDate: "2026-06-01",
    totalTaps: 16,
    functionalTaps: 15,
    plantCapacity: "20,000 GPD",
    antiScalantDosing: "Active",
    functionality: true,
    remarks: "Plant is functional with minor tap leakage observed near the public collection point.",
    mapX: 45,
    mapY: 41,
  },
  {
    id: 2,
    formId: "FORM-02",
    formName: "Water Quality Assessment",
    siteCode: "PSPA-FSD-0007",
    assetName: "Faisalabad MF Water Plant",
    assetType: "MF",
    assetStatus: "Operational",
    provinceName: "Punjab",
    zoneName: "Central Zone",
    divisionName: "Faisalabad Division",
    districtName: "Faisalabad",
    tehsilName: "City Tehsil",
    areaName: "Jinnah Colony",
    jurisdiction: "District Water Quality Cell",
    inspector: "Inspection Team B",
    status: "in_progress",
    scheduledDate: "2026-06-03",
    completedDate: "",
    totalTaps: 12,
    functionalTaps: 10,
    plantCapacity: "15,000 GPD",
    antiScalantDosing: "Not Applicable",
    functionality: true,
    remarks: "Water sample collection is in progress. Final remarks will be updated after field verification.",
    mapX: 55,
    mapY: 39,
  },
  {
    id: 3,
    formId: "FORM-03",
    formName: "O&M Compliance Review",
    siteCode: "PSPA-RWP-0012",
    assetName: "Rawalpindi UF Community Plant",
    assetType: "UF",
    assetStatus: "Requires Attention",
    provinceName: "Punjab",
    zoneName: "North Zone",
    divisionName: "Rawalpindi Division",
    districtName: "Rawalpindi",
    tehsilName: "Rawal Town",
    areaName: "Satellite Town",
    jurisdiction: "Northern Operations Unit",
    inspector: "Inspection Team C",
    status: "assigned",
    scheduledDate: "2026-06-05",
    completedDate: "",
    totalTaps: 10,
    functionalTaps: 8,
    plantCapacity: "12,000 GPD",
    antiScalantDosing: "Pending Verification",
    functionality: true,
    remarks: "Operator record and dosing logbook need to be checked during the scheduled visit.",
    mapX: 58,
    mapY: 19,
  },
  {
    id: 4,
    formId: "FORM-01",
    formName: "Asset Condition Inspection",
    siteCode: "PSPA-MTN-0021",
    assetName: "Multan RO Filtration Plant",
    assetType: "RO",
    assetStatus: "Operational",
    provinceName: "Punjab",
    zoneName: "South Zone",
    divisionName: "Multan Division",
    districtName: "Multan",
    tehsilName: "Multan City",
    areaName: "Shah Rukn-e-Alam",
    jurisdiction: "Southern Water Supply Cell",
    inspector: "Inspection Team D",
    status: "completed",
    scheduledDate: "2026-05-31",
    completedDate: "2026-05-31",
    totalTaps: 18,
    functionalTaps: 18,
    plantCapacity: "25,000 GPD",
    antiScalantDosing: "Active",
    functionality: true,
    remarks: "Plant condition is satisfactory and all taps were found functional.",
    mapX: 47,
    mapY: 72,
  },
  {
    id: 5,
    formId: "FORM-02",
    formName: "Water Quality Assessment",
    siteCode: "PSPA-BWP-0034",
    assetName: "Bahawalpur MF Public Plant",
    assetType: "MF",
    assetStatus: "Partially Operational",
    provinceName: "Punjab",
    zoneName: "South Zone",
    divisionName: "Bahawalpur Division",
    districtName: "Bahawalpur",
    tehsilName: "Bahawalpur City",
    areaName: "Model Town A",
    jurisdiction: "Southern Water Quality Cell",
    inspector: "Inspection Team E",
    status: "pending",
    scheduledDate: "2026-06-07",
    completedDate: "",
    totalTaps: 14,
    functionalTaps: 9,
    plantCapacity: "14,000 GPD",
    antiScalantDosing: "Needs Review",
    functionality: false,
    remarks: "Field team must verify the outlet condition and water sample status.",
    mapX: 51,
    mapY: 84,
  },
  {
    id: 6,
    formId: "FORM-03",
    formName: "O&M Compliance Review",
    siteCode: "PSPA-SWL-0042",
    assetName: "Sahiwal UF Water Facility",
    assetType: "UF",
    assetStatus: "Operational",
    provinceName: "Punjab",
    zoneName: "Central Zone",
    divisionName: "Sahiwal Division",
    districtName: "Sahiwal",
    tehsilName: "Sahiwal City",
    areaName: "Farid Town",
    jurisdiction: "Central Operations Unit",
    inspector: "Inspection Team F",
    status: "completed",
    scheduledDate: "2026-06-02",
    completedDate: "2026-06-02",
    totalTaps: 11,
    functionalTaps: 11,
    plantCapacity: "10,000 GPD",
    antiScalantDosing: "Not Applicable",
    functionality: true,
    remarks: "Operator was available and maintenance record was properly updated.",
    mapX: 49,
    mapY: 56,
  },
  {
    id: 7,
    formId: "FORM-01",
    formName: "Asset Condition Inspection",
    siteCode: "PSPA-GRW-0055",
    assetName: "Gujranwala RO Plant",
    assetType: "RO",
    assetStatus: "Requires Attention",
    provinceName: "Punjab",
    zoneName: "North Zone",
    divisionName: "Gujranwala Division",
    districtName: "Gujranwala",
    tehsilName: "Gujranwala City",
    areaName: "People Colony",
    jurisdiction: "Northern Water Supply Cell",
    inspector: "Inspection Team G",
    status: "rejected",
    scheduledDate: "2026-05-29",
    completedDate: "2026-05-29",
    totalTaps: 13,
    functionalTaps: 6,
    plantCapacity: "18,000 GPD",
    antiScalantDosing: "Inactive",
    functionality: false,
    remarks: "Inspection evidence was incomplete. Revisit is required for verification.",
    mapX: 51,
    mapY: 30,
  },
  {
    id: 8,
    formId: "FORM-02",
    formName: "Water Quality Assessment",
    siteCode: "PSPA-DGK-0063",
    assetName: "DG Khan MF Filtration Plant",
    assetType: "MF",
    assetStatus: "Operational",
    provinceName: "Punjab",
    zoneName: "South Zone",
    divisionName: "Dera Ghazi Khan Division",
    districtName: "Dera Ghazi Khan",
    tehsilName: "DG Khan City",
    areaName: "Block 17",
    jurisdiction: "Southern Water Quality Cell",
    inspector: "Inspection Team H",
    status: "assigned",
    scheduledDate: "2026-06-06",
    completedDate: "",
    totalTaps: 9,
    functionalTaps: 9,
    plantCapacity: "9,000 GPD",
    antiScalantDosing: "Not Applicable",
    functionality: true,
    remarks: "Routine sample verification is assigned to the district inspection team.",
    mapX: 35,
    mapY: 78,
  },
];

function getOptionsForLevel(rows, hierarchy, level) {
  const levelIndex = HIERARCHY_LEVELS.findIndex((item) => item.type === level.type);

  const scopedRows = rows.filter((row) => {
    return HIERARCHY_LEVELS.slice(0, levelIndex).every((previousLevel) => {
      const selectedValue = hierarchy[previousLevel.type];
      if (!selectedValue) return true;
      return row[previousLevel.key] === selectedValue;
    });
  });

  return Array.from(new Set(scopedRows.map((row) => row[level.key]).filter(Boolean))).sort();
}

function cascadeHierarchyChange(current, type, value) {
  const order = HIERARCHY_LEVELS.map((item) => item.type);
  const idx = order.indexOf(type);
  const next = { ...current, [type]: value };

  for (let i = idx + 1; i < order.length; i += 1) {
    next[order[i]] = "";
  }

  return next;
}

export default function Dashboard() {
  const { isLight } = useTheme();
  const { setState, isCollapsed } = useNavbar();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hierarchy, setHierarchy] = useState(EMPTY_HIERARCHY);
  const [selectedRow, setSelectedRow] = useState(DEMO_INSPECTIONS[0]);

  const pageClasses = isLight ? "bg-slate-100 text-slate-900" : "bg-[#0b0f1a] text-[#e8edf5]";
  const surface = isLight ? "bg-white border-black/10" : "bg-[#111827] border-white/10";
  const softSurface = isLight ? "bg-slate-50 border-black/10" : "bg-[#1a2236] border-white/10";
  const textMuted = isLight ? "text-slate-600" : "text-[#8a95a8]";
  const textSoft = isLight ? "text-slate-400" : "text-[#4f5a6e]";
  const fieldClasses = isLight
    ? "border-black/10 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-blue-500"
    : "border-white/10 bg-[#1a2236] text-slate-100 placeholder:text-slate-500 focus:border-blue-500";

  useEffect(() => {
    setState({
      title: "Dashboard",
      subtitle: "Punjab Saaf Pani Authority inspection overview",
      actions: (
        <span className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 text-[12px] font-semibold text-white">
          <FileCheck2 size={14} />
          Frontend Demo
        </span>
      ),
    });

    return () => setState({ title: "", subtitle: "", actions: null });
  }, [setState]);

  const filteredRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return DEMO_INSPECTIONS.filter((row) => {
      const hierarchyMatch = HIERARCHY_LEVELS.every((level) => {
        const selectedValue = hierarchy[level.type];
        if (!selectedValue) return true;
        return row[level.key] === selectedValue;
      });

      if (!hierarchyMatch) return false;
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (!q) return true;

      return [
        row.formName,
        row.siteCode,
        row.assetName,
        row.assetType,
        row.zoneName,
        row.divisionName,
        row.districtName,
        row.tehsilName,
        row.areaName,
        row.jurisdiction,
        row.inspector,
        row.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    }).map((row, index) => ({ ...row, srNo: index + 1 }));
  }, [hierarchy, searchTerm, statusFilter]);

  const totals = useMemo(() => {
    const completed = DEMO_INSPECTIONS.filter((row) => row.status === "completed").length;
    const inProgress = DEMO_INSPECTIONS.filter((row) => row.status === "in_progress").length;
    const assigned = DEMO_INSPECTIONS.filter((row) => row.status === "assigned").length;
    const pending = DEMO_INSPECTIONS.filter((row) => row.status === "pending").length;
    const functional = DEMO_INSPECTIONS.filter((row) => row.functionality === true).length;
    const dysfunctional = DEMO_INSPECTIONS.filter((row) => row.functionality === false).length;
    const mf = DEMO_INSPECTIONS.filter((row) => row.assetType === "MF").length;
    const ro = DEMO_INSPECTIONS.filter((row) => row.assetType === "RO").length;
    const uf = DEMO_INSPECTIONS.filter((row) => row.assetType === "UF").length;

    return {
      totalAssets: DEMO_INSPECTIONS.length,
      totalInspections: DEMO_INSPECTIONS.length,
      completed,
      inProgress,
      assigned,
      pending,
      functional,
      dysfunctional,
      recentCount: 6,
      mf,
      ro,
      uf,
    };
  }, []);

  const formStats = useMemo(() => {
    return DEMO_FORMS.map((form) => {
      const rows = DEMO_INSPECTIONS.filter((row) => row.formId === form.id);
      const completed = rows.filter((row) => row.status === "completed").length;
      const active = rows.filter((row) => ["assigned", "in_progress", "pending"].includes(row.status)).length;

      return {
        ...form,
        total: rows.length,
        completed,
        active,
      };
    });
  }, []);

  const handleHierarchyChange = (type, value) => {
    if (type === "reset") {
      setHierarchy(EMPTY_HIERARCHY);
      return;
    }

    setHierarchy((prev) => cascadeHierarchyChange(prev, type, value));
  };

  const recentInspections = filteredRows.slice(0, 8);

  return (
    <div className={cn("min-h-screen px-3 py-4 sm:px-5 lg:px-6", pageClasses)}>
      <div className="mx-auto max-w-[1500px]">
        {/* Row 1: same KPI card structure as Inspection.jsx */}
        <section className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <KPICard
            title="Total Sites"
            value={formatNumber(totals.totalAssets)}
            subtitle={`${formatNumber(totals.totalInspections)} static inspection records`}
            icon={Building2}
            tone="blue"
          />
          <KPICard
            title="Functional"
            value={formatNumber(totals.functional)}
            subtitle="WFP functionality confirmed"
            icon={CheckCircle2}
            tone="green"
          />
          <KPICard
            title="Dysfunctional"
            value={formatNumber(totals.dysfunctional)}
            subtitle="WFP reported non-functional"
            icon={AlertTriangle}
            tone="red"
          />
        </section>

        {/* Row 2: same KPI card structure as Inspection.jsx */}
        <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KPICard
            title="Inspections (7 days)"
            value={formatNumber(totals.recentCount)}
            subtitle="Recent inspection activity"
            icon={ClipboardCheck}
            tone="indigo"
          />
          <KPICard
            title="MF"
            value={formatNumber(totals.mf)}
            subtitle="Membrane filtration assets"
            icon={Droplets}
            tone="amber"
          />
          <KPICard
            title="RO"
            value={formatNumber(totals.ro)}
            subtitle="Reverse osmosis assets"
            icon={Activity}
            tone="blue"
          />
          <KPICard
            title="UF"
            value={formatNumber(totals.uf)}
            subtitle="Ultra filtration assets"
            icon={Layers}
            tone="slate"
          />
        </section>

        {/* Static form overview */}
        <section className="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-3">
          {formStats.map((form) => {
            const Icon = form.icon;
            return (
              <div key={form.id} className={cn("rounded-[10px] border p-4", surface)}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                      <Icon size={17} />
                    </div>
                    <div>
                      <div className={cn("text-[10px] uppercase tracking-[0.12em] font-bold", textSoft)}>
                        {form.id}
                      </div>
                      <div className="mt-1 text-[14px] font-semibold">{form.title}</div>
                      <p className={cn("mt-1 text-[11px] leading-relaxed", textMuted)}>{form.subtitle}</p>
                    </div>
                  </div>
                  <span className={cn("rounded-full border px-2.5 py-1 text-[11px] font-semibold", softSurface, textMuted)}>
                    {form.total} sites
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className={cn("rounded-lg border p-3", softSurface)}>
                    <div className={cn("text-[10px] uppercase tracking-[0.12em]", textSoft)}>Completed</div>
                    <div className="mt-1 text-[18px] font-bold text-green-500">{form.completed}</div>
                  </div>
                  <div className={cn("rounded-lg border p-3", softSurface)}>
                    <div className={cn("text-[10px] uppercase tracking-[0.12em]", textSoft)}>Active</div>
                    <div className="mt-1 text-[18px] font-bold text-blue-500">{form.active}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Hierarchy + Search filter panel */}
        <section className="mb-5">
          <div className={cn("rounded-[10px] border p-5", surface)}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                  <Filter size={15} />
                </div>
                <div>
                  <div className={cn("text-[10px] uppercase tracking-[0.12em] font-bold", textSoft)}>
                    Administrative Hierarchy
                  </div>
                  <div className={cn("text-[13px] font-semibold", isLight ? "text-slate-900" : "text-slate-100")}>
                    Filter static inspection records by Punjab area levels
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleHierarchyChange("reset")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-medium transition",
                  isLight ? "border-black/10 text-slate-600 hover:bg-slate-100" : "border-white/10 text-slate-300 hover:bg-white/10",
                )}
              >
                <X size={11} /> Reset All
              </button>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {HIERARCHY_LEVELS.map((level) => {
                const options = getOptionsForLevel(DEMO_INSPECTIONS, hierarchy, level);
                const isParentSelected = !level.parent || hierarchy[level.parent];
                const isDisabled = !isParentSelected;
                const currentSelection = hierarchy[level.type];

                return (
                  <div key={level.type} className="space-y-1.5">
                    <label
                      className={cn(
                        "text-[10px] uppercase tracking-[0.12em] font-bold",
                        isDisabled ? "opacity-40" : textSoft,
                      )}
                    >
                      {level.label}
                    </label>
                    <div className="relative">
                      <select
                        disabled={isDisabled}
                        value={currentSelection}
                        onChange={(e) => handleHierarchyChange(level.type, e.target.value)}
                        className={cn(
                          "w-full appearance-none rounded-lg border px-3 py-2 pr-7 text-[12px] font-medium outline-none transition-all",
                          isDisabled
                            ? "cursor-not-allowed opacity-40 bg-transparent border-transparent"
                            : cn(
                                isLight ? "border-black/10 bg-slate-50" : "border-white/10 bg-white/5",
                                "cursor-pointer hover:border-blue-500/40 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10",
                              ),
                          currentSelection
                            ? isLight
                              ? "text-blue-700 border-blue-500/40 bg-blue-50"
                              : "text-blue-300 border-blue-500/30 bg-blue-500/5"
                            : isLight
                              ? "text-slate-900"
                              : "text-slate-100",
                        )}
                      >
                        <option value="">All {level.label}s</option>
                        {options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {!isDisabled && (
                        <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
                          <ChevronDown className={cn("h-3 w-3", textSoft)} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_200px]">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search form, asset, code, division, district, tehsil..."
                  className={cn(
                    "h-10 w-full rounded-lg border pl-9 pr-3 text-[13px] outline-none transition",
                    fieldClasses,
                  )}
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={cn("h-10 rounded-lg border px-3 text-[13px] outline-none transition", fieldClasses)}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Map-like coverage panel + Recent records */}
        <section className="mb-5 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className={cn("overflow-hidden rounded-[10px] border", surface)}>
            <div className="flex items-center justify-between border-b border-black/10 px-4 py-3 dark:border-white/10">
              <div>
                <div className="flex items-center gap-2 text-[14px] font-semibold">
                  <MapPin size={16} className="text-blue-500" />
                  Punjab inspection coverage
                </div>
                <p className={cn("mt-1 text-[11px]", textMuted)}>
                  Static frontend-only visual, no backend or Mapbox required
                </p>
              </div>
              <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px]", softSurface, textMuted)}>
                <Layers size={12} />
                {formatNumber(filteredRows.length)} visible
              </span>
            </div>

            <div className="relative h-[500px] overflow-hidden p-4">
              <div
                className={cn(
                  "relative h-full w-full overflow-hidden rounded-[14px] border",
                  isLight ? "border-black/10 bg-slate-100" : "border-white/10 bg-[#0b1220]",
                )}
              >
                <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(148,163,184,.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,.25)_1px,transparent_1px)] [background-size:42px_42px]" />
                <div className="absolute left-[20%] top-[8%] h-[84%] w-[58%] rounded-[44%_56%_48%_52%] border border-blue-500/25 bg-blue-500/10 shadow-inner" />
                <div className="absolute left-[30%] top-[22%] rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
                  Punjab Province
                </div>

                {filteredRows.map((row) => {
                  const isSelected = selectedRow?.id === row.id;
                  const statusClass =
                    row.status === "completed"
                      ? "bg-emerald-500"
                      : row.status === "in_progress"
                        ? "bg-blue-500"
                        : row.status === "assigned"
                          ? "bg-amber-500"
                          : row.status === "rejected"
                            ? "bg-rose-500"
                            : "bg-slate-500";

                  return (
                    <button
                      key={row.id}
                      type="button"
                      onClick={() => setSelectedRow(row)}
                      className={cn(
                        "absolute z-10 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white shadow-lg transition hover:scale-125",
                        statusClass,
                        isSelected && "scale-125 ring-4 ring-blue-500/25",
                      )}
                      style={{ left: `${row.mapX}%`, top: `${row.mapY}%` }}
                      title={`${row.assetName} - ${titleCase(row.status)}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </button>
                  );
                })}

                <div className="absolute bottom-4 left-4 right-4 z-20 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {STATUS_OPTIONS.filter((option) => option.value !== "all").map((option) => (
                    <div key={option.value} className="flex items-center gap-2 rounded-lg border border-white/20 bg-black/35 px-3 py-2 text-[11px] text-white backdrop-blur">
                      <span
                        className={cn(
                          "h-2.5 w-2.5 rounded-full",
                          option.value === "completed" && "bg-emerald-500",
                          option.value === "in_progress" && "bg-blue-500",
                          option.value === "assigned" && "bg-amber-500",
                          option.value === "rejected" && "bg-rose-500",
                          option.value === "pending" && "bg-slate-400",
                        )}
                      />
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={cn("overflow-hidden rounded-[10px] border", surface)}>
            <div className="flex items-center justify-between border-b border-black/10 px-4 py-3 dark:border-white/10">
              <div>
                <div className="flex items-center gap-2 text-[14px] font-semibold">
                  <ClipboardCheck size={16} className="text-blue-500" />
                  Recent inspection records
                </div>
                <p className={cn("mt-1 text-[11px]", textMuted)}>
                  Static records for three inspection forms
                </p>
              </div>
              <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px]", softSurface, textMuted)}>
                {recentInspections.length} records
              </span>
            </div>

            <div className="h-[500px] overflow-y-auto p-4">
              <div className="flex flex-col gap-3">
                {recentInspections.map((row) => {
                  const isSelected = selectedRow?.id === row.id;

                  return (
                    <button
                      key={row.id}
                      type="button"
                      onClick={() => setSelectedRow(row)}
                      className={cn(
                        "relative w-full rounded-[10px] border p-4 text-left transition-all duration-150",
                        isSelected
                          ? isLight
                            ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/30"
                            : "border-blue-500 bg-blue-500/10 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/20"
                          : cn(softSurface, "hover:border-blue-500/40 hover:shadow-md"),
                      )}
                    >
                      {isSelected && <span className="absolute inset-y-0 left-0 w-[3px] rounded-l-[10px] bg-blue-500" />}

                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <Building2 size={13} className={cn("flex-shrink-0", isSelected ? "text-blue-500" : "text-blue-500/60")} />
                            <span className={cn("truncate text-[13px] font-semibold", isSelected && "text-blue-600 dark:text-blue-400")}>
                              {row.assetName}
                            </span>
                          </div>
                          <div className={cn("mt-1 flex flex-wrap items-center gap-1.5 text-[11px]", textMuted)}>
                            <span className="font-mono text-blue-500">{row.siteCode}</span>
                            <span>·</span>
                            <span>{row.assetType}</span>
                            <span>·</span>
                            <span>{row.formName}</span>
                          </div>
                        </div>
                        <span className={cn("inline-flex flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold", getStatusTone(row.status))}>
                          {titleCase(row.status)}
                        </span>
                      </div>

                      <div className={cn("mb-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]", textMuted)}>
                        <div className="flex items-center gap-1.5">
                          <Layers size={11} className="flex-shrink-0 text-slate-400" />
                          <span className="truncate">{row.divisionName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={11} className="flex-shrink-0 text-slate-400" />
                          <span className="truncate">{row.districtName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Activity size={11} className="flex-shrink-0 text-slate-400" />
                          <span className="truncate">{row.jurisdiction}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Tally5 size={11} className="flex-shrink-0 text-slate-400" />
                          <span>{row.functionalTaps} / {row.totalTaps} taps</span>
                        </div>
                      </div>

                      <div className={cn("flex items-center justify-between text-[10px]", textMuted)}>
                        <div className="flex items-center gap-1">
                          <ClipboardCheck size={10} />
                          <span>{dateOnly(row.scheduledDate)}</span>
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-600">
                          <Navigation size={9} />
                          <span>Mapped</span>
                        </div>
                      </div>
                    </button>
                  );
                })}

                {!recentInspections.length && (
                  <div className={cn("py-10 text-center text-[13px]", textMuted)}>
                    No static inspection records found for the selected filters.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Table */}
        <section className="mb-5">
          <div className={cn("overflow-hidden rounded-[10px] border", surface)}>
            <div className="flex items-center justify-between border-b border-black/10 px-4 py-3 dark:border-white/10">
              <div>
                <div className="flex items-center gap-2 text-[14px] font-semibold">
                  <Table2 size={16} className="text-blue-500" />
                  Asset inspection status
                </div>
                <p className={cn("mt-1 text-[11px]", textMuted)}>
                  {formatNumber(filteredRows.length)} records found
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[1040px] w-full text-left text-[12px]">
                <thead className={cn("border-b text-[11px] uppercase tracking-[0.07em]", isLight ? "border-black/10 bg-slate-50 text-slate-500" : "border-white/10 bg-[#1a2236] text-slate-400")}>
                  <tr>
                    <th className="px-4 py-3 font-medium">Serial Number</th>
                    <th className="px-4 py-3 font-medium">View</th>
                    <th className="px-4 py-3 font-medium">Asset ID</th>
                    <th className="px-4 py-3 font-medium">Asset Plant</th>
                    <th className="px-4 py-3 font-medium">Form</th>
                    <th className="px-4 py-3 font-medium">Division</th>
                    <th className="px-4 py-3 font-medium">District</th>
                    <th className="px-4 py-3 font-medium">Asset Type</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr
                      key={row.id}
                      className={cn(
                        "border-b transition hover:bg-blue-500/5",
                        isLight ? "border-black/5" : "border-white/5",
                        selectedRow?.id === row.id && "bg-blue-500/10",
                      )}
                    >
                      <td className="px-4 py-3 font-medium">{row.srNo}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedRow(row)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700"
                          title="View inspection"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                      <td className="px-4 py-3 font-medium text-blue-500">{row.siteCode}</td>
                      <td className="px-4 py-3">{row.assetName}</td>
                      <td className="px-4 py-3">{row.formName}</td>
                      <td className="px-4 py-3">{row.divisionName}</td>
                      <td className="px-4 py-3">{row.districtName}</td>
                      <td className="px-4 py-3">{row.assetType}</td>
                      <td className="px-4 py-3">
                        <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold", getStatusTone(row.status))}>
                          {titleCase(row.status || "pending")}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {!filteredRows.length && (
                    <tr>
                      <td colSpan={9} className={cn("px-4 py-10 text-center text-[13px]", textMuted)}>
                        No static inspection data found for the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {selectedRow && (
        <DashboardDetailsModal
          row={selectedRow}
          isLight={isLight}
          isCollapsed={isCollapsed}
          textMuted={textMuted}
          onClose={() => setSelectedRow(null)}
        />
      )}
    </div>
  );
}

function DashboardDetailsModal({ row, isLight, isCollapsed, textMuted, onClose }) {
  const sidebarW = isCollapsed ? "68px" : "224px";
  const totalTaps = Number(row.totalTaps) || 0;
  const funcTaps = Number(row.functionalTaps) || 0;
  const tapPct = totalTaps > 0 ? Math.round((funcTaps / totalTaps) * 100) : 0;

  const sectionHdr = isLight
    ? "text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400"
    : "text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500";

  const divider = isLight ? "border-black/8" : "border-white/8";

  return (
    <div
      className="fixed inset-0 z-[59] flex items-center justify-center p-6"
      style={{ paddingLeft: `calc(${sidebarW} + 24px)` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />

      <div
        className={cn(
          "relative z-10 flex w-full max-w-2xl max-h-[88vh] flex-col overflow-hidden rounded-2xl shadow-2xl",
          isLight ? "bg-white" : "bg-[#0f1623]",
        )}
      >
        <div
          className={cn(
            "flex-shrink-0 px-6 pt-5 pb-4",
            row.status === "completed"
              ? "bg-emerald-500/10"
              : row.status === "in_progress"
                ? "bg-blue-500/10"
                : row.status === "assigned"
                  ? "bg-amber-500/10"
                  : row.status === "rejected"
                    ? "bg-rose-500/10"
                    : isLight
                      ? "bg-slate-50"
                      : "bg-white/5",
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", getStatusTone(row.status))}>
                  {titleCase(row.status || "pending")}
                </span>
                <span
                  className={cn(
                    "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                    isLight ? "border-black/10 bg-white text-slate-600" : "border-white/10 bg-white/5 text-slate-300",
                  )}
                >
                  {row.formName}
                </span>
              </div>

              <h3 className={cn("mt-2 text-[22px] font-bold leading-tight", isLight ? "text-slate-900" : "text-white")}>
                {row.assetName}
              </h3>
              <p className={cn("mt-1 flex items-center gap-1.5 text-[12px]", textMuted)}>
                <MapPin size={11} className="text-blue-500" />
                {row.siteCode}
                <span>·</span>
                <Navigation size={11} className="text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Mapped</span>
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className={cn(
                "flex-shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-xl border transition",
                isLight ? "border-black/10 bg-white hover:bg-slate-100" : "border-white/10 bg-white/5 hover:bg-white/10",
              )}
            >
              <X size={15} />
            </button>
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-[11px]">
              <span className={textMuted}>Functional taps</span>
              <span className={cn("font-semibold", isLight ? "text-slate-700" : "text-slate-200")}>
                {funcTaps} / {totalTaps} <span className={textMuted}>({tapPct}%)</span>
              </span>
            </div>
            <div className={cn("h-2 w-full overflow-hidden rounded-full", isLight ? "bg-slate-200" : "bg-white/10")}>
              <div
                className={cn("h-full rounded-full transition-all", tapPct >= 80 ? "bg-emerald-500" : tapPct >= 50 ? "bg-amber-500" : "bg-rose-500")}
                style={{ width: `${tapPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className={cn("px-6 py-4 border-b", divider)}>
            <div className={cn("mb-3 flex items-center gap-2", sectionHdr)}>
              <MapPin size={12} className="text-blue-500" />
              Location Details
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <ModalField label="Zone" value={row.zoneName} light={isLight} />
              <ModalField label="Division" value={row.divisionName} light={isLight} />
              <ModalField label="District" value={row.districtName} light={isLight} />
              <ModalField label="Tehsil" value={row.tehsilName} light={isLight} />
              <ModalField label="Area" value={row.areaName} light={isLight} />
              <ModalField label="Jurisdiction" value={row.jurisdiction} light={isLight} />
            </div>
          </div>

          <div className={cn("px-6 py-4 border-b", divider)}>
            <div className={cn("mb-3 flex items-center gap-2", sectionHdr)}>
              <Building2 size={12} className="text-amber-500" />
              Inspection Details
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <ModalField label="Asset ID" value={row.siteCode} mono light={isLight} />
              <ModalField label="Asset Type" value={row.assetType} light={isLight} />
              <ModalField label="Asset Status" value={row.assetStatus} light={isLight} />
              <ModalField label="Inspector" value={row.inspector} light={isLight} />
              <ModalField label="Scheduled Date" value={dateOnly(row.scheduledDate)} light={isLight} />
              <ModalField label="Completed Date" value={dateOnly(row.completedDate) || "Not completed"} light={isLight} />
              <ModalField label="Plant Capacity" value={row.plantCapacity} light={isLight} />
              <ModalField label="Anti-Scalant Dosing" value={row.antiScalantDosing} light={isLight} />
            </div>
          </div>

          <div className="px-6 py-4">
            <div className={cn("mb-3 flex items-center gap-2", sectionHdr)}>
              <ClipboardCheck size={12} className="text-green-500" />
              Remarks
            </div>
            <p className={cn("rounded-xl border p-4 text-[13px] leading-relaxed", isLight ? "border-black/10 bg-slate-50 text-slate-700" : "border-white/10 bg-white/5 text-slate-300")}>
              {row.remarks}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalField({ label, value, light, mono = false }) {
  return (
    <div>
      <div className={light ? "text-[10px] uppercase tracking-[0.1em] text-slate-400 font-medium" : "text-[10px] uppercase tracking-[0.1em] text-slate-500 font-medium"}>
        {label}
      </div>
      <div
        className={cn(
          "mt-1 text-[13px] font-semibold",
          mono && "font-mono text-blue-500",
          !mono && (light ? "text-slate-800" : "text-slate-100"),
        )}
      >
        {value || "-"}
      </div>
    </div>
  );
}
