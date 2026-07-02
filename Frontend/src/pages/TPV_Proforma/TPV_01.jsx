import React, { useEffect, useState, useCallback } from "react";
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
  
const STORAGE_KEY = "tpv_01_form_data";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://127.0.0.1:8000";

const physicalCheckItems = [
  "Major process equipment present",
  "Site clean and generally usable",
  "No major leakage / visible damage",
  "Water point / taps usable",
  "Civil structure / room / shed acceptable",
  "Drainage / wastewater disposal acceptable",
  "Operator available / O&M evident",
  "Plant appears to serve public",
];

const recordCheckItems = [
  "O&M log",
  "Maintenance / repair record",
  "Water quality report",
  "Complaint register",
  "Plant handover / rehabilitation record",
];

const initialFormData = {
  district: "",
  dateOfVisit: "",
  tehsil: "",
  inspection_site: "",
  plantLocation: "",
  phase: "",
  inspectorName: "",
  contractorRepPresent: "",
  operatorCaretakerPresent: "",
  gpsAppEntry: "",
  plant_type: "",
  plantTypeOther: "",
  capacity: "",
  operatingAtVisit: "",
  waterAvailableToPublic: "",
  overall_status: "",
  physicalChecks: physicalCheckItems.map((item) => ({
    item,
    status: "",
    remarks: "",
  })),
  recordChecks: recordCheckItems.map((record) => ({
    record,
    status: "",
    remarks: "",
  })),
  serviceDelivery: "",
  omCompliance: "",
  recommendation: "",
  majorObservations: "",
  inspectorSignature: "",
  siteRepresentativeSignature: "",
};

export default function TPV_01({ plantId = "", onSubmit }) {
  const { isLight } = useTheme();
  const navigate = useNavigate();
  
  const pageClasses = isLight
    ? "min-h-screen bg-[#f5f5f5] text-gray-950"
    : "min-h-screen bg-black text-gray-100";

  const inputClasses = isLight
    ? "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13px] text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
    : "w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-[13px] text-white outline-none transition placeholder:text-gray-600 focus:border-white/50 focus:ring-4 focus:ring-white/5 disabled:cursor-not-allowed disabled:bg-[#151515] disabled:text-gray-600";


  const { setState } = useNavbar();

  const [formData, setFormData] = useState({
    ...initialFormData,
    inspection_site: plantId || initialFormData.inspection_site,
  });

  // API data states
  const [districts, setDistricts] = useState([]);
  const [tehsils, setTehsils] = useState([]);
  const [inspectionSites, setInspectionSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch districts on mount
  const fetchDistricts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/list-district/`);
      const result = await response.json();
      
      if (Array.isArray(result)) {
        setDistricts(result);
      } else if (Array.isArray(result?.data)) {
        setDistricts(result.data);
      } else if (Array.isArray(result?.results)) {
        setDistricts(result.results);
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch tehsils when district changes
  const fetchTehsils = useCallback(async (districtId) => {
    if (!districtId) {
      setTehsils([]);
      setInspectionSites([]);
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/list-tehsil/?district=${districtId}`
      );
      const result = await response.json();
      
      if (Array.isArray(result)) {
        setTehsils(result);
      } else if (Array.isArray(result?.data)) {
        setTehsils(result.data);
      } else if (Array.isArray(result?.results)) {
        setTehsils(result.results);
      }
      setInspectionSites([]);
    } catch (error) {
      console.error("Error fetching tehsils:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch inspection sites when tehsil changes
  const fetchInspectionSites = useCallback(async (tehsilId) => {
    if (!tehsilId) {
      setInspectionSites([]);
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/list-inspection-site/?tehsil=${tehsilId}`
      );
      const result = await response.json();
      
      if (Array.isArray(result)) {
        setInspectionSites(result);
      } else if (Array.isArray(result?.data)) {
        setInspectionSites(result.data);
      } else if (Array.isArray(result?.results)) {
        setInspectionSites(result.results);
      }
    } catch (error) {
      console.error("Error fetching inspection sites:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch logged-in user info
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        setCurrentUser(userData);
        // Auto-fill inspector name from logged-in user
        setFormData((prev) => ({
          ...prev,
          inspectorName: userData.full_name || "",
        }));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    fetchDistricts();
  }, [fetchDistricts]);

  useEffect(() => {
    setState({
      title: "TPV-01: Plant Visit, Functionality & Quality Proforma",
      subtitle:
        "For Third Party Validation teams conducting field verification of PSPA water filtration plants.",
    });

    return () => setState({ title: "", subtitle: "", actions: null });
  }, [setState]);

  const handleDistrictChange = (value) => {
    updateField("district", value);
    updateField("tehsil", "");
    updateField("inspection_site", "");
    if (value) {
      fetchTehsils(value);
    }
  };

  const handleTehsilChange = (value) => {
    updateField("tehsil", value);
    updateField("inspection_site", "");
    if (value) {
      fetchInspectionSites(value);
    }
  };

  const updateField = (name, value) => {
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const updateTableRow = (tableName, index, field, value) => {
    setFormData((previous) => ({
      ...previous,
      [tableName]: previous[tableName].map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    }));
  };

  const handleSaveDraft = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    alert(
      "TPV-01 draft saved locally. Open TPV_01_Report.jsx route/page to print the filled report.",
    );
  };

  const handleSaveAndNext = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    navigate("/tpv-02");
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

    console.log("TPV-01 payload:", formData);
    alert(
      "TPV-01 data captured successfully. Backend integration can be connected later.",
    );
  };

  return (
    <div className={pageClasses}>
      <main className="w-full max-w-none space-y-5 px-4 py-4">
        <form onSubmit={handleSubmit} className="space-y-5">
          

          <div className="space-y-5">
            <Section title="A. Basic Information">
              <div className="grid gap-4 md:grid-cols-3">
                <SelectInput
                  label="District"
                  value={formData.district}
                  onChange={handleDistrictChange}
                  options={districts}
                  optionLabel="district_name"
                  optionValue="id"
                  inputClasses={inputClasses}
                  loading={loading}
                />
                <TextInput
                  label="Date of Visit"
                  type="date"
                  value={formData.dateOfVisit}
                  onChange={(value) => updateField("dateOfVisit", value)}
                  inputClasses={inputClasses}
                />
                <SelectInput
                  label="Tehsil / UC"
                  value={formData.tehsil}
                  onChange={handleTehsilChange}
                  options={tehsils}
                  optionLabel="tehsil_name"
                  optionValue="id"
                  inputClasses={inputClasses}
                  loading={loading}
                  disabled={!formData.district}
                />
                <SelectInput
                  label="Plant ID / Code (Site Name)"
                  value={formData.inspection_site}
                  onChange={(value) => {
                    const selectedSite = inspectionSites.find(
                      (site) => String(site.id) === String(value)
                    );

                    setFormData((prev) => ({
                      ...prev,
                      inspection_site: value,
                      // Auto-fill location
                      plantLocation: selectedSite
                        ? `${selectedSite.site_name} (${selectedSite.latitude}, ${selectedSite.longitude})`
                        : "",
                      // Auto-fill plant type
                      plant_type: selectedSite?.type || "",
                    }));
                  }}
                  options={inspectionSites}
                  optionLabel="site_name"
                  optionValue="id"
                  showId={true}
                  inputClasses={inputClasses}
                  loading={loading}
                  disabled={!formData.tehsil}
                />
                <div className="md:col-span-3">
                  <TextInput
                    label="Plant Location"
                    value={formData.plantLocation}
                    onChange={(value) => updateField("plantLocation", value)}
                    inputClasses={inputClasses}
                    disabled
                  />
                </div>
                <RadioGroup
                  label="Phase"
                  value={formData.phase}
                  options={["Phase I", "Phase II", "Phase III"]}
                  onChange={(value) => updateField("phase", value)}
                  inputClasses={inputClasses}
                />
                <TextInput
                  label="Inspector Name"
                  value={formData.inspectorName}
                  onChange={(value) => updateField("inspectorName", value)}
                  inputClasses={inputClasses}
                  disabled={!!currentUser}
                />
                <RadioGroup
                  label="Contractor Rep Present"
                  value={formData.contractorRepPresent}
                  options={["Yes", "No"]}
                  onChange={(value) =>
                    updateField("contractorRepPresent", value)
                  }
                  inputClasses={inputClasses}
                />
                <RadioGroup
                  label="Operator / Caretaker Present"
                  value={formData.operatorCaretakerPresent}
                  options={["Yes", "No"]}
                  onChange={(value) =>
                    updateField("operatorCaretakerPresent", value)
                  }
                  inputClasses={inputClasses}
                />
                <RadioGroup
                  label="GPS / App Entry"
                  value={formData.gpsAppEntry}
                  options={["Done", "Not Done"]}
                  onChange={(value) => updateField("gpsAppEntry", value)}
                  inputClasses={inputClasses}
                />
              </div>
            </Section>

            <Section title="B. Plant Status">
              <div className="grid gap-4 md:grid-cols-3">
                <TextInput
                  label="Plant Type"
                  value={formData.plant_type}
                  inputClasses={inputClasses}
                  disabled
                />
                {formData.plant_type === "Other" && (
                  <TextInput
                    label="Other Plant Type"
                    value={formData.plantTypeOther}
                    onChange={(value) => updateField("plantTypeOther", value)}
                    inputClasses={inputClasses}
                  />
                )}
                <RadioGroup
                  label="Capacity"
                  value={formData.capacity}
                  options={["500 LPH", "1000 LPH", "2000 LPH", "4000 LPH"]}
                  onChange={(value) => updateField("capacity", value)}
                  inputClasses={inputClasses}
                />
                <RadioGroup
                  label="Operating at time of visit"
                  value={formData.operatingAtVisit}
                  options={["Yes", "No"]}
                  onChange={(value) => updateField("operatingAtVisit", value)}
                  inputClasses={inputClasses}
                />
                <RadioGroup
                  label="Water available to public"
                  value={formData.waterAvailableToPublic}
                  options={["Yes", "No"]}
                  onChange={(value) =>
                    updateField("waterAvailableToPublic", value)
                  }
                  inputClasses={inputClasses}
                />
                <div className="md:col-span-3">
                  <RadioGroup
                    label="Overall Status"
                    value={formData.overall_status}
                    options={[
                      "Functional",
                      "Functional with Minor Issues",
                      "Partially Functional",
                      "Non-Functional",
                      "Not Accessible",
                    ]}
                    onChange={(value) => updateField("overall_status", value)}
                    inputClasses={inputClasses}
                  />
                </div>
              </div>
            </Section>

            <Section title="C. Quick Physical / Quality Check">
              <StatusTable
                firstColumnLabel="Item"
                rows={formData.physicalChecks}
                statusOptions={["OK", "Not OK"]}
                rowLabelKey="item"
                onChange={(index, field, value) =>
                  updateTableRow("physicalChecks", index, field, value)
                }
                inputClasses={inputClasses}
              />
            </Section>

            <Section title="D. Record Check">
              <StatusTable
                firstColumnLabel="Record"
                rows={formData.recordChecks}
                statusOptions={["Available", "Not Available"]}
                rowLabelKey="record"
                onChange={(index, field, value) =>
                  updateTableRow("recordChecks", index, field, value)
                }
                inputClasses={inputClasses}
              />
            </Section>

            <Section title="E. Overall Assessment">
              <div className="grid gap-4">
                <RadioGroup
                  label="Service Delivery"
                  value={formData.serviceDelivery}
                  options={[
                    "Satisfactory",
                    "Needs Improvement",
                    "Unsatisfactory",
                  ]}
                  onChange={(value) => updateField("serviceDelivery", value)}
                  inputClasses={inputClasses}
                />
                <RadioGroup
                  label="O&M Compliance"
                  value={formData.omCompliance}
                  options={["Compliant", "Partial", "Non-Compliant"]}
                  onChange={(value) => updateField("omCompliance", value)}
                  inputClasses={inputClasses}
                />
                <RadioGroup
                  label="Recommendation"
                  value={formData.recommendation}
                  options={[
                    "Acceptable",
                    "Acceptable with Observations",
                    "Corrective Action Required",
                    "Serious Deficiency / Revisit Required",
                  ]}
                  onChange={(value) => updateField("recommendation", value)}
                  inputClasses={inputClasses}
                />
                <TextArea
                  label="Major Observations"
                  value={formData.majorObservations}
                  onChange={(value) => updateField("majorObservations", value)}
                  inputClasses={inputClasses}
                />
              </div>
            </Section>

            <Section title="Signatures">
              <div className="grid gap-4 md:grid-cols-3">
                <TextInput
                  label="Inspector Signature"
                  value={formData.inspectorSignature}
                  onChange={(value) => updateField("inspectorSignature", value)}
                  inputClasses={inputClasses}
                />
                <TextInput
                  label="Site Representative Signature"
                  value={formData.siteRepresentativeSignature}
                  onChange={(value) =>
                    updateField("siteRepresentativeSignature", value)
                  }
                  inputClasses={inputClasses}
                />
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
              onClick={handleSaveAndNext}
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

function TextInput({
  label,
  value,
  onChange,
  type = "text",
  inputClasses,
  disabled = false,
}) {
  const cls =
    inputClasses ||
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13px] text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5";

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value)}
        className={cls}
      />
    </div>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options = [],
  optionLabel = "name",
  optionValue = "id",
  showId = false,
  inputClasses,
  loading = false,
  disabled = false,
}) {
  const cls =
    inputClasses ||
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13px] text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5";

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled || loading}
        className={cls}
      >
        <option value="">
          {loading ? "Loading..." : `Select ${label.toLowerCase()}`}
        </option>
        {options.map((option) => (
          <option key={option[optionValue]} value={option[optionValue]}>
            {showId
              ? `${option[optionValue]} - ${option[optionLabel]}`
              : option[optionLabel]}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextArea({ label, value, onChange, inputClasses }) {
  const cls =
    inputClasses ||
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13px] text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5";

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={5}
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

function StatusTable({
  rows,
  firstColumnLabel,
  statusOptions,
  rowLabelKey,
  onChange,
  inputClasses,
}) {
  const { isLight } = useTheme();

  return (
    <div
      className={cn(
        "overflow-x-auto rounded-xl border",
        isLight ? "border-gray-200" : "border-white/10",
      )}
    >
      <table className="w-full min-w-[720px] border-collapse text-[13px]">
        <thead>
          <tr
            className={cn(
              isLight
                ? "border-b border-gray-200 bg-gray-50 text-gray-500"
                : "border-b border-white/10 bg-[#0b0b0b] text-gray-500",
            )}
          >
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
              {firstColumnLabel}
            </th>
            {statusOptions.map((option) => (
              <th
                key={option}
                className="w-28 px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.08em]"
              >
                {option}
              </th>
            ))}
            <th className="min-w-64 px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em]">
              Remarks
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row[rowLabelKey]}
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
                {row[rowLabelKey]}
              </td>
              {statusOptions.map((option) => (
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
