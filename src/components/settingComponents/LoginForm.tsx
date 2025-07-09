import React, { useState } from "react";
import { login } from "../../api/auth.ts";

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

const LoginForm: React.FC<{ onLoginSuccess?: () => void }> = ({
  onLoginSuccess,
}) => {
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
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <div>
        <label className="font-medium text-gray-700">
          Email{requiredMark}
        </label>
        <input
          type="email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2.5 rounded-lg border-2 border-blue-300 bg-blue-50 text-base mt-1 outline-none transition-border focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label className="font-medium text-gray-700">
          Password{requiredMark}
        </label>
        <div className="relative">
          <input
            type={loginShowPassword ? "text" : "password"}
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2.5 pr-10 rounded-lg border-2 border-blue-300 bg-blue-50 text-base mt-1 outline-none transition-border focus:border-blue-500"
            required
          />
          <span
            className="absolute right-2.5 top-2.5"
            onClick={() => setLoginShowPassword((v) => !v)}
            tabIndex={0}
            aria-label="Show password"
            role="button"
          >
            {eyeIcon(loginShowPassword)}
          </span>
        </div>
      </div>
      {loginError && (
        <div className="text-red-500 text-sm mt-[-0.6rem]">
          {loginError}
        </div>
      )}
      <button
        type="submit"
        className={`font-bold bg-blue-500 text-white border-none rounded-lg py-2.5 mt-2 text-lg shadow-md transition-colors cursor-pointer ${
          loginLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-600"
        }`}
        disabled={loginLoading}
      >
        {loginLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;