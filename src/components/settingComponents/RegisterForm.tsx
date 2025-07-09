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

const pastelGreen = "#eafaf1";
const accent = "#90caf9";
const accentDark = "#42a5f5";
const requiredMark = <span style={{ color: "#e57373", marginLeft: 2 }}>*</span>;

const eyeIcon = (show: boolean) => (
  <span style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
    {show ? (
      <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24">
        <ellipse cx="12" cy="12" rx="8" ry="5" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    ) : (
      <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24">
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

    // List of required fields (all except middlename)
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
    <form onSubmit={handleRegister} style={{ height:"fit",display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <label className="font-medium" style={{ color: "#345" }}>
            First Name{requiredMark}
          </label>
          <input
            type="text"
            value={reg.firstname}
            onChange={e => setReg(r => ({ ...r, firstname: e.target.value }))}
            placeholder="First name"
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 12,
              border: `1.5px solid ${accent}`,
              background: pastelGreen,
              fontSize: 16,
              marginTop: 4,
              outline: "none",
            }}
            required
          />
        </div>
        <div style={{ flex: 1 }}>
          <label className="font-medium" style={{ color: "#345" }}>
            Middle Name
          </label>
          <input
            type="text"
            value={reg.middlename}
            onChange={e => setReg(r => ({ ...r, middlename: e.target.value }))}
            placeholder="Middle name (optional)"
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 12,
              border: `1.5px solid ${accent}`,
              background: pastelGreen,
              fontSize: 16,
              marginTop: 4,
              outline: "none",
            }}
          />
        </div>
      </div>
      <div>
        <label className="font-medium" style={{ color: "#345" }}>
          Last Name{requiredMark}
        </label>
        <input
          type="text"
          value={reg.lastname}
          onChange={e => setReg(r => ({ ...r, lastname: e.target.value }))}
          placeholder="Last name"
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 12,
            border: `1.5px solid ${accent}`,
            background: pastelGreen,
            fontSize: 16,
            marginTop: 4,
            outline: "none",
          }}
          required
        />
      </div>
      <div>
        <label className="font-medium" style={{ color: "#345" }}>
          Nickname{requiredMark}
        </label>
        <input
          type="text"
          value={reg.nickname}
          onChange={e => setReg(r => ({ ...r, nickname: e.target.value }))}
          placeholder="Nickname"
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 12,
            border: `1.5px solid ${accent}`,
            background: pastelGreen,
            fontSize: 16,
            marginTop: 4,
            outline: "none",
          }}
          required
        />
      </div>
      <div>
        <label className="font-medium" style={{ color: "#345" }}>
          Department{requiredMark}
        </label>
        <input
          type="text"
          value={reg.department}
          onChange={e => setReg(r => ({ ...r, department: e.target.value }))}
          placeholder="Department"
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 12,
            border: `1.5px solid ${accent}`,
            background: pastelGreen,
            fontSize: 16,
            marginTop: 4,
            outline: "none",
          }}
          required
        />
      </div>
      <div>
        <label className="font-medium" style={{ color: "#345" }}>
          Email{requiredMark}
        </label>
        <input
          type="email"
          value={reg.email}
          onChange={e => setReg(r => ({ ...r, email: e.target.value }))}
          placeholder="Email"
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 12,
            border: `1.5px solid ${accent}`,
            background: pastelGreen,
            fontSize: 16,
            marginTop: 4,
            outline: "none",
          }}
          required
        />
      </div>
      <div>
        <label className="font-medium" style={{ color: "#345" }}>
          Password{requiredMark}
        </label>
        <div style={{ position: "relative" }}>
          <input
            type={regShowPassword ? "text" : "password"}
            value={reg.password}
            onChange={e => setReg(r => ({ ...r, password: e.target.value }))}
            placeholder="Password"
            style={{
              width: "100%",
              padding: "10px 40px 10px 14px",
              borderRadius: 12,
              border: `1.5px solid ${accent}`,
              background: pastelGreen,
              fontSize: 16,
              marginTop: 4,
              outline: "none",
            }}
            required
          />
          <span
            style={{
              position: "absolute",
              right: 10,
              top: 13,
            }}
            onClick={() => setRegShowPassword(v => !v)}
            tabIndex={0}
            aria-label="Show password"
            role="button"
          >
            {eyeIcon(regShowPassword)}
          </span>
        </div>
      </div>
      <div>
        <label className="font-medium" style={{ color: "#345" }}>
          Confirm Password{requiredMark}
        </label>
        <div style={{ position: "relative" }}>
          <input
            type={regShowConfirm ? "text" : "password"}
            value={reg.confirm}
            onChange={e => setReg(r => ({ ...r, confirm: e.target.value }))}
            placeholder="Confirm Password"
            style={{
              width: "100%",
              padding: "10px 40px 10px 14px",
              borderRadius: 12,
              border: `1.5px solid ${accent}`,
              background: pastelGreen,
              fontSize: 16,
              marginTop: 4,
              outline: "none",
            }}
            required
          />
          <span
            style={{
              position: "absolute",
              right: 10,
              top: 13,
            }}
            onClick={() => setRegShowConfirm(v => !v)}
            tabIndex={0}
            aria-label="Show password"
            role="button"
          >
            {eyeIcon(regShowConfirm)}
          </span>
        </div>
      </div>
      {/* Password strength */}
      <div className="font-sans" style={{ fontSize: 13, color: "#456", marginTop: -10, marginBottom: 2 }}>
        <div style={{ color: passwordStrength.minLength ? "#4caf50" : "#e57373" }}>
          • At least 8 characters
        </div>
        <div style={{ color: passwordStrength.hasUpper ? "#4caf50" : "#e57373" }}>
          • Uppercase letter
        </div>
        <div style={{ color: passwordStrength.hasLower ? "#4caf50" : "#e57373" }}>
          • Lowercase letter
        </div>
        <div style={{ color: passwordStrength.hasNumber ? "#4caf50" : "#e57373" }}>
          • Number
        </div>
      </div>
      {regError && (
        <div className="font-sans" style={{ color: "#e57373", fontSize: 14 }}>{regError}</div>
      )}
      {regSuccess && (
        <div className="font-sans" style={{ color: "#43a047", fontSize: 14 }}>{regSuccess}</div>
      )}
      <button
        type="submit"
        className="font-bold"
        style={{
          background: passwordStrength.isStrong ? accentDark : accent,
          color: "#fff",
          border: "none",
          borderRadius: 14,
          padding: "10px 0",
          marginTop: 8,
          fontSize: 17,
          boxShadow: "0 2px 8px #90caf930",
          opacity: regLoading || !passwordStrength.isStrong ? 0.7 : 1,
          cursor: regLoading || !passwordStrength.isStrong ? "not-allowed" : "pointer",
          transition: "background .2s, opacity .2s",
        }}
        disabled={regLoading || !passwordStrength.isStrong}
      >
        {regLoading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default RegisterForm;