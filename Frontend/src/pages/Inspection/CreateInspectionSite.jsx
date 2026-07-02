import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Check, Info, Loader2, MapPin, X } from "lucide-react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useNavbar } from "../../components/Navbar";
import { useTheme } from "../../components/Layout";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const siteTypes = ["RO", "UF", "MF"];
const siteCategories = [
  "Revamped",
  "New",
  "Old",
  "Functional",
  "Dysfunctional",
  "Not functional",
  "Abondoned",
];
const sitePhases = [1, 2, 3, 4, 5, 6, 7];

const DEFAULT_CENTER = [31.5204, 74.3587];
const DEFAULT_ZOOM = 11;
const SELECTED_ZOOM = 16;
const INSPECTION_SITE_LIST_ROUTE = "/inspection-sites";

const markerIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 30px;
      height: 30px;
      background: #111827;
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 12px 26px rgba(17, 24, 39, 0.35);
    ">
      <div style="
        width: 8px;
        height: 8px;
        margin: 8px auto;
        border-radius: 999px;
        background: white;
      "></div>
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 33],
});

const initialForm = {
  contract_no: "",
  site_name: "",
  type: "",
  category: "",
  phase: "",

  zone: "",
  division: "",
  district: "",
  tehsil: "",
  latitude: "",
  longitude: "",
};

function FieldLabel({ children, required = false }) {
  return (
    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">
      {children}
      {required ? <span className="ml-1 text-red-500">*</span> : null}
    </label>
  );
}

function FieldError({ show, children }) {
  if (!show) return null;

  return (
    <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-red-500">
      <AlertCircle className="h-3.5 w-3.5" />
      {children}
    </div>
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
          {description ? (
            <p
              className={cn(
                "mt-1 text-[13px] leading-5",
                isLight ? "text-gray-500" : "text-gray-400",
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
      </div>

      {children}
    </section>
  );
}

function isValidCoordinate(lat, lon) {
  const parsedLat = Number(lat);
  const parsedLon = Number(lon);

  return (
    Number.isFinite(parsedLat) &&
    Number.isFinite(parsedLon) &&
    parsedLat >= -90 &&
    parsedLat <= 90 &&
    parsedLon >= -180 &&
    parsedLon <= 180
  );
}

function formatCoordinate(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "";
  return parsed.toFixed(7);
}

function extractApiError(result, fallbackMessage) {
  if (!result) return fallbackMessage;
  if (typeof result === "string") return result;

  const data = result.data || result.errors || result;

  if (typeof data === "string") return data;

  if (data && typeof data === "object") {
    const fieldMessages = Object.entries(data)
      .filter(([field]) => !["status", "message", "detail"].includes(field))
      .map(([field, value]) => {
        if (Array.isArray(value)) return `${field}: ${value.join(", ")}`;
        if (typeof value === "object" && value !== null) {
          return `${field}: ${JSON.stringify(value)}`;
        }
        return `${field}: ${value}`;
      })
      .join(" | ");

    if (fieldMessages) return fieldMessages;
  }

  if (result.detail) return result.detail;
  if (result.message && result.message !== "Error") return result.message;
  if (result.message) return `${result.message}: ${fallbackMessage}`;

  return fallbackMessage;
}

function MapRecenter({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);

  return null;
}

function MapClickHandler({ onPick }) {
  useMapEvents({
    click(event) {
      onPick(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

function InspectionSiteLocationMap({ latitude, longitude, onPick }) {
  const hasSelectedPosition = isValidCoordinate(latitude, longitude);

  const position = useMemo(() => {
    return hasSelectedPosition
      ? [Number(latitude), Number(longitude)]
      : DEFAULT_CENTER;
  }, [hasSelectedPosition, latitude, longitude]);

  const zoom = hasSelectedPosition ? SELECTED_ZOOM : DEFAULT_ZOOM;

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      scrollWheelZoom
      className="h-full w-full"
    >
      <MapRecenter center={position} zoom={zoom} />
      <MapClickHandler onPick={onPick} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={position}
        draggable
        icon={markerIcon}
        eventHandlers={{
          dragend: (event) => {
            const nextPosition = event.target.getLatLng();
            onPick(nextPosition.lat, nextPosition.lng);
          },
        }}
      />
    </MapContainer>
  );
}

export default function CreateInspectionSite() {
  const { isLight } = useTheme();
  const { setState } = useNavbar();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [siteCode, setSiteCode] = useState("SITE-XXXX");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contractsList, setContractsList] = useState([]);
  const [zonesList, setZonesList] = useState([]);
  const [divisionsList, setDivisionsList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [tehsilsList, setTehsilsList] = useState([]);

  const [newContractNo, setNewContractNo] = useState("");
  const [showAddContract, setShowAddContract] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!toast || toast.type === "loading") return undefined;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const API_BASE_URL = useMemo(() => {
    return (
      import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ||
      "http://127.0.0.1:8000"
    );
  }, []);

  const normalizeListResponse = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.results)) return payload.results;
    return [];
  };

  const buildApiUrls = (endpoint) => {
    const cleanEndpoint = String(endpoint || "")
      .replace(/^\/+/, "")
      .replace(/\/+$/, "");
    const cleanBase = API_BASE_URL.replace(/\/+$/, "");
    const baseWithoutApi = cleanBase.replace(/\/api$/i, "");
    const baseAlreadyIncludesApi = /\/api$/i.test(cleanBase);

    const urls = baseAlreadyIncludesApi
      ? [
          `${cleanBase}/${cleanEndpoint}/`,
          `${baseWithoutApi}/api/${cleanEndpoint}/`,
          `${baseWithoutApi}/${cleanEndpoint}/`,
        ]
      : [
          `${cleanBase}/api/${cleanEndpoint}/`,
          `${cleanBase}/${cleanEndpoint}/`,
        ];

    return Array.from(new Set(urls));
  };

  const parseApiResponse = async (response) => {
    const text = await response.text();

    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch (error) {
      return text;
    }
  };

  const apiRequest = async (endpoint, options = {}) => {
    const urls = buildApiUrls(endpoint);
    let lastResult = null;
    let lastStatus = null;
    let lastUrl = urls[0];

    for (const url of urls) {
      const response = await fetch(url, options);
      const result = await parseApiResponse(response);

      lastResult = result;
      lastStatus = response.status;
      lastUrl = url;

      if (response.status === 404) continue;

      return {
        ok: response.ok,
        status: response.status,
        result,
        url,
      };
    }

    return {
      ok: false,
      status: lastStatus,
      result: lastResult,
      url: lastUrl,
    };
  };

  const getCreatedId = (result) => {
    return (
      result?.data?.id || result?.site?.id || result?.site_id || result?.id
    );
  };

  const pageClasses = isLight
    ? "min-h-screen bg-[#f5f5f5] text-gray-950"
    : "min-h-screen bg-black text-gray-100";

  const inputClasses = isLight
    ? "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13px] text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
    : "w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-[13px] text-white outline-none transition placeholder:text-gray-600 focus:border-white/50 focus:ring-4 focus:ring-white/5 disabled:cursor-not-allowed disabled:bg-[#151515] disabled:text-gray-600";

  const selectedZoneName = useMemo(() => {
    return zonesList.find((z) => String(z.id) === String(form.zone))?.zone_name;
  }, [zonesList, form.zone]);

  const selectedDivisionName = useMemo(() => {
    return divisionsList.find((d) => String(d.id) === String(form.division))
      ?.division_name;
  }, [divisionsList, form.division]);

  const selectedDistrictName = useMemo(() => {
    return districtsList.find((d) => String(d.id) === String(form.district))
      ?.district_name;
  }, [districtsList, form.district]);

  const selectedTehsilName = useMemo(() => {
    return tehsilsList.find((t) => String(t.id) === String(form.tehsil))
      ?.tehsil_name;
  }, [tehsilsList, form.tehsil]);

  const fetchContracts = useCallback(async () => {
  try {
    const res = await apiRequest("list-contract");
    setContractsList(normalizeListResponse(res.result));
  } catch (err) {
    console.error(err);
  }
}, []);

useEffect(() => {
  fetchZones();
  fetchContracts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  // Cascading fetch functions
  const fetchZones = useCallback(async () => {
    try {
      const res = await apiRequest("list-zone");
      setZonesList(normalizeListResponse(res.result));
    } catch (err) {
      console.error("Error fetching zones:", err);
    }
  }, []);

  const fetchDivisions = useCallback(async (zoneId) => {
    if (!zoneId) {
      setDivisionsList([]);
      setDistrictsList([]);
      setTehsilsList([]);
      return;
    }
    try {
      const res = await apiRequest(`list-division?zone_id=${zoneId}`);
      setDivisionsList(normalizeListResponse(res.result));
      setDistrictsList([]);
      setTehsilsList([]);
    } catch (err) {
      console.error("Error fetching divisions:", err);
    }
  }, []);

  const fetchDistricts = useCallback(async (divisionId) => {
    if (!divisionId) {
      setDistrictsList([]);
      setTehsilsList([]);
      return;
    }
    try {
      const res = await apiRequest(`list-district?division_id=${divisionId}`);
      setDistrictsList(normalizeListResponse(res.result));
      setTehsilsList([]);
    } catch (err) {
      console.error("Error fetching districts:", err);
    }
  }, []);

  const fetchTehsils = useCallback(async (districtId) => {
    if (!districtId) {
      setTehsilsList([]);
      return;
    }
    try {
      const res = await apiRequest(`list-tehsil?district_id=${districtId}`);
      setTehsilsList(normalizeListResponse(res.result));
    } catch (err) {
      console.error("Error fetching tehsils:", err);
    }
  }, []);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const handleZoneChange = (zoneId) => {
    setForm((prev) => ({
      ...prev,
      zone: zoneId,
      division: "",
      district: "",
      tehsil: "",
    }));
    setErrors((prev) => ({
      ...prev,
      zone: false,
      division: false,
      district: false,
      tehsil: false,
    }));
    if (zoneId) {
      fetchDivisions(zoneId);
    }
  };

  const handleDivisionChange = (divisionId) => {
    setForm((prev) => ({
      ...prev,
      division: divisionId,
      district: "",
      tehsil: "",
    }));
    setErrors((prev) => ({
      ...prev,
      division: false,
      district: false,
      tehsil: false,
    }));
    if (divisionId) {
      fetchDistricts(divisionId);
    }
  };

  const handleDistrictChange = (districtId) => {
    setForm((prev) => ({
      ...prev,
      district: districtId,
      tehsil: "",
    }));
    setErrors((prev) => ({
      ...prev,
      district: false,
      tehsil: false,
    }));
    if (districtId) {
      fetchTehsils(districtId);
    }
  };

  const updateLocationFields = ({ latitude, longitude }) => {
    setForm((prev) => ({
      ...prev,
      latitude: latitude ?? prev.latitude,
      longitude: longitude ?? prev.longitude,
    }));

    setErrors((prev) => ({
      ...prev,
      latitude: false,
      longitude: false,
    }));
  };

  const handleMapPick = (latitude, longitude) => {
    updateLocationFields({
      latitude: formatCoordinate(latitude),
      longitude: formatCoordinate(longitude),
    });
  };

  const handleManualCoordinateBlur = () => {
    if (isValidCoordinate(form.latitude, form.longitude)) {
      updateLocationFields({
        latitude: formatCoordinate(form.latitude),
        longitude: formatCoordinate(form.longitude),
      });
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.site_name.trim()) nextErrors.site_name = "Site name is required";
    if (!form.type.trim()) nextErrors.type = "Type is required";
    if (!form.category.trim()) nextErrors.category = "Category is required";
    if (!form.zone.trim()) nextErrors.zone = "Zone is required";
    if (!form.division.trim()) nextErrors.division = "Division is required";
    if (!form.district.trim()) nextErrors.district = "District is required";
    if (!form.tehsil.trim()) nextErrors.tehsil = "Tehsil is required";

    if (!isValidCoordinate(form.latitude, form.longitude)) {
      nextErrors.latitude = "Valid latitude is required";
      nextErrors.longitude = "Valid longitude is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCreateInspectionSite = async () => {
    if (!validateForm()) {
      showToast("Please fix the errors in the form", "error");
      return;
    }

    setIsSubmitting(true);
    showToast("Saving inspection site...", "loading");

    try {
      const payload = {
        contract_no: form.contract_no,
        phase: form.phase ? Number(form.phase) : null,
        zone: Number(form.zone),
        division: Number(form.division),
        district: Number(form.district),
        tehsil: Number(form.tehsil),
        site_name: form.site_name.trim(),
        latitude: formatCoordinate(form.latitude),
        longitude: formatCoordinate(form.longitude),
        type: form.type,
        category: form.category,
      };

      const siteResponse = await apiRequest("create-inspection-site", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!siteResponse.ok) {
        throw new Error(
          extractApiError(
            siteResponse.result,
            `Failed to create inspection site. URL tried: ${siteResponse.url}`,
          ),
        );
      }

      const createdSiteId = getCreatedId(siteResponse.result);

      setSiteCode(createdSiteId ? `SITE-${createdSiteId}` : "SITE-XXXX");
      setShowSuccess(true);
      showToast("Inspection site created successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(INSPECTION_SITE_LIST_ROUTE);
  };

  const clearForm = () => {
    setForm(initialForm);
    setErrors({});
  };

  useEffect(() => {
    setState({
      title: "Create Inspection Site",
      subtitle: "Add a new PSPA inspection site",
    });

    return () => setState({ title: "", subtitle: "", actions: null });
  }, [setState]);

  return (
    <div className={pageClasses}>
      <main className="mx-auto max-w-7xl space-y-5 px-5 py-6 md:px-8">
        <SectionCard
          isLight={isLight}
          number="01"
          title="Contract details"
          description="Select contract first."
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">
  
            {/* Contract Dropdown */}
            <div className="w-full">
              <FieldLabel required>Contract</FieldLabel>

              <select
                className={cn(inputClasses, "w-full md:max-w-md")}
                value={form.contract_no}
                onChange={(e) => updateField("contract_no", e.target.value)}
              >
                <option value="">Select contract</option>
                {contractsList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.contract_no}
                  </option>
                ))}
              </select>
            </div>

            {/* Button aligned with dropdown */}
            <button
            type="button"
            onClick={() => setShowAddContract((prev) => !prev)}
            className="h-[42px] px-4 rounded-xl text-xs font-semibold 
                      bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            + Add Contract
          </button>

          </div>        
        </SectionCard>
        {showAddContract && (
            <div className="mt-3 flex gap-2">
              <input
                className={cn(inputClasses, "max-w-md")}
                placeholder="Enter contract number"
                value={newContractNo}
                onChange={(e) => setNewContractNo(e.target.value)}
              />

              <button
                type="button"
                onClick={async () => {
                  if (!newContractNo) return;

                  const res = await apiRequest("create-contract", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ contract_no: newContractNo }),
                  });

                  if (res.ok) {
                    fetchContracts();
                    updateField("contract_no", res.result.contract_no);
                    setNewContractNo("");
                    setShowAddContract(false);
                  }
                }}
                className="px-4 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
              >
                Save
              </button>
            </div>
          )}
        <SectionCard
          isLight={isLight}
          number="02"
          title="Administrative location"
          description="Select the hierarchy from zone to tehsil."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            {/* ZONE */}
            <div>
              <FieldLabel required>Zone</FieldLabel>
              <select
                className={inputClasses}
                value={form.zone}
                onChange={(e) => handleZoneChange(e.target.value)}
              >
                <option value="">Select zone</option>
                {zonesList.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.zone_name}
                  </option>
                ))}
              </select>
              <FieldError show={Boolean(errors.zone)}>{errors.zone}</FieldError>
            </div>

            {/* DIVISION */}
            <div>
              <FieldLabel required>Division</FieldLabel>
              <select
                className={inputClasses}
                value={form.division}
                onChange={(e) => handleDivisionChange(e.target.value)}
                disabled={!form.zone}
              >
                <option value="">
                  {form.zone ? "Select division" : "Select zone first"}
                </option>
                {divisionsList.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.division_name}
                  </option>
                ))}
              </select>
              <FieldError show={Boolean(errors.division)}>{errors.division}</FieldError>
            </div>

            {/* DISTRICT */}
            <div>
              <FieldLabel required>District</FieldLabel>
              <select
                className={inputClasses}
                value={form.district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                disabled={!form.division}
              >
                <option value="">
                  {form.division ? "Select district" : "Select division first"}
                </option>
                {districtsList.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.district_name}
                  </option>
                ))}
              </select>
              <FieldError show={Boolean(errors.district)}>{errors.district}</FieldError>
            </div>

            {/* TEHSIL */}
            <div>
              <FieldLabel required>Tehsil</FieldLabel>
              <select
                className={inputClasses}
                value={form.tehsil}
                onChange={(e) => updateField("tehsil", e.target.value)}
                disabled={!form.district}
              >
                <option value="">
                  {form.district ? "Select tehsil" : "Select district first"}
                </option>
                {tehsilsList.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.tehsil_name}
                  </option>
                ))}
              </select>
              <FieldError show={Boolean(errors.tehsil)}>{errors.tehsil}</FieldError>
            </div>

          </div>
        </SectionCard>

        <SectionCard
          isLight={isLight}
          number="02"
          title="Site details"
          description="Enter details of the inspection site."
        >
          <div>
            <div>
              <FieldLabel required>Site name</FieldLabel>
              <input
                className={inputClasses}
                value={form.site_name}
                onChange={(e) => updateField("site_name", e.target.value)}
                placeholder="e.g. RO Plant 01"
              />
              <FieldError show={Boolean(errors.site_name)}>
                {errors.site_name}
              </FieldError>
            </div>

            <div>
              <FieldLabel required>Type</FieldLabel>
              <select
                className={inputClasses}
                value={form.type}
                onChange={(e) => updateField("type", e.target.value)}
              >
                <option value="">Select type</option>
                {siteTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <FieldError show={Boolean(errors.type)}>{errors.type}</FieldError>
            </div>

            <div>
              <FieldLabel required>Category</FieldLabel>
              <select
                className={inputClasses}
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
              >
                <option value="">Select category</option>
                {siteCategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <FieldError show={Boolean(errors.category)}>
                {errors.category}
              </FieldError>
            </div>

            <div>
              <FieldLabel>Phase</FieldLabel>
              <select
                className={inputClasses}
                value={form.phase}
                onChange={(e) => updateField("phase", e.target.value)}
              >
                <option value="">Select phase</option>
                {sitePhases.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          isLight={isLight}
          number="03"
          title="Site location"
          description="Enter coordinates manually or select the position from the map."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="grid gap-4">
                <div>
                  <FieldLabel required>Latitude</FieldLabel>
                  <input
                    className={inputClasses}
                    value={form.latitude}
                    onChange={(e) => updateField("latitude", e.target.value)}
                    onBlur={handleManualCoordinateBlur}
                    placeholder="31.5204000"
                  />
                  <FieldError show={Boolean(errors.latitude)}>
                    {errors.latitude}
                  </FieldError>
                </div>

                <div>
                  <FieldLabel required>Longitude</FieldLabel>
                  <input
                    className={inputClasses}
                    value={form.longitude}
                    onChange={(e) => updateField("longitude", e.target.value)}
                    onBlur={handleManualCoordinateBlur}
                    placeholder="74.3587000"
                  />
                  <FieldError show={Boolean(errors.longitude)}>
                    {errors.longitude}
                  </FieldError>
                </div>

                <div
                  className={cn(
                    "mt-2 flex items-start gap-3 rounded-2xl border p-4 text-[12px] leading-6",
                    isLight
                      ? "border-gray-200 bg-gray-50 text-gray-600"
                      : "border-white/10 bg-black text-gray-400",
                  )}
                >
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <div>Coordinates are saved with 7 decimal places.</div>
                    <div className="mt-2 text-sm">
                      {isValidCoordinate(form.latitude, form.longitude) ? (
                        <div className="space-y-1">
                          <div>
                            <span className="font-semibold">Latitude:</span>{" "}
                            {formatCoordinate(form.latitude)}
                          </div>
                          <div>
                            <span className="font-semibold">Longitude:</span>{" "}
                            {formatCoordinate(form.longitude)}
                          </div>
                        </div>
                      ) : (
                        "No valid coordinates selected yet"
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handleCreateInspectionSite}
                    disabled={isSubmitting}
                    className={cn(
                      "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-[12px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
                      isLight
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-emerald-500 text-white hover:bg-emerald-600",
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Save Site
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className={cn(
                      "rounded-xl px-4 py-2 text-[12px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
                      isLight
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-red-500 text-white hover:bg-red-600",
                    )}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            <div className="h-[330px] overflow-hidden rounded-2xl border md:h-[350px]">
              <InspectionSiteLocationMap
                latitude={form.latitude}
                longitude={form.longitude}
                onPick={handleMapPick}
              />
            </div>
          </div>
        </SectionCard>
      </main>

      {showSuccess ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div
            className={cn(
              "relative w-full max-w-md rounded-2xl border px-7 py-8 text-center shadow-2xl",
              isLight
                ? "border-gray-200 bg-white text-gray-950"
                : "border-white/10 bg-[#111111] text-white",
            )}
          >
            <div
              className={cn(
                "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border",
                isLight
                  ? "border-gray-200 bg-gray-100"
                  : "border-white/10 bg-black",
              )}
            >
              <Check className="h-7 w-7" />
            </div>

            <div className="mb-1 text-[22px] font-semibold tracking-[-0.03em]">
              Inspection site created
            </div>
            <div
              className={cn(
                "mb-5 text-[13px]",
                isLight ? "text-gray-500" : "text-gray-400",
              )}
            >
              The inspection site record has been saved successfully.
            </div>

            <div
              className={cn(
                "mb-5 rounded-2xl border px-4 py-4",
                isLight
                  ? "border-gray-200 bg-gray-50"
                  : "border-white/10 bg-black",
              )}
            >
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                Site ID
              </div>
              <div className="font-mono text-[22px] font-semibold">
                {siteCode}
              </div>
            </div>

            <div className="flex flex-col justify-center gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setShowSuccess(false);
                  navigate(INSPECTION_SITE_LIST_ROUTE);
                }}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-[12px] font-semibold transition",
                  isLight
                    ? "bg-gray-950 text-white hover:bg-black"
                    : "bg-white text-black hover:bg-gray-200",
                )}
              >
                View all sites
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSuccess(false);
                  clearForm();
                }}
                className={cn(
                  "rounded-xl border px-4 py-2.5 text-[12px] font-semibold transition",
                  isLight
                    ? "border-gray-200 bg-white text-gray-800 hover:bg-gray-100"
                    : "border-white/10 bg-[#111111] text-gray-200 hover:bg-[#1b1b1b]",
                )}
              >
                Create another
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}

      {toast && (
        <div
          className={cn(
            "fixed right-6 top-6 z-[9999] flex w-full max-w-sm items-center gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-4",
            toast.type === "success"
              ? isLight
                ? "border-emerald-500/20 bg-emerald-50/95 text-emerald-900"
                : "border-emerald-500/20 bg-emerald-950/95 text-emerald-100"
              : toast.type === "error"
                ? isLight
                  ? "border-red-500/20 bg-red-50/95 text-red-900"
                  : "border-red-500/20 bg-red-950/95 text-red-100"
                : isLight
                  ? "border-gray-200 bg-white/95 text-gray-900"
                  : "border-white/10 bg-[#111111]/95 text-gray-100",
          )}
        >
          <div className="shrink-0">
            {toast.type === "success" && (
              <Check className="h-5 w-5 text-emerald-500" />
            )}
            {toast.type === "error" && (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
            {toast.type === "info" && (
              <Info className="h-5 w-5 text-gray-500" />
            )}
            {toast.type === "loading" && (
              <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
            )}
          </div>
          <div className="flex-1 text-[13px] font-medium leading-5">
            {toast.message}
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="shrink-0 rounded-lg p-1 opacity-70 transition hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
