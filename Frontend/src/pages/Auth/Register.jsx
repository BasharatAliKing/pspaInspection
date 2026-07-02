import React, { useState } from "react";
import { Eye, EyeOff, MapPin } from "lucide-react";

const intakeChannels = ["Web Portal", "Mobile App", "Call Center", "Walk In"];

const zones = ["North", "South", "East", "West"];

const roles = ["Administrator", "Director", "Supervisor", "Call Agent"];

const assignToOptions = [
  "Field Team",
  "Supervisor",
  "Director",
  "Manager",
  "MD Office",
];

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    assignTo: "",
    intakeChannel: "",
    zone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "role",
      "assignTo",
      "intakeChannel",
      "zone",
      "password",
      "confirmPassword",
    ];

    const hasEmptyField = requiredFields.some(
      (field) => !formData[field].trim(),
    );

    if (hasEmptyField) {
      setError("Please fill all required fields before continuing.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please re-enter both passwords.");
      return;
    }

    setError("");
    console.log("Register submitted:", formData);
    // navigate("/login")
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0f1a] text-[#e8edf5] font-sans">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.025) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* Left Panel */}
        <div className="relative flex w-full flex-col justify-between overflow-hidden bg-[linear-gradient(135deg,#0d1525_0%,#0f1d35_60%,#0b1628_100%)] px-8 py-10 sm:px-10 lg:w-[52%] lg:px-14 lg:py-12">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 80%, rgba(59,130,246,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(20,184,166,0.08) 0%, transparent 50%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-10 flex items-center gap-3 lg:mb-auto">
              <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#3b82f6] shadow-[0_10px_30px_rgba(59,130,246,0.25)]">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-serif text-[18px] font-medium tracking-[-0.02em] text-[#e8edf5]">
                  PSPA
                </div>
                <div className="text-[11px] uppercase tracking-[0.08em] text-[#4f5a6e]">
                  Water Authority
                </div>
              </div>
            </div>

            <div className="my-8 lg:my-auto">
              <div className="mb-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[#3b82f6]">
                <span className="inline-block h-px w-6 bg-[#3b82f6]" />
                Complaint Management System
              </div>

              <h2 className="mb-5 font-serif text-[34px] font-light leading-tight tracking-[-0.03em] text-[#e8edf5] sm:text-[42px]">
                Create secure
                <br />
                access for{" "}
                <em className="italic text-[rgba(59,130,246,0.85)]">field</em>
                <br />
                operations.
              </h2>

              <p className="max-w-[380px] text-[14px] leading-7 text-[#8a95a8]">
                Register new personnel for the PSPA complaint management portal
                with proper role assignment, intake channel mapping, and zone
                allocation.
              </p>

              <div className="mt-10 flex flex-wrap gap-8">
                <div>
                  <div className="font-serif text-[28px] font-light tracking-[-0.02em] text-[#e8edf5]">
                    4
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.06em] text-[#4f5a6e]">
                    Service zones
                  </div>
                </div>
                <div>
                  <div className="font-serif text-[28px] font-light tracking-[-0.02em] text-[#e8edf5]">
                    24/7
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.06em] text-[#4f5a6e]">
                    Intake coverage
                  </div>
                </div>
                <div>
                  <div className="font-serif text-[28px] font-light tracking-[-0.02em] text-[#e8edf5]">
                    100%
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.06em] text-[#4f5a6e]">
                    Role-based access
                  </div>
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
          <div className="w-full max-w-[560px] animate-[fadeUp_.5s_ease_both]">
            <div className="mb-8">
              <h3 className="mb-1 font-serif text-[26px] font-light tracking-[-0.02em] text-[#e8edf5]">
                Create account
              </h3>
              <p className="text-[13px] text-[#8a95a8]">
                Register a new user to access the complaint management portal
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-md border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.1)] px-4 py-3 text-[12px] text-[#ef4444]">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.07em] text-[#4f5a6e]">
                    First name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    className="w-full rounded-md border border-[rgba(255,255,255,0.07)] bg-[#1a2236] px-3.5 py-3 text-[13px] text-[#e8edf5] outline-none transition focus:border-[#3b82f6] focus:bg-[rgba(59,130,246,0.05)] placeholder:text-[#4f5a6e]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.07em] text-[#4f5a6e]">
                    Last name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    className="w-full rounded-md border border-[rgba(255,255,255,0.07)] bg-[#1a2236] px-3.5 py-3 text-[13px] text-[#e8edf5] outline-none transition focus:border-[#3b82f6] focus:bg-[rgba(59,130,246,0.05)] placeholder:text-[#4f5a6e]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.07em] text-[#4f5a6e]">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full rounded-md border border-[rgba(255,255,255,0.07)] bg-[#1a2236] px-3.5 py-3 text-[13px] text-[#e8edf5] outline-none transition focus:border-[#3b82f6] focus:bg-[rgba(59,130,246,0.05)] placeholder:text-[#4f5a6e]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.07em] text-[#4f5a6e]">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full rounded-md border border-[rgba(255,255,255,0.07)] bg-[#1a2236] px-3.5 py-3 text-[13px] text-[#e8edf5] outline-none transition focus:border-[#3b82f6] focus:bg-[rgba(59,130,246,0.05)]"
                  >
                    <option value="" className="bg-[#1a2236] text-[#8a95a8]">
                      Select role
                    </option>
                    {roles.map((role) => (
                      <option key={role} value={role} className="bg-[#1a2236]">
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.07em] text-[#4f5a6e]">
                    Assign to
                  </label>
                  <select
                    name="assignTo"
                    value={formData.assignTo}
                    onChange={handleChange}
                    className="w-full rounded-md border border-[rgba(255,255,255,0.07)] bg-[#1a2236] px-3.5 py-3 text-[13px] text-[#e8edf5] outline-none transition focus:border-[#3b82f6] focus:bg-[rgba(59,130,246,0.05)]"
                  >
                    <option value="" className="bg-[#1a2236] text-[#8a95a8]">
                      Select
                    </option>
                    {assignToOptions.map((item) => (
                      <option key={item} value={item} className="bg-[#1a2236]">
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.07em] text-[#4f5a6e]">
                    Intake channel
                  </label>
                  <select
                    name="intakeChannel"
                    value={formData.intakeChannel}
                    onChange={handleChange}
                    className="w-full rounded-md border border-[rgba(255,255,255,0.07)] bg-[#1a2236] px-3.5 py-3 text-[13px] text-[#e8edf5] outline-none transition focus:border-[#3b82f6] focus:bg-[rgba(59,130,246,0.05)]"
                  >
                    <option value="" className="bg-[#1a2236] text-[#8a95a8]">
                      Select intake channel
                    </option>
                    {intakeChannels.map((item) => (
                      <option key={item} value={item} className="bg-[#1a2236]">
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.07em] text-[#4f5a6e]">
                    Zone
                  </label>
                  <select
                    name="zone"
                    value={formData.zone}
                    onChange={handleChange}
                    className="w-full rounded-md border border-[rgba(255,255,255,0.07)] bg-[#1a2236] px-3.5 py-3 text-[13px] text-[#e8edf5] outline-none transition focus:border-[#3b82f6] focus:bg-[rgba(59,130,246,0.05)]"
                  >
                    <option value="" className="bg-[#1a2236] text-[#8a95a8]">
                      Select zone
                    </option>
                    {zones.map((zone) => (
                      <option key={zone} value={zone} className="bg-[#1a2236]">
                        {zone}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.07em] text-[#4f5a6e]">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      className="w-full rounded-md border border-[rgba(255,255,255,0.07)] bg-[#1a2236] px-3.5 py-3 pr-11 text-[13px] text-[#e8edf5] outline-none transition focus:border-[#3b82f6] focus:bg-[rgba(59,130,246,0.05)] placeholder:text-[#4f5a6e]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4f5a6e] transition hover:text-[#8a95a8]"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.07em] text-[#4f5a6e]">
                    Password again
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswordAgain ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className="w-full rounded-md border border-[rgba(255,255,255,0.07)] bg-[#1a2236] px-3.5 py-3 pr-11 text-[13px] text-[#e8edf5] outline-none transition focus:border-[#3b82f6] focus:bg-[rgba(59,130,246,0.05)] placeholder:text-[#4f5a6e]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordAgain((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4f5a6e] transition hover:text-[#8a95a8]"
                    >
                      {showPasswordAgain ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-md bg-[#3b82f6] px-4 py-3 text-[14px] font-medium text-white transition hover:bg-[#1d4ed8] active:scale-[0.99]"
              >
                Create account
              </button>

              <div className="flex items-center gap-3 pt-1 text-[11px] text-[#4f5a6e]">
                <span className="h-px flex-1 bg-[rgba(255,255,255,0.07)]" />
                secure PSPA registration
                <span className="h-px flex-1 bg-[rgba(255,255,255,0.07)]" />
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
