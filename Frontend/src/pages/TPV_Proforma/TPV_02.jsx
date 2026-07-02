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

const STORAGE_KEY = "tpv_02_form_data";

const emptyItemRow = {
  billItemNo: "",
  description: "",
  unit: "",
  agreementBoqQty: "",
  previousBilledQty: "",
  uptoDateQty: "",
  qtyVerifiedAtSite: "",
  basis: "",
  qualityStatus: "",
  variance: "",
  remarks: "",
};

const initialFormData = {
  plantId: "",
  districtPhase: "",
  runningBillNo: "",
  ipcMbReference: "",
  billHeadNo: "",
  boqType: "",
  plantLocation: "",
  items: Array.from({ length: 12 }, () => ({ ...emptyItemRow })),
};

export default function TPV_02({ plantId = "", onSubmit }) {
  const { isLight } = useTheme();
  const navigate = useNavigate();
  const { setState } = useNavbar();

  useEffect(() => {
    setState({
      title: "TPV-02: IPC / BOQ Item Verification Sheet",
      subtitle:
        "Plant-wise verification against Running Bill / IPC / BOQ / MB.",
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

  const updateItem = (index, field, value) => {
    setFormData((previous) => ({
      ...previous,
      items: previous.items.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    }));
  };

  const addRow = () => {
    setFormData((previous) => ({
      ...previous,
      items: [...previous.items, { ...emptyItemRow }],
    }));
  };

  const removeRow = (index) => {
    setFormData((previous) => ({
      ...previous,
      items: previous.items.filter((_, rowIndex) => rowIndex !== index),
    }));
  };

  const handleSaveDraft = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    alert(
      "TPV-02 draft saved locally. Open TPV_02_Report.jsx route/page to print the filled report.",
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

    console.log("TPV-02 payload:", formData);
    alert(
      "TPV-02 data captured successfully. Backend integration can be connected later.",
    );
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
                <RadioGroup
                  label="Running Bill No."
                  value={formData.runningBillNo}
                  options={["1st", "2nd", "3rd"]}
                  onChange={(value) => updateField("runningBillNo", value)}
                  inputClasses={inputClasses}
                />
                <TextInput
                  label="IPC / MB Reference"
                  value={formData.ipcMbReference}
                  onChange={(value) => updateField("ipcMbReference", value)}
                  inputClasses={inputClasses}
                />
                <TextInput
                  label="Bill Head No."
                  value={formData.billHeadNo}
                  onChange={(value) => updateField("billHeadNo", value)}
                  inputClasses={inputClasses}
                />
                <RadioGroup
                  label="BOQ / Non-BOQ / VO"
                  value={formData.boqType}
                  options={["BOQ", "Non-BOQ", "VO"]}
                  onChange={(value) => updateField("boqType", value)}
                  inputClasses={inputClasses}
                />
                <div className="md:col-span-3">
                  <TextInput
                    label="Plant Location"
                    value={formData.plantLocation}
                    onChange={(value) => updateField("plantLocation", value)}
                    inputClasses={inputClasses}
                  />
                </div>
              </div>
            </Section>

            <Section title="B. Item-wise Verification">
              <div className="mb-3 flex justify-end">
                <button
                  type="button"
                  onClick={addRow}
                  className={cn(
                    "inline-flex items-center justify-center rounded-xl border px-4 py-2 text-[12px] font-semibold transition",
                    isLight
                      ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      : "border-white/10 bg-[#0b0b0b] text-gray-300 hover:bg-white/5",
                  )}
                >
                  Add Item Row
                </button>
              </div>

              <div
                className={cn(
                  "overflow-x-auto rounded-xl border",
                  isLight ? "border-gray-200" : "border-white/10",
                )}
              >
                <table className="min-w-[1600px] border-collapse text-[13px]">
                  <thead>
                    <tr
                      className={cn(
                        isLight
                          ? "border-b border-gray-200 bg-gray-50 text-gray-500"
                          : "border-b border-white/10 bg-[#0b0b0b] text-gray-500",
                      )}
                    >
                      {[
                        "Bill No. / Item No.",
                        "Description",
                        "Unit",
                        "Agreement / BOQ Qty",
                        "Prev. Billed Qty",
                        "Upto-date Qty",
                        "Qty Verified at Site",
                        "Basis",
                        "Quality / Status",
                        "Variance",
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
                    {formData.items.map((item, index) => (
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
                          value={item.billItemNo}
                          onChange={(value) =>
                            updateItem(index, "billItemNo", value)
                          }
                          inputClasses={inputClasses}
                        />
                        <TableInput
                          value={item.description}
                          onChange={(value) =>
                            updateItem(index, "description", value)
                          }
                          wide
                          inputClasses={inputClasses}
                        />
                        <TableInput
                          value={item.unit}
                          onChange={(value) => updateItem(index, "unit", value)}
                          inputClasses={inputClasses}
                        />
                        <TableInput
                          value={item.agreementBoqQty}
                          onChange={(value) =>
                            updateItem(index, "agreementBoqQty", value)
                          }
                          inputClasses={inputClasses}
                        />
                        <TableInput
                          value={item.previousBilledQty}
                          onChange={(value) =>
                            updateItem(index, "previousBilledQty", value)
                          }
                          inputClasses={inputClasses}
                        />
                        <TableInput
                          value={item.uptoDateQty}
                          onChange={(value) =>
                            updateItem(index, "uptoDateQty", value)
                          }
                          inputClasses={inputClasses}
                        />
                        <TableInput
                          value={item.qtyVerifiedAtSite}
                          onChange={(value) =>
                            updateItem(index, "qtyVerifiedAtSite", value)
                          }
                          inputClasses={inputClasses}
                        />
                        <td className="px-2 py-2">
                          <select
                            value={item.basis}
                            onChange={(event) =>
                              updateItem(index, "basis", event.target.value)
                            }
                            className={inputClasses}
                          >
                            <option value="">Select</option>
                            <option value="Count">Count</option>
                            <option value="Measure">Measure</option>
                            <option value="Record">Record</option>
                          </select>
                        </td>
                        <td className="px-2 py-2">
                          <select
                            value={item.qualityStatus}
                            onChange={(event) =>
                              updateItem(
                                index,
                                "qualityStatus",
                                event.target.value,
                              )
                            }
                            className={inputClasses}
                          >
                            <option value="">Select</option>
                            <option value="OK">OK</option>
                            <option value="DEF">DEF</option>
                            <option value="MIS">MIS</option>
                            <option value="RPV">RPV</option>
                            <option value="NV">NV</option>
                          </select>
                        </td>
                        <TableInput
                          value={item.variance}
                          onChange={(value) =>
                            updateItem(index, "variance", value)
                          }
                          inputClasses={inputClasses}
                        />
                        <TableInput
                          value={item.remarks}
                          onChange={(value) =>
                            updateItem(index, "remarks", value)
                          }
                          wide
                          inputClasses={inputClasses}
                        />
                        <td className="px-2 py-2">
                          <button
                            type="button"
                            onClick={() => removeRow(index)}
                            disabled={formData.items.length === 1}
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

            <Section title="C. Quick Verification Codes">
              <div className="grid gap-3 text-sm text-gray-700 md:grid-cols-3">
                <InfoBox
                  label="Verification Basis"
                  value="Count / Measure / Record"
                />
                <InfoBox
                  label="Quality / Status"
                  value="OK = acceptable; DEF = defective; MIS = missing; RPV = record partly verifiable; NV = not verifiable"
                />
                <InfoBox
                  label="Variance"
                  value="Difference between Upto-date Qty / Current IPC Qty and quantity physically verified at site"
                />
                <InfoBox
                  label="BOQ / Non-BOQ / VO"
                  value="Tick or state whether item falls under original BOQ, non-BOQ, or variation order"
                />
                <div className="md:col-span-3">
                  <InfoBox
                    label="TPV Note"
                    value="Any major discrepancy should be supported with photographs, measurements, and brief remarks."
                  />
                </div>
              </div>
            </Section>
          </div>

          <div
            className={cn(
              "flex flex-col gap-3 rounded-2xl border p-5 shadow-sm sm:flex-row sm:justify-end md:p-6",
              isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#111111]",
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
              onClick={() => {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
                navigate("/tpv-02a");
              }}
              className={cn(
                "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-[12px] font-semibold text-white transition",
                isLight
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-emerald-500 hover:bg-emerald-600",
              )}
            >
              Save & Next
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

function TextInput({ label, value, onChange, inputClasses }) {
  const cls =
    inputClasses ||
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13px] text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5";

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
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

function TableInput({ value, onChange, wide = false, inputClasses }) {
  const cls = cn(inputClasses, wide ? "min-w-60" : "min-w-28");

  return (
    <td className="px-2 py-2">
      <input
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
