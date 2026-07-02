import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { Plus, Search, Target, Trash2, X } from "lucide-react";
import { useTheme } from "../../components/Layout";
import { useNavbar } from "../../components/Navbar";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const PJP = () => {
  const { isLight } = useTheme();
  const { setState } = useNavbar();

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 10;
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    setState({
      title: "Contractor Permanent Journey Plan",
      subtitle: "Add and manage contractor inspection targets",
    });

    return () => setState({ title: "", subtitle: "", actions: null });
  }, [setState]);

  const inspectorOptions = [
    { value: "inspector-001", label: "INS-001 - Ahmed Khan" },
    { value: "inspector-002", label: "INS-002 - Bilal Hussain" },
    { value: "inspector-003", label: "INS-003 - Sarah Ali" },
  ];

  const zoneOptions = [
    { value: "north", label: "North Zone" },
    { value: "south", label: "South Zone" },
    { value: "central", label: "Central Zone" },
  ];

  const divisionOptions = [
    { value: "malakand", label: "Malakand Division" },
    { value: "mardan", label: "Mardan Division" },
    { value: "peshawar", label: "Peshawar Division" },
  ];

  const districtOptions = [
    { value: "swat", label: "Swat" },
    { value: "mardan", label: "Mardan" },
    { value: "peshawar", label: "Peshawar" },
  ];

  const tehsilOptions = [
    { value: "babuzai", label: "Babuzai" },
    { value: "matta", label: "Matta" },
    { value: "takht-bhai", label: "Takht Bhai" },
  ];

  const siteOptions = [
    { value: "SITE-001", label: "SITE-001" },
    { value: "SITE-002", label: "SITE-002" },
    { value: "SITE-003", label: "SITE-003" },
  ];

  const [plans, setPlans] = useState([
    {
      id: 1,
      inspectorName: "INS-001 - Ahmed Khan",
      zone: "North Zone",
      division: "Malakand Division",
      district: "Swat",
      tehsil: "Babuzai",
      siteNum: "SITE-001",
      noOfTarget: 12,
      targetDate: "2026-06-20",
    },
  ]);

  const [formData, setFormData] = useState({
    inspectorName: null,
    zone: null,
    division: null,
    district: null,
    tehsil: null,
    siteNum: null,
    noOfTarget: "",
    targetDate: "",
  });

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

  const inputClasses = isLight
    ? "h-[42px] w-full rounded-xl border border-gray-200 bg-white px-3 text-[13px] text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5"
    : "h-[42px] w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-3 text-[13px] text-white outline-none transition placeholder:text-gray-600 focus:border-white/50 focus:ring-4 focus:ring-white/5";

  const customSelectStyles = {
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      fontSize: "13px",
    }),
    control: (provided) => ({
      ...provided,
      minHeight: "42px",
      borderRadius: "12px",
      borderColor: isLight ? "#e5e7eb" : "rgba(255,255,255,0.1)",
      backgroundColor: isLight ? "#ffffff" : "#0b0b0b",
      boxShadow: "none",
      fontSize: "13px",
      "&:hover": {
        borderColor: isLight ? "#111827" : "rgba(255,255,255,0.5)",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isLight ? "#111827" : "#ffffff",
    }),
    input: (provided) => ({
      ...provided,
      color: isLight ? "#111827" : "#ffffff",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: isLight ? "#9ca3af" : "#4b5563",
    }),
  };

  const resetForm = () => {
    setFormData({
      inspectorName: null,
      zone: null,
      division: null,
      district: null,
      tehsil: null,
      siteNum: null,
      noOfTarget: "",
      targetDate: "",
    });
  };

  const closeModal = () => {
    resetForm();
    setShowModal(false);
  };

  const handleSavePlan = () => {
    if (
      !formData.inspectorName ||
      !formData.zone ||
      !formData.division ||
      !formData.district ||
      !formData.tehsil ||
      !formData.siteNum ||
      !formData.noOfTarget ||
      !formData.targetDate
    ) {
      alert("Please fill all fields.");
      return;
    }

    const newPlan = {
      id: Date.now(),
      inspectorName: formData.inspectorName.label,
      zone: formData.zone.label,
      division: formData.division.label,
      district: formData.district.label,
      tehsil: formData.tehsil.label,
      siteNum: formData.siteNum.label,
      noOfTarget: formData.noOfTarget,
      targetDate: formData.targetDate,
    };

    setPlans((prev) => [newPlan, ...prev]);
    resetForm();
    setShowModal(false);
    setPage(1);
  };

  const filteredPlans = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return plans;

    return plans.filter((plan) =>
      [
        plan.inspectorName,
        plan.zone,
        plan.division,
        plan.district,
        plan.tehsil,
        plan.siteNum,
        plan.noOfTarget,
        plan.targetDate,
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
                  Permanent Journey Plan
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

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-blue-800"
              >
                <Plus className="h-4 w-4" />
                Add Target
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-[13px]">
              <thead>
                <tr className={tableHead}>
                  <th className="w-16 px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
                    Sr.
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
                    Inspector Name
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
                    Zone
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
                    Division
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
                    District
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
                    Tehsil
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
                    Site Num
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
                    No. of Target
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
                    Target Date
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
                              {plan.inspectorName || "—"}
                            </div>
                            <div className={cn("text-[11px]", tableMuted)}>
                              Site: {plan.siteNum || "—"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className={cn("px-4 py-3", tableCell)}>
                        {plan.zone || "—"}
                      </td>

                      <td className={cn("px-4 py-3", tableCell)}>
                        {plan.division || "—"}
                      </td>

                      <td className={cn("px-4 py-3", tableCell)}>
                        {plan.district || "—"}
                      </td>

                      <td className={cn("px-4 py-3", tableCell)}>
                        {plan.tehsil || "—"}
                      </td>

                      <td className={cn("px-4 py-3", tableCell)}>
                        {plan.siteNum || "—"}
                      </td>

                      <td className={cn("px-4 py-3 font-semibold", tableCell)}>
                        {plan.noOfTarget || "—"}
                      </td>

                      <td className={cn("px-4 py-3", tableCell)}>
                        {plan.targetDate || "—"}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() =>
                              setPlans((prev) =>
                                prev.filter((item) => item.id !== plan.id),
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-rose-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
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

        {/* Add Target Modal - centered inside PJP section only */}
        {showModal && (
          <div className="fixed top-0 right-0 bottom-0 left-[16rem] z-40 flex items-center justify-center bg-black/30 px-4 py-8">
            {" "}
            <div
              className={cn(
                "relative w-full max-w-5xl rounded-2xl border p-6 shadow-2xl translate-y-8",
                isLight
                  ? "border-gray-200 bg-white"
                  : "border-white/10 bg-[#111111]",
              )}
            >
              <button
                type="button"
                className={cn(
                  "absolute right-3 top-3 rounded-lg p-1 transition",
                  isLight
                    ? "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    : "text-gray-400 hover:bg-white/5 hover:text-white",
                )}
                onClick={closeModal}
              >
                <X size={20} />
              </button>

              <div className="mb-5">
                <h2
                  className={cn(
                    "text-[18px] font-semibold",
                    isLight ? "text-gray-950" : "text-white",
                  )}
                >
                  Add Target
                </h2>
                <p className={cn("mt-1 text-[12px]", tableMuted)}>
                  Fill the target details for the contractor journey plan.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                    Inspector Name
                  </label>
                  <Select
                    value={formData.inspectorName}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        inspectorName: value,
                      }))
                    }
                    options={inspectorOptions}
                    placeholder="Select Inspector"
                    isClearable
                    styles={customSelectStyles}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                    Zone
                  </label>
                  <Select
                    value={formData.zone}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        zone: value,
                      }))
                    }
                    options={zoneOptions}
                    placeholder="Select Zone"
                    isClearable
                    styles={customSelectStyles}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                    Division
                  </label>
                  <Select
                    value={formData.division}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        division: value,
                      }))
                    }
                    options={divisionOptions}
                    placeholder="Select Division"
                    isClearable
                    styles={customSelectStyles}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                    District
                  </label>
                  <Select
                    value={formData.district}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        district: value,
                      }))
                    }
                    options={districtOptions}
                    placeholder="Select District"
                    isClearable
                    styles={customSelectStyles}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                    Tehsil
                  </label>
                  <Select
                    value={formData.tehsil}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        tehsil: value,
                      }))
                    }
                    options={tehsilOptions}
                    placeholder="Select Tehsil"
                    isClearable
                    styles={customSelectStyles}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                    Site Num
                  </label>
                  <Select
                    value={formData.siteNum}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        siteNum: value,
                      }))
                    }
                    options={siteOptions}
                    placeholder="Select Site"
                    isClearable
                    styles={customSelectStyles}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                    No. of Target
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.noOfTarget}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        noOfTarget: e.target.value,
                      }))
                    }
                    placeholder="Enter target"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                    Target Date
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={formData.targetDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        targetDate: e.target.value,
                      }))
                    }
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className={cn(
                    "rounded-xl border px-5 py-2.5 text-[12px] font-semibold transition",
                    isLight
                      ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      : "border-white/10 bg-[#0b0b0b] text-gray-300 hover:bg-white/5",
                  )}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSavePlan}
                  className="rounded-xl bg-blue-900 px-5 py-2.5 text-[12px] font-semibold text-white transition hover:bg-blue-800"
                >
                  Save Target
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PJP;
