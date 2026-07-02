import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNavbar } from "../../components/Navbar";
import { useTheme } from "../../components/Layout";

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

const STORAGE_KEY = "tpv_02a_form_data";

const emptyMeasurementRow = {
  itemNo: "",
  description: "",
  location: "",
  nos: "",
  length: "",
  widthBreadth: "",
  heightDepth: "",
  calculatedQty: "",
  unit: "",
  qtyInBoq: "",
  variance: "",
  qualityCheck: "",
  remarks: "",
};

const qualityParameters = [
  "Excavation / foundation dimensions match",
  "PCC / RCC dimensions acceptable",
  "Brickwork / blockwork line, level, plumb acceptable",
  "Plaster / paint finish acceptable",
  "Floor / tiles laid properly",
  "Doors / windows / ventilators / locks installed",
  "Roof / sandwich panels / sheets properly fixed",
  "Electrical fixtures / wiring / DB / lights installed",
  "Pipe works / trench / drains completed properly",
  "No visible cracks / seepage / unsafe defects",
];

const initialFormData = {
  plantId: "",
  districtPhase: "",
  billHeadSubhead: "",
  runningBillIpcRef: "",
  workCategory: "",
  workCategoryOther: "",
  measuredBy: "",
  crossCheckedBy: "",
  measurements: Array.from({ length: 9 }, () => ({ ...emptyMeasurementRow })),
  qualityChecks: qualityParameters.map((parameter) => ({
    parameter,
    status: "",
    remarks: "",
  })),
  finalMeasuredBy: "",
  finalCheckedBy: "",
  date: "",
};

export default function TPV_02A({ plantId = "", onSubmit }) {
  const { isLight } = useTheme();
  const { setState } = useNavbar();
  const navigate = useNavigate();

  useEffect(() => {
    setState({
      title:
        "TPV-02A: Measurement Sheet for Civil / Pre-Fab / Plant Room Works",
      subtitle:
        "To be used only where physical measurement is required for quantity verification.",
    });

    return () => setState({ title: "", subtitle: "", actions: null });
  }, [setState]);

  const pageClasses = isLight
    ? "min-h-screen bg-[#f5f5f5] text-gray-950"
    : "min-h-screen bg-black text-gray-100";

  const inputClasses = isLight
    ? "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13px] text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
    : "w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-[13px] text-white outline-none transition placeholder:text-gray-600 focus:border-white/50 focus:ring-4 focus:ring-white/5 disabled:cursor-not-allowed disabled:bg-[#151515] disabled:text-gray-600";

  const [formData, setFormData] = useState({
    ...initialFormData,
    plantId: plantId || initialFormData.plantId,
  });

  const updateField = (name, value) => {
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const updateMeasurement = (index, field, value) => {
    setFormData((previous) => ({
      ...previous,
      measurements: previous.measurements.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    }));
  };

  const updateQualityCheck = (index, field, value) => {
    setFormData((previous) => ({
      ...previous,
      qualityChecks: previous.qualityChecks.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    }));
  };

  const addMeasurementRow = () => {
    setFormData((previous) => ({
      ...previous,
      measurements: [...previous.measurements, { ...emptyMeasurementRow }],
    }));
  };

  const removeMeasurementRow = (index) => {
    setFormData((previous) => ({
      ...previous,
      measurements: previous.measurements.filter(
        (_, rowIndex) => rowIndex !== index,
      ),
    }));
  };

  const handleSaveDraft = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    alert(
      "TPV-02A draft saved locally. Open TPV_02A_Report.jsx route/page to print the filled report.",
    );
  };

  const handleReset = () => {
    setFormData({
      ...initialFormData,
      plantId: plantId || "",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));

    if (typeof onSubmit === "function") {
      onSubmit(formData);
      return;
    }

    console.log("TPV-02A payload:", formData);
    alert(
      "TPV-02A data captured successfully. Backend integration can be connected later.",
    );
  };

  const handleSubmitAll = (event) => {
    event.preventDefault();
    // save current form
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));

    const tpv01 = (() => {
      try {
        return JSON.parse(localStorage.getItem("tpv_01_form_data") || "null");
      } catch (e) {
        return null;
      }
    })();

    const tpv02 = (() => {
      try {
        return JSON.parse(localStorage.getItem("tpv_02_form_data") || "null");
      } catch (e) {
        return null;
      }
    })();

    const combined = { tpv01, tpv02, tpv02a: formData };

    if (typeof onSubmit === "function") {
      onSubmit(combined);
    } else {
      console.log("Submitting all TPV forms:", combined);
      alert("All TPV forms saved locally (TPV-01, TPV-02, TPV-02A).");
    }

    // optionally navigate to a report or list page
    // navigate('/tpv-01-report');
  };

  return (
    <div className={pageClasses}>
      <main className="w-full max-w-none space-y-5 px-4 py-4">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-5">
            <Section title="A. Header Information">
              <div className="grid gap-4 md:grid-cols-3">
                <TextInput
                  label="Plant ID / Code"
                  value={formData.plantId}
                  onChange={(value) => updateField("plantId", value)}
                  inputClasses={inputClasses}
                />
                <TextInput
                  label="District / Phase"
                  value={formData.districtPhase}
                  onChange={(value) => updateField("districtPhase", value)}
                  inputClasses={inputClasses}
                />
                <TextInput
                  label="Bill Head / Subhead"
                  value={formData.billHeadSubhead}
                  onChange={(value) => updateField("billHeadSubhead", value)}
                  inputClasses={inputClasses}
                />
                <TextInput
                  label="Running Bill / IPC Ref."
                  value={formData.runningBillIpcRef}
                  onChange={(value) => updateField("runningBillIpcRef", value)}
                  inputClasses={inputClasses}
                />
                <div className="md:col-span-3">
                  <RadioGroup
                    label="Work Category"
                    value={formData.workCategory}
                    options={[
                      "Civil Work",
                      "Plant Room",
                      "Pre-Fab Room",
                      "Foundation",
                      "Electrification",
                      "Other",
                    ]}
                    onChange={(value) => updateField("workCategory", value)}
                    inputClasses={inputClasses}
                  />
                </div>
                {formData.workCategory === "Other" && (
                  <div className="md:col-span-3">
                    <TextInput
                      label="Other Work Category"
                      value={formData.workCategoryOther}
                      onChange={(value) =>
                        updateField("workCategoryOther", value)
                      }
                      inputClasses={inputClasses}
                    />
                  </div>
                )}
                <TextInput
                  label="Measured By"
                  value={formData.measuredBy}
                  onChange={(value) => updateField("measuredBy", value)}
                  inputClasses={inputClasses}
                />
                <TextInput
                  label="Cross-checked By"
                  value={formData.crossCheckedBy}
                  onChange={(value) => updateField("crossCheckedBy", value)}
                  inputClasses={inputClasses}
                />
              </div>
            </Section>

            <Section title="B. Measurement Table">
              <div className="mb-3 flex justify-end">
                <button
                  type="button"
                  onClick={addMeasurementRow}
                  className={cn(
                    "inline-flex items-center justify-center rounded-xl border px-4 py-2 text-[12px] font-semibold transition",
                    isLight
                      ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      : "border-white/10 bg-[#0b0b0b] text-gray-300 hover:bg-white/5",
                  )}
                >
                  Add Measurement Row
                </button>
              </div>

              <div
                className={cn(
                  "overflow-x-auto rounded-xl border",
                  isLight ? "border-gray-200" : "border-white/10",
                )}
              >
                <table className="min-w-[1800px] border-collapse text-[13px]">
                  <thead>
                    <tr
                      className={cn(
                        isLight
                          ? "border-b border-gray-200 bg-gray-50 text-gray-500"
                          : "border-b border-white/10 bg-[#0b0b0b] text-gray-500",
                      )}
                    >
                      {[
                        "Item No.",
                        "Description",
                        "Location",
                        "Nos.",
                        "Length",
                        "Width / Breadth",
                        "Height / Depth",
                        "Calculated Qty",
                        "Unit",
                        "Qty in BOQ",
                        "Variance",
                        "Quality Check",
                        "Remarks",
                        "Action",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {formData.measurements.map((row, index) => (
                      <tr
                        key={index}
                        className={cn(
                          isLight
                            ? "border-b border-gray-100 hover:bg-gray-50"
                            : "border-b border-white/5 hover:bg-white/5",
                          "transition",
                        )}
                      >
                        <TableInput
                          value={row.itemNo}
                          onChange={(value) =>
                            updateMeasurement(index, "itemNo", value)
                          }
                          inputClasses={inputClasses}
                        />
                        <TableInput
                          value={row.description}
                          onChange={(value) =>
                            updateMeasurement(index, "description", value)
                          }
                          wide
                          inputClasses={inputClasses}
                        />
                        <TableInput
                          value={row.location}
                          onChange={(value) =>
                            updateMeasurement(index, "location", value)
                          }
                          inputClasses={inputClasses}
                        />
                        <TableInput
                          value={row.nos}
                          onChange={(value) =>
                            updateMeasurement(index, "nos", value)
                          }
                          inputClasses={inputClasses}
                        />
                        <TableInput
                          value={row.length}
                          onChange={(value) =>
                            updateMeasurement(index, "length", value)
                          }
                          inputClasses={inputClasses}
                        />
                        <TableInput
                          value={row.widthBreadth}
                          onChange={(value) =>
                            updateMeasurement(index, "widthBreadth", value)
                          }
                          inputClasses={inputClasses}
                        />
                        <TableInput
                          value={row.heightDepth}
                          onChange={(value) =>
                            updateMeasurement(index, "heightDepth", value)
                          }
                          inputClasses={inputClasses}
                        />
                        <TableInput
                          value={row.calculatedQty}
                          onChange={(value) =>
                            updateMeasurement(index, "calculatedQty", value)
                          }
                          inputClasses={inputClasses}
                        />
                        <TableInput
                          value={row.unit}
                          onChange={(value) =>
                            updateMeasurement(index, "unit", value)
                          }
                          inputClasses={inputClasses}
                        />
                        <TableInput
                          value={row.qtyInBoq}
                          onChange={(value) =>
                            updateMeasurement(index, "qtyInBoq", value)
                          }
                          inputClasses={inputClasses}
                        />
                        <TableInput
                          value={row.variance}
                          onChange={(value) =>
                            updateMeasurement(index, "variance", value)
                          }
                          inputClasses={inputClasses}
                        />
                        <TableInput
                          value={row.qualityCheck}
                          onChange={(value) =>
                            updateMeasurement(index, "qualityCheck", value)
                          }
                          inputClasses={inputClasses}
                        />
                        <TableInput
                          value={row.remarks}
                          onChange={(value) =>
                            updateMeasurement(index, "remarks", value)
                          }
                          wide
                          inputClasses={inputClasses}
                        />
                        <td className="px-2 py-2">
                          <button
                            type="button"
                            onClick={() => removeMeasurementRow(index)}
                            disabled={formData.measurements.length === 1}
                            className={
                              isLight
                                ? "rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                                : "rounded-md border border-red-700/30 px-3 py-1.5 text-xs font-semibold text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                            }
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="C. Civil / Room / Pre-Fab Quality Check">
              <StatusTable
                rows={formData.qualityChecks}
                onChange={(index, field, value) =>
                  updateQualityCheck(index, field, value)
                }
                inputClasses={inputClasses}
              />
            </Section>

            <Section title="Measured / Checked Details">
              <div className="grid gap-4 md:grid-cols-3">
                <TextInput
                  label="Measured By"
                  value={formData.finalMeasuredBy}
                  onChange={(value) => updateField("finalMeasuredBy", value)}
                  inputClasses={inputClasses}
                />
                <TextInput
                  label="Checked By"
                  value={formData.finalCheckedBy}
                  onChange={(value) => updateField("finalCheckedBy", value)}
                  inputClasses={inputClasses}
                />
                <TextInput
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(value) => updateField("date", value)}
                  inputClasses={inputClasses}
                />
              </div>
            </Section>
          </div>

          <div
            className={cn(
              "flex flex-col gap-3 rounded-2xl border p-5 shadow-sm sm:flex-row sm:justify-end md:p-6",
              isLight
                ? "border-gray-200 bg-white"
                : "border-white/10 bg-[#111111]",
            )}
          >
            <button
              type="button"
              onClick={handleReset}
              className={cn(
                "inline-flex items-center justify-center rounded-xl border px-5 py-2.5 text-[12px] font-semibold transition",
                isLight
                  ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  : "border-white/10 bg-[#0b0b0b] text-gray-300 hover:bg-white/5",
              )}
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className={cn(
                "inline-flex items-center justify-center rounded-xl border px-5 py-2.5 text-[12px] font-semibold transition",
                isLight
                  ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  : "border-white/10 bg-[#0b0b0b] text-gray-300 hover:bg-white/5",
              )}
            >
              Save Draft Locally
            </button>
            <button
              type="button"
              onClick={handleSubmitAll}
              className={cn(
                "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-[12px] font-semibold text-white transition",
                isLight
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-emerald-500 hover:bg-emerald-600",
              )}
            >
              Submit All
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

function Section({ title, description, children }) {
  const { isLight } = useTheme();
  const match = String(title).match(/^([A-Z])\.\s*(.*)$/);
  const number = match ? match[1] : "•";
  const cleanTitle = match ? match[2] : title;

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
            {cleanTitle}
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

function TextInput({ label, value, onChange, type = "text", inputClasses }) {
  const cls =
    inputClasses ||
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13px] text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5";

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cls}
      />
    </div>
  );
}

function RadioGroup({ label, value, options, onChange }) {
  const { isLight } = useTheme();

  return (
    <fieldset
      className={cn(
        "rounded-xl border p-3",
        isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0b0b0b]",
      )}
    >
      <FieldLabel>{label}</FieldLabel>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <label
            key={option}
            className={cn(
              "flex cursor-pointer items-center gap-2 text-[13px]",
              isLight ? "text-gray-700" : "text-gray-300",
            )}
          >
            <input
              type="radio"
              checked={value === option}
              onChange={() => onChange(option)}
              className="h-4 w-4 border-gray-300 text-gray-950 focus:ring-gray-950"
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function TableInput({
  value,
  onChange,
  wide = false,
  inputClasses,
  type = "text",
}) {
  const cls = cn(inputClasses, wide ? "min-w-60" : "min-w-28");

  return (
    <td className="px-2 py-2">
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cls}
      />
    </td>
  );
}

function InfoBox({ label, value }) {
  const { isLight } = useTheme();

  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-[#0b0b0b]",
      )}
    >
      <FieldLabel>{label}</FieldLabel>
      <p
        className={cn(
          "text-[13px] leading-5",
          isLight ? "text-gray-700" : "text-gray-300",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function StatusTable({ rows, onChange, inputClasses }) {
  const { isLight } = useTheme();

  return (
    <div
      className={cn(
        "overflow-x-auto rounded-xl border",
        isLight ? "border-gray-200" : "border-white/10",
      )}
    >
      <table className="w-full min-w-[760px] border-collapse text-[13px]">
        <thead>
          <tr
            className={cn(
              isLight
                ? "border-b border-gray-200 bg-gray-50 text-gray-500"
                : "border-b border-white/10 bg-[#0b0b0b] text-gray-500",
            )}
          >
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
              Quality Parameter
            </th>
            <th className="w-28 px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.08em]">
              OK
            </th>
            <th className="w-28 px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.08em]">
              Not OK
            </th>
            <th className="min-w-64 px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
              Remarks
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.parameter}
              className={cn(
                isLight
                  ? "border-b border-gray-100 hover:bg-gray-50"
                  : "border-b border-white/5 hover:bg-white/5",
                "transition",
              )}
            >
              <td
                className={cn(
                  "px-4 py-3 font-medium",
                  isLight ? "text-gray-900" : "text-gray-200",
                )}
              >
                {row.parameter}
              </td>
              {["OK", "Not OK"].map((option) => (
                <td key={option} className="px-4 py-3 text-center">
                  <input
                    type="radio"
                    checked={row.status === option}
                    onChange={() => onChange(index, "status", option)}
                    className="h-4 w-4 border-gray-300 text-gray-950 focus:ring-gray-950"
                  />
                </td>
              ))}
              <td className="px-4 py-3">
                <input
                  value={row.remarks}
                  onChange={(event) =>
                    onChange(index, "remarks", event.target.value)
                  }
                  className={inputClasses}
                  placeholder="Remarks"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
