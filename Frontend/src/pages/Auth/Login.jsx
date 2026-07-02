import React, { useState } from "react";
import { Eye, EyeOff, MapPin, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

// Maps each quick-login button to the role value the backend returns in user.role
const roleOptions = [
  {
    key:       "super_admin",
    icon:      "⚖",
    name:      "Administrator",
    desc:      "Full system access",
  },
  {
    key:       "director",
    icon:      "★",
    name:      "Director",
    desc:      "Zone oversight",
  },
  {
    key:       "supervisor",
    icon:      "⚑",
    name:      "Supervisor",
    desc:      "Field management",
  },
  {
    key:       "call_agent",
    icon:      "✉",
    name:      "Call Agent",
    desc:      "Complaint intake",
  },
];

function storeAuthAndRedirect(data, remember, navigate) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("access_token",  data.token  || data.access  || "");
  storage.setItem("refresh_token", data.refresh || "");
  storage.setItem("user_role",     data.role    || "");
  storage.setItem("user_id",       String(data.id || ""));
  storage.setItem("user_email",    data.email   || "");
  storage.setItem("user_name",     `${data.first_name || ""} ${data.last_name || ""}`.trim());
  navigate("/");
}

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    code:    "",
    password: "",
    remember: true,
  });

  // The role the user selected via the quick-login buttons (null = no role selected yet)
  const [selectedRole, setSelectedRole] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState("");
  const [loading,      setLoading]      = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Clicking a role button: select the role and clear the form fields
  // so the user types their own credentials
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData((prev) => ({ ...prev, code: "", password: "" }));
    setError("");
  };

  // ── Core API call ──────────────────────────────────────────────────────────
  const callLoginAPI = async (code, password) => {
    const res = await fetch(`${API_BASE_URL}/api/login-user/`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ code, password }),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || json.data || "Invalid credentials");
    }
    return json.data || json;
  };

  // ── Form submit ────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.code.trim() || !formData.password.trim()) {
      setError("Please enter your code and password.");
      return;
    }

    setLoading(true);
    try {
      const data = await callLoginAPI(formData.code.trim(), formData.password);

      // If a role was selected via the quick-login buttons, validate that the
      // returned user.role matches. The backend does not enforce this itself.
      if (selectedRole && data.role !== selectedRole.key) {
        setError(
          `This account does not have the "${selectedRole.name}" role. ` +
          `Please use the correct credentials for this role.`
        );
        return;
      }

      storeAuthAndRedirect(data, formData.remember, navigate);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Which role is currently active (for button highlight)
  const activeRoleKey = selectedRole?.key;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0f1a] text-[#e8edf5] font-sans">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.025) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* Left Panel */}
        <div className="relative flex w-full flex-col justify-between overflow-hidden bg-[linear-gradient(135deg,#0d1525_0%,#0f1d35_60%,#0b1628_100%)] px-8 py-10 sm:px-10 lg:w-[52%] lg:px-14 lg:py-12">
          <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, rgba(59,130,246,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(20,184,166,0.08) 0%, transparent 50%)" }} />
          <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-10 flex items-center gap-3 lg:mb-auto">
              <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#3b82f6] shadow-[0_10px_30px_rgba(59,130,246,0.25)]">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-serif text-[18px] font-medium tracking-[-0.02em] text-[#e8edf5]">PSPA</div>
                <div className="text-[11px] uppercase tracking-[0.08em] text-[#4f5a6e]">Water Authority</div>
              </div>
            </div>

            <div className="my-8 lg:my-auto">
              <div className="mb-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[#3b82f6]">
                <span className="inline-block h-px w-6 bg-[#3b82f6]" />
                Complaint Management System
              </div>
              <h2 className="mb-5 font-serif text-[34px] font-light leading-tight tracking-[-0.03em] text-[#e8edf5] sm:text-[42px]">
                Managing water<br />
                service for <em className="italic text-[rgba(59,130,246,0.85)]">all</em><br />
                of Punjab.
              </h2>
              <p className="max-w-[380px] text-[14px] leading-7 text-[#8a95a8]">
                A centralized platform for efficient, transparent, and timely resolution of public complaints related to PSPA&apos;s water infrastructure and service delivery.
              </p>
              <div className="mt-10 flex flex-wrap gap-8">
                <div>
                  <div className="font-serif text-[28px] font-light tracking-[-0.02em] text-[#e8edf5]">1,284</div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.06em] text-[#4f5a6e]">Active complaints</div>
                </div>
                <div>
                  <div className="font-serif text-[28px] font-light tracking-[-0.02em] text-[#e8edf5]">4</div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.06em] text-[#4f5a6e]">Service zones</div>
                </div>
                <div>
                  <div className="font-serif text-[28px] font-light tracking-[-0.02em] text-[#e8edf5]">93%</div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.06em] text-[#4f5a6e]">Resolution rate</div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-10 text-[11px] text-[#4f5a6e]">
              © 2026 Punjab Safe Pani Authority · All rights reserved
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-[400px] animate-[fadeUp_.5s_ease_both]">
            <div className="mb-8">
              <h3 className="mb-1 font-serif text-[26px] font-light tracking-[-0.02em] text-[#e8edf5]">
                Welcome back
              </h3>
              <p className="text-[13px] text-[#8a95a8]">
                Sign in to access the complaint management portal
              </p>
            </div>

            {/* Role selection buttons */}
            <div className="mb-6">
              <div className="mb-3 flex items-center gap-3 text-[11px] text-[#4f5a6e]">
                <span className="h-px flex-1 bg-[rgba(255,255,255,0.07)]" />
                sign in as
                <span className="h-px flex-1 bg-[rgba(255,255,255,0.07)]" />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {roleOptions.map((role) => {
                  const isActive = activeRoleKey === role.key;
                  return (
                    <button
                      key={role.key}
                      type="button"
                      disabled={loading}
                      onClick={() => handleRoleSelect(role)}
                      className={[
                        "rounded-md border px-3 py-3 text-center transition",
                        isActive
                          ? "border-[#3b82f6] bg-[rgba(59,130,246,0.12)] text-[#e8edf5]"
                          : "border-[rgba(255,255,255,0.07)] bg-[#1a2236] text-[#8a95a8] hover:border-[rgba(255,255,255,0.13)] hover:bg-[#212d42] hover:text-[#e8edf5]",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                      ].join(" ")}
                    >
                      <span className="mb-1 block text-[16px]">{role.icon}</span>
                      <span className="block text-[11px] font-medium">{role.name}</span>
                      <span className="mt-0.5 block text-[10px] text-[#4f5a6e]">{role.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected role indicator */}
            {selectedRole && (
              <div className="mb-4 flex items-center gap-2 rounded-md border border-[rgba(59,130,246,0.3)] bg-[rgba(59,130,246,0.08)] px-3 py-2 text-[12px] text-[#93c5fd]">
                <span className="text-[14px]">{selectedRole.icon}</span>
                <span>Signing in as <strong>{selectedRole.name}</strong> — enter your credentials below</span>
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-md border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.1)] px-4 py-3 text-[12px] text-[#ef4444]">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.07em] text-[#4f5a6e]">
                  Code
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g. admin@pspa.gov.pk"
                  disabled={loading}
                  className="w-full rounded-md border border-[rgba(255,255,255,0.07)] bg-[#1a2236] px-3.5 py-3 text-[13px] text-[#e8edf5] outline-none transition focus:border-[#3b82f6] focus:bg-[rgba(59,130,246,0.05)] placeholder:text-[#4f5a6e] disabled:opacity-50"
                />
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.07em] text-[#4f5a6e]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    disabled={loading}
                    className="w-full rounded-md border border-[rgba(255,255,255,0.07)] bg-[#1a2236] px-3.5 py-3 pr-11 text-[13px] text-[#e8edf5] outline-none transition focus:border-[#3b82f6] focus:bg-[rgba(59,130,246,0.05)] placeholder:text-[#4f5a6e] disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4f5a6e] transition hover:text-[#8a95a8]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="mb-5 flex items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-[12px] text-[#8a95a8]">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                    className="h-4 w-4 accent-[#3b82f6]"
                  />
                  Remember me
                </label>
                <a href="#" className="text-[12px] text-[#3b82f6] transition hover:opacity-70">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[#3b82f6] px-4 py-3 text-[14px] font-medium text-white transition hover:bg-[#1d4ed8] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Signing in…" : selectedRole ? `Sign in as ${selectedRole.name}` : "Sign in to CMS"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
