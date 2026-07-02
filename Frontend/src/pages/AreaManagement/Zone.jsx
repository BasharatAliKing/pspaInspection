import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNavbar } from "../../components/Navbar";
import { useTheme } from "../../components/Layout";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

const LIST_PROVINCE_URL = `${API_BASE_URL}/api/list-province/`;
const LIST_ZONE_URL = `${API_BASE_URL}/api/list-zone/`;
const LIST_DIVISION_URL = `${API_BASE_URL}/api/list-division/`;
const LIST_DISTRICT_URL = `${API_BASE_URL}/api/list-district/`;
const LIST_TEHSIL_URL = `${API_BASE_URL}/api/list-tehsil/`;
const LIST_AREA_URL = `${API_BASE_URL}/api/list-area/`;

const parseResponseSafely = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return await response.json();
  const text = await response.text();
  return { nonJson: true, text };
};

const extractListFromResponse = (result) => {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.results)) return result.results;
  if (Array.isArray(result?.data?.data)) return result.data.data;
  if (Array.isArray(result?.data?.results)) return result.data.results;
  return [];
};

const getBackendError = (result, fallback, fields = []) => {
  for (const field of fields) {
    const value =
      result?.[field]?.[0] ||
      result?.data?.[field]?.[0] ||
      result?.errors?.[field]?.[0];
    if (value) return value;
  }
  return (
    result?.message ||
    result?.detail ||
    result?.data?.message ||
    result?.data?.detail ||
    fallback
  );
};

const buildFilteredUrl = (url, filterKey, filterValue) => {
  if (!filterKey || !filterValue) return url;
  const params = new URLSearchParams({ [filterKey]: String(filterValue) });
  return `${url}?${params.toString()}`;
};

const display = (value) => value || "—";

const getProvinceName = (item) =>
  item?.province_name ||
  item?.province?.province_name ||
  item?.zone?.province_name ||
  item?.zone?.province?.province_name ||
  item?.division?.province_name ||
  item?.division?.zone?.province_name ||
  item?.division?.zone?.province?.province_name ||
  item?.district?.division?.zone?.province_name ||
  item?.district?.division?.zone?.province?.province_name ||
  item?.tehsil?.district?.division?.zone?.province_name ||
  item?.tehsil?.district?.division?.zone?.province?.province_name;

const getZoneName = (item) =>
  item?.zone_name ||
  item?.zone?.zone_name ||
  item?.division?.zone_name ||
  item?.division?.zone?.zone_name ||
  item?.district?.division?.zone_name ||
  item?.district?.division?.zone?.zone_name ||
  item?.tehsil?.district?.division?.zone_name ||
  item?.tehsil?.district?.division?.zone?.zone_name;

const getDivisionName = (item) =>
  item?.division_name ||
  item?.division?.division_name ||
  item?.district?.division_name ||
  item?.district?.division?.division_name ||
  item?.tehsil?.district?.division_name ||
  item?.tehsil?.district?.division?.division_name;

const getDistrictName = (item) =>
  item?.district_name ||
  item?.district?.district_name ||
  item?.tehsil?.district_name ||
  item?.tehsil?.district?.district_name;

const getTehsilName = (item) => item?.tehsil_name || item?.tehsil?.tehsil_name;

const CREATE_ZONE_URL = `${API_BASE_URL}/api/create-zone/`;

export default function Zone() {
  const { isLight } = useTheme();
  const { setState } = useNavbar();
  const navigate = useNavigate();

  const [provinceId, setProvinceId] = useState("");
  const [zoneName, setZoneName] = useState("");

  const [provinces, setProvinces] = useState([]);
  const [zones, setZones] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const pageClasses = isLight
    ? "bg-slate-100 text-slate-900"
    : "bg-[#0b0f1a] text-[#e8edf5]";
  const surface = isLight
    ? "bg-white border-black/10"
    : "bg-[#111827] border-white/10";
  const textMuted = isLight ? "text-slate-600" : "text-[#8a95a8]";
  const textSoft = isLight ? "text-slate-400" : "text-[#4f5a6e]";
  const subduedSurface = isLight ? "bg-slate-50" : "bg-[#1a2236]";

  const zoneCount = useMemo(() => zones.length, [zones]);

  const fetchProvinces = useCallback(async () => {
    setIsLoadingProvinces(true);
    try {
      const response = await fetch(LIST_PROVINCE_URL, {
        headers: { Accept: "application/json" },
      });
      const result = await parseResponseSafely(response);
      if (!response.ok)
        throw new Error(getBackendError(result, "Failed to fetch provinces."));
      setProvinces(extractListFromResponse(result));
    } catch (error) {
      setErrorMessage(error.message || "Unable to load provinces.");
      setProvinces([]);
    } finally {
      setIsLoadingProvinces(false);
    }
  }, []);

  const fetchZones = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch(LIST_ZONE_URL, {
        headers: { Accept: "application/json" },
      });
      const result = await parseResponseSafely(response);
      if (!response.ok)
        throw new Error(getBackendError(result, "Failed to fetch zones."));
      setZones(extractListFromResponse(result));
    } catch (error) {
      setErrorMessage(error.message || "Unable to load zones.");
      setZones([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProvinces();
    fetchZones();
  }, [fetchProvinces, fetchZones]);

  const handleReset = useCallback(() => {
    setProvinceId("");
    setZoneName("");
    setErrorMessage("");
    setSuccessMessage("");
  }, []);

  const handleSave = useCallback(async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!provinceId) return setErrorMessage("Please select Province.");
    if (!zoneName.trim()) return setErrorMessage("Please enter Zone Name.");

    setIsSubmitting(true);
    try {
      const response = await fetch(CREATE_ZONE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          province: Number(provinceId),
          zone_name: zoneName.trim(),
        }),
      });

      const result = await parseResponseSafely(response);
      if (!response.ok) {
        throw new Error(
          getBackendError(result, "Failed to create zone.", [
            "province",
            "zone_name",
          ]),
        );
      }

      setSuccessMessage("Zone created successfully.");
      setProvinceId("");
      setZoneName("");
      await fetchZones();
    } catch (error) {
      setErrorMessage(error.message || "Failed to create zone.");
    } finally {
      setIsSubmitting(false);
    }
  }, [provinceId, zoneName, fetchZones]);

  const handleFormSubmit = useCallback(
    (e) => {
      e.preventDefault();
      handleSave();
    },
    [handleSave],
  );

  useEffect(() => {
    const mutedSurface = isLight ? "bg-slate-50" : "bg-[#1a2236]";
    const actionTextMuted = isLight ? "text-slate-600" : "text-[#8a95a8]";

    setState({
      title: "Zone",
      subtitle: "Create and manage zones under provinces",
    });

    return () => setState({ title: "", subtitle: "", actions: null });
  }, [isLight, setState, handleReset, handleSave, isSubmitting]);

  return (
    <PageShell
      isLight={isLight}
      pageClasses={pageClasses}
      surface={surface}
      badge="Z"
      title="New Zone"
      subtitle="Create zone against selected province"
    >
      <div className="space-y-5">
        <FormSection title="Zone details" surface={surface} isLight={isLight}>
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 items-end">
              <SelectField
                label="Province"
                value={provinceId}
                onChange={setProvinceId}
                isLight={isLight}
                disabled={isLoadingProvinces}
                options={provinces.map((item) => ({
                  value: String(item.id),
                  label: item.province_name,
                }))}
                placeholder={
                  isLoadingProvinces
                    ? "Loading provinces..."
                    : "Select Province"
                }
              />

              <InputField
                label="Zone Name"
                value={zoneName}
                onChange={setZoneName}
                placeholder="e.g. North Zone"
                isLight={isLight}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "h-[42px] rounded-md px-4 py-2 text-[12px] font-medium text-white transition",
                  isSubmitting
                    ? "cursor-not-allowed bg-blue-400"
                    : "bg-blue-500 hover:bg-blue-700",
                )}
              >
                {isSubmitting ? "Adding..." : "Add Zone"}
              </button>
            </div>
            <StatusMessages
              errorMessage={errorMessage}
              successMessage={successMessage}
              isLight={isLight}
            />
          </form>
        </FormSection>

        <FormSection title="Zone list" surface={surface} isLight={isLight}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="font-serif text-[20px] font-light tracking-[-0.03em]">
                Added Zones
              </div>
              <div className={cn("mt-1 text-[12px]", textMuted)}>
                Total Zones: {zoneCount}
              </div>
            </div>
            <button
              type="button"
              onClick={fetchZones}
              className={cn(
                "rounded-md border px-3 py-2 text-[12px] font-medium transition",
                subduedSurface,
                textMuted,
              )}
            >
              Refresh
            </button>
          </div>

          <TableWrapper isLight={isLight}>
            <table className="min-w-full">
              <thead className={cn(isLight ? "bg-slate-50" : "bg-[#1a2236]")}>
                <tr>
                  <TableHead textSoft={textSoft}>Sr. No</TableHead>
                  <TableHead textSoft={textSoft}>Province</TableHead>
                  <TableHead textSoft={textSoft}>Zone Name</TableHead>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <EmptyRow
                    colSpan={3}
                    textMuted={textMuted}
                    text="Loading zones..."
                  />
                ) : zones.length === 0 ? (
                  <EmptyRow
                    colSpan={3}
                    textMuted={textMuted}
                    text="No zones found."
                  />
                ) : (
                  zones.map((item, index) => (
                    <tr
                      key={item.id ?? `${item.zone_name}-${index}`}
                      className={cn(
                        "border-t",
                        isLight ? "border-black/10" : "border-white/10",
                      )}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{display(getProvinceName(item))}</TableCell>
                      <TableCell>{display(getZoneName(item))}</TableCell>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </TableWrapper>
        </FormSection>
      </div>
    </PageShell>
  );
}

function PageShell({
  isLight,
  pageClasses,
  surface,
  badge,
  title,
  subtitle,
  children,
}) {
  return (
    <div className={cn("min-h-screen w-full", pageClasses)}>
      <div
        className={cn(
          "pointer-events-none fixed inset-0 opacity-100",
          isLight
            ? "[background-image:linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.04)_1px,transparent_1px)]"
            : "[background-image:linear-gradient(rgba(59,130,246,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.025)_1px,transparent_1px)]",
          "[background-size:44px_44px]",
        )}
      />
      <div className="relative z-10 px-5 py-6 md:px-7">
        <section
          className={cn("mb-5 overflow-hidden rounded-[10px] border", surface)}
        >
          <div
            className={cn(
              "border-b px-6 py-5",
              isLight
                ? "border-black/10 bg-slate-50"
                : "border-white/10 bg-[#1a2236]",
            )}
          >
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-[18px] border border-blue-500/25 bg-blue-500/10 font-serif text-[22px] font-light text-blue-500">
                {badge}
              </div>
              <div>
                <div className="font-serif text-[24px] font-light tracking-[-0.03em]">
                  {title}
                </div>
                <div
                  className={cn(
                    "mt-1 text-[12px]",
                    isLight ? "text-slate-600" : "text-[#8a95a8]",
                  )}
                >
                  {subtitle}
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-6">{children}</div>
        </section>
      </div>
    </div>
  );
}

function FormSection({ title, surface, isLight, children }) {
  return (
    <section className={cn("overflow-hidden rounded-[10px] border", surface)}>
      <div
        className={cn(
          "border-b px-4 py-3 text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400",
          isLight
            ? "border-black/10 bg-slate-50"
            : "border-white/10 bg-[#1a2236]",
        )}
      >
        {title}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  isLight,
  type = "text",
}) {
  return (
    <div>
      <div className="mb-1.5 text-[11px] uppercase tracking-[0.07em] text-slate-400">
        {label}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-md border px-3 py-2.5 text-[12px] outline-none transition",
          isLight
            ? "border-black/10 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500"
            : "border-white/10 bg-[#0f172a] text-white placeholder:text-slate-500 focus:border-blue-500",
        )}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  isLight,
  disabled = false,
}) {
  return (
    <div>
      <div className="mb-1.5 text-[11px] uppercase tracking-[0.07em] text-slate-400">
        {label}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "w-full rounded-md border px-3 py-2.5 text-[12px] outline-none transition",
          isLight
            ? "border-black/10 bg-white text-slate-900 focus:border-blue-500"
            : "border-white/10 bg-[#0f172a] text-white focus:border-blue-500",
          disabled ? "cursor-not-allowed opacity-60" : "",
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function StatusMessages({ errorMessage, successMessage, isLight }) {
  if (!errorMessage && !successMessage) return null;

  return (
    <div className="mt-4">
      {errorMessage ? (
        <div
          className={cn(
            "rounded-md border px-3 py-2 text-[12px]",
            isLight
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-red-500/20 bg-red-500/10 text-red-300",
          )}
        >
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div
          className={cn(
            "mt-2 rounded-md border px-3 py-2 text-[12px]",
            isLight
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
          )}
        >
          {successMessage}
        </div>
      ) : null}
    </div>
  );
}

function TableWrapper({ children, isLight }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[10px] border",
        isLight ? "border-black/10" : "border-white/10",
      )}
    >
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

function TableHead({ children, textSoft }) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.08em]",
        textSoft,
      )}
    >
      {children}
    </th>
  );
}

function TableCell({ children }) {
  return <td className="px-4 py-3 text-[12px] font-medium">{children}</td>;
}

function EmptyRow({ colSpan, textMuted, text }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className={cn("px-4 py-6 text-center text-[12px]", textMuted)}
      >
        {text}
      </td>
    </tr>
  );
}
