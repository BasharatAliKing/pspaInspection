import React, { useState, useEffect } from "react";
import { useTheme } from "../../components/Layout";
import { X, SlidersHorizontal } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://127.0.0.1:8000";

const SelectInput = ({
  label,
  value,
  onChange,
  options = [],
  optionLabel = "name",
  optionValue = "id",
  inputClasses,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClasses}
        disabled={disabled}
      >
        <option value="">Select {label}</option>
        {options?.map((item) => (
          <option key={item[optionValue]} value={item[optionValue]}>
            {item[optionLabel]}
          </option>
        ))}
      </select>
    </div>
  );
};

const Filters = ({ isOpen, onClose, filterval, handleSiteId }) => {
  if (!isOpen) return null;

  const { isLight } = useTheme();
  const [zones, setZones] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [tehsils, setTehsils] = useState([]);
  const [phases, setPhases] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [sites, setSites] = useState([]);
  const [formData, setFormData] = useState({
    zone: "",
    division: "",
    district: "",
    tehsil: "",
    phase: "",
    contract: "",
    site: "",
  });

  const isLahoreDivision = formData.division === "2";

  const wrapperClass = isLight
    ? "border-slate-200 bg-white text-slate-800 shadow-[0_20px_60px_rgba(15,23,42,0.15)]"
    : "border-slate-800 bg-slate-900 text-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.35)]";

  const inputClasses = isLight
    ? "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#111a3d] focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
    : "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-900 disabled:text-slate-500";

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleZoneChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      zone: value,
      division: "",
      district: "",
      tehsil: "",
      phase: "",
      contract: "",
      site: "",
    }));

    setDistricts([]);
    setTehsils([]);
    setPhases([]);
    setContracts([]);
    setSites([]);
  };

  const handleDivisionChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      division: value,
      district: "",
      tehsil: "",
      phase: "",
      contract: "",
      site: "",
    }));

    setTehsils([]);
    setPhases([]);
    setContracts([]);
    setSites([]);
  };

  const handleDistrictChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      district: value,
      tehsil: "",
      phase: "",
      contract: "",
      site: "",
    }));

    setPhases([]);
    setContracts([]);
    setSites([]);
  };

  const handleTehsilChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      tehsil: value,
      phase: "",
      contract: "",
      site: "",
    }));

    setContracts([]);
    setSites([]);
  };

  const handlePhaseChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      phase: value,
      contract: "",
      site: "",
    }));

    setSites([]);
  };

  const handleContractChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      contract: value,
      site: "",
    }));
    filterval(value);
  };

  const getZones = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/list-zone/`);
      const data = await res.json();

      if (data?.data) {
        setZones(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDivisions = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/list-division/?zone_id=${formData.zone}`,
      );
      const data = await res.json();

      if (data?.data) {
        setDivisions(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDistricts = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/list-district/?division_id=${formData.division}`,
      );
      const data = await res.json();
      if (data?.data) {
        setDistricts(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTehsils = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/list-tehsil/?district_id=${formData.district}`,
      );
      const data = await res.json();
      if (data?.data) {
        setTehsils(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getContracts = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/list-contract/?division_id=${formData?.division}`,
      );
      const data = await res.json();
      if (data?.data) {
        setContracts(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getSites = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/list-inspection-site/?contract=${formData?.contract}`,
      );
      const data = await res.json();
      if (data?.data) {
        setSites(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  useEffect(() => {
    getDivisions();
    getDistricts();
    getTehsils();
    getContracts();
    getSites();
  }, [formData]);

  useEffect(() => {
    getZones();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-5xl overflow-hidden rounded-[28px] border ${wrapperClass}`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-[#111a3d] to-[#1f3a8a] px-6 py-5 text-white">
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} />
              <h2 className="text-lg font-semibold">Filter Records</h2>
            </div>
            <p className="mt-1 text-sm text-slate-200">
              Refine the BOQ list by location and contract.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/20 p-2 transition hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              <SelectInput
                label="Zone"
                value={formData.zone}
                onChange={handleZoneChange}
                options={zones}
                optionLabel="zone_name"
                optionValue="id"
                inputClasses={inputClasses}
              />

              <SelectInput
                label="Division"
                value={formData.division}
                onChange={handleDivisionChange}
                options={divisions}
                optionLabel="division_name"
                optionValue="id"
                inputClasses={inputClasses}
                disabled={!formData.zone}
              />

              <SelectInput
                label="District"
                value={formData.district}
                onChange={handleDistrictChange}
                options={districts}
                optionLabel="district_name"
                optionValue="id"
                inputClasses={inputClasses}
                disabled={!formData.division}
              />

              <SelectInput
                label="Tehsil"
                value={formData.tehsil}
                onChange={handleTehsilChange}
                options={tehsils}
                optionLabel="tehsil_name"
                optionValue="id"
                inputClasses={inputClasses}
                disabled={!formData.district}
              />

              {isLahoreDivision && (
                <SelectInput
                  label="Phase"
                  value={formData.phase}
                  onChange={handlePhaseChange}
                  options={phases}
                  optionLabel="phase_name"
                  optionValue="id"
                  inputClasses={inputClasses}
                  disabled={!formData.tehsil}
                />
              )}

              <SelectInput
                label="Contract"
                value={formData.contract}
                onChange={handleContractChange}
                options={contracts}
                optionLabel="contract_no"
                optionValue="id"
                inputClasses={inputClasses}
                disabled={isLahoreDivision ? !formData.phase : !formData.tehsil}
              />

              <SelectInput
                label="Site"
                value={formData.site}
                onChange={(value) => {
                  updateField("site", value);
                  handleSiteId(value);
                }}
                options={sites}
                optionLabel="site_name"
                optionValue="id"
                inputClasses={inputClasses}
                disabled={!formData.contract}
              />
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
                onClick={onClose}
                type="submit"
                className="rounded-xl bg-[#111a3d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0d1530]"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Filters;
