import { useEffect, useMemo, useState } from "react";
import { Check, ClipboardList, Loader2 } from "lucide-react";
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
            <p
              className={cn(
                "mt-1 text-[13px] leading-5",
                isLight ? "text-gray-500" : "text-gray-400",
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

const COLUMNS = [
  { key: "id",                   label: "#",              width: "w-12"  },
  { key: "bill_no",              label: "Bill No",        width: "w-20"  },
  { key: "bill_title",           label: "Bill Title",     width: ""      },
   { key: "qty", label: "Qty", width: "" },
  { key: "unit_rate_rs", label: "Unit Rate (Rs.)", width: "" },
  { key: "amount_rs", label: "Amount (Rs.)", width: "" },
  // { key: "zone_name",            label: "Zone",           width: ""      },
  // { key: "division_name", label: "Division", width: ""      },
  { key: "created_at",           label: "Created",        width: "w-32"  },
];

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d)) return value;
  return d.toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" });
}

export default function CreateBOQBill() {
  const { isLight } = useTheme();
  const { setState } = useNavbar();

  const API = useMemo(() => "http://127.0.0.1:8000/api", []);

  // ── Cascading dropdowns ────────────────────────────────────────────
  const [contracts, setContracts] = useState([]);
  const [zones, setZones] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [tehsils, setTehsils] = useState([]);
  const [sites, setSites] = useState([]);

  const [sitePage, setSitePage] = useState(1);
  const pageSize = 5;

const [form, setForm] = useState({
  contract: "",
  zone: "",
  division: "",
  district: "",
  tehsil: "",
  
  inspection_site: "",

  bill_title: "",
  bill_no: "",

  qty: "",
  unit_rate_rs: "",
});

  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);

  // ── Bills table ────────────────────────────────────────────────────
  const [bills,         setBills]         = useState([]);
  const [billsLoading,  setBillsLoading]  = useState(false);

  useEffect(() => {
    fetch(`${API}/list-contract/`)
      .then(r => r.json())
      .then(d => setContracts(d.data || []));
  }, []);

  // ── Navbar ────────────────────────────────────────────────────────
  useEffect(() => {
    setState({ title: "Create BOQ Bill", subtitle: "Add a new Bill of Quantities record" });
    return () => setState({ title: "", subtitle: "", actions: null });
  }, [setState]);

  // ── Fetch helpers ─────────────────────────────────────────────────
  const fetchBills = async (divisionId = "") => {
  setBillsLoading(true);
  try {
    let url = `${API}/list-boq-bill/`;

    if (divisionId) {
      url += `?division_id=${divisionId}`;
    }

    const r = await fetch(url);
    const d = await r.json().catch(() => ({}));
    setBills(d?.data || []);
    console.log("BOQ response:", d);
  } finally {
    setBillsLoading(false);
  }
};

useEffect(() => {
  fetchBills(form.division);
}, [form.division]);



  // useEffect(() => {
  //   fetch(`${API}/list-zone/`).then(r => r.json()).then(d => setZones(d.data || []));
  // }, []);
  useEffect(() => {
  if (!form.contract) return setZones([]);

  fetch(`${API}/list-zone/?contract_id=${form.contract}`)
    .then(r => r.json())
    .then(d => setZones(d.data || []));
}, [form.contract]);

useEffect(() => {
  if (!form.zone) return setDivisions([]);

  fetch(`${API}/list-division/?zone_id=${form.zone}`)
    .then(r => r.json())
    .then(d => setDivisions(d.data || []));
}, [form.zone]);

useEffect(() => {
  if (!form.division) return setDistricts([]);

  fetch(`${API}/list-district/?division_id=${form.division}`)
    .then(r => r.json())
    .then(d => setDistricts(d.data || []));
}, [form.division]);


useEffect(() => {
  if (!form.district) return setTehsils([]);

  fetch(`${API}/list-tehsil/?district_id=${form.district}`)
    .then(r => r.json())
    .then(d => setTehsils(d.data || []));
}, [form.district]);

useEffect(() => {
  if (!form.tehsil) {
    setSites([]);
    return;
  }

  const fetchSites = async () => {
    const params = new URLSearchParams();

    params.append("contract_id", form.contract);
    params.append("zone_id", form.zone);
    params.append("division_id", form.division);
    params.append("district_id", form.district);
    params.append("tehsil_id", form.tehsil);

    const res = await fetch(
      `${API}/list-inspection-site/?${params.toString()}`
    );

    const data = await res.json();
    setSites(data.data || []);
  };

  fetchSites();
}, [
  form.tehsil,
  form.contract,
  form.zone,
  form.division,
  form.district
]);
  // ── Field handler with cascade reset ──────────────────────────────
const handle = (k, v) => {
  setForm(prev => {
    const updated = { ...prev, [k]: v };

    if (k === "contract") {
      updated.zone = "";
      updated.division = "";
      updated.district = "";
      updated.tehsil = "";
      updated.inspection_site = "";
    }

    if (k === "zone") {
      updated.division = "";
      updated.district = "";
      updated.tehsil = "";
      updated.inspection_site = "";
    }

    if (k === "division") {
      updated.district = "";
      updated.tehsil = "";
      updated.inspection_site = "";
    }

    if (k === "district") {
      updated.tehsil = "";
      updated.inspection_site = "";
    }

    if (k === "tehsil") {
      updated.inspection_site = "";
    }

    return updated;
  });
};

// ── Submit ────────────────────────────────────────────────────────
const submit = async () => {
  console.log("SUBMIT CLICKED:", form);

  if (!form.contract || !form.bill_title || !form.bill_no || !form.qty ) {
    alert("Please fill all required fields");
    return;
  }

  setLoading(true);
  setSuccess(false);

  try {
    const res = await fetch(`${API}/create-boq-bill/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contract: form.contract,
        bill_title: form.bill_title,
        bill_no: Number(form.bill_no),
        qty: Number(form.qty),
        unit_rate_rs: Number(form.unit_rate_rs),
      }),
    });

    const data = await res.json().catch(() => null);

    console.log("CREATE RESPONSE:", res.status, data);

    if (!res.ok) {
      alert(data?.detail || "Bill creation failed");
      return;
    }

    setSuccess(true);

    setForm((p) => ({
      ...p,
      bill_title: "",
      bill_no: "",
      qty: "",
      unit_rate_rs: "",
    }));

    await fetchBills(form.division);

    setTimeout(() => setSuccess(false), 3000);
  } catch (err) {
    console.error(err);
    alert("Network error while creating bill");
  } finally {
    setLoading(false);
  }
};
  // ── Theme tokens ──────────────────────────────────────────────────
  const pageClasses = isLight
    ? "min-h-screen bg-[#f5f5f5] text-gray-950"
    : "min-h-screen bg-black text-gray-100";

  const inputClasses = isLight
    ? "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13px] text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
    : "w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-[13px] text-white outline-none transition placeholder:text-gray-600 focus:border-white/50 focus:ring-4 focus:ring-white/5 disabled:cursor-not-allowed disabled:bg-[#151515] disabled:text-gray-600";

  const tableHead = isLight
    ? "bg-gray-50 text-gray-500 border-b border-gray-200"
    : "bg-[#0b0b0b] text-gray-500 border-b border-white/10";

  const tableRow = isLight
    ? "border-b border-gray-100 hover:bg-gray-50 transition"
    : "border-b border-white/5 hover:bg-white/5 transition";

  const tableCell = isLight ? "text-gray-900" : "text-gray-200";
  const tableCellMuted = isLight ? "text-gray-500" : "text-gray-500";

  const totalPages = Math.ceil(sites.length / pageSize);

  const paginatedSites = sites.slice(
    (sitePage - 1) * pageSize,
    sitePage * pageSize
  );

  return (
    <div className={pageClasses}>
      <main className="mx-auto max-w-5xl space-y-5 px-5 py-6 md:px-8">

        {/* ── Single form card ──────────────────────────────────────── */}
        <SectionCard
          isLight={isLight}
          number="01"
          title="BOQ bill details"
          description="Select the site location and enter the bill information."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel required>Contract</FieldLabel>

              <select
                className={inputClasses}
                value={form.contract}
                onChange={e => handle("contract", e.target.value)}
              >
                <option value="">Select Contract</option>
                {contracts.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.contract_no}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel required>Zone</FieldLabel>
                <select className={inputClasses} value={form.zone} onChange={e => handle("zone", e.target.value)} disabled={!form.contract}>
                  <option value="">Select Zone</option>
                  {zones.map(z => (
                    <option key={z.id} value={z.id}>{z.zone_name}</option>
                  ))}
                </select>
            </div>

            <div>
              <FieldLabel required>Division</FieldLabel>
              <select className={inputClasses} value={form.division} onChange={e => handle("division", e.target.value)} disabled={!form.zone}>
                <option value="">Select Division</option>
                {divisions.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.division_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <FieldLabel required>District</FieldLabel>
              <select className={inputClasses} value={form.district} onChange={e => handle("district", e.target.value)} disabled={!form.division}>
                <option value="">Select District</option>
                {districts.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.district_name}
                  </option>
                ))}
              </select>
            </div> 

            <div>
              <FieldLabel required>Tehsil</FieldLabel>
              <select className={inputClasses} value={form.tehsil} onChange={e => handle("tehsil", e.target.value)} disabled={!form.district}>
                <option value="">Select Tehsil</option>
                {tehsils.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.tehsil_name}
                  </option>
                ))}
              </select>
            </div>


            {/* <div>
              <FieldLabel required>Inspection Site</FieldLabel>
              <select className={inputClasses} value={form.inspection_site} onChange={e => handle("inspection_site", e.target.value)} disabled={!form.division}>
                <option value="">Select Site</option>
                {sites.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.site_name}
                  </option>
                ))}
              </select>
            </div>
             */}
             {sites.length > 0 && (
                <div className="sm:col-span-2 mt-2">
                  <FieldLabel>Inspection Sites in this Division</FieldLabel>

                  <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10">
                    <table className="w-full text-[13px]">
                      <thead className={tableHead}>
                        <tr>
                          <th className="px-4 py-2 text-left">#</th>
                          <th className="px-4 py-2 text-left">Site Name</th>
                          <th className="px-4 py-2 text-left">Zone</th>
                          <th className="px-4 py-2 text-left">Division</th>
                          <th className="px-4 py-2 text-left">District</th>
                          <th className="px-4 py-2 text-left">Tehsil</th>
                          
                        </tr>
                      </thead>

                      <tbody>
                        {paginatedSites.map((s, idx) => (
                          <tr key={s.id} className={tableRow}>
                            <td className="px-4 py-2">
                              {(sitePage - 1) * pageSize + idx + 1}
                            </td>
                            <td className="px-4 py-2 font-medium">{s.site_name}</td>
                            <td className="px-4 py-2">{s.zone_name || "—"}</td>
                            <td className="px-4 py-2">{s.division_name || "—"}</td>
                            <td className="px-4 py-2">{s.district_name || "—"}</td>
                            <td className="px-4 py-2">{s.tehsil_name || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t">
                      
                      <button
                        className="px-3 py-1 text-sm rounded border disabled:opacity-50"
                        disabled={sitePage === 1}
                        onClick={() => setSitePage(p => p - 1)}
                      >
                        Prev
                      </button>

                      <div className="text-sm">
                        Page {sitePage} of {totalPages}
                      </div>

                      <button
                        className="px-3 py-1 text-sm rounded border disabled:opacity-50"
                        disabled={sitePage === totalPages}
                        onClick={() => setSitePage(p => p + 1)}
                      >
                        Next
                      </button>

                    </div>
                  )}
                      </div>
                    </div>
                  )}

            
            {/* Bill Title — full width */}
            <div className="sm:col-span-2">
              <FieldLabel required>Bill Title</FieldLabel>
              <input
                className={inputClasses}
                placeholder="e.g. Civil Works Bill"
                value={form.bill_title}
                onChange={e => handle("bill_title", e.target.value)}
              />
            </div>

            {/* Bill No */}
            <div>
              <FieldLabel required>Bill No</FieldLabel>
              <input
                type="number"
                className={inputClasses}
                placeholder="e.g. 1"
                value={form.bill_no}
                onChange={e => handle("bill_no", e.target.value)}
              />
            </div>

            <div>
              <FieldLabel required>Quantity</FieldLabel>
              <input
                type="number"
                className={inputClasses}
                value={form.qty}
                onChange={(e) => handle("qty", e.target.value)}
              />
            </div>

            <div>
              <FieldLabel required>Unit Rate (Rs)</FieldLabel>
              <input
                type="number"
                className={inputClasses}
                value={form.unit_rate_rs}
                onChange={(e) => handle("unit_rate_rs", e.target.value)}
              />
            </div>

          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={submit}
              disabled={loading || !form.bill_title || !form.bill_no}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-[12px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
                isLight ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-emerald-500 text-white hover:bg-emerald-600",
              )}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Create Bill
            </button>

            {success && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-[12px] font-medium text-emerald-500">
                <Check className="h-3.5 w-3.5" />
                Bill created successfully
              </span>
            )}
          </div>
        </SectionCard>

        {/* ── Section 03: Bills table ──────────────────────────────── */}
        <section
          className={cn(
            "rounded-2xl border shadow-sm",
            isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#111111]",
          )}
        >
          {/* Table header */}
          <div className={cn(
            "flex items-center justify-between border-b px-5 py-4",
            isLight ? "border-gray-200" : "border-white/10",
          )}>
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                isLight ? "bg-blue-50 text-blue-600" : "bg-blue-500/10 text-blue-400",
              )}>
                <ClipboardList className="h-4 w-4" />
              </div>
              <div>
                <div className={cn("text-[14px] font-semibold", isLight ? "text-gray-950" : "text-white")}>
                  BOQ Bills
                </div>
                <div className={cn("text-[11px]", isLight ? "text-gray-500" : "text-gray-500")}>
                  {bills.length} record{bills.length !== 1 ? "s" : ""} total
                </div>
              </div>
            </div>

            {billsLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {bills.length === 0 && !billsLoading ? (
              <div className={cn("px-5 py-12 text-center text-[13px]", isLight ? "text-gray-400" : "text-gray-600")}>
                No bills yet. Create one above.
              </div>
            ) : (
              <table className="w-full min-w-[700px] border-collapse text-[13px]">
                <thead>
                  <tr className={tableHead}>
                    {COLUMNS.map(col => (
                      <th
                        key={col.key}
                        className={cn(
                          "px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]",
                          col.width,
                        )}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bills.map((bill, idx) => (
                    <tr key={bill.id} className={tableRow}>
                      <td className={cn("px-4 py-3 font-mono text-[11px]", tableCellMuted)}>{idx + 1}</td>
                      
                      <td className={cn("px-4 py-3 font-semibold", tableCell)}>{bill.bill_no}</td>
                      <td className={cn("px-4 py-3 font-medium", tableCell)}>{bill.bill_title}</td>  
                      <td className={cn("px-4 py-3", tableCellMuted)}>
                        {bill.qty}
                      </td>

                      <td className={cn("px-4 py-3", tableCellMuted)}>
                        {bill.unit_rate_rs}
                      </td>

                      <td className={cn("px-4 py-3 font-semibold", tableCell)}>
                        {bill.amount_rs}
                      </td>
                      {/* <td className={cn("px-4 py-3", tableCellMuted)}>{bill.zone_name || "—"}</td>
                      <td className={cn("px-4 py-3", tableCellMuted)}>{bill.division_name || "—"}</td> */}
                      
                      

                      
                      <td className={cn("px-4 py-3 text-[11px]", tableCellMuted)}>{formatDate(bill.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
