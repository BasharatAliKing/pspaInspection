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
const CREATE_PROVINCE_URL = `${API_BASE_URL}/api/create-province/`;

export default function Province() {
  const { isLight } = useTheme();
  const { setState } = useNavbar();
  const navigate = useNavigate();

  const [provinceName, setProvinceName] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const provinceCount = useMemo(() => provinces.length, [provinces]);

  const parseResponseSafely = async (response) => {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      return await response.json();
    }

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

  const extractCreatedProvince = (result) => {
    if (result?.data?.data) return result.data.data;
    if (result?.data) return result.data;
    return result;
  };

  const fetchProvinces = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(LIST_PROVINCE_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const result = await parseResponseSafely(response);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Province list API not found.");
        }

        throw new Error(
          result?.message || result?.detail || "Failed to fetch provinces.",
        );
      }

      const list = extractListFromResponse(result);
      setProvinces(Array.isArray(list) ? list : []);
    } catch (error) {
      setErrorMessage(error.message || "Unable to load provinces.");
      setProvinces([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  const handleReset = useCallback(() => {
    setProvinceName("");
    setErrorMessage("");
    setSuccessMessage("");
  }, []);

  const handleSave = useCallback(async () => {
    const cleanedName = provinceName.trim();

    setErrorMessage("");
    setSuccessMessage("");

    if (!cleanedName) {
      setErrorMessage("Please enter Province Name.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(CREATE_PROVINCE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          province_name: cleanedName,
        }),
      });

      const result = await parseResponseSafely(response);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Create Province API not found.");
        }

        const backendError =
          result?.message ||
          result?.detail ||
          result?.data?.detail ||
          result?.data?.[""]?.[0] ||
          result?.data?.province_name?.[0] ||
          "Failed to create province.";

        throw new Error(backendError);
      }

      const createdProvince = extractCreatedProvince(result);

      setSuccessMessage("Province created successfully.");
      setProvinceName("");

      if (createdProvince?.id || createdProvince?.province_name) {
        setProvinces((prev) => [createdProvince, ...prev]);
      } else {
        fetchProvinces();
      }
    } catch (error) {
      setErrorMessage(error.message || "Failed to create province.");
    } finally {
      setIsSubmitting(false);
    }
  }, [provinceName, fetchProvinces]);

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
      title: "Province",
      subtitle: "Create and manage provinces for the administrative hierarchy",
     
    });

    return () => setState({ title: "", subtitle: "", actions: null });
  }, [isLight, setState, handleReset, handleSave, isSubmitting]);

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
                P
              </div>

              <div>
                <div className="font-serif text-[24px] font-light tracking-[-0.03em]">
                  New Province
                </div>
                <div className={cn("mt-1 text-[12px]", textMuted)}>
                  Create the top-level administrative unit for hierarchy setup
                </div>
              </div>
            </div>

            <div className={cn("flex flex-wrap gap-2 text-[11px]", textSoft)}>
              <span className="rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-blue-500">
                Hierarchy setup
              </span>
              <span
                className={cn(
                  "rounded-full border px-3 py-1",
                  isLight
                    ? "border-black/10 bg-white text-slate-600"
                    : "border-white/10 bg-[#111827] text-slate-300",
                )}
              >
                Level 1
              </span>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="space-y-5">
              <FormSection
                title="Province details"
                surface={surface}
                isLight={isLight}
              >
                <form onSubmit={handleFormSubmit}>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] xl:grid-cols-[1fr_auto] items-end">
                    <InputField
                      label="Province Name"
                      value={provinceName}
                      onChange={setProvinceName}
                      placeholder="e.g. Punjab"
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
                      {isSubmitting ? "Adding..." : "Add Province"}
                    </button>
                  </div>

                  {(errorMessage || successMessage) && (
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
                  )}
                </form>
              </FormSection>

              <FormSection
                title="Province list"
                surface={surface}
                isLight={isLight}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-serif text-[20px] font-light tracking-[-0.03em]">
                      Added Provinces
                    </div>
                    <div className={cn("mt-1 text-[12px]", textMuted)}>
                      Total Provinces: {provinceCount}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={fetchProvinces}
                    className={cn(
                      "rounded-md border px-3 py-2 text-[12px] font-medium transition",
                      subduedSurface,
                      textMuted,
                    )}
                  >
                    Refresh
                  </button>
                </div>

                <div
                  className={cn(
                    "overflow-hidden rounded-[10px] border",
                    isLight ? "border-black/10" : "border-white/10",
                  )}
                >
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead
                        className={cn(isLight ? "bg-slate-50" : "bg-[#1a2236]")}
                      >
                        <tr>
                          <th
                            className={cn(
                              "px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.08em]",
                              textSoft,
                            )}
                          >
                            Sr. No
                          </th>
                          <th
                            className={cn(
                              "px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.08em]",
                              textSoft,
                            )}
                          >
                            Province Name
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {isLoading ? (
                          <tr>
                            <td
                              colSpan={2}
                              className={cn(
                                "px-4 py-6 text-center text-[12px]",
                                textMuted,
                              )}
                            >
                              Loading provinces...
                            </td>
                          </tr>
                        ) : provinces.length === 0 ? (
                          <tr>
                            <td
                              colSpan={2}
                              className={cn(
                                "px-4 py-6 text-center text-[12px]",
                                textMuted,
                              )}
                            >
                              No provinces found.
                            </td>
                          </tr>
                        ) : (
                          provinces.map((province, index) => (
                            <tr
                              key={
                                province.id ??
                                `${province.province_name}-${index}`
                              }
                              className={cn(
                                "border-t",
                                isLight ? "border-black/10" : "border-white/10",
                              )}
                            >
                              <td className="px-4 py-3 text-[12px]">
                                {index + 1}
                              </td>
                              <td className="px-4 py-3 text-[12px] font-medium">
                                {province.province_name || "—"}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </FormSection>
            </div>
          </div>
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
