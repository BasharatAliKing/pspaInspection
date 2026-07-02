import React, { useState } from "react";
import { useTheme } from "../../components/Layout";
import { X, ClipboardCheck } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://127.0.0.1:8000";

const BOQInspectionModal = ({
  isOpen,
  onClose,
  boqData,
  onSuccess,
  siteid,
}) => {
  const { isLight } = useTheme();

  if (!isOpen || !boqData) return null;

  const inputClasses = isLight
    ? "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#111a3d] focus:bg-white"
    : "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition focus:border-slate-400";

  const cardClass = isLight
    ? "border-slate-200 bg-white shadow-sm"
    : "border-slate-800 bg-slate-900/80 shadow-sm";

  const [formData, setFormData] = useState({
    site_id: siteid,
    inspected_claimed_quantity: "",
    inspected_quantity: "",
    inspected_unit_rate: boqData.unit_rate || "",
    inspected_amount: "",
    status: "completed",
    submitted_by: "Bashatat Ali",
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateAmount = (qty, rate) => {
    return Number(qty || 0) * Number(rate || 0);
  };

  const handleQuantityChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      inspected_quantity: value,
      inspected_amount: calculateAmount(value, prev.inspected_unit_rate),
    }));
  };

  const handleRateChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      inspected_unit_rate: value,
      inspected_amount: calculateAmount(prev.inspected_quantity, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        boq: boqData.id,
        site_id: formData.site_id,
        inspected_claimed_quantity: Number(formData.inspected_claimed_quantity),
        inspected_quantity: Number(formData.inspected_quantity),
        inspected_unit_rate: Number(formData.inspected_unit_rate),
        inspected_amount: Number(formData.inspected_amount),
        status: formData.status,
        submitted_by: formData.submitted_by,
      };

      const res = await fetch(`${API_BASE_URL}/api/create-boq-inspection/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Inspection created successfully");

        if (onSuccess) {
          onSuccess(data);
        }

        onClose();
      } else {
        alert(data.message || "Failed to create inspection");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div
        className={`relative max-h-[90vh] w-full max-w-6xl overflow-auto rounded-[28px] border ${isLight ? "border-slate-200 bg-white" : "border-slate-800 bg-slate-950"}`}
      >
        <div className="flex items-center justify-between bg-linear-to-r from-[#111a3d] to-[#1f3a8a] px-6 py-5 text-white sm:px-8">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardCheck size={18} />
              <h2 className="text-xl font-semibold">BOQ Inspection</h2>
            </div>
            <p className="mt-1 text-sm text-slate-200">
              Capture inspection results for the selected BOQ item.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/20 p-2 transition hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-6">
          <div
            className={`overflow-hidden rounded-3xl border p-5 ${cardClass}`}
          >
            <h3
              className={`text-2xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}
            >
              BOQ Information
            </h3>
            <p
              className={`mt-1 text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}
            >
              Review BOQ details before recording inspection results.
            </p>

            <div className="mt-6 space-y-4">
              <div
                className={`rounded-2xl border p-5 ${isLight ? "border-slate-200 bg-slate-50" : "border-slate-800 bg-slate-900/70"}`}
              >
                <p
                  className={`text-xs uppercase tracking-wider ${isLight ? "text-slate-500" : "text-slate-400"}`}
                >
                  Bill No
                </p>
                <h4
                  className={`mt-2 text-xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}
                >
                  {boqData.bill_no}
                </h4>
              </div>

              <div
                className={`rounded-2xl border p-5 ${isLight ? "border-slate-200 bg-slate-50" : "border-slate-800 bg-slate-900/70"}`}
              >
                <p
                  className={`mb-3 text-xs uppercase tracking-wider ${isLight ? "text-slate-500" : "text-slate-400"}`}
                >
                  Description
                </p>
                <p
                  className={`text-sm leading-7 ${isLight ? "text-slate-700" : "text-slate-300"}`}
                >
                  {boqData.description}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div
                  className={`rounded-2xl border p-5 ${isLight ? "border-slate-200 bg-slate-50" : "border-slate-800 bg-slate-900/70"}`}
                >
                  <p
                    className={`text-xs uppercase tracking-wider ${isLight ? "text-slate-500" : "text-slate-400"}`}
                  >
                    Item No
                  </p>
                  <h4
                    className={`mt-2 text-xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}
                  >
                    {boqData.item_no}
                  </h4>
                </div>

                <div
                  className={`rounded-2xl border p-5 ${isLight ? "border-slate-200 bg-slate-50" : "border-slate-800 bg-slate-900/70"}`}
                >
                  <p
                    className={`text-xs uppercase tracking-wider ${isLight ? "text-slate-500" : "text-slate-400"}`}
                  >
                    MRS Ref No
                  </p>
                  <h4
                    className={`mt-2 text-xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}
                  >
                    {boqData.mrs_ref_no}
                  </h4>
                </div>

                <div
                  className={`rounded-2xl border p-5 ${isLight ? "border-slate-200 bg-slate-50" : "border-slate-800 bg-slate-900/70"}`}
                >
                  <p
                    className={`text-xs uppercase tracking-wider ${isLight ? "text-slate-500" : "text-slate-400"}`}
                  >
                    Unit
                  </p>
                  <h4
                    className={`mt-2 text-xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}
                  >
                    {boqData.unit}
                  </h4>
                </div>

                <div
                  className={`rounded-2xl border p-5 ${isLight ? "border-slate-200 bg-slate-50" : "border-slate-800 bg-slate-900/70"}`}
                >
                  <p
                    className={`text-xs uppercase tracking-wider ${isLight ? "text-slate-500" : "text-slate-400"}`}
                  >
                    Quantity
                  </p>
                  <h4
                    className={`mt-2 text-xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}
                  >
                    {boqData.quantity}
                  </h4>
                </div>

                <div
                  className={`rounded-2xl border p-5 ${isLight ? "border-slate-200 bg-slate-50" : "border-slate-800 bg-slate-900/70"}`}
                >
                  <p
                    className={`text-xs uppercase tracking-wider ${isLight ? "text-slate-500" : "text-slate-400"}`}
                  >
                    Unit Rate
                  </p>
                  <h4 className={`mt-2 text-xl font-bold text-emerald-600`}>
                    Rs {Number(boqData.unit_rate).toLocaleString()}
                  </h4>
                </div>

                <div
                  className={`rounded-2xl border border-blue-200 bg-blue-50 p-5 ${isLight ? "border-blue-200 bg-blue-50" : "border-blue-800 bg-blue-900/20"}`}
                >
                  <p className="text-xs uppercase tracking-wider text-blue-500">
                    Total Amount
                  </p>
                  <h4
                    className={`mt-2 text-xl font-bold ${isLight ? "text-blue-700" : "text-blue-400"}`}
                  >
                    Rs{" "}
                    {(
                      Number(boqData.quantity) * Number(boqData.unit_rate)
                    ).toLocaleString()}
                  </h4>
                </div>

                <div
                  className={`rounded-2xl border border-emerald-200 bg-emerald-50 p-5 ${isLight ? "border-emerald-200 bg-emerald-50" : "border-emerald-800 bg-emerald-900/20"}`}
                >
                  <p className="text-xs uppercase tracking-wider text-emerald-500">
                    Status
                  </p>
                  <h4
                    className={`mt-2 text-xl font-bold ${isLight ? "text-emerald-700" : "text-emerald-400"}`}
                  >
                    Ready For Inspection
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className={`rounded-3xl border p-6 ${cardClass}`}>
            <h3
              className={`mb-6 text-xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}
            >
              Inspection Details
            </h3>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}
                >
                  Claimed Quantity
                </label>
                <input
                  type="text"
                  value={formData.inspected_claimed_quantity}
                  onChange={(e) =>
                    updateField("inspected_claimed_quantity" , e.target.value)
                  }
                  className={inputClasses}
                />
              </div>

              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}
                >
                  Inspected Quantity
                </label>
                <input
                  type="number"
                  value={formData.inspected_quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className={inputClasses}
                />
              </div>

              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}
                >
                  Inspected Unit Rate
                </label>
                <input
                  type="number"
                  value={formData.inspected_unit_rate}
                  onChange={(e) => handleRateChange(e.target.value)}
                  className={inputClasses}
                />
              </div>

              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}
                >
                  Inspected Amount
                </label>
                <input
                  type="number"
                  value={formData.inspected_amount}
                  readOnly
                  className={inputClasses}
                />
              </div>

              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}
                >
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  className={inputClasses}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}
                >
                  Submitted By
                </label>
                <input
                  type="text"
                  value={formData.submitted_by}
                  onChange={(e) => updateField("submitted_by", e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className={`rounded-xl border px-6 py-3 text-sm font-medium transition ${isLight ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-100" : "border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800"}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#111a3d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0d1530]"
            >
              Submit Inspection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BOQInspectionModal;
