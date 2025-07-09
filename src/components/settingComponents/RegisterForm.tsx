import React, { useState } from "react";

function checkPasswordStrength(password: string) {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  return {
    minLength,
    hasUpper,
    hasLower,
    hasNumber,
    isStrong: minLength && hasUpper && hasLower && hasNumber,
  };
}

const requiredMark = <span className="text-red-500 ml-1">*</span>;

const eyeIcon = (show: boolean) => (
  <span className="cursor-pointer flex items-center">
    {show ? (
      <svg
        width="22"
        height="22"
        fill="none"
        stroke="#888"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <ellipse cx="12" cy="12" rx="8" ry="5" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    ) : (
      <svg
        width="22"
        height="22"
        fill="none"
        stroke="#888"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <ellipse cx="12" cy="12" rx="8" ry="5" />
        <line x1="4" y1="20" x2="20" y2="4" />
      </svg>
    )}
  </span>
);

const RegisterForm: React.FC<{
  registerAPI: (...args: any[]) => Promise<any>;
  regSuccess: string;
  setRegSuccess: (s: string) => void;
}> = ({ registerAPI, regSuccess, setRegSuccess }) => {
  const [reg, setReg] = useState({
    email: "",
    firstname: "",
    middlename: "",
    lastname: "",
    nickname: "",
    department: "",
    password: "",
    confirm: "",
  });
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regShowConfirm, setRegShowConfirm] = useState(false);
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  const passwordStrength = checkPasswordStrength(reg.password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");
    setRegLoading(true);

    const requiredFields: { field: keyof typeof reg; label: string }[] = [
      { field: "email", label: "Email" },
      { field: "firstname", label: "First Name" },
      { field: "lastname", label: "Last Name" },
      { field: "nickname", label: "Nickname" },
      { field: "department", label: "Department" },
      { field: "password", label: "Password" },
      { field: "confirm", label: "Confirm Password" },
    ];

    const missing = requiredFields.filter(({ field }) => !reg[field]);
    if (missing.length > 0) {
      setRegError(
        `Please fill: ${missing.map((m) => m.label).join(", ")}.`
      );
      setRegLoading(false);
      return;
    }

    if (reg.password !== reg.confirm) {
      setRegError("Passwords do not match.");
      setRegLoading(false);
      return;
    }
    if (!passwordStrength.isStrong) {
      setRegError("Password is not strong enough.");
      setRegLoading(false);
      return;
    }
    try {
      await registerAPI(
        reg.email,
        reg.firstname,
        reg.middlename,
        reg.lastname,
        reg.nickname,
        reg.department,
        reg.password
      );
      setRegSuccess("Registration successful! You can now log in.");
      setReg({
        email: "",
        firstname: "",
        middlename: "",
        lastname: "",
        nickname: "",
        department: "",
        password: "",
        confirm: "",
      });
    } catch (err: any) {
      setRegError(err.message || "Registration failed.");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-4 h-fit">
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block font-medium text-gray-700 text-sm">
            First Name{requiredMark}
          </label>
          <input
            type="text"
            value={reg.firstname}
            onChange={(e) =>
              setReg((r) => ({ ...r, firstname: e.target.value }))
            }
            placeholder="First name"
            className="mt-1 p-2.5 w-full rounded-md border-2 border-blue-300 bg-green-50 text-sm outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block font-medium text-gray-700 text-sm">
            Middle Name
          </label>
          <input
            type="text"
            value={reg.middlename}
            onChange={(e) =>
              setReg((r) => ({ ...r, middlename: e.target.value }))
            }
            placeholder="Middle name (optional)"
            className="mt-1 p-2.5 w-full rounded-md border-2 border-blue-300 bg-green-50 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="block font-medium text-gray-700 text-sm">
          Last Name{requiredMark}
        </label>
        <input
          type="text"
          value={reg.lastname}
          onChange={(e) =>
            setReg((r) => ({ ...r, lastname: e.target.value }))
          }
          placeholder="Last name"
          className="mt-1 p-2.5 w-full rounded-md border-2 border-blue-300 bg-green-50 text-sm outline-none focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label className="block font-medium text-gray-700 text-sm">
          Nickname{requiredMark}
        </label>
        <input
          type="text"
          value={reg.nickname}
          onChange={(e) =>
            setReg((r) => ({ ...r, nickname: e.target.value }))
          }
          placeholder="Nickname"
          className="mt-1 p-2.5 w-full rounded-md border-2 border-blue-300 bg-green-50 text-sm outline-none focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label className="block font-medium text-gray-700 text-sm">
          Department{requiredMark}
        </label>
        <input
          type="text"
          value={reg.department}
          onChange={(e) =>
            setReg((r) => ({ ...r, department: e.target.value }))
          }
          placeholder="Department"
          className="mt-1 p-2.5 w-full rounded-md border-2 border-blue-300 bg-green-50 text-sm outline-none focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label className="block font-medium text-gray-700 text-sm">
          Email{requiredMark}
        </label>
        <input
          type="email"
          value={reg.email}
          onChange={(e) => setReg((r) => ({ ...r, email: e.target.value }))}
          placeholder="Email"
          className="mt-1 p-2.5 w-full rounded-md border-2 border-blue-300 bg-green-50 text-sm outline-none focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label className="block font-medium text-gray-700 text-sm">
          Password{requiredMark}
        </label>
        <div className="relative">
          <input
            type={regShowPassword ? "text" : "password"}
            value={reg.password}
            onChange={(e) =>
              setReg((r) => ({ ...r, password: e.target.value }))
            }
            placeholder="Password"
            className="mt-1 p-2.5 w-full rounded-md border-2 border-blue-300 bg-green-50 text-sm outline-none focus:border-blue-500 pr-10"
            required
          />
          <span
            className="absolute right-2 top-2.5"
            onClick={() => setRegShowPassword((v) => !v)}
            tabIndex={0}
            aria-label="Show password"
            role="button"
          >
            {eyeIcon(regShowPassword)}
          </span>
        </div>
      </div>
      <div>
        <label className="block font-medium text-gray-700 text-sm">
          Confirm Password{requiredMark}
        </label>
        <div className="relative">
          <input
            type={regShowConfirm ? "text" : "password"}
            value={reg.confirm}
            onChange={(e) =>
              setReg((r) => ({ ...r, confirm: e.target.value }))
            }
            placeholder="Confirm Password"
            className="mt-1 p-2.5 w-full rounded-md border-2 border-blue-300 bg-green-50 text-sm outline-none focus:border-blue-500 pr-10"
            required
          />
          <span
            className="absolute right-2 top-2.5"
            onClick={() => setRegShowConfirm((v) => !v)}
            tabIndex={0}
            aria-label="Show password"
            role="button"
          >
            {eyeIcon(regShowConfirm)}
          </span>
        </div>
      </div>
      {/* Password strength */}
      <div className="text-xs text-gray-600 mt-[-0.5rem] mb-1">
        <div
          className={passwordStrength.minLength ? "text-green-500" : "text-red-500"}
        >
          • At least 8 characters
        </div>
        <div
          className={passwordStrength.hasUpper ? "text-green-500" : "text-red-500"}
        >
          • Uppercase letter
        </div>
        <div
          className={passwordStrength.hasLower ? "text-green-500" : "text-red-500"}
        >
          • Lowercase letter
        </div>
        <div
          className={passwordStrength.hasNumber ? "text-green-500" : "text-red-500"}
        >
          • Number
        </div>
      </div>
      {regError && <div className="text-red-500 text-sm">{regError}</div>}
      {regSuccess && (
        <div className="text-green-600 text-sm">{regSuccess}</div>
      )}
      <button
        type="submit"
        className={`font-bold text-white rounded-md py-2.5 mt-2 text-lg shadow-md transition-colors ${
          passwordStrength.isStrong
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-blue-300 cursor-not-allowed"
        } ${regLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        disabled={regLoading || !passwordStrength.isStrong}
      >
        {regLoading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default RegisterForm;