import { useEffect, useMemo, useState } from "react";
import { Check, ClipboardList, Loader2, Search } from "lucide-react";
import { useTheme } from "../../components/Layout";
import { useNavbar } from "../../components/Navbar";

function cn(...c) {
  return c.filter(Boolean).join(" ");
}

function FieldLabel({ children, required = false }) {
  return (
    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

function SectionCard({ isLight, number, title, description, children }) {
  return (
    <section
      className={cn(
        "rounded-2xl border p-5 shadow-sm md:p-6",
        isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#111111]",
      )}
    >
      <div className="mb-5 flex items-start gap-4">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-[12px] font-bold",
            isLight
              ? "border-gray-200 bg-gray-100 text-gray-800"
              : "border-white/10 bg-black text-gray-200",
          )}
        >
          {number}
        </div>
        <div>
          <h2
            className={cn(
              "text-[16px] font-semibold tracking-[-0.01em]",
              isLight ? "text-gray-950" : "text-white",
            )}
          >
            {title}
          </h2>
          {description && (
            <p className={cn("mt-1 text-[13px] leading-5", isLight ? "text-gray-500" : "text-gray-400")}>
              {description}
            </p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

function fmt(v, decimals = 2) {
  const n = Number(v);
  if (isNaN(n)) return "—";
  return n.toLocaleString("en-PK", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d)) return value;
  return d.toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" });
}

// ── Table column definitions ──────────────────────────────────────────────────
const COLUMNS = [
  { key: "item_no",          label: "Item #",      align: "text-center", width: "w-16"  },
  { key: "item_description", label: "Description", align: "text-left",   width: ""      },
  { key: "unit",             label: "Unit",        align: "text-center", width: "w-20"  },
  { key: "quantity",         label: "Qty",         align: "text-right",  width: "w-20"  },
  { key: "rate_rs",          label: "Rate (Rs.)",  align: "text-right",  width: "w-28"  },
  { key: "amount_rs",        label: "Amount (Rs.)",align: "text-right",  width: "w-32"  },
  { key: "created_at",       label: "Added",       align: "text-left",   width: "w-28"  },
];

export default function CreateBOQ() {
  const { isLight } = useTheme();
  const { setState } = useNavbar();

  const API_BASE_URL = useMemo(
    () => import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "http://127.0.0.1:8000",
    [],
  );

  // ── Form state ────────────────────────────────────────────────────────────
  const [bills, setBills] = useState([]);
  const [form, setForm] = useState({
    bill: "",
    item_description: "",
    unit: "",
    quantity: "",
    rate_rs: "",
  });
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

  // ── Items table state ─────────────────────────────────────────────────────
  const [allItems,      setAllItems]      = useState([]);
  const [itemsLoading,  setItemsLoading]  = useState(false);
  // filter: which bill is selected in the table toolbar
  const [filterBill,    setFilterBill]    = useState("all");
  const [searchText,    setSearchText]    = useState("");

  // ── Navbar ────────────────────────────────────────────────────────────────
  useEffect(() => {
    setState({ title: "Create BOQ Item", subtitle: "Add a new Bill of Quantities line item" });
    return () => setState({ title: "", subtitle: "", actions: null });
  }, [setState]);

  // ── Fetch bills (for form dropdown) ──────────────────────────────────────
  const fetchBills = async () => {
    try {
      const res  = await fetch(`${API_BASE_URL}/api/list-boq-bill/`);
      const data = await res.json();
      setBills(data?.data || []);
    } catch { /* ignore */ }
  };

  // ── Fetch all BOQ items ───────────────────────────────────────────────────
  const fetchItems = async () => {
    setItemsLoading(true);
    try {
      const res  = await fetch(`${API_BASE_URL}/api/list-boq/`);
      const data = await res.json();
      setAllItems(data?.data || []);
    } catch { /* ignore */ }
    finally { setItemsLoading(false); }
  };

  useEffect(() => {
    fetchBills();
    fetchItems();
  }, []);

  // ── Form handler ──────────────────────────────────────────────────────────
  const handleChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      const res = await fetch(`${API_BASE_URL}/api/create-boq/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bill:             Number(form.bill),
          item_description: form.item_description,
          unit:             form.unit,
          quantity:         Number(form.quantity),
          rate_rs:          Number(form.rate_rs),
        }),
      });
      if (res.ok) {
        setSuccess(true);
        // keep the bill selected so user can add more items to the same bill
        setForm((p) => ({ ...p, item_description: "", unit: "", quantity: "", rate_rs: "" }));
        // sync the table filter to the bill that was just used
        setFilterBill(String(form.bill));
        await fetchItems();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Derived: item counts per bill ─────────────────────────────────────────
  const itemCountByBill = useMemo(() => {
    const map = {};
    allItems.forEach((item) => {
      const key = String(item.bill);
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [allItems]);

  // ── Filtered items for table ──────────────────────────────────────────────
  const visibleItems = useMemo(() => {
    let rows = allItems;
    if (filterBill !== "all") {
      rows = rows.filter((item) => String(item.bill) === filterBill);
    }
    const q = searchText.trim().toLowerCase();
    if (q) {
      rows = rows.filter((item) =>
        [item.item_description, item.unit, String(item.item_no)]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    return rows;
  }, [allItems, filterBill, searchText]);

  // ── Totals for visible items ──────────────────────────────────────────────
  const totals = useMemo(() => ({
    qty:    visibleItems.reduce((s, r) => s + Number(r.quantity  || 0), 0),
    amount: visibleItems.reduce((s, r) => s + Number(r.amount_rs || 0), 0),
  }), [visibleItems]);

  // ── Selected bill metadata (for table header badge) ───────────────────────
  const selectedBillMeta = useMemo(
    () => bills.find((b) => String(b.id) === filterBill) || null,
    [bills, filterBill],
  );

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const pageClasses  = isLight ? "min-h-screen bg-[#f5f5f5] text-gray-950"  : "min-h-screen bg-black text-gray-100";
  const inputClasses = isLight
    ? "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13px] text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
    : "w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-[13px] text-white outline-none transition placeholder:text-gray-600 focus:border-white/50 focus:ring-4 focus:ring-white/5 disabled:cursor-not-allowed disabled:bg-[#151515] disabled:text-gray-600";

  const surface      = isLight ? "border-gray-200 bg-white"      : "border-white/10 bg-[#111111]";
  const subSurface   = isLight ? "border-gray-200 bg-gray-50"    : "border-white/10 bg-[#0b0b0b]";
  const tableHead    = isLight ? "bg-gray-50 border-b border-gray-200 text-gray-500"   : "bg-[#0b0b0b] border-b border-white/10 text-gray-500";
  const tableRow     = isLight ? "border-b border-gray-100 hover:bg-gray-50 transition" : "border-b border-white/5 hover:bg-white/5 transition";
  const tableCell    = isLight ? "text-gray-900"  : "text-gray-200";
  const tableMuted   = isLight ? "text-gray-500"  : "text-gray-500";
  const filterSelect = isLight
    ? "rounded-xl border border-gray-200 bg-white px-3 py-2 text-[12px] text-gray-950 outline-none transition focus:border-gray-900"
    : "rounded-xl border border-white/10 bg-[#0b0b0b] px-3 py-2 text-[12px] text-white outline-none transition focus:border-white/40";

  return (
    <div className={pageClasses}>
      <main className="mx-auto max-w-5xl space-y-5 px-5 py-6 md:px-8">

        {/* ── Single form card ──────────────────────────────────────────── */}
        <SectionCard
          isLight={isLight}
          number="01"
          title="BOQ item details"
          description="Select the bill and provide the line item information."
        >
          <div className="grid gap-4 sm:grid-cols-2">

            {/* Bill selector — full width */}
            <div className="sm:col-span-2">
              <FieldLabel required>Bill</FieldLabel>
              <select
                className={inputClasses}
                value={form.bill}
                onChange={(e) => handleChange("bill", e.target.value)}
              >
                <option value="">Select Bill</option>
                {bills.map((b) => (
                  <option key={b.id} value={b.id}>
                    Bill #{b.bill_no} — {b.bill_title}
                    {itemCountByBill[String(b.id)] ? ` (${itemCountByBill[String(b.id)]} items)` : ""}
                  </option>
                ))}
              </select>

              {/* Selected bill metadata pill */}
              {form.bill && (() => {
                const meta = bills.find((b) => String(b.id) === String(form.bill));
                if (!meta) return null;
                const count = itemCountByBill[String(meta.id)] || 0;
                return (
                  <div className={cn("mt-2 flex flex-wrap items-center gap-2 rounded-xl border px-4 py-2.5 text-[12px]", subSurface)}>
                    <span className={cn("font-semibold", isLight ? "text-gray-950" : "text-white")}>
                      Bill #{meta.bill_no} — {meta.bill_title}
                    </span>
                    {meta.inspection_site_name && <span className={tableMuted}>· {meta.inspection_site_name}</span>}
                    {meta.zone_name && <span className={tableMuted}>· {meta.zone_name}</span>}
                    <span className="ml-auto inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-400">
                      {count} item{count !== 1 ? "s" : ""}
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Item description — full width */}
            <div className="sm:col-span-2">
              <FieldLabel required>Item Description</FieldLabel>
              <input
                className={inputClasses}
                placeholder="e.g. Supply and installation of RO membrane"
                value={form.item_description}
                onChange={(e) => handleChange("item_description", e.target.value)}
              />
            </div>

            {/* Unit */}
            <div>
              <FieldLabel required>Unit</FieldLabel>
              <input
                className={inputClasses}
                placeholder="e.g. Nos, Rft, Sqft"
                value={form.unit}
                onChange={(e) => handleChange("unit", e.target.value)}
              />
            </div>

            {/* Quantity */}
            <div>
              <FieldLabel required>Quantity</FieldLabel>
              <input
                type="number"
                className={inputClasses}
                placeholder="0"
                value={form.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
              />
            </div>

            {/* Rate */}
            <div>
              <FieldLabel required>Rate (Rs.)</FieldLabel>
              <input
                type="number"
                className={inputClasses}
                placeholder="0.00"
                value={form.rate_rs}
                onChange={(e) => handleChange("rate_rs", e.target.value)}
              />
            </div>

            {/* Live amount preview */}
            {form.quantity && form.rate_rs ? (
              <div className={cn("flex flex-col justify-center rounded-xl border px-4 py-3", subSurface)}>
                <span className="mb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                  Amount
                </span>
                <span className={cn("text-[15px] font-semibold", isLight ? "text-gray-950" : "text-white")}>
                  Rs. {fmt(Number(form.quantity) * Number(form.rate_rs))}
                </span>
              </div>
            ) : (
              /* keep grid balanced when preview is hidden */
              <div />
            )}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !form.bill || !form.item_description || !form.unit || !form.quantity }
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-[12px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
                isLight ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-emerald-500 text-white hover:bg-emerald-600",
              )}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Save Item
            </button>

            {success && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-[12px] font-medium text-emerald-500">
                <Check className="h-3.5 w-3.5" />
                Item saved
              </span>
            )}
          </div>
        </SectionCard>

        {/* ── Section 03: Items table ────────────────────────────────────── */}
        <section className={cn("rounded-2xl border shadow-sm", surface)}>

          {/* Table toolbar */}
          <div className={cn("flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4", isLight ? "border-gray-200" : "border-white/10")}>
            <div className="flex items-center gap-3">
              <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", isLight ? "bg-blue-50 text-blue-600" : "bg-blue-500/10 text-blue-400")}>
                <ClipboardList className="h-4 w-4" />
              </div>
              <div>
                <div className={cn("text-[14px] font-semibold", isLight ? "text-gray-950" : "text-white")}>
                  BOQ Items
                </div>
                <div className={cn("text-[11px]", tableMuted)}>
                  {visibleItems.length} item{visibleItems.length !== 1 ? "s" : ""}
                  {filterBill !== "all" && selectedBillMeta
                    ? ` in Bill #${selectedBillMeta.bill_no} — ${selectedBillMeta.bill_title}`
                    : " across all bills"}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Bill filter */}
              <select
                className={filterSelect}
                value={filterBill}
                onChange={(e) => { setFilterBill(e.target.value); setSearchText(""); }}
              >
                <option value="all">All Bills ({allItems.length} items)</option>
                {bills.map((b) => (
                  <option key={b.id} value={String(b.id)}>
                    Bill #{b.bill_no} — {b.bill_title} ({itemCountByBill[String(b.id)] || 0} items)
                  </option>
                ))}
              </select>

              {/* Search within visible items */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <input
                  className={cn("h-9 rounded-xl border pl-8 pr-3 text-[12px] outline-none transition", filterSelect, "w-48")}
                  placeholder="Search items…"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>

              {itemsLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {visibleItems.length === 0 && !itemsLoading ? (
              <div className={cn("px-5 py-12 text-center text-[13px]", tableMuted)}>
                {filterBill === "all"
                  ? "No items yet. Save one above to see it here."
                  : "No items for this bill yet."}
              </div>
            ) : (
              <table className="w-full min-w-[700px] border-collapse text-[13px]">
                <thead>
                  <tr className={tableHead}>
                    {COLUMNS.map((col) => (
                      <th
                        key={col.key}
                        className={cn(
                          "px-4 py-3 text-[10px] font-bold uppercase tracking-[0.08em]",
                          col.align,
                          col.width,
                        )}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {visibleItems.map((item) => (
                    <tr key={item.id} className={tableRow}>
                      {/* Item # */}
                      <td className={cn("px-4 py-3 text-center font-mono text-[11px] font-semibold", tableMuted)}>
                        {item.item_no ?? "—"}
                      </td>
                      {/* Description */}
                      <td className={cn("px-4 py-3 max-w-[280px]", tableCell)}>
                        <div className="truncate">{item.item_description}</div>
                        {/* Bill context when "All Bills" is shown */}
                        {filterBill === "all" && item.bill_title && (
                          <div className={cn("mt-0.5 text-[10px]", tableMuted)}>
                            Bill #{item.bill ?? ""} · {item.bill_title}
                          </div>
                        )}
                      </td>
                      {/* Unit */}
                      <td className={cn("px-4 py-3 text-center", tableMuted)}>{item.unit || "—"}</td>
                      {/* Qty */}
                      <td className={cn("px-4 py-3 text-right font-mono", tableCell)}>{fmt(item.quantity, 2)}</td>
                      {/* Rate */}
                      <td className={cn("px-4 py-3 text-right font-mono", tableCell)}>
                        {fmt(item.rate_rs, 2)}
                      </td>
                      {/* Amount */}
                      <td className={cn("px-4 py-3 text-right font-mono font-semibold", isLight ? "text-emerald-700" : "text-emerald-400")}>
                        {fmt(item.amount_rs, 2)}
                      </td>
                      {/* Created */}
                      <td className={cn("px-4 py-3 text-[11px]", tableMuted)}>{formatDate(item.created_at)}</td>
                    </tr>
                  ))}
                </tbody>

                {/* Totals footer */}
                {visibleItems.length > 0 && (
                  <tfoot>
                    <tr className={cn(isLight ? "bg-gray-50 border-t border-gray-200" : "bg-[#0b0b0b] border-t border-white/10")}>
                      <td colSpan={3} className={cn("px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em]", tableMuted)}>
                        Total
                      </td>
                      <td className={cn("px-4 py-3 text-right font-mono font-semibold text-[13px]", tableCell)}>
                        {fmt(totals.qty, 2)}
                      </td>
                      <td className={cn("px-4 py-3 text-right", tableMuted)} />
                      <td className={cn("px-4 py-3 text-right font-mono font-bold text-[13px]", isLight ? "text-emerald-700" : "text-emerald-400")}>
                        {fmt(totals.amount, 2)}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                )}
              </table>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
