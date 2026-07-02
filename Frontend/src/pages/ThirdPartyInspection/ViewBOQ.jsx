import React from "react";
import { useTheme } from "../../components/Layout";
import { X, AlertCircle } from "lucide-react";

const InfoCard = ({ label, value, isLight }) => (
  <div
    className={`group rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isLight ? "border-slate-200 bg-white" : "border-slate-800 bg-slate-900/80"}`}
  >
    <p
      className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-slate-400"}`}
    >
      {label}
    </p>
    <p
      className={`mt-3 break-words text-lg font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}
    >
      {value || "-"}
    </p>
  </div>
);

const ViewBOQ = ({ isOpen, onClose, boqData }) => {
  const { isLight } = useTheme();

  if (!isOpen || !boqData) return null;

  const inspection = boqData?.forInspection;
  const hasInspection = inspection && Object.keys(inspection).length > 0;

  const statusColors = {
    completed: "bg-emerald-100 text-emerald-700",
    failed: "bg-rose-100 text-rose-700",
    pending: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div
        className={`relative max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-[28px] border ${isLight ? "border-slate-200 bg-white" : "border-slate-800 bg-slate-950"}`}
      >
        <div className="bg-gradient-to-r from-[#111a3d] to-[#1f3a8a] px-6 py-5 text-white sm:px-8">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full border border-white/20 p-2 transition hover:bg-white/10"
          >
            <X size={18} />
          </button>

          <h2 className="text-2xl font-semibold sm:text-3xl">
            BOQ Inspection Details
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-200">
            <span>Contract #{boqData.contract_no}</span>
            <span>Bill #{boqData.bill_no}</span>
            <span>BOQ ID #{boqData.id}</span>
          </div>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-6 sm:p-8">
          <div className="mb-8">
            <h3
              className={`mb-5 border-b pb-3 text-xl font-bold ${isLight ? "border-slate-200 text-slate-800" : "border-slate-800 text-slate-100"}`}
            >
              BOQ Information
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <InfoCard
                label="Contract Number"
                value={boqData.contract_no}
                isLight={isLight}
              />
              <InfoCard
                label="Item Number"
                value={boqData.item_no}
                isLight={isLight}
              />
              <InfoCard
                label="Bill Number"
                value={boqData.bill_no}
                isLight={isLight}
              />
              <InfoCard
                label="MRS Reference"
                value={boqData.mrs_ref_no}
                isLight={isLight}
              />
              <InfoCard label="Unit" value={boqData.unit} isLight={isLight} />
              <InfoCard
                label="Quantity"
                value={boqData.quantity}
                isLight={isLight}
              />
              <InfoCard
                label="Unit Rate"
                value={`Rs. ${boqData.unit_rate}`}
                isLight={isLight}
              />
              <InfoCard
                label="Amount"
                value={`Rs. ${boqData.amount}`}
                isLight={isLight}
              />
            </div>

            <div
              className={`mt-5 rounded-2xl border p-6 ${isLight ? "border-slate-200 bg-slate-50" : "border-slate-800 bg-slate-900/70"}`}
            >
              <p
                className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-slate-400"}`}
              >
                Description
              </p>
              <p
                className={`mt-3 leading-relaxed ${isLight ? "text-slate-700" : "text-slate-300"}`}
              >
                {boqData.description}
              </p>
            </div>
          </div>

          <div>
            <h3
              className={`mb-5 border-b pb-3 text-xl font-bold ${isLight ? "border-slate-200 text-slate-800" : "border-slate-800 text-slate-100"}`}
            >
              Inspection Information
            </h3>

            {hasInspection ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <InfoCard
                  label="Inspected Unit"
                  value={inspection.inspected_claimed_quantity}
                  isLight={isLight}
                />
                <InfoCard
                  label="Inspected Quantity"
                  value={inspection.inspected_quantity}
                  isLight={isLight}
                />
                <InfoCard
                  label="Inspected Unit Rate"
                  value={`Rs. ${inspection.inspected_unit_rate}`}
                  isLight={isLight}
                />
                <InfoCard
                  label="Inspected Amount"
                  value={`Rs. ${inspection.inspected_amount}`}
                  isLight={isLight}
                />
                <InfoCard
                  label="Submitted By"
                  value={inspection.submitted_by}
                  isLight={isLight}
                />
                <div
                  className={`rounded-2xl border p-5 shadow-sm ${isLight ? "border-slate-200 bg-white" : "border-slate-800 bg-slate-900/80"}`}
                >
                  <p
                    className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-slate-400"}`}
                  >
                    Status
                  </p>
                  <div className="mt-3">
                    <span
                      className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold capitalize ${statusColors[inspection.status] || "bg-slate-100 text-slate-700"}`}
                    >
                      {inspection.status}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`rounded-3xl border p-10 text-center shadow-sm ${isLight ? "border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50" : "border-slate-800 bg-slate-900/70"}`}
              >
                <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-amber-100">
                  <AlertCircle size={32} className="text-amber-600" />
                </div>
                <h4
                  className={`text-2xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}
                >
                  Inspection Not Performed Yet
                </h4>
                <p
                  className={`mx-auto mt-3 max-w-2xl ${isLight ? "text-slate-600" : "text-slate-400"}`}
                >
                  This BOQ has not yet been submitted for third-party
                  inspection. No inspection records are available at the moment.
                </p>
                <div className="mt-5 inline-flex rounded-full bg-amber-100 px-5 py-2 text-sm font-semibold text-amber-700">
                  Waiting for Inspection
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBOQ;
