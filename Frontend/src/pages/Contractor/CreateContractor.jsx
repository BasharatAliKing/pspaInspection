import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Edit3,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  XCircle,
  Users,
} from "lucide-react";
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

const initialForm = {
  id: null,
  code: "",
  full_name: "",
  email: "",
  contact: "",
  password: "",
  confirm_password: "",
  is_active: true,
};

const dummyContractors = [
  {
    id: 1,
    code: "3001",
    full_name: "ABC Contractor",
    email: "contractor@example.com",
    contact: "0300-1234567",
    is_active: true,
    created_at: "2026-06-09T10:30:00",
  },
];

export default function CreateContractor() {
  const { isLight } = useTheme();
  const { setState } = useNavbar();

  const [form, setForm] = useState(initialForm);
  const [contractors, setContractors] = useState(dummyContractors);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [currentPage, setCurrentPage] = useState(1);

  const contractorsPerPage = 5;

  useEffect(() => {
    setState({
      title: "Create Contractor",
      subtitle: "Add and manage contractor accounts",
    });

    return () => setState({ title: "", subtitle: "", actions: null });
  }, [setState]);

  const pageClasses = isLight
    ? "min-h-screen bg-[#f5f5f5] text-gray-950"
    : "min-h-screen bg-black text-gray-100";

  const inputClasses = isLight
    ? "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13px] text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
    : "w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-[13px] text-white outline-none transition placeholder:text-gray-600 focus:border-white/50 focus:ring-4 focus:ring-white/5 disabled:cursor-not-allowed disabled:bg-[#151515] disabled:text-gray-600";

  const surface = isLight
    ? "border-gray-200 bg-white"
    : "border-white/10 bg-[#111111]";

  const subSurface = isLight
    ? "border-gray-200 bg-gray-50"
    : "border-white/10 bg-[#0b0b0b]";

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

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setForm((prev) => ({ ...prev, code: value }));
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  const clearForm = () => {
    setForm(initialForm);
    setMessage("");
    setMessageType("success");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.code.trim()) {
      showMessage("Contractor code is required.", "error");
      return;
    }

    if (!form.full_name.trim()) {
      showMessage("Contractor name is required.", "error");
      return;
    }

    if (!form.email.trim()) {
      showMessage("Email is required.", "error");
      return;
    }

    if (!form.id && !form.password.trim()) {
      showMessage("Password is required.", "error");
      return;
    }

    if (!form.id && form.password !== form.confirm_password) {
      showMessage("Password and confirm password must match.", "error");
      return;
    }

    if (form.id) {
      setContractors((prev) =>
        prev.map((item) =>
          item.id === form.id
            ? {
                ...item,
                code: form.code.trim(),
                full_name: form.full_name.trim(),
                email: form.email.trim(),
                contact: form.contact.trim(),
                is_active: form.is_active,
                updated_at: new Date().toISOString(),
              }
            : item,
        ),
      );

      showMessage("Contractor updated successfully.");
    } else {
      const newContractor = {
        id: Date.now(),
        code: form.code.trim(),
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        contact: form.contact.trim(),
        is_active: form.is_active,
        created_at: new Date().toISOString(),
      };

      setContractors((prev) => [newContractor, ...prev]);
      showMessage("Contractor created successfully.");
    }

    setForm(initialForm);
    setCurrentPage(1);
  };

  const handleEdit = (contractor) => {
    setForm({
      id: contractor.id,
      code: contractor.code || "",
      full_name: contractor.full_name || "",
      email: contractor.email || "",
      contact: contractor.contact || "",
      password: "",
      confirm_password: "",
      is_active: Boolean(contractor.is_active),
    });

    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this contractor?",
    );

    if (!confirmDelete) return;

    setContractors((prev) => prev.filter((item) => item.id !== id));
    showMessage("Contractor deleted successfully.");
  };

  const filteredContractors = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return contractors;

    return contractors.filter((item) =>
      [
        item.code,
        item.full_name,
        item.email,
        item.contact,
        item.is_active ? "active" : "inactive",
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query),
      ),
    );
  }, [search, contractors]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredContractors.length / contractorsPerPage),
  );

  const startIndex = (currentPage - 1) * contractorsPerPage;

  const currentContractors = filteredContractors.slice(
    startIndex,
    startIndex + contractorsPerPage,
  );

  return (
    <div className={pageClasses}>
      <main className="w-full max-w-none space-y-5 px-4 py-4">
        <SectionCard
          isLight={isLight}
          number="01"
          title="Contractor details"
          description="Provide contractor account information."
        >
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <FieldLabel required>Contractor Code</FieldLabel>
                <input
                  value={form.code}
                  onChange={handleCodeChange}
                  placeholder="e.g. 3001"
                  inputMode="numeric"
                  className={inputClasses}
                />
              </div>

              <div>
                <FieldLabel required>Contractor Name</FieldLabel>
                <input
                  value={form.full_name}
                  onChange={(e) => handleChange("full_name", e.target.value)}
                  placeholder="e.g. ABC Contractor"
                  className={inputClasses}
                />
              </div>

              <div>
                <FieldLabel required>Email</FieldLabel>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="e.g. contractor@example.com"
                  className={inputClasses}
                />
              </div>

              <div>
                <FieldLabel>Contact</FieldLabel>
                <input
                  value={form.contact}
                  onChange={(e) => handleChange("contact", e.target.value)}
                  placeholder="e.g. 0300-1234567"
                  className={inputClasses}
                />
              </div>

              {!form.id && (
                <>
                  <div>
                    <FieldLabel required>Password</FieldLabel>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      placeholder="Enter password"
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <FieldLabel required>Confirm Password</FieldLabel>
                    <input
                      type="password"
                      value={form.confirm_password}
                      onChange={(e) =>
                        handleChange("confirm_password", e.target.value)
                      }
                      placeholder="Re-enter password"
                      className={inputClasses}
                    />
                  </div>
                </>
              )}

              <div>
                <FieldLabel>Account Status</FieldLabel>
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      is_active: !prev.is_active,
                    }))
                  }
                  className={cn(
                    "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-[12px] font-semibold transition",
                    form.is_active
                      ? "bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20"
                      : "bg-rose-500/10 text-rose-500 ring-1 ring-rose-500/20",
                  )}
                >
                  <ShieldCheck className="h-4 w-4" />
                  {form.is_active ? "Active" : "Inactive"}
                </button>
              </div>
            </div>

            {message && (
              <div
                className={cn(
                  "mt-5 rounded-xl border px-4 py-3 text-[12px] font-medium",
                  messageType === "error"
                    ? "border-rose-500/20 bg-rose-500/10 text-rose-500"
                    : "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
                )}
              >
                {message}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-[12px] font-semibold transition",
                  isLight
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-emerald-500 text-white hover:bg-emerald-600",
                )}
              >
                {form.id ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                {form.id ? "Update Contractor" : "Save Contractor"}
              </button>

              <button
                type="button"
                onClick={clearForm}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-[12px] font-semibold transition",
                  isLight
                    ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    : "border-white/10 bg-[#0b0b0b] text-gray-300 hover:bg-white/5",
                )}
              >
                <XCircle className="h-4 w-4" />
                Clear
              </button>
            </div>
          </form>
        </SectionCard>

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
                <Users className="h-4 w-4" />
              </div>

              <div>
                <div
                  className={cn(
                    "text-[14px] font-semibold",
                    isLight ? "text-gray-950" : "text-white",
                  )}
                >
                  Contractors
                </div>
                <div className={cn("text-[11px]", tableMuted)}>
                  {filteredContractors.length} contractor
                  {filteredContractors.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search contractors…"
                className={cn(searchInput, "w-56")}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-[13px]">
              <thead>
                <tr className={tableHead}>
                  <th className="w-16 px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
                    Sr.
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
                    Contractor
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.08em]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentContractors.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className={cn(
                        "px-5 py-12 text-center text-[13px]",
                        tableMuted,
                      )}
                    >
                      No contractors found.
                    </td>
                  </tr>
                ) : (
                  currentContractors.map((item, index) => (
                    <tr key={item.id} className={tableRow}>
                      <td
                        className={cn(
                          "px-4 py-3 font-mono text-[11px]",
                          tableMuted,
                        )}
                      >
                        {startIndex + index + 1}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-[12px] font-bold text-emerald-500">
                            {(item.full_name || "C")
                              .split(" ")
                              .map((word) => word[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </div>

                          <div>
                            <div className={cn("font-semibold", tableCell)}>
                              {item.full_name || "—"}
                            </div>
                            <div className={cn("text-[11px]", tableMuted)}>
                              Code: {item.code || "—"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className={cn("px-4 py-3", tableCell)}>
                        {item.email || "—"}
                      </td>

                      <td className={cn("px-4 py-3", tableCell)}>
                        {item.contact || "—"}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold",
                            item.is_active
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-rose-500/10 text-rose-500",
                          )}
                        >
                          {item.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition",
                              isLight
                                ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                : "border-white/10 bg-[#0b0b0b] text-gray-300 hover:bg-white/5",
                            )}
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
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
              Showing {currentContractors.length} of{" "}
              {filteredContractors.length} contractors
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  currentPage > 1 && setCurrentPage((prev) => prev - 1)
                }
                disabled={currentPage === 1}
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
                  subSurface,
                )}
              >
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() =>
                  currentPage < totalPages && setCurrentPage((prev) => prev + 1)
                }
                disabled={currentPage === totalPages}
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
      </main>
    </div>
  );
}
