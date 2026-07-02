// ContractorPlanning.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardCheck, FileText, Search, Target } from "lucide-react";
import { useTheme } from "../../components/Layout";
import { useNavbar } from "../../components/Navbar";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const PAGE_SIZE = 10;

const DUMMY_CONTRACTOR_PLANS = [
  {
    id: "TPV-TGT-001",
    inspectorName: "INS-001 - Ahmed Khan",
    siteNo: "SITE-001",
    targetDate: "2026-06-20",
    totalTarget: 12,
    targetsDone: 8,
    status: "in_progress",
    approved: 5,
    pending: 3,
    finalApproved: 4,
  },
  {
    id: "TPV-TGT-002",
    inspectorName: "INS-002 - Bilal Hussain",
    siteNo: "SITE-002",
    targetDate: "2026-06-24",
    totalTarget: 10,
    targetsDone: 10,
    status: "completed",
    approved: 8,
    pending: 2,
    finalApproved: 7,
  },
];

function valueOrDash(value) {
  if (value === null || value === undefined || value === "") return "—";
  return value;
}

function formatStatusLabel(status) {
  if (!status) return "Unknown";

  return String(status)
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getStatusPillClasses(status) {
  switch (String(status || "").toLowerCase()) {
    case "completed":
    case "complete":
      return "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20";
    case "in_progress":
    case "in progress":
      return "bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20";
    case "not_started":
    case "not started":
      return "bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20";
    case "rejected":
      return "bg-rose-500/10 text-rose-600 ring-1 ring-rose-500/20";
    default:
      return "bg-gray-500/10 text-gray-600 ring-1 ring-gray-500/20";
  }
}

export default function ContractorPlanning() {
  const { isLight } = useTheme();
  const { setState } = useNavbar();
  const navigate = useNavigate();

  const [plans] = useState(DUMMY_CONTRACTOR_PLANS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setState({
      title: "Contractor Planning",
      subtitle: "Review contractor TPV targets and open TPV proformas",
    });

    return () => setState({ title: "", subtitle: "", actions: null });
  }, [setState]);

  const pageClasses = isLight
    ? "relative min-h-screen bg-[#f5f5f5] text-gray-950"
    : "relative min-h-screen bg-black text-gray-100";

  const surface = isLight
    ? "border-gray-200 bg-white"
    : "border-white/10 bg-[#111111]";

  const tableHead = isLight
    ? "bg-gray-50 border-b border-gray-200 text-gray-500"
    : "bg-[#0b0b0b] border-b border-white/10 text-gray-500";

  const tableRow = isLight
    ? "border-b border-gray-100 hover:bg-gray-50 transition"
    : "border-b border-white/5 hover:bg-white/5 transition";

  const tableCell = isLight ? "text-gray-900" : "text-gray-200";
  const tableMuted = isLight ? "text-gray-500" : "text-gray-500";

  const searchInput = isLight
    ? "h-9 rounded-xl border border-gray-200 bg-white pl-8 pr-3 text-[12px] text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-900"
    : "h-9 rounded-xl border border-white/10 bg-[#0b0b0b] pl-8 pr-3 text-[12px] text-white outline-none transition placeholder:text-gray-600 focus:border-white/40";

  const filteredPlans = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return plans;

    return plans.filter((plan) =>
      [
        plan.inspectorName,
        plan.siteNo,
        plan.targetDate,
        plan.targetsDone,
        plan.totalTarget,
        plan.status,
        plan.approved,
        plan.pending,
        plan.finalApproved,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [plans, search]);

  const totalPages = Math.max(1, Math.ceil(filteredPlans.length / PAGE_SIZE));

  const paginatedPlans = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredPlans.slice(start, start + PAGE_SIZE);
  }, [filteredPlans, page]);

  const handleOpenTPV = (plan) => {
    navigate(`/show-tpv-proforma/${plan.id}`, {
      state: {
        targetId: plan.id,
        siteNo: plan.siteNo,
        inspectorName: plan.inspectorName,
        targetDone: plan.targetsDone,
        totalTarget: plan.totalTarget,
      },
    });
  };

  return (
    <div className={pageClasses}>
      <main className="relative w-full max-w-none space-y-5 px-4 py-4">
        <section className={cn("rounded-2xl border shadow-sm", surface)}>
          <div
            className={cn(
              "flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4",
              isLight ? "border-gray-200" : "border-white/10",
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  isLight
                    ? "bg-blue-50 text-blue-600"
                    : "bg-blue-500/10 text-blue-400",
                )}
              >
                <Target className="h-4 w-4" />
              </div>

              <div>
                <div
                  className={cn(
                    "text-[14px] font-semibold",
                    isLight ? "text-gray-950" : "text-white",
                  )}
                >
                  Contractor TPV Planning
                </div>
                <div className={cn("text-[11px]", tableMuted)}>
                  {filteredPlans.length} target
                  {filteredPlans.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search targets..."
                  className={cn(searchInput, "w-56")}
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className={cn(
                  "rounded-xl border px-4 py-2 text-[12px] font-semibold transition",
                  isLight
                    ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    : "border-white/10 bg-[#0b0b0b] text-gray-300 hover:bg-white/5",
                )}
              >
                Clear
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-[13px]">
              <thead>
                <tr className={tableHead}>
                  <th className="w-16 px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
                    Sr.
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
                    Inspector Name
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
                    Site No
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
                    Target Date
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
                    Targets Done
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
                    Approved
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
                    Pending
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
                    Final Approved
                  </th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.08em]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedPlans.length === 0 ? (
                  <tr>
                    <td
                      colSpan="10"
                      className={cn(
                        "px-5 py-12 text-center text-[13px]",
                        tableMuted,
                      )}
                    >
                      No targets found.
                    </td>
                  </tr>
                ) : (
                  paginatedPlans.map((plan, index) => (
                    <tr key={plan.id} className={tableRow}>
                      <td
                        className={cn(
                          "px-4 py-3 font-mono text-[11px]",
                          tableMuted,
                        )}
                      >
                        {(page - 1) * PAGE_SIZE + index + 1}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-[12px] font-bold text-emerald-500">
                            {(plan.inspectorName || "I")
                              .split(" ")
                              .map((word) => word[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </div>

                          <div>
                            <div className={cn("font-semibold", tableCell)}>
                              {valueOrDash(plan.inspectorName)}
                            </div>
                            <div className={cn("text-[11px]", tableMuted)}>
                              Site: {valueOrDash(plan.siteNo)}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className={cn("px-4 py-3 font-semibold", tableCell)}>
                        {valueOrDash(plan.siteNo)}
                      </td>

                      <td className={cn("px-4 py-3", tableCell)}>
                        {valueOrDash(plan.targetDate)}
                      </td>

                      <td className={cn("px-4 py-3 font-semibold", tableCell)}>
                        {valueOrDash(plan.targetsDone)} / {valueOrDash(plan.totalTarget)}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold",
                            getStatusPillClasses(plan.status),
                          )}
                        >
                          {formatStatusLabel(plan.status)}
                        </span>
                      </td>

                      <td className={cn("px-4 py-3", tableCell)}>
                        {valueOrDash(plan.approved)}
                      </td>

                      <td className={cn("px-4 py-3", tableCell)}>
                        {valueOrDash(plan.pending)}
                      </td>

                      <td className={cn("px-4 py-3", tableCell)}>
                        {valueOrDash(plan.finalApproved)}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() => handleOpenTPV(plan)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-900 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-blue-800"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            TPV Proforma
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div
            className={cn(
              "flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between",
              isLight ? "border-gray-200" : "border-white/10",
            )}
          >
            <p className={cn("text-[12px]", tableMuted)}>
              Showing {paginatedPlans.length} of {filteredPlans.length} targets
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => page > 1 && setPage((prev) => prev - 1)}
                disabled={page === 1}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
                  isLight
                    ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    : "border-white/10 bg-[#0b0b0b] text-gray-300 hover:bg-white/5",
                )}
              >
                Previous
              </button>

              <span
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-[12px] font-semibold",
                  isLight
                    ? "border-gray-200 bg-gray-50 text-gray-700"
                    : "border-white/10 bg-[#0b0b0b] text-gray-300",
                )}
              >
                {page} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => page < totalPages && setPage((prev) => prev + 1)}
                disabled={page === totalPages}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
                  isLight
                    ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    : "border-white/10 bg-[#0b0b0b] text-gray-300 hover:bg-white/5",
                )}
              >
                Next
              </button>
            </div>
          </div>
        </section>

        <section
          className={cn(
            "grid gap-4 sm:grid-cols-3",
            filteredPlans.length === 0 && "hidden",
          )}
        >
          <div className={cn("rounded-2xl border p-5 shadow-sm", surface)}>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <ClipboardCheck className="h-4 w-4" />
              </div>
              <div>
                <p className={cn("text-[11px]", tableMuted)}>Total Plans</p>
                <p className={cn("text-[22px] font-semibold", tableCell)}>
                  {plans.length}
                </p>
              </div>
            </div>
          </div>

          <div className={cn("rounded-2xl border p-5 shadow-sm", surface)}>
            <p className={cn("text-[11px]", tableMuted)}>Targets Done</p>
            <p className={cn("mt-1 text-[22px] font-semibold", tableCell)}>
              {plans.reduce((sum, plan) => sum + Number(plan.targetsDone || 0), 0)}
            </p>
          </div>

          <div className={cn("rounded-2xl border p-5 shadow-sm", surface)}>
            <p className={cn("text-[11px]", tableMuted)}>Final Approved</p>
            <p className={cn("mt-1 text-[22px] font-semibold", tableCell)}>
              {plans.reduce((sum, plan) => sum + Number(plan.finalApproved || 0), 0)}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
