import React, { useState } from "react";
import { login } from "../../api/auth.ts";

const pastelBlue = "#e3f0fc";
const accent = "#90caf9";

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

const LoginForm: React.FC<{ onLoginSuccess?: () => void }> = ({ onLoginSuccess }) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    if (!loginEmail || !loginPassword) {
      setLoginError("Please enter both email and password.");
      setLoginLoading(false);
      return;
    }
    try {
      await login(loginEmail, loginPassword);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err: any) {
      setLoginError(
        err?.message?.toLowerCase().includes("invalid")
          ? "Invalid email or password."
          : err.message || "Login failed."
      );
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <label className="font-medium" style={{ color: "#345" }}>
          Email{requiredMark}
        </label>
        <input
          type="email"
          value={loginEmail}
          onChange={e => setLoginEmail(e.target.value)}
          placeholder="Email"
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 12,
            border: `1.5px solid ${accent}`,
            background: pastelBlue,
            fontSize: 16,
            marginTop: 4,
            outline: "none",
            transition: "border .2s",
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
            type={loginShowPassword ? "text" : "password"}
            value={loginPassword}
            onChange={e => setLoginPassword(e.target.value)}
            placeholder="Password"
            style={{
              width: "100%",
              padding: "10px 40px 10px 14px",
              borderRadius: 12,
              border: `1.5px solid ${accent}`,
              background: pastelBlue,
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
            onClick={() => setLoginShowPassword(v => !v)}
            tabIndex={0}
            aria-label="Show password"
            role="button"
          >
            {eyeIcon(loginShowPassword)}
          </span>
        </div>
      </div>
      {loginError && (
        <div className="font-sans" style={{ color: "#e57373", fontSize: 14, marginTop: -10 }}>{loginError}</div>
      )}
      <button
        type="submit"
        className="font-bold"
        style={{
          background: accent,
          color: "#fff",
          border: "none",
          borderRadius: 14,
          padding: "10px 0",
          marginTop: 8,
          fontSize: 17,
          boxShadow: "0 2px 8px #90caf930",
          transition: "background .2s",
          cursor: loginLoading ? "not-allowed" : "pointer",
          opacity: loginLoading ? 0.7 : 1,
        }}
        disabled={loginLoading}
      >
        {loginLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;